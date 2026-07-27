# HANDOFF

Update this at the end of every session touching this repo, whether that's
Claude Code, Cowork, or Cursor. Keep entries short. Newest session at the top.

---

## 2026-07-27 — Marketing System Phase A: Content Ideas mood board (Cursor)

### What was built or decided
- New page **`/marketing`** — **Marketing System** header, five vertical
  sections (Task Board section pattern):
  1. **Content Ideas** — built: zoomable mood-board canvas with image cards,
     category-coloured cards, right-click empty space → Add card, drag image
     onto canvas or card, click image well then paste (`Ctrl+V`/`Cmd+V`),
     `+ Add idea` button, 4 sample cards, drag cards to reposition, drag empty
     space to pan, `Ctrl`+scroll to zoom, cards shrink as the idea count grows
  2. **Content Preparation** — skeleton (empty, "Coming in a later phase")
  3. **Content Execution** — skeleton
  4. **Content Review** — skeleton
  5. **Content Schedule** — skeleton
- New API **`/api/marketing`** → KV key `marketing` (ideas + reserved section
  arrays). Images stored on each card (`imageData`) with resized dimensions
  tracked for thumbnail/panel display.
- Nav links added on Annual Planner and Task Board → Marketing.
- Worker name / live URL stay **`ppc-planner`** (no hostname migration).
- No cross-links to planner or kanban yet.
- Cards now open a Task Board-style side panel for editing **Description** and
  **Category**. Category uses the PPC palette and tints the card like Task
  Board cards. Panel also shows a larger image preview.
- Portrait thumbnails were adjusted late in session to reduce side whitespace
  by matching the image well height more closely to image aspect ratio.

### What's mid-flight / not finished
- Sections 2–5 not implemented — next agent picks up Content Preparation.
- No git commit/push yet this session.

### Known issues or things flagged but not fixed
- Base64 images in KV JSON will grow payload size — fine for reference
  mood-board images; move to R2/CDN if library gets large.
- Planner KV still has undated `mir-*` events (pre-existing).

### Next logical step
- Phase B: Content Preparation section (production plan fields per Miro middle
  frame), then Content Execution / Review / Schedule.
- If the portrait thumbnail tweak still leaves visible whitespace on some
  images, refine the image-well sizing logic before adding more media-heavy
  features.

---

## 2026-07-25 — OTS Layout plan mirror spot-check (Cursor)

### What was built or decided
- Spot-checked live card **OTS - Layout plan** (`k1784776542819`, project
  Ode to Sirens, due `2026-08-07`) against Annual Planner mirror
  `mir-k1784776542819`.
- Baseline: exactly one ⇄ mirror, dates/slot match (Aug 2026 week 1 day 7).
- Live API tests (with restore): board→timeline due-date move PASS;
  timeline→board due-date move PASS; production date restored to
  `2026-08-07`.
- Cursor round-trip + GitHub push auth are confirmed working on this Mac.

### What's mid-flight / not finished
- Deploys stay manual (`npx wrangler deploy`) — unchanged.

### Known issues or things flagged but not fixed
- Planner KV still has several `mir-*` events with `srcCardId` but
  `dueDate: null` (undated mirrors left on the timeline). Not specific to
  OTS; worth a cleanup pass later if they clutter Aug/Jul views.

### Next logical step
- Hand Cursor real product work when ready. No deploy needed for this
  HANDOFF-only update.

---

## 2026-07-24 — Second agent swapped: Perplexity Computer → Cursor Pro (Claude Code)

### What was built or decided
- The second coding agent working on this repo alongside Claude Code is now
  **Cursor Pro**, not Perplexity Computer (Perplexity Pro was separately
  dropped/refunded on 2026-07-22 for research use — unrelated tool, noted
  here only to avoid confusion between the two).
- Repo cloned onto Jarvis's Mac at
  `~/Desktop/Press Play Collective/ppc-planner-worker` (deliberately outside
  the Obsidian vault — a code repo inside the vault risks iCloud sync
  conflicts and unnecessary Obsidian file indexing). Windows machine still
  has its own clone at the equivalent path; both point at the same GitHub
  remote.
- Cursor should open this exact folder and read this file first each
  session — same round-trip pattern used for any agent here: report
  understanding + flag anything mid-flight before making changes.

### What's mid-flight / not finished
- Deploys stay a single-agent/manual step (`npx wrangler deploy`) — Cursor
  and Claude Code both write code and push to GitHub, but do not deploy
  independently, to avoid version drift between the two live apps.
- ~~Jarvis to spot-check the "OTS - Layout plan" kanban card~~ — done
  2026-07-25 (see entry above).

### Known issues or things flagged but not fixed
- None new this session.

### Next logical step
- ~~Give Cursor its first read-only task~~ — done; round-trip confirmed.

---

## 2026-07-23 — Repo init (Claude Code)

### What was built or decided
- First git repo for this codebase — previously just a loose folder deployed
  straight to Cloudflare via `wrangler deploy`, no version control at all.
- Pushed initial commit to `https://github.com/jarvis-tuttlebee/ppc-planner.git`
  (`main` branch) so a second agent (Perplexity Computer) can work on this
  codebase in parallel without silently clobbering edits.
- Added `.gitignore` for `.wrangler/` (local wrangler cache/tmp, not source).

### What's mid-flight / not finished
- `public/kanban.html` (Task Board) was edited most recently (2026-07-23,
  before repo init) — worth checking `git log -p -- public/kanban.html`
  once there's more history, since this first commit has no prior diff to
  compare against.
- No CI/deploy automation from git — deploys are still manual
  (`npx wrangler deploy` from this folder). Pushing to GitHub does **not**
  automatically deploy.

### Known issues or things flagged but not fixed
- None flagged yet — this is the first tracked session.

### Next logical step
- Confirm the Perplexity agent can clone/pull from the GitHub remote and
  give it a small first task to verify the round-trip before relying on it.
- Whoever deploys next should run `wrangler deploy` manually after pulling
  latest — git and Cloudflare are not wired together.

---

## Quick reference

- **Live:** https://ppc-planner.pressplaycollective.workers.dev
- **Deploy:** `npx wrangler deploy` from this folder (needs Node on PATH)
- **KV binding:** `PLANNER_KV` (id `2f3dc18365c2477595cc76e4f3303746`)
- **Structure:** `public/index.html` (Annual Planner), `public/kanban.html`
  (Task Board), `public/marketing.html` (Marketing System), `src/index.js`
  (Worker — serves `/api/data`, `/api/kanban`, `/api/marketing`; kanban
  also has `/api/kanban/patch` for server-side single-card merge)
