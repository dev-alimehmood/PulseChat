import nodemailer from "nodemailer";
import User from "../models/user.models.js";

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
      "_id full_name email profilepicture isOnline"
    );

    if (existingUser) {
      return res.status(200).json({
        alreadyRegistered: true,
        user: existingUser,
        message: `${existingUser.full_name} is already registered on PulseChat! You can start chatting with them right away.`,
      });
    }

    // Determine client base URL
    const baseUrl =
      req.headers.origin ||
      process.env.CLIENT_URL ||
      "https://pulsechat-ali.netlify.app";

    const inviteLink = `${baseUrl}/signup?ref=${inviter._id}&email=${encodeURIComponent(cleanEmail)}`;

    // Setup Nodemailer transporter using system credentials
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const inviterName = inviter.full_name || "A friend";
    const noteHtml = personalMessage && personalMessage.trim()
      ? `<div style="margin: 20px 0; padding: 16px; background-color: #f1f5f9; border-left: 4px solid #38bdf8; border-radius: 8px; font-style: italic; color: #334155;">
          "${personalMessage.trim()}"
        </div>`
      : "";

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>You're invited to PulseChat</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #090e1f; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #090e1f; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="100%" max-width="560" cellpadding="0" cellspacing="0" style="max-width: 560px; background-color: #0c1228; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);">
                
                <!-- Header -->
                <tr>
                  <td align="center" style="padding: 36px 30px 20px; background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(56, 189, 248, 0.15) 100%);">
                    <div style="display: inline-block; width: 56px; height: 56px; line-height: 56px; font-size: 28px; background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 16px;">
                      🫀
                    </div>
                    <h1 style="margin: 14px 0 0; font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
                      PulseChat
                    </h1>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 30px 36px; color: #cbd5e1; font-size: 15px; line-height: 1.6;">
                    <p style="margin: 0 0 16px; font-size: 17px; font-weight: 600; color: #ffffff;">
                      ${inviterName} has invited you to connect!
                    </p>
                    <p style="margin: 0 0 16px; color: #94a3b8;">
                      Experience lightning-fast messaging, rich media sharing, voice notes, and seamless desktop & mobile notifications on PulseChat.
                    </p>
                    
                    ${noteHtml}

                    <!-- CTA Button -->
                    <div style="text-align: center; margin: 34px 0;">
                      <a href="${inviteLink}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #6366f1 0%, #38bdf8 50%, #2dd4bf 100%); color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 700; border-radius: 14px; box-shadow: 0 8px 24px rgba(56, 189, 248, 0.35); text-transform: none;">
                        Accept Invitation & Join
                      </a>
                    </div>

                    <p style="margin: 24px 0 0; font-size: 12px; color: #64748b; text-align: center;">
                      Or copy and paste this link in your browser:
                    </p>
                    <p style="margin: 6px 0 0; font-size: 12px; color: #38bdf8; word-break: break-all; text-align: center;">
                      <a href="${inviteLink}" style="color: #38bdf8; text-decoration: none;">${inviteLink}</a>
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 24px 36px; border-top: 1px solid rgba(255, 255, 255, 0.05); text-align: center; font-size: 12px; color: #475569;">
                    © ${new Date().getFullYear()} PulseChat. Real-Time Human Communication.
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"PulseChat" <${process.env.EMAIL_USER}>`,
      to: cleanEmail,
      subject: `🫀 ${inviterName} invited you to join PulseChat`,
      html: htmlContent,
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
