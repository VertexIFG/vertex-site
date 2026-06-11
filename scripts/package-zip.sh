#!/usr/bin/env bash
# Build the client deliverable: a clean source zip from the committed tree.
set -euo pipefail
cd "$(dirname "$0")/.."

if ! git diff-index --quiet HEAD --; then
  echo "Working tree is dirty — commit before packaging." >&2
  exit 1
fi

STAMP=$(date +%Y-%m-%d)
OUT=~/Downloads/vertex-site-redesign-$STAMP.zip
git archive HEAD -o "$OUT"
echo "Wrote $OUT"
unzip -l "$OUT" | tail -2
