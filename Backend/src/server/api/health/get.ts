import { databaseHealth } from "@/server/database/pool";
import type { RouteDefinition } from "@/server/http/load-routes";

export const definition: RouteDefinition = {
  method: "GET",
  path: "/health",
};

export async function handler() {
  const database = await databaseHealth();
  return {
    status: database.status === "connected" ? "ok" : "degraded",
    database,
  };
}
