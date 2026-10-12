# Jitendra Builds — Portfolio

The personal portfolio of **Jitendra Saini**: a single-page Next.js site with a procedural three.js hero ("The Builder's Universe"), real project evidence, and a contact flow aimed at recruiters and freelance clients.

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server (Turbopack) |
| `npm run build` | Production build (all routes are statically prerendered) |
| `npm start` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` (strict mode) |
| `npm run lint` | ESLint (Next.js core-web-vitals + TypeScript + React Compiler rules) |
| `npm test` | Vitest unit and data-integrity tests |
| `npm run check` | All of the above, then a production build |

Requires Node 20.19+, 22.13+ or 24+ (`.nvmrc` pins 22 LTS; odd-numbered releases like 23 work but print engine warnings). `.npmrc` sets `legacy-peer-deps=true` to work around an npm 10.9 resolver crash with Vitest's optional peers.

## Stack

Next.js 16.4 (App Router) · React 19.2 · TypeScript 5.9 (strict) · Tailwind CSS 4.3 · three.js 0.186 + React Three Fiber 9.7 · Motion 12 · Lucide · Vitest 4.

No backend, CMS, database, analytics or third-party scripts.

## Where to edit things

| What | File |
| --- | --- |
| Name, hero copy, email, socials, résumé, availability badge, location, "Now" strip | `src/config/site.ts` |
| ⌘K command palette entries | `src/config/commands.ts` (generated from the data below) |
| Projects, case studies, screenshots, links | `src/data/projects.ts` |
| Work history | `src/data/experience.ts` |
| Skills and their evidence | `src/data/skills.ts` |
| YouTube videos | `src/data/content.ts` |
| Colours, type, motion tokens | `src/app/globals.css` (`@theme`) |
| The 3D scene | `src/components/three/` |

Images live in `public/images/projects/<slug>/`, videos in `public/media/`. Each image is tagged `screenshot` (captured from the real product) or `promo` (marketing artwork). The UI labels them accordingly, so never tag artwork as a screenshot.

Links only render when they're real: `isUsableUrl()` hides empty values and placeholders such as `REPLACE…` or `example.com`. The tests in `tests/data-integrity.test.ts` fail if a configured link is a placeholder or an image is missing.

## Project structure

```
src/
  app/                 layout, page, 404, globals.css, OG image, icons, manifest, robots, sitemap
  config/site.ts       personal configuration
  data/                projects, experience, skills, content
  components/
    layout/            header (+ mobile menu), footer, JSON-LD
    sections/          hero, work, about, skills, experience, philosophy, content, contact
    projects/          featured rows, cards, client work, case-study dialog, filters
    three/             WebGL scene, procedural environment, CSS fallback, capability checks
    ui/                buttons, headings, badges, icons, reveal, deferred video
    providers/         Motion reduced-motion config
  hooks/  lib/  types/
