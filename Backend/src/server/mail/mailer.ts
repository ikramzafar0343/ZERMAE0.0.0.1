import nodemailer from "nodemailer";
import { Resend } from "resend";

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

async function sendWithResend(input: {
  to: string;
  subject: string;
  text: string;
  from: string;
  apiKey: string;
}): Promise<boolean> {
  const resend = new Resend(input.apiKey);
  const { data, error } = await resend.emails.send({
    from: input.from,
    to: [input.to],
    subject: input.subject,
    text: input.text,
  });
  if (error) {
    logger.error({ err: error.message, to: input.to, subject: input.subject }, "Unable to send email via Resend");
    return false;
  }
  logger.info({ to: input.to, subject: input.subject, id: data?.id }, "Email sent via Resend");
  return true;
}

async function sendWithSmtp(input: {
  to: string;
  subject: string;
  text: string;
  from: string;
}): Promise<boolean> {
  const env = getEnv();
  if (!env.SMTP_HOST || !env.SMTP_PORT) {
    logger.warn({ to: input.to, subject: input.subject }, "SMTP is not configured; email was not sent");
    return false;
  }
  const secure = Boolean(env.SMTP_SECURE);
  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure,
    requireTLS: !secure && env.SMTP_PORT === 587,
    auth: env.SMTP_USER
      ? {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        }
      : undefined,
  });
  await transporter.sendMail({
    from: input.from,
    to: input.to,
    subject: input.subject,
    text: input.text,
  });
  return true;
}

export async function sendMail(input: {
  to: string;
  subject: string;
  text: string;
  from?: string;
}): Promise<boolean> {
  const env = getEnv();
  const from = stripEnvQuotes(input.from ?? env.EMAIL_FROM) || stripEnvQuotes(env.EMAIL_FROM);

  try {
    // Prefer Resend when configured — independent of Google password / 2SV.
    if (env.RESEND_API_KEY) {
      return await sendWithResend({
        to: input.to,
        subject: input.subject,
        text: input.text,
        from,
        apiKey: env.RESEND_API_KEY,
      });
    }

    return await sendWithSmtp({
      to: input.to,
      subject: input.subject,
      text: input.text,
      from,
    });
  } catch (error) {
    logger.error(
      {
        err: error instanceof Error ? error.message : "mail failed",
        provider: env.RESEND_API_KEY ? "resend" : "smtp",
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        user: env.SMTP_USER,
      },
      "Unable to send email",
    );
    return false;
  }
}
