export type CommandGroup = "Ask" | "Navigate" | "Case studies" | "Actions" | "Links" | "Play";

export type CommandAction =
  | { type: "navigate"; href: string }
  | { type: "external"; href: string }
  | { type: "copy"; text: string; message: string }
  | { type: "download"; href: string }
  | { type: "wave" }
  | { type: "rebuild" }
  | { type: "ask"; question: string };

export interface Command {
  id: string;
  label: string;
  group: CommandGroup;
  hint?: string;
  keywords?: string[];
  action: CommandAction;
}

/**
 * Scores how well `query` matches `text`: exact > prefix > word start >
 * substring > in-order characters. Returns 0 for no match.
 */
export function scoreMatch(text: string, query: string): number {
  const t = text.toLowerCase();
  const q = query.trim().toLowerCase();
  if (!q) return 1;
  if (t === q) return 100;
  if (t.startsWith(q)) return 80;
  if (t.split(/[\s\-·/:]+/).some((word) => word.startsWith(q))) return 60;
  if (t.includes(q)) return 40;
  let i = 0;
  for (const ch of t) if (ch === q[i]) i++;
  return i === q.length ? 10 : 0;
}

/** Filters and ranks commands; ties keep their original order. */
export function filterCommands(commands: Command[], query: string): Command[] {
  if (!query.trim()) return commands;
  return commands
    .map((command, index) => {
      const fields = [command.label, command.group, command.hint ?? "", ...(command.keywords ?? [])];
      const score = Math.max(...fields.map((field, i) => scoreMatch(field, query) * (i === 0 ? 1 : 0.7)));
      return { command, score, index };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((entry) => entry.command);
}
