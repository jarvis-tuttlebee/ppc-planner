# HANDOFF

Update this at the end of every session touching this repo, whether that's
Claude Code, Cowork, or the Perplexity coding agent. Keep entries short.
Newest session at the top.

---

## 2026-07-23 — First recon + small cleanup (Perplexity agent)

### What was built or decided
- Did the read-only recon Claude Code asked for (cloned repo, read
  `HANDOFF.md`, `src/index.js`, both HTML pages) and reported back before
  touching anything — round-trip confirmed working.
- Jarvis then asked for the flagged items to be cleaned up. Fixed on branch
  `cleanup/handoff-flags` (not merged/deployed yet, needs review):
  - Renamed `saveToFirestore()` → `saveToKV()` in `public/index.html`
    (12 call sites). No Firestore involved — it's Cloudflare KV, the old
    name was leftover/misleading.
  - Fixed stale "28 Aug" seed-data references to Ode to Sirens' actual
    date (4 Sept 2026) in `public/kanban.html` (`SEED_CARDS`, card `k11`)
    and `public/index.html` (`EVENTS` seed array + the swing-tags task
    body that mentioned the old date). These are fallback-only seed
    values used when KV is empty, so low real-world impact, but would
    have resurfaced the wrong date on any future reset.

### What's mid-flight / not finished
- **Not fixed yet — flagged as its own task, too big for a quick cleanup:**
  the kanban "clobber" mitigation is only half-applied. `src/index.js`'s
  `/api/kanban/patch` route does a safe server-side single-card merge, and
  `public/index.html` uses it. But `public/kanban.html`'s own `saveBoard()`
  (13 call sites — drag/drop, delete, project rename, panel save, staff
  edits, etc.) still does a full read-modify-write POST straight to
  `/api/kanban`. If the Task Board and Annual Planner are open in two tabs
  and both save around the same time, the Task Board's full save can still
  silently drop an edit the Annual Planner just made via patch. Needs a
  proper pass deciding which of the 13 call sites are pure card edits
  (→ switch to patch) vs. structural changes to order/projects/staff
  (→ still need a full save, or a second patch-style endpoint for board
  metadata). Didn't want to rush that blind on the live app's save path.

### Known issues or things flagged but not fixed
- Still no CI/deploy automation — `wrangler deploy` from this folder is
  still the only way anything goes live. This branch has NOT been merged
  to `main` or deployed; nothing changes for Jarvis until that happens.

### Next logical step
- Jarvis or Claude Code to review branch `cleanup/handoff-flags`, merge to
  `main`, and run `wrangler deploy` when ready.
- Pick up the `saveBoard()` → patch-endpoint refactor as its own scoped
  task next.

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
