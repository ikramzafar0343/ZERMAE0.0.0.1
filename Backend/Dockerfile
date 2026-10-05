# syntax=docker/dockerfile:1
# Build context: repository root (see docker-compose.yml)

FROM node:20.19.0-bookworm-slim AS base
WORKDIR /app
ENV NODE_ENV=production

FROM base AS deps
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*
COPY Backend/package.json Backend/package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

FROM base AS runner
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/* \
  && mkdir -p /app/uploads /app/Database/migrations \
  && chown -R node:node /app
COPY --from=deps /app/node_modules ./node_modules
COPY Backend/package.json ./
COPY Backend/tsconfig.json ./
COPY Backend/src ./src
COPY Database/migrations ./Database/migrations
COPY --chown=node:node Backend/docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

USER node
EXPOSE 5000
ENV API_HOST=0.0.0.0
ENV API_PORT=5000
ENV UPLOAD_DIR=/app/uploads

ENTRYPOINT ["/app/docker-entrypoint.sh"]
