import React, { useState, useEffect } from "react";
import { X, Search } from "lucide-react";
import { getInitials, avatarColor } from "../../utils/chat";
import { useAuth } from "../../context/auth";
import api from "../../services/api";

const ForwardModal = ({ isOpen, onClose, onForward }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [Auth] = useAuth();
  const loggedInUserId = Auth?.User?._id;

  useEffect(() => {
    if (isOpen && loggedInUserId) {
      setLoading(true);
      api.get(`/conversations/${loggedInUserId}`)
        .then((res) => setConversations(res.data))
        .catch((err) => console.error("Error fetching chats for forward:", err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, loggedInUserId]);

  if (!isOpen) return null;

  const filteredConversations = conversations.filter((conv) => {
    const name = conv.user?.full_name || conv.user?.name || "";
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="bg-white dark:bg-[#0c1228] rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh] border border-slate-200/80 dark:border-white/10 transition-all">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/80 dark:border-white/5 bg-slate-50/80 dark:bg-[#0e1630]/80">
          <div className="flex items-center gap-2">
            <span className="text-lg">🫀</span>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Forward Message</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-slate-200/80 dark:border-white/5">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#38bdf8] transition-colors" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100/90 dark:bg-[#090e1f] border border-slate-200 dark:border-white/10 rounded-2xl focus:outline-none focus:border-[#38bdf8]/50 focus:shadow-[0_0_15px_rgba(56,189,248,0.2)] text-sm dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 max-h-72 custom-scrollbar">
          {loading ? (
            <div className="text-center py-8 text-slate-400 text-sm">Loading conversations...</div>
          ) : filteredConversations.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">No conversations found</div>
          ) : (
            filteredConversations.map((conv) => {
              const [bg, fg] = avatarColor(conv.user?._id || "");
              return (
                <div
                  key={conv._id}
                  onClick={() => {
                    onForward(conv._id);
                    onClose();
                  }}
                  className="flex items-center gap-3.5 p-3 hover:bg-gradient-to-r hover:from-[#6366f1]/10 hover:to-[#38bdf8]/10 rounded-2xl cursor-pointer transition-all border border-transparent hover:border-[#38bdf8]/30 mb-1"
                >
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold flex-shrink-0 border border-white/10"
                    style={{ background: bg, color: fg }}
                  >
                    {getInitials(conv.user?.full_name || conv.user?.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {conv.user?.full_name || conv.user?.name || "Unknown"}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ForwardModal;
