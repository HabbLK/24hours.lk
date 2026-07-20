import nodemailer from "nodemailer";

const BRAND_RED = "#E4322B";
const BRAND_RED_DK = "#B91C1C";
const BRAND_INK = "#1A1A1A";
const BRAND_ORANGE = "#F97316";

/** Public site URL for links inside emails — always 24hours.lk, even in local dev where NEXTAUTH_URL points at localhost. */
export function getAppUrl() {
  return process.env.APP_URL || process.env.NEXTAUTH_URL || "https://24hours.lk";
}

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  if (transporter) return transporter;

  const port = Number(process.env.SMTP_PORT || 587);
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      // Gmail app passwords are shown with spaces for readability; strip them —
      // Google accepts both, but some SMTP auth mechanisms don't like literal spaces.
      pass: process.env.SMTP_PASS?.replace(/\s+/g, ""),
    },
  });

  transporter.verify((err) => {
    if (err) {
      console.error("[mail] SMTP connection failed — check SMTP_HOST/PORT/USER/PASS in .env.local:", err);
    } else {
      console.log("[mail] SMTP connection verified, ready to send");
    }
  });

  return transporter;
}

interface SendMailInput {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/** Sends an email; never throws — logs and returns false on failure so callers never have to wrap this in try/catch. */
export async function sendMail({ to, subject, html, text }: SendMailInput): Promise<boolean> {
  try {
    await getTransporter().sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
      text,
    });
    return true;
  } catch (error: any) {
    console.error(`[mail] Failed to send "${subject}" to ${to}: ${error?.message || error}`, {
      code: error?.code,
      response: error?.response,
      responseCode: error?.responseCode,
    });
    return false;
  }
}

/**
 * Shared branded HTML shell used by every transactional and newsletter email.
 * Uses inline styles and table layout throughout for email-client compatibility.
 */
