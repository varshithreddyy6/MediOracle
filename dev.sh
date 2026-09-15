#!/usr/bin/env bash
# One command: builds the frontend (if needed) and serves the WHOLE app
# (frontend + API) from a single process on :5175.
set -e
cd "$(dirname "$0")"

echo "▶ Installing backend deps (first run only)…"
pip install -q -r backend/requirements.txt

echo "▶ Building frontend (skipped if dist/ exists)…"
if [ ! -d frontend/dist ]; then
  (cd frontend && npm install && npm run build)
fi

echo "▶ Serving MEDIORACLE on http://localhost:5175"
cd backend && exec python3 -m uvicorn app.main:app --host 0.0.0.0 --port 5175
