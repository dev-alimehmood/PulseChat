import { buildPulseEmailHtml } from "./mailer.js";

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
  return buildPulseEmailHtml({
    categoryBadge: badge,
    title,
    headline,
    bodyHtml,
    actionUrl,
    actionText,
    otpCode,
    footerNote,
  });
};

export default generatePulseEmailHtml;