tests/                 Vitest
```

## Signature details

- **Assembly intro.** On load, the hero's blueprint envelope draws in, the slabs drop and twist into place one by one (each lock-in flashes the core), and the crown settles on top. **Rebuild** in the hero bar (or ⌘K → "Rebuild the tower") replays it. On desktop, a soft light follows the cursor across the metal.
- **⌘K / Ctrl+K command palette.** Jump to sections, open case studies (searchable by tech, e.g. "supabase"), copy the email, download the résumé, open profiles, or make the avatar wave. It's fetched on first use, so it costs nothing on page load.
- **Case-study pages** at `/work/<slug>`: statically generated, each with its own title, canonical URL and generated social card, and listed in the sitemap. The in-page dialog links to them via "Full page". Four of them include a **"How it's built"** architecture diagram (animated data flow; an ordered list on mobile and for screen readers) and **numbers counted from the source code** (routes, migrations, test files…), set in `src/data/projects.ts`.
- **Web résumé** at `/resume`: generated from the same data, printable ("Print or save as PDF" gives a clean black-on-white copy) and ATS-friendly. It omits the phone number that's in the PDF.
- **Now strip** under the hero: current build, latest store release and latest video, all derived from data.
- **Product motion**: PDFify's real launch video plays muted inside its phone mockup while visible.
- Word-by-word headline reveal (CSS only), a scroll-progress line under the header, magnetic primary buttons, and a colophon in the footer.

## The portfolio assistant (⌘K → Ask)

Visitors can ask questions in plain language ("Has Jitendra built offline-first apps?") from the ⌘K palette or the "Ask my portfolio" link in Contact. It's free to run: no AI service, no API key, no server.

- **Grounded by construction.** `src/lib/knowledge/knowledge-base.ts` turns the site's own data (projects, case studies, experience, skills, videos, approach) into ~70 small facts. Nothing is written separately, so answers are always the site's own words.
- **Search in the browser.** `retrieve.ts` ranks facts with BM25 plus stemming, synonyms and project-name boosting. The best match is shown as the answer with a "Read more" link, followed by related facts. If nothing matches, it offers the email address.
- **Evals:** `tests/ask-retrieval.eval.test.ts` checks that 22 realistic visitor questions retrieve the right fact in the top 3. Add a case whenever you add content people might ask about.

## How the 3D hero works

1. The **CSS sculpture** (`three/hero-fallback.tsx`) is server-rendered, so the hero is complete on first paint.
2. When the browser is idle, `hero-visual.tsx` checks WebGL 2 support, Save-Data and device class, then lazy-loads the three.js chunk.
3. Shaders are compiled with `renderer.compileAsync` (parallel compile, off the main thread) **before** the first frame. The canvas then cross-fades in over the CSS version.
4. Desktop renders every frame, DPR ≤ 1.75, with a procedural PMREM environment. Phones and tablets render at 30fps, DPR ≤ 1.25, with fewer particles and no environment pass.
5. Rendering stops when the hero is off-screen or the tab is hidden. If the WebGL context is lost or anything throws, the CSS sculpture comes back.
6. With `prefers-reduced-motion`, the scene renders still frames only: no pointer parallax, no continuous rotation.

## The 3D avatar (About section)

`public/models/avatar.glb` (2.4 MB) is your Avaturn avatar, converted from FBX and compressed. The pipeline is in `scripts/avatar/`. Avaturn exports a T-pose with no animation, so all motion is procedural (`src/components/three/avatar/avatar-rig.ts`):

- a relaxed stance, breathing, a slow weight shift and blinking;
- head and eyes that follow the pointer anywhere on the page, and drift slowly when the pointer is idle;
- drag or swipe to turn the body, which eases back to face the visitor;
- a click, tap or the **Say hi** button makes the avatar wave and smile.

It loads only when About approaches the viewport, compiles shaders off the main thread, stops rendering when off-screen, and runs at 30fps on phones. With reduced motion it holds still (gaze only). Without WebGL 2, or with Save-Data on, the recorded clip plays instead.

## Deployment (Vercel)

1. Push this folder to a Git repository and import it in Vercel (framework preset: Next.js). There's no build configuration to change.
2. Set **`NEXT_PUBLIC_SITE_URL`** to the final domain, e.g. `https://jitendrabuilds.com`. It drives canonical URLs, Open Graph, the sitemap and robots.txt. If it's unset on Vercel, the project's production domain is used automatically.
3. No other environment variables, secrets or paid services are needed.

Any Node host also works: `npm ci && npm run build && npm start`.

## Deployment (GitHub Pages)

`npm run build:pages` builds a plain static site into `out/` (the `STATIC_EXPORT=1` mode in `next.config.ts`). `.github/workflows/deploy-pages.yml` runs the checks, builds that and publishes it.

1. Put this project in the **`jitendra-saini123.github.io`** repository (the user site, served at the domain root). A different repository would be served under `/<repo>/` and would need a `basePath`, which isn't set up.
2. In that repository: **Settings → Pages → Source: GitHub Actions**. Every push to `main` then deploys. `NEXT_PUBLIC_SITE_URL` comes from the Pages settings, so a custom domain added later is picked up.
3. `public/app-ads.txt` is a copy of the file AdMob reads from the current site. Keep it, or ads on your apps can be limited.

