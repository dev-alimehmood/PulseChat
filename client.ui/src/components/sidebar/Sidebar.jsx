import { useAuth } from "../../context/auth";
import { getInitials, avatarColor } from "../../utils/chat";
import { useNavigate, useLocation } from "react-router-dom";
import { MessageSquare, Sun, Moon, LogOut, Info, Shield, LayoutDashboard, Users, Settings, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const NAV = [
  { label: "Chats", path: "/chatpage", icon: MessageSquare },
  { label: "Settings", path: "/dashboard", icon: Settings },
  { label: "About", path: "/about", icon: Info },
];

const ADMIN_NAV = [
  { label: "Admin Dashboard", path: "/admin", icon: LayoutDashboard },
  { label: "Manage Users", path: "/admin/users", icon: Users },
  { label: "Manage Chats", path: "/admin/chats", icon: MessageSquare },
];

const Sidebar = ({ activeTab, onSelectTab, toggleDark, isDark }) => {
  const [Auth, , { logout }] = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const user = Auth?.User;
  const [bg, fg] = avatarColor(user?._id || "");

  const isActivePath = (path) => location.pathname === path || (path === "/chatpage" && location.pathname === "/");

  return (
    <aside className="flex h-full max-h-screen overflow-y-auto overflow-x-hidden custom-scrollbar w-16 md:w-20 shrink-0 flex-col items-center justify-between border-r border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-[#0b1021]/80 py-4 shadow-[12px_0_40px_rgba(15,23,42,0.06)] dark:shadow-[12px_0_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-all duration-500 z-50">
      
      {/* Top Brand Logo */}
      <div className="flex flex-col items-center gap-6 w-full">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/chatpage")}
          title="PulseChat Workspace"
          className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#6366f1]/20 via-[#38bdf8]/20 to-[#2dd4bf]/20 border border-[#2dd4bf]/40 shadow-[0_0_20px_rgba(45,212,191,0.25)] group"
        >
          <span className="text-xl group-hover:scale-110 transition-transform">🫀</span>
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#2dd4bf] ring-2 ring-white dark:ring-[#0b1021] animate-ping" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#2dd4bf]" />
        </motion.button>

        <div className="w-8 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />

        {/* Main Navigation */}
        <div className="flex flex-col items-center gap-3 w-full px-2">
          {NAV.map(({ icon: Icon, label, path }) => {
            const active = isActivePath(path);
            return (
              <motion.button
                key={label}
                title={label}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (onSelectTab) onSelectTab(label);
                  navigate(path);
                }}
                className={`group relative flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl md:rounded-2xl transition-all duration-300 ${
                  active
                    ? "bg-gradient-to-tr from-[#6366f1] via-[#38bdf8] to-[#2dd4bf] text-white shadow-[0_0_25px_rgba(56,189,248,0.45)] border border-white/20"
                    : "border border-slate-200/80 bg-slate-50/80 text-slate-600 hover:border-[#38bdf8]/40 hover:bg-slate-100 hover:text-slate-900 dark:border-white/5 dark:bg-slate-900/60 dark:text-slate-400 dark:hover:border-[#38bdf8]/40 dark:hover:bg-slate-800/80 dark:hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4 md:h-5 md:w-5 transition-transform group-hover:scale-110" />
                {active && (
                  <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-1.5 h-6 rounded-r-full bg-[#2dd4bf] shadow-[0_0_10px_#2dd4bf]" />
                )}
              </motion.button>
            );
          })}

          {user?.isadmin && (
            <>
              <div className="w-8 h-px bg-slate-200 dark:bg-slate-800 my-1" />
              {ADMIN_NAV.map(({ icon: Icon, label, path }) => {
                const active = location.pathname === path;
                return (
                  <motion.button
                    key={label}
                    title={label}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(path)}
                    className={`group flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl md:rounded-2xl border transition-all duration-300 ${
                      active
                        ? "border-[#818cf8]/40 bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25"
                        : "border-slate-200/80 bg-slate-50/80 text-purple-600 hover:border-purple-400 hover:bg-purple-50 dark:border-white/5 dark:bg-slate-900/60 dark:text-purple-400 dark:hover:bg-slate-800/80 dark:hover:text-purple-300"
                    }`}
                  >
                    <Icon className="h-4 w-4 md:h-5 md:w-5 transition-transform group-hover:scale-110" />
                  </motion.button>
                );
              })}
            </>
          )}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="flex flex-col items-center gap-3 w-full px-2">
        {/* User Profile Button */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/profile")}
          title={user?.full_name || "Profile"}
          className={`relative flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl md:rounded-2xl border transition-all duration-300 overflow-hidden ${
            location.pathname === "/profile"
              ? "ring-2 ring-[#2dd4bf] shadow-[0_0_20px_rgba(45,212,191,0.35)] border-transparent"
              : "border-slate-200/80 dark:border-white/10 hover:border-[#38bdf8]/50"
          }`}
          style={!user?.profilepicture ? { background: bg, color: fg } : {}}
        >
          {user?.profilepicture ? (
            <img 
              src={user.profilepicture} 
              alt={user?.full_name || "Profile"} 
              className="w-full h-full object-cover" 
            />
          ) : (
            <span className="text-xs md:text-sm font-bold tracking-tight">
              {getInitials(user?.full_name)}
            </span>
          )}
          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#2dd4bf] border-2 border-white dark:border-[#0b1021] z-10" />
        </motion.button>

        {/* Theme Toggle */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleDark}
          title={isDark ? "Switch to light mode" : "Switch to dark obsidian mode"}
          className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl md:rounded-2xl border border-slate-200/80 bg-slate-50/80 text-amber-500 hover:border-amber-400/50 hover:bg-amber-50/50 dark:border-white/5 dark:bg-slate-900/60 dark:text-[#38bdf8] dark:hover:border-[#38bdf8]/40 dark:hover:bg-slate-800/80 transition-all duration-300"
        >
          {isDark ? <Sun className="h-4 w-4 md:h-5 md:w-5 drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]" /> : <Moon className="h-4 w-4 md:h-5 md:w-5" />}
        </motion.button>

        {/* Logout */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={logout}
          title="Sign Out"
          className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl md:rounded-2xl border border-slate-200/80 bg-slate-50/80 text-rose-500 hover:border-rose-400/50 hover:bg-rose-50/80 dark:border-white/5 dark:bg-slate-900/60 dark:text-rose-400 dark:hover:bg-rose-500/10 dark:hover:border-rose-500/30 transition-all duration-300"
        >
          <LogOut className="h-4 w-4 md:h-5 md:w-5" />
        </motion.button>
      </div>
    </aside>
  );
};

export default Sidebar;