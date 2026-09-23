import nodemailer from "nodemailer";

import { getEnv } from "@/lib/env";
import { logger } from "@/lib/logger";

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
  const from = (input.from ?? env.EMAIL_FROM).trim() || env.EMAIL_FROM;
  try {
    const transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: Boolean(env.SMTP_SECURE),
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
    logger.error({ err: error instanceof Error ? error.message : "mail failed" }, "Unable to send email");
    return false;
  }
}
