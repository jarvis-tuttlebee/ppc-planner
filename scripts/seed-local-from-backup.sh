#!/usr/bin/env bash
# Load a backups/live-* dump into LOCAL wrangler KV (never --remote).
# Then open: npx wrangler dev --port 8787 --local
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

STAMP="${1:-}"
if [ -z "$STAMP" ]; then
  if [ -f backups/LATEST ]; then
    STAMP="$(tr -d '[:space:]' < backups/LATEST)"
  else
    echo "Usage: $0 <live-YYYYMMDDTHHMMSSZ>   or create backups/LATEST via pull-live-backup.sh" >&2
    exit 1
  fi
fi
# Allow either full folder name or bare stamp
case "$STAMP" in
  live-*) DIR="$ROOT/backups/$STAMP" ;;
  *) DIR="$ROOT/backups/live-$STAMP" ;;
esac
if [ ! -f "$DIR/marketing.json" ]; then
  echo "Missing backup at $DIR" >&2
  exit 1
fi

echo "Seeding LOCAL KV from $DIR (will not touch live Cloudflare KV)"
npx wrangler kv key put marketing --binding=PLANNER_KV --local --path="$DIR/marketing.json"
npx wrangler kv key put main --binding=PLANNER_KV --local --path="$DIR/planner-main.json"
npx wrangler kv key put kanban --binding=PLANNER_KV --local --path="$DIR/kanban.json"
npx wrangler kv key put archive --binding=PLANNER_KV --local --path="$DIR/archive.json"

echo "Local keys:"
npx wrangler kv key list --binding=PLANNER_KV --local
echo
echo "Start local preview (isolated from live):"
echo "  npx wrangler dev --port 8787 --local"
echo "Open http://127.0.0.1:8787/marketing"
echo
echo "To restore THIS dump onto LIVE later (manual, intentional):"
echo "  # only when you mean it — posts to production:"
echo "  curl -X POST \$LIVE/api/marketing -H 'Content-Type: application/json' -H 'X-PPC-Force-Overwrite: 1' --data-binary @$DIR/marketing.json"
