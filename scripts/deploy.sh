#!/usr/bin/env bash
set -Eeuo pipefail

cd "$(dirname "$0")/.."

git pull --ff-only origin main
npm ci
rm -rf .next
NODE_OPTIONS="--max-old-space-size=1536" npm run build

if pm2 describe barber-frontend >/dev/null 2>&1; then
  pm2 restart barber-frontend
else
  pm2 start npm --name barber-frontend --cwd "$PWD" -- start -- -H 127.0.0.1 -p 3000
fi

pm2 save
pm2 status barber-frontend
