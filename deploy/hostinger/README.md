# Hostinger VPS Docker deploy (zermae.com)

## What this stack runs
- `db` — PostgreSQL 16
- `api` — Backend (Node / tsx)
- `web` — Frontend (Next.js standalone)
- `caddy` — HTTPS reverse proxy (auto Let's Encrypt)

## Files
- `Backend/Dockerfile`
- `Frontend/Dockerfile`
- `docker-compose.yml` (repo root)
- `deploy/hostinger/Caddyfile`
- `deploy/hostinger/.env.example`
- `deploy/hostinger/deploy.sh`
