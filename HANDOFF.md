# HANDOFF

Update this at the end of every session touching this repo, whether that's
Claude Code, Cowork, or Cursor. Keep entries short. Newest session at the top.

---

## 2026-07-28 — EOD (Cursor)

### What was built or decided
- Marketing: Content Preparation board; Prepare inline (no modal); centred nav;
  Miro half-import earlier (27 ideas live).
- Planner: Sun–Sat weeks + bleed; Unassigned/Any (no Any column); complete sync
  + minimise; Overview prefs; drop Gantt + category legend.
- Kanban: centred nav; complete minimise; mirror/auto-assign updates.
- Deployed: `015041cb-386a-4e7b-b245-51968bfa7832`
  → https://ppc-planner.pressplaycollective.workers.dev
- Committed this EOD (marketing + planner + kanban + HANDOFF).

### What's mid-flight / not finished
- Remaining Miro import deferred.
- Unassigned month-rollover not done.
- Execution / Review / Schedule still skeletons.
- Portrait Ideas thumbnail whitespace may still need a pass.

### Known issues or things flagged but not fixed
- Marketing KV ~3 MB base64 images — watch growth.

### Next logical step
1. Continue Preparation board polish, or Unassigned rollover.
2. Pull on other machines before more edits.

---

## 2026-07-28 — Drop Gantt + legend (Cursor)

### What was built or decided
- Removed Gantt / horizontal view and Timeline/Gantt format menu.
- Removed category name/colour legend from planner heading; slim toolbar
  (Settings + Dark only). Planner `2.9.1`.

### Next logical step
- Continue Preparation board polish, or Unassigned month-rollover later.

### Deployed
- Version ID `015041cb-386a-4e7b-b245-51968bfa7832`
  → https://ppc-planner.pressplaycollective.workers.dev

---

## 2026-07-28 — Week bleed + complete sync (Cursor)

### What was built or decided
- Planner week scheme **5**: Sun–Sat weeks; trailing weeks **bleed** into the
  next month as live cells (not empty). Leading week only when Sunday is before
  the planner year (so Jul 1–4 still show). Later months don’t duplicate the
  previous month’s trailing week. July 2026 still has 5 calendar rows — that’s
  a real month grid; Aug won’t re-show the Jul 26 week.
- Complete sync both ways (status + Done column); Task Board complete cards
  minimise. Auto-assign → Unassigned / Any.
- Versions: planner `2.9.0`, kanban `1.9.2`. Not deployed.

### What's mid-flight / not finished
- Month rollover of leftover Unassigned still not done.
- Local uncommitted; deploy when asked.

### Next logical step
1. Smoke-test July weeks + Aug 1 bleed cell; complete sync both apps.
2. Deploy.

---

## 2026-07-28 — Calendar weeks + Unassigned/Any (Cursor)

### What was built or decided
- Removed week **Any** column. Renamed bottom row to **Unassigned / Any**.
- Former Any-slot cards (`week` set, `day` null) migrate to Unassigned.
- Week rows are true **Sun–Sat** calendar weeks (scheme 4); always 7 columns;
  out-of-month days are empty placeholders (no more 9–10 day week rows).
- Planner version `2.8.1`. Not deployed yet.

### What's mid-flight / not finished
- Month rollover of leftover Unassigned cards still not done.
- Local uncommitted HTML + HANDOFF.

### Known issues or things flagged but not fixed
- First load after deploy runs weekScheme 3→4 migrate once (re-bands dated
  pills; parks undated Any pills).

### Next logical step
1. Local smoke-test Week View (Jul should show proper Sun–Sat rows).
2. Deploy when ready.

---

## 2026-07-28 — Cross-app nav + planner S/M polish (Cursor)

### What was built or decided
- Unified centred nav (Home / Annual Planner / Task Board / Marketing) on
  planner + kanban (marketing already matched). Refresh removed; tab-focus
  refresh when panel closed.
- Planner: future months default to Overview; per-month Overview/Week choice
  persisted in localStorage. Complete pills minimised (`pill--complete`).
- Unassigned placement fix: await Task Board due-date clear on drop; keep
  parked mirrors with `week == null` instead of deleting them on sync.
- Versions: planner `2.8.0`, kanban `1.9.1`. Parked for later: merge
  Unassigned+Any + month rollover.

### What's mid-flight / not finished
- Local uncommitted across `index.html` / `kanban.html` / `marketing.html` /
  `HANDOFF.md`.
- Unassigned/Any merge + next-month rollover still not done.

### Known issues or things flagged but not fixed
- Base64 marketing images ~3 MB.
- Portrait Ideas thumbnail whitespace may still need a pass.
- Not deployed yet this pass — ask before `wrangler deploy`.

### Next logical step
1. Deploy when ready; smoke-test Unassigned park + Overview defaults.
2. Continue Preparation board, or tackle Unassigned/Any merge later.

---

## 2026-07-28 — Preparation UX: Prepare inline + nav polish (Cursor)

