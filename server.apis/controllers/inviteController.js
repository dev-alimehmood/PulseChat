import User from "../models/user.models.js";
import { sendPulseEmail } from "../helpers/mailer.js";

/**
 * Send an email invitation to someone not yet on PulseChat
 * POST /api/v1/invites/email
 */
export const sendEmailInvite = async (req, res) => {
  try {
    const { recipientEmail, personalMessage } = req.body;
    const inviter = req.user;

    if (!recipientEmail || !recipientEmail.trim()) {
      return res.status(400).json({ error: "Recipient email is required." });
    }

    const cleanEmail = recipientEmail.trim().toLowerCase();

    // Check if inviter is trying to invite themselves
    if (cleanEmail === inviter.email?.toLowerCase()) {
      return res.status(400).json({ error: "You cannot invite yourself!" });
    }

    // Check if user is already registered on PulseChat
    const existingUser = await User.findOne({ email: cleanEmail }).select(
      "_id full_name email profilepicture isOnline showOnlineStatus"
    );

    if (existingUser) {
      const sanitizedUser = existingUser.toObject();
      sanitizedUser.isOnline = (existingUser.showOnlineStatus !== false && existingUser.isOnline) || false;
      return res.status(200).json({
        alreadyRegistered: true,
        user: sanitizedUser,
        message: `${existingUser.full_name} is already registered on PulseChat! You can start chatting with them right away.`,
      });
    }

    const baseUrl =
      req.headers.origin ||
      process.env.CLIENT_URL ||
      "https://pulsechat-ali.netlify.app";

    const inviterName = inviter.full_name || "A colleague";
    const noteHtml = personalMessage && personalMessage.trim()
      ? `<blockquote style="margin: 16px 0; padding: 12px 16px; background: rgba(56, 189, 248, 0.08); border-left: 3px solid #38bdf8; border-radius: 8px; font-style: italic; color: #cbd5e1;">"${personalMessage.trim()}"</blockquote>`
      : "";

    const inviteLink = `${baseUrl}/signup?ref=${inviter._id}&email=${encodeURIComponent(cleanEmail)}`;

    await sendPulseEmail({
      to: cleanEmail,
      subject: `[PulseChat] ${inviterName} invited you to join PulseChat`,
      headline: `${inviterName} invited you to connect`,
      bodyHtml: `<p><strong>${inviterName}</strong> has invited you to connect on PulseChat — high-speed encrypted messaging with instant voice notes and media sharing.</p>${noteHtml}`,
      actionUrl: inviteLink,
      actionText: "Accept Invitation & Join",
      footerNote: "You received this invitation because your colleague invited you to PulseChat. If you do not wish to join, no action is needed.",
    });

    return res.status(200).json({
      success: true,
      message: `Invitation successfully sent to ${cleanEmail}!`,
    });
  } catch (error) {
    console.error("sendEmailInvite error:", error);
    return res.status(500).json({
      error: error.message || "Failed to send invitation email.",
    });
  }
};

/**
 * Get personalized shareable invite link
 * GET /api/v1/invites/share-link
 */
export const getShareableInviteLink = async (req, res) => {
  try {
    const inviter = req.user;
    const baseUrl =
      req.headers.origin ||
      process.env.CLIENT_URL ||
      "https://pulsechat-ali.netlify.app";

    const inviteLink = `${baseUrl}/signup?ref=${inviter._id}`;

    return res.status(200).json({
      inviteLink,
      inviterName: inviter.full_name,
      inviterId: inviter._id,
    });
  } catch (error) {
    console.error("getShareableInviteLink error:", error);
    return res.status(500).json({ error: error.message });
  }
};
