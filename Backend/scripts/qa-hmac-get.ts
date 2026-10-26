import { createHash, createHmac, randomBytes } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";

function loadEnv() {
  // minimal: HMAC from Backend/.env already loaded by process if using dotenv — read file
  return null;
}

async function getSecret() {
  const envPath = path.resolve(process.cwd(), ".env");
  const text = await readFile(envPath, "utf8");
  const line = text.split(/\r?\n/).find((row) => row.startsWith("HMAC_SIGNING_SECRET="));
  if (!line) throw new Error("HMAC missing");
  return line.slice("HMAC_SIGNING_SECRET=".length).trim();
}

function sha256Hex(value: string) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function hmacSign(secret: string, method: string, pathName: string, timestamp: string, nonce: string, body: string) {
  const canonical = `${method}\n${pathName}\n${timestamp}\n${nonce}\n${sha256Hex(body)}`;
  return createHmac("sha256", secret).update(canonical, "utf8").digest("hex");
}

async function main() {
  const secret = await getSecret();
  const method = "GET";
  const pathName = "/api/v1/storefront";
  const timestamp = String(Math.floor(Date.now() / 1000));
  const nonce = randomBytes(16).toString("hex");
  const signature = hmacSign(secret, method, pathName, timestamp, nonce, "");
  const response = await fetch(`http://127.0.0.1:5000${pathName}`, {
    headers: {
      "X-Timestamp": timestamp,
      "X-Nonce": nonce,
      "X-Signature": signature,
      Origin: "http://localhost:3000",
    },
  });
  const json = await response.json();
  if (!response.ok) {
    console.error(JSON.stringify(json, null, 2));
    process.exit(1);
  }
  const content = json.data.content;
  const checks = {
    hero: content.home?.sections?.hero?.posterSrc,
    lifestyle: content.home?.sections?.lifestyle?.posterSrc,
    about: content.pageTemplates?.about?.imageSrc,
    contact: content.pageTemplates?.contact?.imageSrc,
    serumsHero: content.collectionPages?.serums?.heroSrc,
    logo: content.brand?.logoOnLightSrc,
    journalHidden: content.home?.sections?.journal?.hidden,
    sectionOrder: content.home?.sectionOrder?.join(">"),
    primary: json.data.theme?.primary,
  };
  console.log(JSON.stringify(checks, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