### What was built or decided
- Marketing nav pills centred; Refresh button removed.
- Auto-refresh on tab focus when side panel is closed (no hourly poll).
- Section heading colour dots removed (pillar swatches on prep board kept).
- Ideas panel: **Prepare** toggle expands Pillar + Format dropdowns inline;
  bottom button becomes **Prepare & save**; move modal deleted.
- Version `0.4.2`. Remaining Miro import deferred / out of scope.

### What's mid-flight / not finished
- Local uncommitted: `public/marketing.html` + `HANDOFF.md` (still vs `25aebb7`).
- Content Execution / Review / Schedule still skeletons.
- Portrait thumbnail whitespace on Ideas may still need a pass.

### Known issues or things flagged but not fixed
- Ideas KV payload ~3 MB base64 — watch size if library grows.
- Still no git commit/push of marketing.html / HANDOFF.

### Deployed
- Version ID `bc1b24f8-c642-4948-b465-ebdf17c76a99`
  → https://ppc-planner.pressplaycollective.workers.dev

### Next logical step
1. Confirm live shows v0.4.2 + Prepare inline (hard-refresh if needed).
2. Continue Preparation board polish, or commit/push when ready.

---

## 2026-07-28 — EOD: deploy + Miro half-import (Cursor)

### What was built or decided
- Miro half-import: **27** Content Ideas live (first 28 of 57 frame images;
  1 skipped 403). Empty body, `organic`, JPEG ≤1200 @ ~0.85; prep kept (3).
- Deployed: Version ID `2a698460-e0ae-43b8-aa04-007b664436a5`
  → https://ppc-planner.pressplaycollective.workers.dev
- Assets already matched prior Preparation deploy; worker redeployed clean.

### What's mid-flight / not finished
- Second half (~29) Miro images not imported (deferred).
- **Local uncommitted:** `public/marketing.html` + `HANDOFF.md` (Preparation
  UI + polish vs `25aebb7`). No commit/push this EOD.

### Known issues or things flagged but not fixed
- Ideas KV payload ~3 MB — watch before half-2 import.
- Portrait thumbnail whitespace may still need a pass.

### Next logical step
1. Commit/push Preparation + HANDOFF when ready.
2. Continue Preparation board (see newer entry above).

---

## 2026-07-28 — Miro Content Ideas half-import done (Cursor)

### What was built or decided
- Restored live Content Ideas from Miro Pressplay frame
  `3458764660977230640` (board `uXjVG9DCPEc=`): first 28 of 57 image items;
  **27** posted (1 skipped HTTP 403). `body: ''`, `cat: 'organic'`, JPEG max
  edge 1200 @ ~0.85 as `imageData`, packed compact mood-board grid.
- GET then POST `/api/marketing`: replaced sample ideas; kept preparation (3),
  execution/review/schedule empty. No commit.

### What's mid-flight / not finished
- Second half (~29) Miro images not imported.
- Still no git commit/push of today's marketing.html Preparation work.

### Known issues or things flagged but not fixed
- Payload ~3 MB base64 — watch size before half-2 import.

### Next logical step
- See EOD entry above.

---

## 2026-07-28 — Marketing Preparation + polish; Ideas wipe; Miro import parked (Cursor)

### What was built or decided
- **Content Preparation** shipped on `/marketing`: pillars Organic / Email / Ads /
  Website; Organic format lanes (IG Post, Reel, Story, Pinterest, TikTok).
- Marketing colour categories = pillars (not Task Board cats). TikTok = Organic
  format only.
- Move Ideas → Preparation (removes from Ideas); prep panel has production plan
  + fit note; drag between lanes; duplicate to another format.
- Empty pillars/lanes render as slim bars; lanes with cards scroll vertically.
- Ideas polish: restack on delete/move when sparse; Home nav pill; centred
  section titles; removed `001` numbers; `/` no longer triggers browser search;
  panel Image always between props and Description.
- Deployed safe init so a failed/empty cloud load does **not** POST sample data
  over real KV. Live version: `d73201e9-f470-4ae0-bcb2-32f52e9fcd0b`.

### What's mid-flight / not finished
- ~~Live Content Ideas wiped / Miro import parked~~ — half-import completed in
  session above.
- Content Execution / Review / Schedule still skeletons.
- **No git commit/push** of today's `marketing.html` / HANDOFF changes yet.

### Known issues or things flagged but not fixed
- Base64 images in KV size risk remains.
- Portrait thumbnail whitespace on Ideas may still need a pass.

### Next logical step
- See newer session entry above.

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
- ~~Sections 2–5 not implemented — next agent picks up Content Preparation.~~
  Preparation shipped 2026-07-28; Execution / Review / Schedule remain.
- Committed/pushed as `25aebb7` after Phase A session.

### Known issues or things flagged but not fixed
- Base64 images in KV JSON will grow payload size — fine for reference
  mood-board images; move to R2/CDN if library gets large.
- Planner KV still has undated `mir-*` events (pre-existing).

### Next logical step
- See 2026-07-28 entry.

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
