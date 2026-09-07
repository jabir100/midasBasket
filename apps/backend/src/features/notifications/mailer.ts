import nodemailer, { type Transporter } from "nodemailer";

import { env } from "../../core/config/env.js";
import { logger } from "../../core/logging/logger.js";

const fromAddress = env.EMAIL_FROM_ADDRESS ?? env.EMAIL_USER ?? "";

function createTransporter(): Transporter | null {
  if (!env.EMAIL_USER || !env.EMAIL_PASSWORD) {
    return null;
  }

  return nodemailer.createTransport({
    host: env.EMAIL_HOST,
    port: env.EMAIL_PORT,
    secure: env.EMAIL_PORT === 465,
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASSWORD,
    },
  });
}

const transporter = createTransporter();
const isConfigured = transporter !== null;

if (isConfigured) {
  logger.info("Email service initialized successfully");
} else {
  logger.warn(
    "Email credentials are not configured. Transactional emails will be skipped.",
  );
}

export type MailInput = {
  to: string;
  subject: string;
  html: string;
};

export async function sendMail(input: MailInput): Promise<void> {
  if (!transporter) {
    logger.warn(
      { to: input.to, subject: input.subject },
      "Email service is not configured; skipping email send",
    );
    return;
  }

  try {
    await transporter.sendMail({
      from: `"${env.EMAIL_FROM_NAME}" <${fromAddress}>`,
      to: input.to,
      subject: input.subject,
      html: input.html,
    });
    logger.info({ to: input.to, subject: input.subject }, "Email sent");
  } catch (error) {
    logger.error(
      { error, to: input.to, subject: input.subject },
      "Failed to send email",
    );
  }
}
