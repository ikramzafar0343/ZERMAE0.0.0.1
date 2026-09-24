import nodemailer from "nodemailer";

import { getEnv } from "@/lib/env";
import { logger } from "@/lib/logger";

function stripEnvQuotes(value: string): string {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

export async function sendMail(input: {
  to: string;
  subject: string;
  text: string;
  from?: string;
}): Promise<boolean> {
  const env = getEnv();
  if (!env.SMTP_HOST || !env.SMTP_PORT) {
    logger.warn({ to: input.to, subject: input.subject }, "SMTP is not configured; email was not sent");
    return false;
  }
  const from = stripEnvQuotes(input.from ?? env.EMAIL_FROM) || stripEnvQuotes(env.EMAIL_FROM);
  const secure = Boolean(env.SMTP_SECURE);
  try {
    const transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure,
      // Google Workspace / Gmail on 587 need STARTTLS
      requireTLS: !secure && env.SMTP_PORT === 587,
      auth: env.SMTP_USER
        ? {
            user: env.SMTP_USER,
            pass: env.SMTP_PASS,
          }
        : undefined,
    });
    await transporter.sendMail({
      from,
      to: input.to,
      subject: input.subject,
      text: input.text,
    });
    return true;
  } catch (error) {
    logger.error(
      {
        err: error instanceof Error ? error.message : "mail failed",
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        user: env.SMTP_USER,
      },
      "Unable to send email",
    );
    return false;
  }
}
