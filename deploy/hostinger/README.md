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

## Deploy / update

```bash
cd /var/www/zermae && bash deploy/hostinger/deploy.sh
```

### Optimize existing CMS hero uploads (LCP)

New admin uploads are compressed by sharp automatically. Legacy multi-MB files already on the `zermae_uploads` volume still need a one-time pass:

```bash
cd /var/www/zermae
docker compose exec api npx tsx scripts/optimize-existing-media.ts --dry-run --dir /app/uploads --purpose hero
docker compose exec api npx tsx scripts/optimize-existing-media.ts --apply --dir /app/uploads --purpose hero
# Pre-build ?w= WebP (also runs automatically at the end of deploy.sh).
# Re-run manually if you only change uploads without a full deploy:
docker compose exec -T api npx tsx scripts/warm-media-derivatives.ts --dir /app/uploads
```

If the script writes `.webp` siblings, remap hero banner URLs in Admin → Storefront (or re-upload Desktop + Mobile banners). Prefer a real **9:16 mobile** art for Banner · Mobile.

Runtime LCP requests `/api/v1/media/{file}?w=1080` (mobile, WebP q86) and `?w=1920` (desktop); all `CmsImage` upload URLs also get a `?w=` cap. Derivatives cache under `/app/uploads/.cache/`.