The other Pages sites (`/nativestack/`, `/pdfify-privacy-policy/`, `/civil-site-calculator-privacy/`) live in their own repositories and keep working; nothing here uses those paths.

Trade-offs compared with Vercel:
- **No security headers.** Pages can't send the Content-Security-Policy and the other headers in `next.config.ts`. The site has no third-party scripts or user accounts, so the practical risk is low, but Lighthouse's best-practices score may drop a little.
- **No image optimizer.** Images are served as committed (already WebP); YouTube thumbnails load straight from `i.ytimg.com`.
- Social cards and the touch icon are rendered at build time to real `.png` files, because Pages chooses the content type from the file extension.

## Measured results

Lighthouse 13.5 against `next start` on localhost (12 Oct 2026), with the 3D scene loading:

| Page | Mobile perf. | Desktop perf. | Accessibility | Best practices | SEO |
| --- | --- | --- | --- | --- | --- |
| `/` | 91 | 100 | 100 | 100 | 100 |
| `/work/pdfify` | 92 | 100 | 100 | 100 | 100 |
| `/work/viral-hunter` | 94 | — | 100 | 100 | 100 |
| `/resume` | 95 | — | 100 | 100 | 100 |

Mobile is Lighthouse's simulated Moto G on slow 4G with 4× CPU throttling: home LCP 3.5s (simulated; observed ~0.2s), TBT 80ms, CLS 0. A real deployment behind a CDN will differ, so re-measure once it's live.

## Before publishing — please verify

- [ ] **Experience end date.** The résumé says Sublimity Softwares "Feb 2023 – Present", but the 3 Oct 2026 video says you've moved from client work to your own products. Update `end` in `src/data/experience.ts` if needed.
- [ ] **Public email**: `jitendra.saini1189@gmail.com` (from the résumé).
- [ ] **LinkedIn** `linkedin.com/in/jitendrabuilds` (from the résumé). LinkedIn blocks automated checks, so open it once by hand.
- [ ] **Résumé PDF** (`public/jitendra-saini-resume.pdf`) contains your **phone number** and becomes publicly downloadable. Redact it, or set `resume.enabled = false`.
- [ ] **Client work.** FireArrest and ClockedIn HRM are named with their public Play links, as on your résumé; the client company isn't named. Confirm that's within any NDA.
- [ ] **TubeNative** is presented honestly as an unofficial YouTube client sold as source code. Decide whether you want it in front of recruiters: YouTube's terms restrict downloading, and the screenshots show third-party thumbnails.
- [ ] **Mega Site** has no public Play listing yet (`com.civiltycoon.civil_tycoon` returned 404). Add a `store` link in `projects.ts` once it's live; the status badge will still say "In development" until you change it.
- [ ] **About avatar**: the live 3D avatar comes from your Avaturn export, and the fallback clip from your screen recording. Remove `<AvatarViewer />` in `about.tsx` if you'd rather not show either.
- [ ] **Availability badge** is off (`siteConfig.availability.enabled`). Turn it on only when it's true.

## Known limitations

- **Contact form**: no backend. It validates input, then opens the visitor's email app with the message prefilled, and the UI says so. To accept messages directly, add a route handler using an email provider (for example Resend), with server-side validation and spam protection.
- **Console warning**: React Three Fiber 9.7 uses the deprecated `THREE.Clock`, which logs a harmless warning.
- **`npm audit`**: production dependencies have 0 vulnerabilities. The remaining high-severity advisory is in `braces`, pulled in by `eslint-config-next`'s dev-only lint toolchain; there's no non-breaking fix yet.
- **Reduced motion and the WebGL fallback**: both are implemented. The fallback was verified by forcing a context loss in the browser; reduced motion is covered by code paths (Motion `reducedMotion="user"`, CSS media query, still-frame rendering) but wasn't emulated in a browser during this build.
