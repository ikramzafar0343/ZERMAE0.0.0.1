import path from "node:path";
import { fileURLToPath } from "node:url";

import type { NextConfig } from "next";

const directoryName = path.dirname(fileURLToPath(import.meta.url));

/** Browser hits Next :3000; proxy CMS media to the API (same contract as prod nginx /api). */
const apiOrigin = (process.env.API_URL ?? "http://127.0.0.1:5000").replace(/\/$/, "");

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  turbopack: {
    root: directoryName,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "zermae.com" },
      { protocol: "https", hostname: "www.zermae.com" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "127.0.0.1" },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/media/:name",
        destination: `${apiOrigin}/api/v1/media/:name`,
      },
      {
        source: "/uploads/:name",
        destination: `${apiOrigin}/api/v1/media/:name`,
      },
    ];
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "24mb",
    },
  },
};

export default nextConfig;
