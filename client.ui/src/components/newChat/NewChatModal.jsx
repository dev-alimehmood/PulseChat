import { useState, useEffect, useRef } from "react";
import api from "../../services/api";
import { getInitials, avatarColor } from "../../utils/chat";
import { useAuth } from "../../context/auth";
import { X, Search as SearchIcon, ChevronRight, UserX } from "lucide-react";
import ModalWrapper from "../shared/ModalWrapper";

const NewChatModal = ({ onSelectUser, onClose }) => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);
  const [Auth] = useAuth();
  const loggedInUserId = Auth?.User?._id;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get("/users", {
          params: { q: search },
          signal: controller.signal,
        });
        // filter out logged in user
        const filtered = (data.users || data).filter(
          (u) => String(u._id) !== String(loggedInUserId)
        );
        setUsers(filtered);
      } catch (err) {
        if (err.name !== "CanceledError") {
          setError("Failed to load users. Try again.");
          console.error("NewChatModal fetch error:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchUsers, 300);
    return () => {
      clearTimeout(debounce);
      controller.abort();
    };
  }, [search, loggedInUserId]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <ModalWrapper onClose={onClose}>
      <div className="rounded-3xl w-88 md:w-[420px] overflow-hidden shadow-2xl backdrop-blur-2xl bg-white dark:bg-[#0c1228] border border-slate-200/80 dark:border-white/10 transition-all duration-300">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/80 dark:border-white/5 bg-slate-50/80 dark:bg-[#0e1630]/80">
          <div className="flex items-center gap-2">
            <span className="text-lg">🫀</span>
            <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">
              Start New Thread
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors text-slate-400 hover:text-slate-900 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-200/80 dark:border-white/5 bg-white/40 dark:bg-[#0c1228]/40">
          <div className="relative flex items-center group">
            <SearchIcon className="absolute left-3.5 w-4 h-4 pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-[#38bdf8] transition-colors" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search contacts by name or email..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-sm outline-none border transition-all duration-300 bg-slate-100/90 dark:bg-[#090e1f] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 border-slate-200 dark:border-white/5 focus:border-[#38bdf8]/50 focus:bg-white dark:focus:bg-[#121936] focus:shadow-[0_0_15px_rgba(56,189,248,0.2)]"
            />
          </div>
        </div>

        {/* User list */}
        <div className="max-h-80 overflow-y-auto custom-scrollbar p-2 bg-white dark:bg-[#0c1228]">
          {loading ? (
            <div className="flex flex-col gap-1 p-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-3.5 px-3 py-3 rounded-2xl border border-slate-200/40 dark:border-white/5 bg-slate-100/40 dark:bg-slate-800/20 animate-pulse">
                  <div className="w-10 h-10 rounded-2xl bg-slate-200 dark:bg-slate-800 flex-shrink-0" />
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="h-3 w-28 rounded bg-slate-200 dark:bg-slate-800" />
                    <div className="h-2.5 w-36 rounded bg-slate-100 dark:bg-slate-800/50" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2 text-center">
              <p className="text-sm text-rose-500 dark:text-rose-400">{error}</p>
              <button
                onClick={() => setSearch((s) => s + " ")}
                className="text-xs font-semibold text-[#38bdf8] hover:underline"
              >
                Retry
              </button>
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2 text-slate-400 dark:text-slate-500 text-center">
              <UserX className="w-8 h-8 opacity-40 mb-1" />
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {search ? "No matching contacts found" : "No other users available"}
              </p>
            </div>
          ) : (
            users.map((user) => {
              const [bg, fg] = avatarColor(user._id);
              return (
                <div
                  key={user._id}
                  onClick={() => onSelectUser(user)}
                  className="flex items-center gap-3.5 px-3.5 py-3 cursor-pointer rounded-2xl transition-all duration-200 hover:bg-gradient-to-r hover:from-[#6366f1]/10 hover:to-[#38bdf8]/10 group border border-transparent hover:border-[#38bdf8]/30 mb-1"
                >
                  <div
                    className="relative w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-sm border border-white/10 group-hover:scale-105 transition-transform"
                    style={{ background: bg, color: fg }}
                  >
                    {getInitials(user.full_name)}
                    {user.isOnline && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#2dd4bf] ring-2 ring-white dark:ring-[#0c1228] shadow-[0_0_6px_#2dd4bf]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate text-slate-900 dark:text-white group-hover:text-[#38bdf8] transition-colors">
                      {user.full_name}
                    </p>
                    <p className="text-xs truncate text-slate-500 dark:text-slate-400 mt-0.5">
                      {user.isOnline
                        ? <span className="text-[#2dd4bf] font-medium">Active now</span>
                        : user.email
                      }
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 flex-shrink-0 text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:text-[#38bdf8] transition-all" />
                </div>
              );
            })
          )}
        </div>
      </div>
    </ModalWrapper>
  );
};

export default NewChatModal;