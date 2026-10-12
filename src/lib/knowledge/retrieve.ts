import { ENTITY_ALIASES, type KnowledgeChunk } from "./knowledge-base";

/**
 * Lightweight BM25 retrieval over the knowledge base. Deterministic and
 * dependency-free, so it runs in the browser (offline answers) and on the
 * server (to rank sources), and can be evaluated in unit tests.
 */

const STOPWORDS = new Set(
  "a an and are as at be been but by can could did do does doing for from had has have he her hers him his how i if in into is it its jitendra jitendra's just me my of on or our she so than that the their them they this to up was we were what when where which who whom why will with would you your about tell know any some there also please saini".split(
    " ",
  ),
);

/** Query-side expansions for how visitors actually ask. */
const SYNONYMS: Record<string, string[]> = {
  hire: ["contact", "email", "availability", "freelance"],
  hiring: ["contact", "availability", "role"],
  available: ["availability", "contact"],
  freelance: ["availability", "contact", "project"],
  reach: ["contact", "email"],
  email: ["contact"],
  cv: ["resume", "résumé"],
  resume: ["résumé"],
  based: ["location", "city"],
  live: ["location", "based"],
  where: ["location"],
  timezone: ["time", "zone", "ist"],
  ai: ["llm", "model", "machine", "learning", "gemini", "agents"],
  llm: ["ai", "model", "zod", "structured"],
  ml: ["machine", "learning", "tensorflow", "kit"],
  game: ["mega", "tycoon", "idle"],
  games: ["mega", "tycoon", "idle"],
  job: ["experience", "role", "developer"],
  work: ["experience", "project"],
  worked: ["experience", "built"],
  company: ["experience", "sublimity"],
  employer: ["experience", "sublimity"],
  study: ["education", "tech"],
  degree: ["education", "engineering"],
  education: ["tech", "engineering"],
  web: ["next", "react", "typescript"],
  backend: ["supabase", "api", "postgres"],
  database: ["supabase", "postgres", "sqlite", "drift", "hive", "objectbox"],
  offline: ["sync", "offline-first"],
  payment: ["payments", "razorpay", "stripe", "paypal", "billing"],
  payments: ["razorpay", "stripe", "paypal", "billing"],
  face: ["recognition", "biometric", "liveness"],
  biometric: ["face", "palm", "kiosk"],
  video: ["youtube", "channel"],
  videos: ["youtube", "channel"],
  youtube: ["channel", "video"],
  app: ["mobile", "android", "play"],
  apps: ["mobile", "android", "play"],
  store: ["play", "google"],
  shipped: ["live", "published", "released"],
  released: ["live", "published", "release"],
  release: ["live", "published", "status"],
  launched: ["live", "published", "release"],
  built: ["stack", "tech"],
  made: ["stack", "tech"],
  using: ["stack", "tech"],
  tech: ["stack", "technology"],
  technology: ["stack", "tech"],
  technologies: ["stack", "tech"],
  framework: ["stack", "tech"],
  status: ["release", "live"],
};

function stem(token: string): string {
  if (token.length > 5 && token.endsWith("ies")) return token.slice(0, -3) + "y";
  if (token.length > 5 && token.endsWith("ing")) return token.slice(0, -3);
  // "released" → "release", "managed" → "manage", "optimized" → "optimize"…
  if (token.length > 5 && /[scvgz]ed$/.test(token)) return token.slice(0, -1);
  if (token.length > 4 && token.endsWith("ed")) return token.slice(0, -2);
  if (token.length > 3 && token.endsWith("s") && !token.endsWith("ss")) return token.slice(0, -1);
  return token;
}

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .split(/[^a-z0-9+#]+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t))
    .map(stem);
}

export function expandQuery(question: string): string[] {
  const base = question
    .toLowerCase()
    .split(/[^a-z0-9+#']+/)
    .filter(Boolean);
  const expanded = [...base];
  for (const word of base) expanded.push(...(SYNONYMS[word] ?? []));
  return tokenize(expanded.join(" "));
}

export interface RetrievedChunk {
  chunk: KnowledgeChunk;
  score: number;
}

interface Index {
  docs: { chunk: KnowledgeChunk; tf: Map<string, number>; length: number }[];
  df: Map<string, number>;
  avgLength: number;
}

const indexCache = new WeakMap<KnowledgeChunk[], Index>();

function buildIndex(chunks: KnowledgeChunk[]): Index {
  const docs = chunks.map((chunk) => {
    // Titles carry the most signal, so they count twice.
    const tokens = tokenize(`${chunk.title} ${chunk.title} ${chunk.text}`);
    const tf = new Map<string, number>();
    for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1);
    return { chunk, tf, length: tokens.length };
  });
  const df = new Map<string, number>();
  for (const d of docs) for (const term of d.tf.keys()) df.set(term, (df.get(term) ?? 0) + 1);
  const avgLength = docs.reduce((sum, d) => sum + d.length, 0) / Math.max(docs.length, 1);
  return { docs, df, avgLength };
}

/** Projects the question names, e.g. "Is Mega Site live?" → ["mega-site"]. */
export function detectEntities(question: string): string[] {
  const q = ` ${question.toLowerCase().replace(/[^a-z0-9]+/g, " ")} `;
  return Object.entries(ENTITY_ALIASES)
    .filter(([, aliases]) => aliases.some((alias) => q.includes(` ${alias} `)))
    .map(([entity]) => entity);
}

const ENTITY_BOOST = 2.2;

/** BM25 (k1 = 1.4, b = 0.7) over title + text, boosting projects the question names. */
export function retrieve(chunks: KnowledgeChunk[], question: string, k = 5): RetrievedChunk[] {
  let index = indexCache.get(chunks);
  if (!index) {
    index = buildIndex(chunks);
    indexCache.set(chunks, index);
  }
  const terms = [...new Set(expandQuery(question))];
  if (terms.length === 0) return [];
  const entities = new Set(detectEntities(question));
  const N = index.docs.length;
  const k1 = 1.4;
  const b = 0.7;

  const scored = index.docs.map((doc) => {
    let score = 0;
    for (const term of terms) {
      const f = doc.tf.get(term);
      if (!f) continue;
      const n = index.df.get(term) ?? 0;
      const idf = Math.log(1 + (N - n + 0.5) / (n + 0.5));
      score += idf * ((f * (k1 + 1)) / (f + k1 * (1 - b + (b * doc.length) / index.avgLength)));
    }
    if (score > 0 && doc.chunk.entity && entities.has(doc.chunk.entity)) score *= ENTITY_BOOST;
    return { chunk: doc.chunk, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b2) => b2.score - a.score)
    .slice(0, k);
}

/** Heuristic for the command palette: does this query read like a question? */
export function looksLikeQuestion(query: string): boolean {
  const q = query.trim().toLowerCase();
  if (q.length < 6) return false;
  if (q.endsWith("?")) return true;
  if (/^(what|how|who|where|when|why|which|does|do|is|are|can|has|have|did|tell|show|explain|any)\b/.test(q)) return true;
  return q.split(/\s+/).length >= 4;
}
