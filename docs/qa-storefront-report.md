# Zermae Storefront QA Report

**Date:** 2026-10-27 (updated after media-blocker fix)  
**Environment:** localhost Frontend `:3000` + Backend `:5000`  
**Method:** Browser admin + Backend fixture scripts + live HTML/CSS asserts  
**Fixtures:** `Frontend/public/media/_qa-fixtures/` (cheesecake / taco / pastrami / bagel)  
**Screenshots:** `docs/qa-screenshots/`

## Verdict

**Release gate for CMS image display: Pass (fixed).**  
CMS-uploaded `/api/v1/media/*` URLs now render on the public storefront via Next rewrites. Publish no longer wipes collapsed Home image fields. Admin upload copy matches the 10MB server limit.

Site restored to Zermae brand assets after retest.

---

## Fix summary (2026-10-27)

| Defect | Fix |
|--------|-----|
| `/api/v1/media/*` 404 on `:3000` | Next rewrites in `Frontend/next.config.ts` → `API_URL` media route (plus `/uploads/:name`) |
| Publish wiped collapsed Home images | `SectionShell` keeps children mounted (`hidden={!open}`); `readImage` keeps existing URL when form field omitted |
| Admin “5MB” vs server 10MB | Client `MAX_BYTES` + copy → 10MB in `image-url-field.tsx` / `product-image-uploader.tsx` |

**Retest evidence:** After rewrite, `GET http://localhost:3000/api/v1/media/<file>.jpg` → **200 image/jpeg**. About page `<img>` `naturalWidth`/`naturalHeight` &gt; 0 for fixture URLs (including via `/_next/image`). Fixture IDs present in `/`, `/about-us`, `/contact`, `/collections/serums` HTML while applied.

---

## A. Smoke / health

| Case | Result | Notes |
|------|--------|-------|
| `GET /` 200 | **Pass** | Home renders |
| Admin login → OTP → `/admin` | **Pass** | Seed `admin@example.com` |
| `/admin/customer-side` Online Store | **Pass** | Tabs load |

---

## B. CMS image replace / publish / live verify

| Surface | Result | Notes |
|---------|--------|-------|
| Theme logos | **Pass** | Upload URL reachable; logo `img` loads |
| Home hero / lifestyle / mosaic / journal / social / newsletter | **Pass** | Fixture URLs in HTML + media 200 |
| Collections serums hero | **Pass** | |
| Pages About / Contact / FAQ | **Pass** | About still loads via rewrite / next/image |
| Inventory gallery uploads | **Pass** | Same `/api/v1/media` path |
| Clear FAQ image | **Pass** | |
| Soft/hard refresh after revalidate | **Pass** | |

---

## C–I. Other matrix (from prior campaign)

| Area | Result |
|------|--------|
| Hide Journal / reorder Social above FAQ | **Pass** |
| Header/footer menu edits | **Pass** |
| Theme primary color | **Pass** |
| Checkout fees (read-only) | **Pass** |
| No sage pill / border card on stills | **Pass** |
| Wrong MIME reject | **Pass** |
| Oversized &gt;10MB reject | **Pass** |
| Maintenance ON/OFF | **Pass** |
| Restore Zermae assets | **Pass** |

---

## Remaining known gaps (non-blocking)

1. Hero ProductMiniCard pill chrome is not CMS-editable (Inventory / best sellers / hero poster only).
2. Logo hydration warning on admin login when logo URL changes (`src/components/ui/logo.tsx`).
3. Video upload/playback is not in scope (images only: PNG/JPG/WEBP/AVIF).

---

## Success criteria vs plan

| Criterion | Status |
|-----------|--------|
| Critical/Major cases Pass | **Pass** (media blocker fixed) |
| Fixture uploads prove admin→live | **Pass** |
| Site restored to Zermae imagery | **Pass** |
| Ritual/About/Contact picture-only | **Pass** |
