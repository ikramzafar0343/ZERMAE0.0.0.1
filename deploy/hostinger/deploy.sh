#!/usr/bin/env bash
# First-time / update deploy on Hostinger VPS (Ubuntu).
# Run as root from /var/www/zermae after cloning the repo.
set -euo pipefail

APP_ROOT="${APP_ROOT:-/var/www/zermae}"
cd "${APP_ROOT}"

if [[ ! -f .env ]]; then
  echo "Missing ${APP_ROOT}/.env — copy deploy/hostinger/.env.example and fill secrets."
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is not installed. Install Docker Engine + Compose plugin first."
  exit 1
fi

echo "== Pulling latest code =="
git fetch --all --prune
git checkout main
git pull --ff-only origin main

echo "== Building and starting containers =="
docker compose pull
docker compose build --pull
docker compose up -d

echo "== Status =="
docker compose ps
echo "Done. Open https://zermae.com after DNS A record points to this VPS."
