import { useState } from "react";
import ModalWrapper from "../shared/ModalWrapper";
import { useAuth } from "../../context/auth";
import { toast } from "react-toastify";
import {
  X,
  Copy,
  Check,
  Share2,
  MessageCircle,
  Mail,
  Send,
  Edit3,
  RotateCcw,
  Smartphone,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import api from "../../services/api";

const InviteModal = ({ isOpen, onClose, initialEmail = "", onOpenChatWithUser }) => {
  const [Auth] = useAuth();
  const loggedInUser = Auth?.User;

  const currentOrigin =
    typeof window !== "undefined" ? window.location.origin : "https://pulsechat-ali.netlify.app";
  const shareableInviteLink = `${currentOrigin}/signup?ref=${loggedInUser?._id || ""}`;

  const inviterName = loggedInUser?.full_name || "A friend";
  const defaultMessage = `Hey! Join me on PulseChat for real-time messaging, crisp voice notes, and private chats. Here is my invite link: ${shareableInviteLink}`;

  const [message, setMessage] = useState(defaultMessage);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Optional server email section state
  const [showEmailSection, setShowEmailSection] = useState(Boolean(initialEmail));
  const [serverEmail, setServerEmail] = useState(initialEmail);
  const [sendingEmail, setSendingEmail] = useState(false);

  if (!isOpen) return null;

  const encodedMessage = encodeURIComponent(message);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareableInviteLink);
      setCopied(true);
      toast.success("Invite link copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      toast.error("Failed to copy link.");
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join me on PulseChat",
          text: message,
          url: shareableInviteLink,
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Native share error:", err);
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const handleResetMessage = () => {
    setMessage(defaultMessage);
    setIsEditing(false);
  };

  const handleSendServerEmail = async (e) => {
    e.preventDefault();
    if (!serverEmail || !serverEmail.trim()) {
      toast.warning("Please enter an email address.");
      return;
    }

    setSendingEmail(true);
    try {
      const { data } = await api.post("/invites/email", {
        recipientEmail: serverEmail.trim(),
        personalMessage: message !== defaultMessage ? message : "",
      });

      if (data.alreadyRegistered) {
        toast.info(data.message);
        if (onOpenChatWithUser && data.user) {
          onOpenChatWithUser(data.user);
          onClose();
        }
      } else {
        toast.success(data.message || `Invitation sent to ${serverEmail}!`);
        setServerEmail("");
      }
    } catch (err) {
      const errMsg = err?.response?.data?.error || "Failed to send email invite.";
      toast.error(errMsg);
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <ModalWrapper onClose={onClose}>
      <div className="rounded-3xl w-[94vw] max-w-[490px] overflow-hidden shadow-2xl backdrop-blur-2xl bg-white dark:bg-[#0c1228] border border-slate-200/80 dark:border-white/10 transition-all duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-200/80 dark:border-white/5 bg-slate-50/80 dark:bg-[#0e1630]/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#6366f1]/20 via-[#38bdf8]/20 to-[#2dd4bf]/20 border border-[#38bdf8]/30 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(56,189,248,0.25)]">
              🫀
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white tracking-tight">
                Invite Friends
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Pick an app below to share your invite instantly
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-200/60 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4">

          {/* Primary Quick Share Grid */}
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
              Select App to Share
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* WhatsApp */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodedMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-1.5 p-3.5 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 transition-all group"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.35)] group-hover:scale-105 transition-transform">
                  <MessageCircle className="w-5 h-5 fill-current" />
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white">WhatsApp</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">1-click send</span>
              </a>

              {/* Native Messages / SMS */}
              <a
                href={`sms:?body=${encodedMessage}`}
                className="flex flex-col items-center justify-center gap-1.5 p-3.5 rounded-2xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/25 transition-all group"
              >
                <div className="w-9 h-9 rounded-xl bg-indigo-500 text-white flex items-center justify-center shadow-[0_0_12px_rgba(99,102,241,0.35)] group-hover:scale-105 transition-transform">
                  <Smartphone className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white">SMS / Text</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Mobile messages</span>
              </a>

              {/* Default Email Client */}
              <a
                href={`mailto:?subject=${encodeURIComponent("Join me on PulseChat")}&body=${encodedMessage}`}
                className="flex flex-col items-center justify-center gap-1.5 p-3.5 rounded-2xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/25 transition-all group"
              >
                <div className="w-9 h-9 rounded-xl bg-purple-500 text-white flex items-center justify-center shadow-[0_0_12px_rgba(168,85,247,0.35)] group-hover:scale-105 transition-transform">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white">Email App</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Gmail / Outlook</span>
              </a>

              {/* Native System Share Sheet */}
              <button
                type="button"
                onClick={handleNativeShare}
                className="flex flex-col items-center justify-center gap-1.5 p-3.5 rounded-2xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-600 dark:text-teal-400 border border-teal-500/25 transition-all group"
              >
                <div className="w-9 h-9 rounded-xl bg-teal-500 text-white flex items-center justify-center shadow-[0_0_12px_rgba(20,184,166,0.35)] group-hover:scale-105 transition-transform">
                  <Share2 className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white">All Apps</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Device share</span>
              </button>
            </div>

            {/* Direct Invite Link bar */}
            <div className="mt-3 flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100/90 dark:bg-[#070b18] border border-slate-200/80 dark:border-white/5">
              <input
                type="text"
                readOnly
                value={shareableInviteLink}
                className="flex-1 bg-transparent px-3 text-xs text-slate-600 dark:text-slate-400 outline-none select-all font-mono truncate"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  copied
                    ? "bg-[#2dd4bf] text-slate-950"
                    : "bg-gradient-to-r from-[#6366f1] to-[#38bdf8] text-white hover:opacity-95"
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy Link
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Pre-written message with optional edit/customize */}
          <div className="rounded-2xl p-3.5 bg-slate-100/80 dark:bg-[#070b18] border border-slate-200/80 dark:border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <span>💬 Pre-written message</span>
                <span className="text-[10px] font-normal text-slate-400">(ready to send)</span>
              </span>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <button
                    type="button"
                    onClick={handleResetMessage}
                    className="text-[11px] font-medium text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="text-[11px] font-semibold text-[#38bdf8] hover:underline flex items-center gap-1 transition-colors"
                  >
                    <Edit3 className="w-3 h-3" />
                    Edit message
                  </button>
                )}
              </div>
            </div>

            {isEditing ? (
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-[#0c1228] text-slate-900 dark:text-white outline-none focus:border-[#38bdf8]/60 transition-colors resize-none"
                placeholder="Write your custom message..."
              />
            ) : (
              <p className="text-xs text-slate-700 dark:text-slate-300 italic line-clamp-2 select-text">
                "{message}"
              </p>
            )}
          </div>

          {/* Optional: Send Direct via PulseChat Email (Expandable) */}
          <div className="border-t border-slate-200/80 dark:border-white/5 pt-3">
            <button
              type="button"
              onClick={() => setShowEmailSection(!showEmailSection)}
              className="w-full flex items-center justify-between py-1 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#38bdf8]" />
                Want PulseChat to send an email for you?
              </span>
              {showEmailSection ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

            {showEmailSection && (
              <form onSubmit={handleSendServerEmail} className="mt-2.5 flex items-center gap-2">
                <input
                  type="email"
                  value={serverEmail}
                  onChange={(e) => setServerEmail(e.target.value)}
                  placeholder="Enter their email..."
                  required
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100/90 dark:bg-[#090e1f] text-slate-900 dark:text-white outline-none focus:border-[#38bdf8]/60"
                />
                <button
                  type="submit"
                  disabled={sendingEmail}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#6366f1] via-[#38bdf8] to-[#2dd4bf] hover:opacity-95 transition-all flex items-center gap-1.5 flex-shrink-0 disabled:opacity-50 shadow-sm"
                >
                  {sendingEmail ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-3 h-3" />
                      Send
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </ModalWrapper>
  );
};

export default InviteModal;
