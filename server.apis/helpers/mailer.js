import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Locate email logo asset for CID attachment (avoiding large base64 inline strings)
const emailLogoPath = path.resolve(__dirname, "../../client.ui/public/email_logo.png");
const hasLocalLogo = fs.existsSync(emailLogoPath);

// Singleton Transporter with connection pooling for maximum speed and deliverability
const transporter = nodemailer.createTransport({
  service: "gmail",
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
  auth: {
    user: process.env.EMAIL_USER || "alimehmood.dev@gmail.com",
    pass: process.env.EMAIL_PASS || "",
  },
});

/**
 * Strips HTML tags to generate a clean plain-text alternative.
 * Plain-text alternative is RFC-mandated and drastically lowers spam score.
 */
function htmlToPlainText(html) {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/h[1-6]>/gi, "\n\n")
    .replace(/<a\s+[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi, "$2 ($1)")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\n\s+\n/g, "\n\n")
    .trim();
}

/**
 * Generate anti-spam compliant, responsive HTML email.
 * - Table-based bulletproof email markup.
 * - Balanced image-to-text ratio.
 * - Legitimate sender identification & physical company footnote.
 * - Clear action triggers and security guidance.
 */
export function buildPulseEmailHtml({
  title = "PulseChat Notification",
  headline = "",
  bodyHtml = "",
  actionUrl = "",
  actionText = "",
  otpCode = "",
  footerNote = "If you did not request this communication, you can safely ignore this email.",
  clientUrl = process.env.CLIENT_URL || "https://pulsechat-ali.netlify.app",
}) {
  const logoSrc = hasLocalLogo ? "cid:pulsechat-logo" : `${clientUrl}/logo.png`;

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>${title}</title>
  <!--[if mso]>
  <style>
    table, td, p, a { font-family: Arial, sans-serif !important; }
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #080c1b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #f1f5f9;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #080c1b; margin: 0; padding: 40px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card Wrapper -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 520px; background-color: #0d142c; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 20px; overflow: hidden; box-shadow: 0 16px 36px rgba(0, 0, 0, 0.45);">
          
          <!-- Brand Accent Bar -->
          <tr>
            <td style="height: 4px; background: linear-gradient(90deg, #6366f1 0%, #38bdf8 50%, #2dd4bf 100%); line-height: 4px; font-size: 0;">&nbsp;</td>
          </tr>

          <!-- Header -->
          <tr>
            <td align="center" style="padding: 32px 24px 20px; background-color: #0e1733;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <img src="${logoSrc}" width="54" height="46" alt="PulseChat" style="display: block; margin: 0 auto 12px; border: 0; outline: none; text-decoration: none;" />
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; color: #ffffff;">
                      <span style="color: #ef4444;">Pulse</span><span style="color: #38bdf8;">Chat</span>
                    </h1>
                    <p style="margin: 4px 0 0; font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: #94a3b8; font-weight: 600;">
                      Real-Time Encrypted Messaging
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 24px 32px 32px; color: #cbd5e1; font-size: 15px; line-height: 1.65;">
              ${headline ? `<h2 style="margin: 0 0 16px; font-size: 18px; font-weight: 700; color: #ffffff; letter-spacing: -0.2px;">${headline}</h2>` : ""}
              
              <div style="color: #cbd5e1; font-size: 14px; line-height: 1.65;">
                ${bodyHtml}
              </div>

              <!-- OTP Verification Box (if applicable) -->
              ${otpCode ? `
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0; background-color: #091024; border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 14px;">
                  <tr>
                    <td align="center" style="padding: 20px;">
                      <span style="display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #38bdf8; font-weight: 700; margin-bottom: 6px;">
                        One-Time Security Passcode
                      </span>
                      <div style="font-family: 'SF Pro Text', Consolas, Monaco, monospace; font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #ffffff; padding: 6px 0;">
                        ${otpCode}
                      </div>
                      <span style="display: block; font-size: 11px; color: #94a3b8; margin-top: 6px;">
                        Valid for 10 minutes • Keep this confidential
                      </span>
                    </td>
                  </tr>
                </table>
              ` : ""}

              <!-- Primary Action Button (if applicable) -->
              ${actionUrl && actionText ? `
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 28px 0 16px;">
                  <tr>
                    <td align="center">
                      <!--[if mso]>
                      <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${actionUrl}" style="height:44px;v-text-anchor:middle;width:240px;" arcsize="25%" stroke="f" fillcolor="#38bdf8">
                        <w:anchorlock/>
                        <center style="color:#ffffff;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;">${actionText}</center>
                      </v:roundrect>
                      <![endif]-->
                      <a href="${actionUrl}" target="_blank" style="mso-hide:all; display: inline-block; padding: 13px 32px; background: #0284c7; background: linear-gradient(135deg, #6366f1 0%, #0284c7 100%); color: #ffffff; font-size: 14px; font-weight: 700; text-decoration: none; border-radius: 12px; box-shadow: 0 4px 14px rgba(2, 132, 199, 0.4); text-align: center;">
                        ${actionText} &rarr;
                      </a>
                    </td>
                  </tr>
                </table>
              ` : ""}

              <!-- Security / Disregard Footnote -->
              ${footerNote ? `
                <p style="margin: 24px 0 0; font-size: 12px; color: #64748b; line-height: 1.5; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 16px;">
                  ${footerNote}
                </p>
              ` : ""}
            </td>
          </tr>

          <!-- Email Footer with Legal & Deliverability Compliance -->
          <tr>
            <td style="padding: 20px 24px; background-color: #080d1e; border-top: 1px solid rgba(255, 255, 255, 0.08); text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #64748b; line-height: 1.4;">
                &copy; ${new Date().getFullYear()} PulseChat Technologies Inc. All rights reserved.
              </p>
              <p style="margin: 4px 0 0; font-size: 11px; color: #475569;">
                Co-Founded & Engineered by Ali Mehmood & Muhammad Moeez
              </p>
              <p style="margin: 8px 0 0; font-size: 10px; color: #475569;">
                This is an automated security communication for your PulseChat account. Please do not reply directly to this message.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * High-deliverability email dispatcher.
 * Incorporates:
 * 1. Matching Plain-Text alternative body (RFC 2046 compliant)
 * 2. CID inline attachment (replaces spam-prone base64 strings)
 * 3. Verified headers (X-Mailer, X-Priority: 3, Reply-To, List-Unsubscribe)
 * 4. Graceful error handling and delivery logging
 */
export async function sendPulseEmail({
  to,
  subject,
  title,
  headline,
  bodyHtml,
  bodyText,
  actionUrl,
  actionText,
  otpCode,
  footerNote,
}) {
  const senderEmail = process.env.EMAIL_USER || "alimehmood.dev@gmail.com";
  const clientUrl = process.env.CLIENT_URL || "https://pulsechat-ali.netlify.app";

  const emailTitle = title || subject || "PulseChat Notification";
  const html = buildPulseEmailHtml({
    title: emailTitle,
    headline: headline || subject,
    bodyHtml,
    actionUrl,
    actionText,
    otpCode,
    footerNote,
    clientUrl,
  });

  // Plain-text alternative: generated from HTML or custom text
  const text = bodyText || htmlToPlainText(bodyHtml) + (otpCode ? `\n\nYour Verification Code: ${otpCode}\n(Valid for 10 minutes)` : "") + (actionUrl ? `\n\nAction Link: ${actionUrl}` : "") + `\n\nPulseChat Technologies Inc.\nCo-Founded & Engineered by Ali Mehmood & Muhammad Moeez`;

  // Attachments: clean CID attachment for the logo
  const attachments = [];
  if (hasLocalLogo) {
    attachments.push({
      filename: "pulsechat-logo.png",
      path: emailLogoPath,
      cid: "pulsechat-logo",
    });
  }

  const mailOptions = {
    from: `"PulseChat" <${senderEmail}>`,
    to,
    replyTo: `"PulseChat Support" <${senderEmail}>`,
    subject,
    text,
    html,
    attachments,
    headers: {
      "X-Mailer": "PulseChat Secure Mailer",
      "X-Priority": "3", // Normal priority (never use 1/high as it flags spam)
      "X-Auto-Response-Suppress": "OOF, AutoReply",
      "List-Unsubscribe": `<mailto:${senderEmail}?subject=unsubscribe>`,
    },
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[PulseChat Mailer] Email dispatched successfully to ${to} (MessageId: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[PulseChat Mailer] Delivery failed for ${to}:`, error.message);
    throw error;
  }
}