export function renderEmailHtml({
  preheader,
  heading,
  bodyHtml,
  ctaLabel,
  ctaUrl,
  footerNote,
}: {
  preheader?: string;
  heading: string;
  bodyHtml: string;
  ctaLabel?: string;
  ctaUrl?: string;
  footerNote?: string;
}) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>24hours.lk</title>
  </head>
  <body style="margin:0;padding:0;background-color:#F5F5F5;font-family:Arial,Helvetica,sans-serif;">
    ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>` : ""}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5F5F5;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;background-color:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #ECECEC;">
            <tr>
              <td style="background-color:${BRAND_INK};padding:24px 32px;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="background-color:${BRAND_RED};color:#ffffff;font-weight:bold;font-size:14px;width:32px;height:32px;text-align:center;vertical-align:middle;border-radius:8px;">24</td>
                    <td style="padding-left:10px;color:#ffffff;font-size:18px;font-weight:bold;">hours<span style="color:${BRAND_RED};">.lk</span></td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:36px 32px 8px;">
                <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;color:${BRAND_INK};">${heading}</h1>
                <div style="font-size:14px;line-height:1.7;color:#4B4B4B;">${bodyHtml}</div>
              </td>
            </tr>
            ${
              ctaLabel && ctaUrl
                ? `<tr>
              <td style="padding:8px 32px 32px;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="background-color:${BRAND_RED};border-radius:10px;">
                      <a href="${ctaUrl}" style="display:inline-block;padding:13px 28px;color:#ffffff;font-size:14px;font-weight:bold;text-decoration:none;">${ctaLabel}</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>`
                : `<tr><td style="padding-bottom:24px;"></td></tr>`
            }
            <tr>
              <td style="padding:20px 32px;background-color:#FAFAFA;border-top:1px solid #F0F0F0;">
                <p style="margin:0;font-size:12px;color:#9A9A9A;line-height:1.6;">
                  ${footerNote || "You're receiving this email because you have an account with 24hours.lk."}
                </p>
                <p style="margin:8px 0 0;font-size:12px;color:#B5B5B5;">&copy; ${new Date().getFullYear()} HABB Global Pvt Ltd &middot; Colombo, Sri Lanka</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function sendOtpEmail(to: string, name: string, otp: string) {
  const html = renderEmailHtml({
    preheader: `Your verification code is ${otp}`,
    heading: `Verify your email, ${name.split(" ")[0]}`,
    bodyHtml: `
      <p style="margin:0 0 20px;">Use the code below to confirm your email address and activate your 24hours.lk account. This code expires in 10 minutes.</p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
        <tr>
          <td style="background-color:#F5F5F5;border:1px dashed #D8D8D8;border-radius:10px;padding:16px 28px;">
            <span style="font-size:28px;font-weight:bold;letter-spacing:8px;color:${BRAND_INK};">${otp}</span>
          </td>
        </tr>
      </table>
      <p style="margin:16px 0 0;font-size:13px;color:#9A9A9A;">Didn't create this account? You can safely ignore this email.</p>
    `,
  });

  return sendMail({ to, subject: `${otp} is your 24hours.lk verification code`, html });
}

export async function sendPasswordResetEmail(to: string, name: string, resetUrl: string) {
  const html = renderEmailHtml({
    preheader: "Reset your 24hours.lk password",
    heading: `Reset your password, ${name.split(" ")[0]}`,
    bodyHtml: `
      <p style="margin:0 0 8px;">We received a request to reset the password for your account.</p>
      <p style="margin:0;">This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>
    `,
    ctaLabel: "Reset Password",
    ctaUrl: resetUrl,
  });

  return sendMail({ to, subject: "Reset your 24hours.lk password", html });
}

export async function sendPointsEarnedEmail(to: string, name: string, points: number, balance?: number) {
  const html = renderEmailHtml({
    preheader: `You just earned ${points} points`,
    heading: `You earned ${points} points!`,
    bodyHtml: `
      <p style="margin:0 0 8px;">Hi ${name.split(" ")[0]}, your recent booking was confirmed and <strong style="color:${BRAND_ORANGE};">${points} points</strong> have been added to your 24hours.lk account.</p>
      ${balance !== undefined ? `<p style="margin:0;">Your new points balance is <strong style="color:${BRAND_INK};">${balance}</strong>.</p>` : ""}
    `,
    ctaLabel: "View Points Wallet",
    ctaUrl: `${getAppUrl()}/account/points`,
  });

  return sendMail({ to, subject: `You earned ${points} points on 24hours.lk`, html });
}

export async function sendPromoCodeEmail(to: string, name: string, code: string, value: number, expiresAt: Date) {
  const html = renderEmailHtml({
    preheader: `Your promo code ${code} is ready`,
    heading: `Your promo code is ready!`,
    bodyHtml: `
      <p style="margin:0 0 20px;">Hi ${name.split(" ")[0]}, you redeemed ${value} points for the promo code below.</p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
        <tr>
          <td style="background-color:#F5F5F5;border:1px dashed #D8D8D8;border-radius:10px;padding:16px 28px;">
            <span style="font-size:24px;font-weight:bold;letter-spacing:2px;color:${BRAND_RED};">${code}</span>
          </td>
        </tr>
      </table>
      <p style="margin:16px 0 0;font-size:13px;color:#9A9A9A;">Valid until ${expiresAt.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}.</p>
    `,
    ctaLabel: "View Promo Codes",
    ctaUrl: `${getAppUrl()}/account/promo-codes`,
  });

  return sendMail({ to, subject: `Your 24hours.lk promo code: ${code}`, html });
}

export function renderNewsletterHtml(subject: string, bodyText: string) {
  const paragraphs = bodyText
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .map((line) => `<p style="margin:0 0 14px;">${line}</p>`)
    .join("");

  return renderEmailHtml({
    preheader: subject,
    heading: subject,
    bodyHtml: paragraphs,
    footerNote: "You're receiving this because you subscribed to 24hours.lk updates.",
  });
}
