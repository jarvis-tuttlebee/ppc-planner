#!/usr/bin/env bash
# Pull every live Homebase KV payload into backups/live-<UTC stamp>/.
# Safe: GET only. Never writes to live.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BASE="${PPC_LIVE_BASE:-https://ppc-homebase.pressplaycollective.workers.dev}"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
DIR="$ROOT/backups/live-$STAMP"
mkdir -p "$DIR"

echo "Pulling live boards from $BASE → $DIR"
curl -fsSL "$BASE/api/marketing" -o "$DIR/marketing.json"
curl -fsSL "$BASE/api/data" -o "$DIR/planner-main.json"
curl -fsSL "$BASE/api/kanban" -o "$DIR/kanban.json"
curl -fsSL "$BASE/api/archive" -o "$DIR/archive.json"
curl -fsSL "$BASE/api/marketing/snapshots" -o "$DIR/marketing-snapshots-meta.json" \
  || echo '{"items":[]}' > "$DIR/marketing-snapshots-meta.json"

export BACKUP_DIR="$DIR"
export BACKUP_STAMP="$STAMP"
export BACKUP_ROOT="$ROOT"
export BACKUP_SOURCE="$BASE"
node <<'NODE'
const fs = require('fs');
const dir = process.env.BACKUP_DIR;
const summary = {
  takenAt: new Date().toISOString(),
  source: process.env.BACKUP_SOURCE,
  files: {}
};
for (const f of fs.readdirSync(dir)) {
  const p = dir + '/' + f;
  const st = fs.statSync(p);
  const meta = { bytes: st.size };
  try {
    const j = JSON.parse(fs.readFileSync(p, 'utf8'));
    if (f === 'marketing.json') {
      meta.rev = j._rev;
      meta.savedAt = j._savedAt;
      meta.ideas = (j.ideas || []).length;
      meta.anchors = (j.anchors || []).length;
      meta.schedule = ((j.sections || {}).schedule || []).length;
      meta.scheduleFilled = ((j.sections || {}).schedule || [])
        .filter(c => String(c.body || '').replace(/<[^>]+>/g, '').trim()).length;
    } else if (f === 'kanban.json') {
      meta.cards = (j.cards || []).length;
    } else if (f === 'planner-main.json') {
      meta.events = Array.isArray(j.events) ? j.events.length : 0;
    } else if (f === 'archive.json') {
      meta.items = (j.items || []).length;
    } else if (f === 'marketing-snapshots-meta.json') {
      meta.snapshots = (j.items || []).length;
      meta.latest = (j.items || [])[0] || null;
    }
  } catch (e) {
    meta.parseError = String(e);
  }
  summary.files[f] = meta;
}
fs.writeFileSync(dir + '/SUMMARY.json', JSON.stringify(summary, null, 2));
fs.writeFileSync(process.env.BACKUP_ROOT + '/backups/LATEST', process.env.BACKUP_STAMP + '\n');
fs.writeFileSync(
  process.env.BACKUP_ROOT + '/backups/LATEST-SUMMARY.json',
  JSON.stringify(summary, null, 2)
);
console.log(JSON.stringify(summary, null, 2));
NODE

echo "Done. Latest stamp: $STAMP"
echo "Seed local preview with: bash scripts/seed-local-from-backup.sh"
