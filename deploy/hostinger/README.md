# Hostinger VPS Docker deploy (zermae.com)

## What this stack runs
- `db` — PostgreSQL 16
- `api` — Backend (Node / tsx)
- `web` — Frontend (Next.js standalone)
- `nginx` — reverse proxy (HTTP + HTTPS with Let's Encrypt certs from certbot)

## Files
- `Backend/Dockerfile`
- `Frontend/Dockerfile`
- `docker-compose.yml` (repo root)
- `deploy/hostinger/nginx.conf`
- `deploy/hostinger/.env.example`
- `deploy/hostinger/deploy.sh`

## TLS notes
Issue / renew certs with certbot (DNS-01 recommended on this VPS):

```bash
certbot certonly --manual --preferred-challenges dns \
  -d zermae.com -d www.zermae.com
```

Certs are read from `/etc/letsencrypt/live/zermae.com/`.
