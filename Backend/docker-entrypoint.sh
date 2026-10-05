#!/bin/sh
set -eu

echo "Running database migrations..."
npx tsx src/server/database/migrate.ts

echo "Seeding admin account (idempotent)..."
npx tsx src/server/jobs/seed-admin.ts || true

echo "Starting Zermae API..."
exec npx tsx src/server/http/start.ts
