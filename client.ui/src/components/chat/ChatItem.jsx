import { useAuth } from "../../context/auth";
import { getInitials, avatarColor, formatTime, truncate } from "../../utils/chat";
import Avatar from "../shared/Avatar";
import { Check, CheckCheck, AlertCircle, Star, Clock } from "lucide-react";

const MessageStatusIcon = ({ status, isMyMessage }) => {
  if (!isMyMessage) return null;
  const currentStatus = status || "sent";
  if (currentStatus === "sending") return <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 animate-pulse flex-shrink-0" />;
  if (currentStatus === "sent") return <Check className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 flex-shrink-0" />;
  if (currentStatus === "delivered") return <CheckCheck className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 flex-shrink-0" />;
  if (currentStatus === "seen") return <CheckCheck className="w-3.5 h-3.5 text-[#2dd4bf] dark:text-[#2dd4bf] flex-shrink-0" />;
  if (currentStatus === "failed") return <AlertCircle className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />;
  return <Check className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 flex-shrink-0" />;
};

const ChatItem = ({ conv, isActive, onClick }) => {
  const [Auth] = useAuth();
  const loggedInUserId = Auth?.User?._id;

  const { user, lastMessage, unread, isFavorite } = conv;

  const senderId = lastMessage?.sender?._id || lastMessage?.sender;
  const isMyMessage = String(senderId) === String(loggedInUserId);

  const preview = lastMessage?.isDeleted
    ? "This message was deleted"
    : lastMessage?.text
    ? `${isMyMessage ? "You: " : ""}${truncate(lastMessage.text, 32)}`
    : lastMessage?.image
    ? `${isMyMessage ? "You: " : ""}📷 Photo`
    : lastMessage?.audioUrl
    ? `${isMyMessage ? "You: " : ""}🎤 Voice Note`
    : "No messages yet";

  const time = formatTime(lastMessage?.createdAt);
  const [bg, fg] = avatarColor(user?._id || "");

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3.5 px-3.5 sm:px-4 py-3 cursor-pointer border-b border-slate-100/90 dark:border-white/5 transition-all duration-200 group relative ${
        isActive 
          ? "bg-indigo-50/80 dark:bg-white/[0.05] border-l-4 border-l-[#4f46e5] dark:border-l-[#2dd4bf] pl-3 sm:pl-3.5" 
          : "hover:bg-slate-50/90 dark:hover:bg-slate-800/40 border-l-4 border-l-transparent"
      }`}
    >
      {/* Active Ambient Glow Indicator */}
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-[#2dd4bf] shadow-[0_0_12px_#2dd4bf]" />
      )}

      {/* Avatar */}
      <Avatar
        src={user?.profilepicture || user?.avatar}
        name={user?.full_name || user?.name}
        id={user?._id || user?.id}
        size="w-12 h-12 text-sm"
        rounded="rounded-2xl"
        showOnline={true}
        isOnline={user?.isOnline}
        className={`${
          isActive 
            ? 'scale-105 ring-2 ring-[#2dd4bf]/70 shadow-[0_0_15px_rgba(45,212,191,0.35)]' 
            : 'group-hover:scale-105 border border-white/10'
        }`}
      />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center gap-2 mb-1">
          <span className={`text-sm font-semibold flex-1 min-w-0 truncate tracking-tight transition-colors ${
            isActive 
              ? 'text-slate-900 dark:text-white' 
              : 'text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white'
          }`}>
            {user?.full_name || user?.name || "Unknown"}
            {isFavorite && <Star className="inline w-3 h-3 ml-1 text-amber-400 fill-amber-400 flex-shrink-0" />}
          </span>
          <span className={`text-[11px] font-mono flex-shrink-0 ${
            unread > 0 ? "text-[#38bdf8] font-semibold" : "text-slate-400 dark:text-slate-500"
          }`}>
            {time}
          </span>
        </div>

        <div className="flex justify-between items-center gap-2">
          <p className={`text-xs flex-1 min-w-0 truncate flex items-center gap-1.5 ${
            unread > 0 
              ? "text-slate-900 dark:text-slate-100 font-medium" 
              : "text-slate-500 dark:text-slate-400"
          }`}>
            <span className="flex-shrink-0">
              <MessageStatusIcon
                status={lastMessage?.status}
                isMyMessage={isMyMessage}
              />
            </span>
            <span className="truncate">{preview}</span>
          </p>
          {unread > 0 && (
            <span className="bg-gradient-to-r from-[#6366f1] to-[#38bdf8] text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center flex-shrink-0 shadow-[0_0_10px_rgba(56,189,248,0.4)]">
              {unread > 99 ? "99+" : unread}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatItem;