import { randomUUID } from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";
import { fileURLToPath } from "node:url";

import { sessionCookieName } from "@/constants/cookies";
import { AppError } from "@/lib/app-error";
import { corsOrigins, getEnv } from "@/lib/env";
import { logger } from "@/lib/logger";
import { verifyHmac } from "@/server/auth/hmac";
import { loadApiRoutes, type LoadedRoute, matchRoute } from "@/server/http/load-routes";
import {
  header,
  parseCookies,
  readBody,
  type RequestContext,
  sendError,
  sendJson,
} from "@/server/http/respond";
import { assertAllowedOrigin } from "@/server/middleware/origin";
import { applyRateLimit, clientIp } from "@/server/middleware/rate-limit";

let routes: LoadedRoute[] | undefined;

export async function handleApiRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const env = getEnv();
  const correlationId = header(req.headers, "x-request-id") ?? randomUUID();
  res.setHeader("X-Request-Id", correlationId);

  const origin = header(req.headers, "origin");
  const allowed = corsOrigins();
  if (origin && allowed.includes(origin.replace(/\/$/, ""))) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Timestamp, X-Nonce, X-Signature, Idempotency-Key");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  }

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const host = req.headers.host ?? `${env.API_HOST}:${env.API_PORT}`;
  const url = new URL(req.url ?? "/", `http://${host}`);
  const apiPrefix = env.API_PREFIX.replace(/\/$/, "");
  const apiPath = url.pathname.startsWith(apiPrefix)
    ? url.pathname.slice(apiPrefix.length) || "/"
    : url.pathname;

  try {
    assertAllowedOrigin(origin, header(req.headers, "referer"), ["POST", "PUT", "PATCH", "DELETE"].includes(req.method ?? ""));

    const rawBody = await readBody(req);
    let body: unknown = {};
    if (rawBody.length > 0) {
      try {
        body = JSON.parse(rawBody) as unknown;
      } catch {
        throw AppError.validation([{ field: "body", message: "Invalid JSON" }]);
      }
    }

    const ip = clientIp(req.socket.remoteAddress, header(req.headers, "x-forwarded-for"));
    const method = req.method ?? "GET";
    const isHealth = method === "GET" && (apiPath === "/health" || apiPath === "/health/");
    const isPublicMedia = method === "GET" && /^\/media\/[^/]+$/.test(apiPath);

    if (!isHealth && !isPublicMedia) {
      try {
        await verifyHmac({
          method,
          path: url.pathname,
          timestampHeader: header(req.headers, "x-timestamp"),
          nonceHeader: header(req.headers, "x-nonce"),
          signatureHeader: header(req.headers, "x-signature"),
          rawBody,
        });
      } catch (error) {
        await applyRateLimit(`unsigned:${ip}`, "unsigned");
        throw error;
      }
      await applyRateLimit(`signed:${ip}`, "signed");
    }

    if (!routes) {
      routes = await loadApiRoutes(fileURLToPath(new URL("../api", import.meta.url)));
    }

    const matched = matchRoute(routes, method, apiPath);
    if (!matched) {
      throw AppError.notFound(`Route ${url.pathname} not found`);
    }

    const cookies = parseCookies(header(req.headers, "cookie"));
    const query: Record<string, string> = {};
    url.searchParams.forEach((value, key) => {
      query[key] = value;
    });

    const ctx: RequestContext = {
      req,
      res,
      method,
      path: apiPath,
      url,
      headers: req.headers,
      rawBody,
      body,
      params: matched.params,
      query,
      ip,
      correlationId,
      sessionToken: cookies[sessionCookieName],
    };

    const data = await matched.route.handler(ctx);
    // Media handler streams bytes directly onto the response.
    if (res.headersSent || res.writableEnded) {
      return;
    }
    if (data === undefined) {
      res.writeHead(204);
      res.end();
      return;
    }
    if (data === null) {
      return;
    }
    const extraHeaders: Record<string, string> = {};
    if (method === "GET" && matched.route.path === "/storefront") {
      extraHeaders["Cache-Control"] = "public, max-age=60, stale-while-revalidate=300";
    }
    if (isHealth) {
      const health = data as { database?: { status?: string } };
      const dbOk = health.database?.status === "connected";
      sendJson(res, dbOk ? 200 : 503, { data }, extraHeaders);
      return;
    }
    sendJson(res, method === "POST" ? 201 : 200, { data }, extraHeaders);
  } catch (error) {
    logger.error({ err: error instanceof Error ? error.message : "error", correlationId, path: url.pathname }, "API request failed");
    sendError(res, error, correlationId);
  }
}
