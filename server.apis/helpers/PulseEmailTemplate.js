import { PULSECHAT_LOGO_BASE64 } from "./logoBase64.js";

/**
 * Generate an executive, production-grade email template for PulseChat
 */
export const generatePulseEmailHtml = ({
  badge = "PULSECHAT SECURITY",
  title = "Notification from PulseChat",
  headline = "",
  bodyHtml = "",
  actionUrl = "",
  actionText = "",
  otpCode = "",
  footerNote = "If you did not request this communication, please disregard this email."
}) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #070b18; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #070b18; padding: 36px 16px;">
    <tr>
      <td align="center">
        <!-- Container -->
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 540px; background-color: #0c1228; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);">
          
          <!-- Top Accent Gradient Line -->
          <tr>
            <td style="height: 4px; background: linear-gradient(90deg, #6366f1 0%, #38bdf8 50%, #2dd4bf 100%);"></td>
          </tr>

          <!-- Header with PulseChat Official Logo -->
          <tr>
            <td align="center" style="padding: 32px 24px 20px; background: linear-gradient(180deg, rgba(56, 189, 248, 0.08) 0%, rgba(12, 18, 40, 0) 100%);">
              <div style="display: inline-block; margin-bottom: 12px;">
                <img src="${PULSECHAT_LOGO_BASE64}" width="58" height="50" alt="PulseChat Logo" style="display: block; border: 0; outline: none; text-decoration: none;" />
              </div>
              <h1 style="margin: 0; font-size: 26px; font-weight: 900; letter-spacing: -0.5px;">
                <span style="color: #ef4444;">Pulse</span><span style="color: #38bdf8;">Chat</span>
              </h1>
              <p style="margin: 4px 0 0; font-size: 11px; font-family: monospace; letter-spacing: 2px; text-transform: uppercase; color: #94a3b8; font-weight: 600;">
                Realtime Encrypted Messaging
              </p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 10px 32px 32px; color: #cbd5e1; font-size: 15px; line-height: 1.6;">
              ${headline ? `<h2 style="margin: 0 0 16px; font-size: 19px; font-weight: 700; color: #ffffff;">${headline}</h2>` : ""}
              
              <div style="color: #cbd5e1; font-size: 14px; line-height: 1.65;">
                ${bodyHtml}
              </div>

              <!-- OTP Code Display (if provided) -->
              ${otpCode ? `
                <div style="margin: 24px 0; padding: 20px; background: rgba(56, 189, 248, 0.06); border: 1px solid rgba(56, 189, 248, 0.25); border-radius: 16px; text-align: center;">
                  <span style="display: block; font-size: 11px; font-family: monospace; text-transform: uppercase; color: #38bdf8; font-weight: 700; letter-spacing: 1.5px; margin-bottom: 8px;">
                    Verification Passcode
                  </span>
                  <div style="font-family: monospace; font-size: 38px; font-weight: 800; letter-spacing: 10px; color: #ffffff; text-shadow: 0 0 20px rgba(56, 189, 248, 0.5);">
                    ${otpCode}
                  </div>
                  <span style="display: block; font-size: 11px; color: #94a3b8; margin-top: 8px;">
                    Valid for 10 minutes • Do not share with anyone
                  </span>
                </div>
              ` : ""}

              <!-- Call To Action Button (if provided) -->
              ${actionUrl && actionText ? `
                <div style="margin: 28px 0 16px; text-align: center;">
                  <a href="${actionUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #6366f1 0%, #38bdf8 100%); color: #ffffff; font-size: 14px; font-weight: 800; text-decoration: none; border-radius: 14px; box-shadow: 0 10px 25px rgba(56, 189, 248, 0.35); text-transform: uppercase; letter-spacing: 0.5px;">
                    ${actionText} &rarr;
                  </a>
                </div>
              ` : ""}

              ${footerNote ? `
                <p style="margin: 24px 0 0; font-size: 12px; color: #64748b; line-height: 1.5; border-top: 1px solid rgba(255, 255, 255, 0.06); pt: 16px; padding-top: 16px;">
                  ${footerNote}
                </p>
              ` : ""}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 32px 28px; background-color: #070b18; border-top: 1px solid rgba(255, 255, 255, 0.06); text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #64748b; font-family: monospace;">
                &copy; ${new Date().getFullYear()} PulseChat Technologies Inc. All rights reserved.
              </p>
              <p style="margin: 4px 0 0; font-size: 11px; color: #475569;">
                Co-Founded & Engineered by Ali Mehmood & Muhammad Moeez
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};
