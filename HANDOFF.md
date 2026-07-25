# HANDOFF

Update this at the end of every session touching this repo, whether that's
Claude Code, Cowork, or Cursor. Keep entries short. Newest session at the top.

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
  (Task Board), `src/index.js` (Worker — serves `/api/data` and
  `/api/kanban`, both backed by shared KV; `/api/kanban/patch` does a
  server-side merge patch on a single card to avoid two open tabs
  clobbering each other on full-board read-modify-write)
