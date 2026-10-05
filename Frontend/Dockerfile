# syntax=docker/dockerfile:1

FROM node:20.19.0-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

FROM node:20.19.0-bookworm-slim AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Runtime secrets are injected by compose; placeholders satisfy build-time env parse if any.
ARG APP_URL=https://zermae.com
ARG API_URL=http://api:5000
ARG API_PREFIX=/api/v1
ARG HMAC_SIGNING_SECRET=build-time-hmac-signing-secret-placeholder-32chars
ARG SESSION_SECRET=build-time-session-secret-placeholder-value-32chars
ARG SESSION_TTL_SECONDS=604800
ENV APP_URL=$APP_URL \
    API_URL=$API_URL \
    API_PREFIX=$API_PREFIX \
    HMAC_SIGNING_SECRET=$HMAC_SIGNING_SECRET \
    SESSION_SECRET=$SESSION_SECRET \
    SESSION_TTL_SECONDS=$SESSION_TTL_SECONDS
RUN npm run build

FROM node:20.19.0-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN mkdir -p /app/public/uploads \
  && chown -R node:node /app

COPY --from=builder /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node
EXPOSE 3000
CMD ["node", "server.js"]
