import { useState } from "react";
import ChatItem from "./ChatItem";
import SearchBar from "../search/SearchBar";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Plus, MessageSquareDashed, Radio, Sparkles } from "lucide-react";

const ChatList = ({
  conversations = [],
  loading,
  refetch,
  setSelectedChat,
  selectedChatId,
  openNewChat,
}) => {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all"); // "all" | "unread"

  const totalUnread = conversations.reduce((acc, c) => acc + (c.unread || 0), 0);

  const filtered = (conversations || []).filter((conv) => {
    if (!conv) return false;
    const userName = (conv.user?.name || conv.user?.full_name || "").toLowerCase();
    const matchesSearch = !search.trim() || userName.includes(search.toLowerCase().trim());
    
    if (activeFilter === "unread") {
      return matchesSearch && ((conv.unread || 0) > 0);
    }
    return matchesSearch;
  });

  return (
    <div className="w-full h-full min-w-0 bg-white/70 dark:bg-[#090e1f]/75 border-r border-slate-200/80 dark:border-white/5 flex flex-col z-10 backdrop-blur-2xl transition-all duration-500">

      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-5 h-20 border-b border-slate-200/80 dark:border-white/5 flex-shrink-0 bg-white/40 dark:bg-[#0c1228]/40 backdrop-blur-md min-w-0">
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <img src="/logo.png" alt="PulseChat" className="w-6 h-6 object-contain drop-shadow" />
            <span className="font-black text-lg tracking-tight bg-gradient-to-r from-[#818cf8] via-[#38bdf8] to-[#2dd4bf] bg-clip-text text-transparent drop-shadow-sm truncate">
              PulseChat
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-[#2dd4bf] shadow-[0_0_8px_#2dd4bf]" />
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {conversations.length} conversation{conversations.length === 1 ? "" : "s"}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <motion.button
            whileHover={{ scale: 1.08, rotate: 180 }}
            whileTap={{ scale: 0.92 }}
            transition={{ duration: 0.3 }}
            onClick={refetch}
            title="Refresh conversations"
            className="w-9 h-9 rounded-xl flex items-center justify-center border border-slate-200/80 dark:border-white/5 bg-slate-100/80 dark:bg-slate-800/60 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:border-[#38bdf8]/40 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openNewChat}
            title="Start new conversation"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#6366f1] via-[#38bdf8] to-[#2dd4bf] text-white shadow-[0_0_20px_rgba(45,212,191,0.35)] hover:opacity-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Chat</span>
          </motion.button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-3.5 border-b border-slate-200/80 dark:border-white/5 flex-shrink-0 min-w-0">
        <SearchBar value={search} onChange={setSearch} />
        
        {/* Filter Pills */}
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
              activeFilter === "all"
                ? "bg-slate-200/80 dark:bg-white/10 text-slate-900 dark:text-white border border-slate-300/60 dark:border-white/10 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border border-transparent"
            }`}
          >
            All ({conversations.length})
          </button>
          <button
            onClick={() => setActiveFilter("unread")}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeFilter === "unread"
                ? "bg-slate-200/80 dark:bg-white/10 text-slate-900 dark:text-white border border-slate-300/60 dark:border-white/10 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border border-transparent"
            }`}
          >
            <span>Unread</span>
            {totalUnread > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#2dd4bf] text-slate-950 font-bold text-[9px] flex items-center justify-center shadow-[0_0_8px_#2dd4bf]">
                {totalUnread}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar min-w-0">
        <AnimatePresence>
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-0 p-2"
            >
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center gap-3.5 px-3 py-3 rounded-2xl mb-1 min-w-0 bg-slate-100/40 dark:bg-slate-800/20 border border-slate-200/40 dark:border-white/5 animate-pulse">
                  <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800/80 flex-shrink-0" />
                  <div className="flex-1 flex flex-col gap-2 min-w-0">
                    <div className="flex justify-between min-w-0">
                      <div className="h-3.5 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
                      <div className="h-3 w-10 bg-slate-100 dark:bg-slate-800/50 rounded flex-shrink-0" />
                    </div>
                    <div className="h-3 w-40 bg-slate-100 dark:bg-slate-800/70 rounded" />
                  </div>
                </div>
              ))}
            </motion.div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-64 gap-3 text-slate-500 dark:text-slate-400 p-6 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#6366f1]/10 via-[#38bdf8]/10 to-[#2dd4bf]/10 border border-[#2dd4bf]/20 flex items-center justify-center shadow-[0_0_20px_rgba(45,212,191,0.15)] mb-1">
                <MessageSquareDashed className="w-6 h-6 text-[#38bdf8]" />
              </div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {search ? "No conversations found" : "No messages yet"}
              </p>
              <p className="text-xs text-slate-500 max-w-[200px]">
                {search ? "Try searching for a different name or contact" : "Start your first real-time conversation now"}
              </p>
              {!search && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={openNewChat}
                  className="mt-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#6366f1] to-[#38bdf8] text-white shadow-[0_0_15px_rgba(56,189,248,0.3)] transition-all"
                >
                  Start a new chat
                </motion.button>
              )}
            </motion.div>
          ) : (
            filtered.map((conv, i) => (
              <motion.div
                key={conv._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="min-w-0"
              >
                <ChatItem
                  conv={conv}
                  isActive={conv._id === selectedChatId}
                  onClick={() => setSelectedChat(conv)}
                />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChatList;