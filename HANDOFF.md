# HANDOFF

Update this at the end of every session touching this repo, whether that's
Claude Code, Cowork, or the Perplexity coding agent. Keep entries short.
Newest session at the top.

---

## 2026-07-23 — Marketing System page: spec only, no code yet (Perplexity agent)

### What was built or decided
- Jarvis's ask: fold the Miro "Content Filter Board" (his own note, "Miro
  Marketing System Plan 23-07-26") into ppc-planner as a **third page**,
  because the Miro board has ideas but no forward motion (his words: "it
  has no solid way of moving forward") and he doesn't want to stay capped
  by Miro/Claude usage limits for something this central to running the
  brand. Confirmed with Jarvis: stays a **separate page** from Task Board
  and Annual Planner (per the standing instruction already in this file),
  no shared card IDs or KV namespace with either.
- Source docs (Jarvis's vault, not this repo): "Miro Marketing System Plan
  23-07-26.md" (raw ask) and "PPC Content Strategy — Phase 2.md" (03-07-26,
  built with Claude — the fuller spec for the Content/Marketing Filter
  Board, channel list, and four-week content rhythm). Pull these again if
  requirements drift — this entry is a compressed version of both.
- This is a **planning-only session** — no code touched. Credits are
  tight on both build tools right now (Jarvis's Claude cap is maxed for
  the week; Perplexity Computer is running on a depleting one-time
  balance, not a recurring grant), so the plan is: spec it once here,
  cheaply, then build in small phases whenever either tool has room —
  instead of re-deriving requirements mid-build and burning credits on
  that instead of the actual feature.
- **Scope split — build in this order, each one a standalone session:**
  - **Phase A (this is the buildable-now scope):** the idea pipeline
    itself. A new page, new KV namespace, four stage-columns (see below).
    No calendar, no gap-detection, no event templates yet — just get
    ideas moving from capture to scheduled with a review gate, mirroring
    the Task Board's drag/drop card UI so it's not a new interaction
    model to learn.
  - **Phase B:** channel filter view + calendar (week/month grid) that
    flags missing days against the four-week rhythm (Release / Brand
    Identity / World Building / Tease weeks, from the Phase 2 doc).
  - **Phase C:** event/campaign phase templates (e.g. 008 Explorations in
    Denim's tease → name-drop → reveal → FDW → launch → post-launch
    phases) that auto-suggest what's due when a card is tagged to an
    event.
  - Metricool export/integration is explicitly **not scoped yet** — open
    question, don't build toward it until asked.

### Phase A spec (buildable as its own task)
- **New page:** `public/marketing.html`. Clone the Task Board's drag/drop
  card + panel mechanics from `public/kanban.html` rather than building
  new interaction patterns — same look, new columns and card shape.
- **New API surface in `src/index.js`:** add `'/api/marketing': 'marketing'`
  to `KV_KEYS` (own KV record, isolated from `main` and `kanban`), plus a
  `/api/marketing/patch` route that mirrors the existing
  `/api/kanban/patch` single-card merge pattern (`{ upsert: [card, ...],
  remove: [id, ...] }`) from day one — don't repeat the full-board
  read-modify-write mistake `kanban.html` had to be fixed for twice this
  week.
- **Stage columns (the pipeline):** `ideas` → `production` → `review` →
  `scheduled`. This is the literal fix for what Jarvis's note flagged as
  missing on the Miro board.
- **Card shape (`MCARD`):**
  ```
  {
    id: 'mc-<id>',
    title: '',
    body: '',              // idea description / notes
    stage: 'ideas',        // 'ideas' | 'production' | 'review' | 'scheduled'
    channel: 'ig_post',    // see taxonomy below
    productionPlan: '',    // filled in once it leaves 'ideas'
    result: '',            // link/note on the finished asset
    scheduledDate: null,   // ISO date, set once it reaches 'scheduled'
    eventTag: null,        // free-text for now, e.g. '008-fdw' — Phase C formalizes this
    assignees: [],         // reuse the STAFF pattern from kanban.html (own local copy, don't cross-fetch)
    approvedBy: null,      // set on the review → scheduled transition
    createdAt: '', updatedAt: ''
  }
  ```
- **Channel taxonomy** (tag on the card, not a column — from the Phase 2
  doc's channel list, organic is primary):
  - Primary: Instagram Post, Instagram Story, Instagram Reel, Pinterest
  - Secondary: TikTok, Email, Meta Ads, Website
  - Reuse the `CATS` colour-chip convention from `kanban.html` so primary
    vs secondary is visually obvious at a glance.
- **Review gate:** a card can't move `review` → `scheduled` without
  `approvedBy` being set — matches the real approval flow (intern drafts,
  Jarvis approves, intern schedules) from the Phase 2 doc's Team Roles
  section.
- **Nav:** none of the three pages currently link to each other (checked
  `index.html` and `kanban.html` — no cross-links exist yet). Add a small
  shared nav/tab bar across all three pages as part of this phase, not as
  an afterthought.
- **Explicitly deferred to Phase B/C, do not build now:** calendar/week
  view, gap detection, content-layer weighting (Acquisition/Identity/
  Conversion), event phase templates, Metricool export.

### What's mid-flight / not finished
- Nothing coded yet — this whole entry is the spec. Next session on this
  should just start Phase A against the spec above.

### Known issues or things flagged but not fixed
- N/A — planning entry.

### Next logical step
- Build Phase A (idea pipeline page) per the spec above, on its own
  branch, whenever there's room on either build tool. Don't start Phase B
  until Phase A is reviewed and working.

---

## 2026-07-23 — One true record: Task Board ⇄ Annual Planner mirror fix (Perplexity agent)

### What was built or decided
- Jarvis's ask: "it should be 1 card existing in both places... if you move a
  card around in the planner, it should change the date in the card that's
  living in both planner and task board. if you adjust it in the card, it
  should update everywhere that card lives." This closes the gap the
  previous entry flagged as a separate task.
- Root cause found while mapping the sync code (as recommended below): the
  Timeline → Task Board direction was already solid — `index.html`'s
  `syncDateMirrors()` reconciles it safely through `/api/kanban/patch`.
  The Task Board → Timeline direction was the broken one, and it was
  broken by **duplicate, competing logic**, not a missing feature:
  - `syncDateMirrors()` in `index.html` already mirrored *dated* cards
    onto the timeline correctly (creates/updates/retires a linked event
    keyed by `srcCardId`, one record per card).
  - But `public/kanban.html` ALSO had `upsertPlannerMirror()` and
    `autoAssignToPlanner()`, which pushed their own copies straight into
    `/api/data` from the Task Board page itself — `autoAssignToPlanner()`
    in particular created a copy with **no `id` and no `srcCardId`**,
    so it was a permanently orphaned snapshot: editing the card afterwards
    never touched that copy again. That's exactly the "lives in both
    places but doesn't stay in sync" symptom Jarvis was hitting.
- Fix: made `syncDateMirrors()` (`index.html`) the single owner of every
  card→timeline mirror, dated or not:
  - Extended it so an **undated** card also gets a linked mirror — parked
    in the current week (via the same `dateToPlannerSlot()` banding used
    for dated placement, just with `day: null`) when the existing
    `kanbanAutoAssign` setting is on — reusing the same `mir-<cardId>` /
    `srcCardId` link convention as dated mirrors, so the *same*
    reconcile loop updates and retires them identically. One code path,
    one record per card, no separate "auto-assign" mechanism anymore.
  - Deleted `upsertPlannerMirror()`, `autoAssignToPlanner()`, and their
    `PLANNER_SYNC_URL`/`PLANNER_MONTHS`/`PLANNER_MONTH_LABELS`/
    `plannerSlotForDate()` support code from `public/kanban.html`, plus
    their two call sites in the card-save function. The Task Board no
    longer talks to `/api/data` at all — it just saves its own card
    fields normally, and the Annual Planner's own reconcile pass (on
    every load, and after planner-side saves) picks up the change.
- Net effect: a card's due date, title, status, category, and project
  now live in exactly one place (the Task Board card) with exactly one
  linked timeline pill that always reflects it — moving the pill on the
  planner still calls the already-safe `pushDueDateToCard()` → patches
  the card's `dueDate` via `/api/kanban/patch`; editing the card updates
  the same mirror event next time the planner reconciles. No more
  separate/duplicate/orphaned copies.
- **Timing note to flag to Jarvis:** this is reconcile-on-load, not
  push-to-open-tabs. If the Task Board and Annual Planner are open in two
  tabs side by side, a card edit shows up on the planner tab next time
  *that tab* reconciles (page load, or its own next save/drag) — not
  instantly. That matches how the reverse direction already worked before
  this fix, so behavior is now consistent both ways, just not real-time
  across simultaneously-open tabs.
- Verified with an isolated Node simulation of the new reconcile logic
  (`console.assert`-based, not saved to the repo): dated card → exactly
  one mirror, editing the card updates that same mirror (not a second
  one), undated card auto-parks in the current week when the setting is
  on and gets no mirror when it's off, clearing a due date retires the
  mirror, deleting a card removes its orphaned mirror. All passed. Both
  files also pass `node --check` on their embedded scripts.

### What's mid-flight / not finished
- **Pre-existing stale data on the live KV, not touched by this fix:**
  because the old `autoAssignToPlanner()` pushed events with no `id` and
  no `srcCardId`, any "current week" copies it already created against
  the *live* `/api/data` before this branch is deployed are permanently
  unlinked and won't be recognized or cleaned up by the new reconcile
  logic (there's no marker distinguishing them from genuine planner-
  native events). If duplicate-looking pills show up on the timeline
  after deploying, they're most likely these old orphans — safe to just
  delete by hand once; not safe to auto-clean since nothing marks them.
- Not yet tested in a real browser (no dev server / test harness for this
  Worker app) — recommend opening both pages after review: create an
  undated card (confirm it lands in the current week), give a card a due
  date (confirm it moves to that date), edit a card's title/date (confirm
  the SAME pill updates, not a new one), drag a pill on the planner
  (confirm the card's due date follows), delete a card (confirm its pill
  disappears).

### Known issues or things flagged but not fixed
- Still no CI/deploy automation, still on branch `cleanup/handoff-flags` —
  nothing live changes until it's reviewed, merged, and `wrangler deploy`
  is run manually.

### Next logical step
- Review + manual browser test as described above, then merge and deploy
  when Jarvis/Claude Code are ready.
- Content calendar / new features should stay a separate page from Task
  Board and Annual Planner when that work starts — not part of this fix.

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
