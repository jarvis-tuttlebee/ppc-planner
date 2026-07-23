# HANDOFF

Update this at the end of every session touching this repo, whether that's
Claude Code, Cowork, or the Perplexity coding agent. Keep entries short.
Newest session at the top.

---

## 2026-07-23 — Kanban save-race fix (Perplexity agent)

### What was built or decided
- Closed the clobber gap flagged in the previous entry, on the same branch
  (`cleanup/handoff-flags`, still not merged/deployed):
  - `src/index.js`: `/api/kanban/patch` now also accepts optional `order`,
    `projects`, `staff` and overwrites those fields directly (safe —
    Task Board is their only writer, so no merge needed, unlike `cards`).
  - `public/kanban.html`: `saveBoard()` now takes `{ upsert, remove }` and
    always routes through `/api/kanban/patch` instead of POSTing the
    entire board. Every one of its ~13 call sites was reclassified and
    updated: pure metadata changes (column reorder, project rename/
    create, staff add) call `saveBoard()` with no args; anything that
    touches specific cards (delete, move, project delete/unassign, staff
    rename remapping assignees, panel save/create) now passes exactly the
    card(s) it touched via `upsert`/`remove`, so this tab's stale copy of
    *other* cards is never resent.
  - Verified with an isolated Node test of the merge logic (not a full
    browser test — no test harness exists for this app yet): confirmed a
    metadata-only save no longer wipes a field the other page just patched
    on an unrelated card, and unrelated deletes don't touch other cards.
    Both files pass `node --check` on their embedded scripts.

### What's mid-flight / not finished (found while doing this, NOT fixed)
- **Bigger, separate issue discovered:** the *other* direction of this
  same race exists on `/api/data` (the Annual Planner's own cats/events/
  settings blob). `public/kanban.html`'s `upsertPlannerMirror()` and
  `autoAssignToPlanner()` do their own full fetch-then-overwrite POST to
  `/api/data` from the Task Board page — there's no `/api/data/patch`
  equivalent at all, so this side has zero mitigation currently.
  - Worth investigating before building a patch endpoint for it: `index.
    html` already has its own `syncDateMirrors()` that reconciles the
    same card→event mirrors independently on every Annual Planner load/
    save. It's not obvious both mechanisms are still needed — possible
    this is partly duplicate logic rather than just a race. Recommend
    tracing through both before touching either, rather than assuming
    it's a straight copy of the kanban-side fix.
  - Also noticed: `autoAssignToPlanner()`'s pushed events have no `id`,
    so even a future patch endpoint can't upsert-by-id on them without
    that being added first (`mir-` prefix convention already exists for
    the other function, e.g. `id: 'mir-' + card.id`).

### Known issues or things flagged but not fixed
- Still no CI/deploy automation, still on a branch — nothing live changes
  until `cleanup/handoff-flags` is reviewed, merged, and `wrangler deploy`
  is run manually.

### Next logical step
- Review and test `cleanup/handoff-flags` for real (open both pages,
  confirm card edits/drags/project changes/staff edits still work and
  sync correctly) before merging + deploying.
- Then pick up the `/api/data` mirror-sync investigation above as its own
  task.

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
