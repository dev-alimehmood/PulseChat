import nodemailer from "nodemailer";

// Reusable Transporter with connection pooling for maximum speed and deliverability
const transporter = nodemailer.createTransport({
  service: "gmail",
  pool: true,
  maxConnections: 3,
  maxMessages: 100,
  auth: {
    user: process.env.EMAIL_USER || "alimehmood.dev@gmail.com",
    pass: process.env.EMAIL_PASS || "",
  },
});

/**
 * Strips HTML tags to generate a clean, accurate plain-text alternative.
 * Matching plain-text is RFC-mandated and prevents spam filter penalties.
 */
function htmlToPlainText(html = "") {
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
 * Build an executive, modern, responsive HTML email template.
 * - Pure CSS vector branding: No attachments, eliminating attachment scanning/quarantine.
 * - High deliverability: Clean semantic HTML without spam-triggering keywords.
 * - Outlook VML support for bulletproof buttons.
 */
export function buildPulseEmailHtml({
  title = "PulseChat",
  preheader = "Important notification regarding your PulseChat account",
  headline = "",
  greetingName = "",
  bodyHtml = "",
  actionUrl = "",
  actionText = "",
  otpCode = "",
  footerNote = "If you didn't request this email, you can safely ignore it.",
}) {
  const currentYear = new Date().getFullYear();
  const previewPadding = "&zwnj;&nbsp;".repeat(25);

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${title}</title>
  <!--[if mso]>
  <style>
    table, td, p, a, span, h1, h2 { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif !important; }
  </style>
  <xml>
    <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
  </xml>
  <![endif]-->
  <style>
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; padding: 12px !important; }
      .content-padding { padding: 24px 20px !important; }
      .otp-code { font-size: 32px !important; letter-spacing: 6px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1e293b; line-height: 1.6;">

  <!-- Preheader preview text for inbox list -->
  <div style="display: none; font-size: 1px; color: #f8fafc; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all;">
    ${preheader} ${previewPadding}
  </div>

  <!-- Outer Canvas Table -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; margin: 0; padding: 32px 12px;">
    <tr>
      <td align="center">
        
        <!-- Main Card Container -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="email-container" style="max-width: 520px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);">
          
          <!-- Top Branded Gradient Bar -->
          <tr>
            <td style="height: 4px; background: linear-gradient(90deg, #6366f1 0%, #0ea5e9 50%, #10b981 100%); line-height: 4px; font-size: 0;">&nbsp;</td>
          </tr>

          <!-- Header Section with Pure CSS PulseChat Branding -->
          <tr>
            <td align="center" style="padding: 28px 32px 18px; background-color: #ffffff;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <!-- Clean SVG Vector Emblem (Zero Attachments) -->
                    <div style="display: inline-block; width: 44px; height: 44px; background: linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%); border-radius: 12px; line-height: 44px; text-align: center; color: #ffffff; font-size: 22px; font-weight: bold; margin-bottom: 10px; box-shadow: 0 4px 10px rgba(14, 165, 233, 0.25);">
                      ⚡
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <h1 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; color: #0f172a;">
                      <span style="color: #ef4444;">Pulse</span><span style="color: #0284c7;">Chat</span>
                    </h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 32px;">
              <div style="border-top: 1px solid #f1f5f9;"></div>
            </td>
          </tr>

          <!-- Email Content Body -->
          <tr>
            <td class="content-padding" style="padding: 24px 32px 32px; color: #334155; font-size: 15px; line-height: 1.65;">
              
              ${headline ? `
                <h2 style="margin: 0 0 14px; font-size: 18px; font-weight: 700; color: #0f172a; letter-spacing: -0.2px;">
                  ${headline}
                </h2>
              ` : ""}

              ${greetingName ? `
                <p style="margin: 0 0 12px; font-size: 15px; font-weight: 600; color: #1e293b;">
                  Hello ${greetingName},
                </p>
              ` : ""}

              <div style="color: #334155; font-size: 15px; line-height: 1.65;">
                ${bodyHtml}
              </div>

              <!-- OTP Passcode Box (if applicable) -->
              ${otpCode ? `
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 22px 0; background-color: #f8fafc; border: 1.5px dashed #0284c7; border-radius: 12px;">
                  <tr>
                    <td align="center" style="padding: 20px 16px;">
                      <span style="display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #0284c7; font-weight: 700; margin-bottom: 6px;">
                        Verification Code
                      </span>
                      <div class="otp-code" style="font-family: 'SF Pro Display', Consolas, Monaco, monospace; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #0f172a; padding: 6px 0; user-select: all;">
                        ${otpCode}
                      </div>
                      <div style="margin-top: 6px; font-size: 12px; color: #64748b;">
                        Expires in 10 minutes
                      </div>
                    </td>
                  </tr>
                </table>
              ` : ""}

              <!-- Primary Action Button (if applicable) -->
              ${actionUrl && actionText ? `
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0 16px;">
                  <tr>
                    <td align="center">
                      <!--[if mso]>
                      <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${actionUrl}" style="height:46px;v-text-anchor:middle;width:240px;" arcsize="20%" stroke="f" fillcolor="#0284c7">
                        <w:anchorlock/>
                        <center style="color:#ffffff;font-family:Arial,sans-serif;font-size:15px;font-weight:bold;">${actionText}</center>
                      </v:roundrect>
                      <![endif]-->
                      <a href="${actionUrl}" target="_blank" style="mso-hide: all; display: inline-block; padding: 13px 32px; background: #0284c7; background: linear-gradient(135deg, #4f46e5 0%, #0284c7 100%); color: #ffffff !important; font-size: 15px; font-weight: 700; text-decoration: none; border-radius: 10px; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3); text-align: center;">
                        ${actionText} &rarr;
                      </a>
                    </td>
                  </tr>
                </table>

                <!-- Fallback URL -->
                <div style="margin-top: 18px; padding: 10px 12px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 12px; color: #64748b; line-height: 1.5;">
                  If the button doesn't work, copy and paste this link:
                  <div style="margin-top: 4px; word-break: break-all;">
                    <a href="${actionUrl}" target="_blank" style="color: #0284c7;">${actionUrl}</a>
                  </div>
                </div>
              ` : ""}

              <!-- Footnote -->
              ${footerNote ? `
                <p style="margin: 20px 0 0; font-size: 12px; color: #64748b; line-height: 1.5; border-top: 1px solid #f1f5f9; padding-top: 14px;">
                  ${footerNote}
                </p>
              ` : ""}

            </td>
          </tr>

          <!-- Email Footer -->
          <tr>
            <td style="padding: 20px 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #64748b;">
                PulseChat &bull; Real-Time Messaging &bull; &copy; ${currentYear}
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
 * Clean, high-deliverability email dispatcher.
 * Deliverability Architecture:
 * 1. Clean RFC 2822 sender formatting: "PulseChat <email>".
 * 2. Authentic DKIM signatures from Google's SMTP servers.
 * 3. NO fake/bulk headers (removed Auto-Submitted, Precedence, X-Priority).
 * 4. Zero attachment payload (eliminates sandbox delays & antivirus flags).
 * 5. Full RFC 2046 plain-text multipart match.
 */
export async function sendPulseEmail({
  to,
  subject,
  title,
  preheader,
  headline,
  greetingName = "",
  bodyHtml,
  bodyText,
  actionUrl,
  actionText,
  otpCode,
  footerNote,
}) {
  const senderName = process.env.EMAIL_FROM_NAME || "PulseChat";
  const senderEmail = process.env.EMAIL_USER || "alimehmood.dev@gmail.com";

  const emailTitle = title || subject || "PulseChat";
  const emailHeadline = headline || "";
  const emailPreheader =
    preheader ||
    (otpCode
      ? `Your verification code is ${otpCode}`
      : actionText
      ? `${actionText} - PulseChat`
      : "Notification from PulseChat");

  const html = buildPulseEmailHtml({
    title: emailTitle,
    preheader: emailPreheader,
    headline: emailHeadline,
    greetingName,
    bodyHtml,
    actionUrl,
    actionText,
    otpCode,
    footerNote,
  });

  // Plain-text alternative matching RFC standards
  const text =
    bodyText ||
    `${(headline || subject).toUpperCase()}\n\n` +
      (greetingName ? `Hello ${greetingName},\n\n` : "") +
      htmlToPlainText(bodyHtml) +
      (otpCode ? `\n\nYour Verification Code: ${otpCode}\n(Valid for 10 minutes)` : "") +
      (actionUrl ? `\n\nLink: ${actionUrl}` : "") +
      `\n\n${footerNote || "If you did not request this email, you can safely ignore it."}\n\n` +
      `PulseChat — Real-Time Messaging`;

  const mailOptions = {
    from: `"${senderName}" <${senderEmail}>`,
    to,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[PulseChat Mailer] Email delivered to ${to} (MessageId: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[PulseChat Mailer] Delivery failed for ${to}:`, error.message);
    throw error;
  }
}

/**
 * Helper: Account Activation Email
 */
export async function sendAccountActivationEmail({ to, fullName, activationUrl }) {
  return sendPulseEmail({
    to,
    subject: "Confirm your PulseChat account",
    title: "PulseChat Account Confirmation",
    preheader: `Welcome to PulseChat! Please confirm your email address.`,
    headline: "Welcome to PulseChat!",
    greetingName: fullName,
    bodyHtml: `<p>Thank you for creating an account on PulseChat. Please click the button below to confirm your email and activate your account:</p>`,
    actionUrl: activationUrl,
    actionText: "Confirm Email Address",
    footerNote: "This link expires in 4 hours. If you didn't create an account, you can ignore this email.",
  });
}

/**
 * Helper: Password Reset OTP Email
 */
export async function sendPasswordResetOtpEmail({ to, recipientName, otpCode }) {
  return sendPulseEmail({
    to,
    subject: `PulseChat: ${otpCode} is your verification code`,
    title: "PulseChat Password Reset",
    preheader: `Your PulseChat verification code is ${otpCode}`,
    headline: "Reset Your Password",
    greetingName: recipientName || "there",
    bodyHtml: `<p>We received a request to reset the password for your PulseChat account. Enter this verification code to proceed:</p>`,
    otpCode,
    footerNote: "This code is valid for 10 minutes. If you didn't request a password reset, you can safely ignore this email.",
  });
}

/**
 * Helper: Colleague Invitation Email
 */
export async function sendInvitationEmail({ to, inviterName, personalMessage, inviteUrl }) {
  const noteHtml =
    personalMessage && personalMessage.trim()
      ? `<blockquote style="margin: 14px 0; padding: 10px 14px; background: #f8fafc; border-left: 3px solid #0284c7; border-radius: 6px; font-style: italic; color: #475569;">"${personalMessage.trim()}"</blockquote>`
      : "";

  return sendPulseEmail({
    to,
    subject: `${inviterName} invited you to join PulseChat`,
    title: "PulseChat Invitation",
    preheader: `${inviterName} invited you to connect on PulseChat`,
    headline: `${inviterName} invited you to connect`,
    greetingName: to.split("@")[0],
    bodyHtml: `<p><strong>${inviterName}</strong> invited you to connect on PulseChat — real-time messaging with instant voice notes and media sharing.</p>${noteHtml}`,
    actionUrl: inviteUrl,
    actionText: "Join PulseChat",
    footerNote: "You received this because your colleague invited you to PulseChat.",
  });
}

export default {
  sendPulseEmail,
  sendAccountActivationEmail,
  sendPasswordResetOtpEmail,
  sendInvitationEmail,
  buildPulseEmailHtml,
};
