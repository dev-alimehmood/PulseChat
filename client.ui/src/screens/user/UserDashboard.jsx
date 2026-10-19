import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { useSocket } from "../../context/socket";
import Avatar from "../../components/shared/Avatar";
import api from "../../services/api";
import { successtoast, errortoast } from "../../toastify/toastify";
import { 
  BarChart3, User, TrendingUp, ShieldCheck, ShieldBan, MessageSquare, 
  ArrowRight, Sparkles, Zap, Copy, CheckCircle2, UserPlus, Volume2, 
  VolumeX, Radio, Check, Eye, EyeOff, ShieldAlert, Lock, Activity, Smartphone
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import InviteModal from "../../components/invite/InviteModal";
import PulseLoader from "../../components/shared/PulseLoader";
import usePWAInstall from "../../hooks/usePWAInstall";

const UserDashboard = () => {
  const [Auth, setAuth] = useAuth();
  const socket = useSocket();
  const navigate = useNavigate();
  const { isInstallable, isInstalled, installApp } = usePWAInstall();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isUpdatingPresence, setIsUpdatingPresence] = useState(false);

  // Sound preference
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem("pulse_sound_enabled") !== "false";
  });

  // Online presence preference (Stealth Mode vs Broadcasting)
  const [presenceVisible, setPresenceVisible] = useState(() => {
    if (Auth?.User?.showOnlineStatus !== undefined) {
      return Auth.User.showOnlineStatus !== false;
    }
    return localStorage.getItem("pulse_presence_visible") !== "false";
  });

  const fetchStats = async () => {
    try {
      const { data } = await api.get("/auth/dashboard-stats");
      if (data?.success?.stats) {
        setStats(data.success.stats);
        if (data.success.stats.showOnlineStatus !== undefined) {
          setPresenceVisible(Boolean(data.success.stats.showOnlineStatus));
          localStorage.setItem("pulse_presence_visible", String(data.success.stats.showOnlineStatus));
        }
      }
    } catch (error) {
      console.error("fetchStats error:", error);
      errortoast("Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (Auth?.token) fetchStats();
  }, [Auth?.token]);

  // Keep local presenceVisible in sync if Auth.User changes
  useEffect(() => {
    if (Auth?.User?.showOnlineStatus !== undefined) {
      setPresenceVisible(Auth.User.showOnlineStatus !== false);
    }
  }, [Auth?.User?.showOnlineStatus]);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    localStorage.setItem("pulse_sound_enabled", String(next));
    successtoast(next ? "Notification audio enabled" : "Notification audio muted");
  };

  const togglePresence = async () => {
    if (isUpdatingPresence) return;
    setIsUpdatingPresence(true);
    const next = !presenceVisible;
    setPresenceVisible(next);
    localStorage.setItem("pulse_presence_visible", String(next));

    // 1. Emit instant socket event so all connected peers update immediately
    if (socket && Auth?.User?._id) {
      socket.emit("togglePresence", { userId: Auth.User._id, isVisible: next });
    }

    // 2. Persist to MongoDB database via profile endpoint
    try {
      const { data } = await api.put("/users/profile", { showOnlineStatus: next });
      
      // 3. Update global auth context state & local storage
      setAuth((prev) => ({
        ...prev,
        User: { ...(prev?.User || {}), showOnlineStatus: next, isOnline: next }
      }));

      try {
        const stored = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem("user", JSON.stringify({ ...stored, showOnlineStatus: next, isOnline: next }));
      } catch (e) {
        console.warn("Storage sync error:", e);
      }

      if (next) {
        successtoast("Online Presence Active: Contacts can now see your online status.");
      } else {
        successtoast("Stealth Mode Enabled: You appear offline to all contacts across PulseChat.");
      }
    } catch (error) {
      console.error("togglePresence server error:", error);
      errortoast("Failed to sync presence mode with server.");
      // Rollback on network failure
      setPresenceVisible(!next);
      localStorage.setItem("pulse_presence_visible", String(!next));
    } finally {
      setIsUpdatingPresence(false);
    }
  };

  const currentOrigin = typeof window !== "undefined" ? window.location.origin : "https://pulsechat-ali.netlify.app";
  const shareableInviteLink = `${currentOrigin}/signup?ref=${Auth?.User?._id || ""}`;

  const handleCopyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(shareableInviteLink);
      setCopiedLink(true);
      successtoast("Invite link copied to clipboard!");
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (err) {
      errortoast("Failed to copy invite link");
    }
  };

  const unblockUser = async (userId, userName) => {
    try {
      const { data } = await api.post(`/auth/block/${userId}`);
      if (data?.success) {
        successtoast(`Unblocked ${userName || "contact"}. Messaging is restored.`);
        setStats((prev) => ({
          ...prev,
          blockedUsers: (prev?.blockedUsers || []).filter((u) => String(u._id || u) !== String(userId)),
        }));

        // Sync with global auth state
        const currentBlocked = Array.isArray(Auth?.User?.blockedUsers) ? Auth.User.blockedUsers : [];
        const updatedBlocked = currentBlocked.filter((u) => String(u?._id || u) !== String(userId));
        setAuth((prev) => ({
          ...prev,
          User: { ...(prev?.User || {}), blockedUsers: updatedBlocked },
        }));
        try {
          const stored = JSON.parse(localStorage.getItem("user") || "{}");
          localStorage.setItem("user", JSON.stringify({ ...stored, blockedUsers: updatedBlocked }));
        } catch (e) {
          console.warn("Storage sync error:", e);
        }
      }
    } catch (error) {
      errortoast(`Failed to unblock ${userName || "user"}`);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  if (loading) {
    return (
      <PulseLoader
        variant="page"
        message="Loading your dashboard..."
        subtext="Syncing conversations and activity"
      />
    );
  }

  const completion = stats?.profileCompletion || 0;
  const user = Auth?.User;

  // Completion checklist items
  const completionItems = [
    { label: "Profile Photo", done: Boolean(user?.profilepicture) },
    { label: "Biography", done: Boolean(user?.bio) },
    { label: "City / Location", done: Boolean(user?.city) },
    { label: "Phone Number", done: Boolean(user?.phonenumber) },
  ];

  return (
    <div className="w-full h-full min-h-0 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar relative selection:bg-[#38bdf8]/30 transition-colors duration-500">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* ── 1. Executive Hero Command Banner ── */}
        <div className="relative rounded-3xl border border-slate-200/80 dark:border-white/10 p-6 sm:p-8 bg-white/80 dark:bg-[#0c1228]/80 backdrop-blur-2xl shadow-xl shadow-slate-200/40 dark:shadow-black/50 overflow-hidden">
          {/* Ambient decorative gradient */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#38bdf8]/15 via-[#6366f1]/10 to-transparent blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4 sm:gap-5">
              <div className="relative">
                <Avatar
                  src={user?.profilepicture}
                  name={user?.full_name}
                  id={user?._id}
                  size="w-16 h-16 sm:w-20 sm:h-20 text-xl sm:text-2xl"
                  rounded="rounded-3xl"
                  showOnline={presenceVisible}
                  isOnline={presenceVisible}
                  className="shadow-xl ring-2 sm:ring-4 ring-white dark:ring-white/10 border border-white/20 shrink-0"
                />
                {/* Visual presence pin on avatar when in Stealth Mode */}
                {!presenceVisible && (
                  <div 
                    className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md ring-1.5 ring-white dark:ring-transparent z-20"
                    title="Stealth Mode (Incognito - You appear offline to others)"
                  >
                    <EyeOff className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  {/* Clean Status Indicator */}
                  {presenceVisible ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                      <span>Online</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-xs font-medium">
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Invisible Mode</span>
                    </div>
                  )}

                  {user?.isadmin && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                      Admin
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white truncate">
                  {getGreeting()}, {user?.full_name?.split(" ")[0] || "there"}
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  {presenceVisible 
                    ? "You are visible to your contacts. They can see when you are active."
                    : "Invisible mode is active. You appear offline across all chat lists."}
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-3 shrink-0 self-stretch sm:self-auto">
              <button
                onClick={() => setShowInviteModal(true)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold border border-slate-200/80 dark:border-white/10 bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-sm active:scale-95"
              >
                <UserPlus className="w-4 h-4 text-[#38bdf8]" />
                <span>Invite Friends</span>
              </button>

              <button
                onClick={() => navigate("/chatpage")}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-semibold bg-gradient-to-r from-[#6366f1] via-[#38bdf8] to-[#2dd4bf] text-white shadow-lg shadow-[#38bdf8]/25 hover:opacity-95 transition-all active:scale-95"
              >
                <span>Open Messages</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ── 2. Integrated Telemetry & Metrics Strip ── */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-[#0c1228]/70 backdrop-blur-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-white/5">
            
            {/* Stat 1: Messages Sent */}
            <div className="p-5 sm:p-6 flex items-center gap-4 group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-[#38bdf8] border border-sky-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Messages Sent</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5 tracking-tight group-hover:text-[#38bdf8] transition-colors">
                  {stats?.totalMessagesSent || 0}
                </p>
              </div>
            </div>

            {/* Stat 2: Peak Thread Volume */}
            <div className="p-5 sm:p-6 flex items-center gap-4 group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Top Conversation</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5 tracking-tight group-hover:text-indigo-400 transition-colors">
                  {stats?.maxMessages || 0} <span className="text-xs font-normal text-slate-400">messages</span>
                </p>
              </div>
            </div>

            {/* Stat 3: Online Presence Mode */}
            <div 
              onClick={togglePresence}
              className="p-5 sm:p-6 flex items-center gap-4 group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform ${
                presenceVisible 
                  ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                  : "bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border-indigo-500/20"
              }`}>
                {presenceVisible ? <Radio className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Online Status</p>
                <p className={`text-base font-bold mt-0.5 tracking-tight flex items-center gap-1.5 ${
                  presenceVisible ? "text-emerald-600 dark:text-emerald-400" : "text-indigo-600 dark:text-indigo-400"
                }`}>
                  {presenceVisible ? "Visible" : "Invisible"}
                  <span className="text-[11px] font-normal text-slate-400 underline ml-1">Change</span>
                </p>
              </div>
            </div>

            {/* Stat 4: Blocked Contacts */}
            <div className="p-5 sm:p-6 flex items-center gap-4 group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Blocked Contacts</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5 tracking-tight group-hover:text-rose-500 transition-colors">
                  {stats?.blockedUsers?.length || 0}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* ── 3. Balanced Dual Hub Grid (Operations & Health) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column (7 cols): Operations & Control Center */}
          <div className="lg:col-span-7 space-y-6">

            {/* Most Active Conversation */}
            <div className="rounded-3xl border border-slate-200/80 dark:border-white/10 p-5 sm:p-6 bg-white/70 dark:bg-[#0c1228]/70 backdrop-blur-xl shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Top Conversation
                  </h3>
                </div>
              </div>

              {stats?.mostActiveUser ? (
                <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-[#6366f1]/10 via-[#38bdf8]/10 to-transparent border border-[#38bdf8]/20">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <Avatar
                      src={stats.mostActiveUser.profilepicture}
                      name={stats.mostActiveUser.full_name}
                      id={stats.mostActiveUser._id}
                      size="w-12 h-12 text-sm"
                      rounded="rounded-2xl"
                      className="border border-white/20 shadow-md"
                    />
                    <div className="min-w-0">
                      <p className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                        {stats.mostActiveUser.full_name}
                      </p>
                      <p className="text-xs text-[#0284c7] dark:text-[#38bdf8] font-medium mt-0.5">
                        {stats.maxMessages} messages exchanged in top thread
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/chatpage?chat=${stats.mostActiveUser._id}`)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#38bdf8]/15 text-[#0284c7] dark:text-[#38bdf8] hover:bg-[#38bdf8]/25 transition-all shrink-0 ml-3 shadow-sm active:scale-95"
                  >
                    <span>Message</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#070b18] border border-dashed border-slate-200 dark:border-white/10 text-center">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    No active conversations yet. Launch Messenger or invite friends to get started.
                  </p>
                  <button
                    onClick={() => navigate("/chatpage")}
                    className="mt-2.5 text-xs font-bold text-[#38bdf8] hover:underline inline-flex items-center gap-1"
                  >
                    <span>Open Messenger Directory</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Privacy & System Settings */}
            <div className="rounded-3xl border border-slate-200/80 dark:border-white/10 p-5 sm:p-6 bg-white/70 dark:bg-[#0c1228]/70 backdrop-blur-xl shadow-lg space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Privacy & Settings</h3>
                </div>
              </div>

              {/* Dedicated Stealth Mode / Presence Row */}
              <div className={`p-4 rounded-2xl border transition-all ${
                presenceVisible 
                  ? "bg-slate-50/80 dark:bg-[#070b18] border-slate-200/80 dark:border-white/5" 
                  : "bg-indigo-50/70 dark:bg-indigo-950/20 border-indigo-200/80 dark:border-indigo-500/20"
              }`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      presenceVisible 
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                        : "bg-indigo-500/15 text-indigo-500 dark:text-indigo-400 border border-indigo-500/30"
                    }`}>
                      {presenceVisible ? <Radio className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          Stealth Mode
                        </p>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          presenceVisible 
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                            : "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400"
                        }`}>
                          {presenceVisible ? "Visible" : "Invisible"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {presenceVisible
                          ? "Your green dot is visible to your contacts when you are active."
                          : "You appear offline to all contacts. No active green dot is shown."}
                      </p>
                    </div>
                  </div>

                  {/* Toggle Button */}
                  <button
                    onClick={togglePresence}
                    disabled={isUpdatingPresence}
                    className={`w-12 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                      presenceVisible ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
                    } ${isUpdatingPresence ? "opacity-60 cursor-wait" : ""}`}
                    aria-label="Toggle Online Presence Visibility"
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform flex items-center justify-center ${
                        presenceVisible ? "translate-x-6" : "translate-x-0"
                      }`}
                    >
                      {presenceVisible ? (
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      ) : (
                        <EyeOff className="w-3 h-3 text-slate-500" />
                      )}
                    </div>
                  </button>
                </div>
              </div>

              {/* Notification Audio & System Preferences */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Audio Notifications Toggle */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/80 dark:bg-[#070b18] border border-slate-200/80 dark:border-white/5">
                  <div className="flex items-center gap-2.5">
                    {soundEnabled ? (
                      <Volume2 className="w-4 h-4 text-[#38bdf8]" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-slate-400" />
                    )}
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Audio Alerts</p>
                      <p className="text-[10px] text-slate-400">Incoming message audio</p>
                    </div>
                  </div>
                  <button
                    onClick={toggleSound}
                    className={`w-10 h-5 rounded-full transition-colors relative p-0.5 shrink-0 ${
                      soundEnabled ? "bg-[#38bdf8]" : "bg-slate-300 dark:bg-slate-700"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        soundEnabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Instant Referral Copy Card */}
                <button
                  onClick={handleCopyInviteLink}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/80 dark:bg-[#070b18] border border-slate-200/80 dark:border-white/5 hover:border-[#38bdf8]/40 transition-all text-left group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      {copiedLink ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                        {copiedLink ? "Link Copied!" : "Copy Invite Link"}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">Share direct workspace URL</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-[#38bdf8] shrink-0 ml-2">
                    {copiedLink ? "Copied" : "Copy"}
                  </span>
                </button>
              </div>

              {/* Mobile / PWA App Installation Card */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-[#2dd4bf]/10 to-transparent border border-emerald-500/20">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {isInstalled ? "Mobile App Installed" : "Install Mobile App"}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {isInstalled ? "Running in standalone mode" : "Add PulseChat directly to your phone's home screen"}
                    </p>
                  </div>
                </div>
                {!isInstalled && (
                  <button
                    onClick={installApp}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#2dd4bf] to-emerald-500 text-slate-950 font-bold text-xs shadow-sm hover:opacity-90 active:scale-95 transition-all shrink-0 ml-2"
                  >
                    Install
                  </button>
                )}
              </div>

              {/* Navigation Shortcuts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => navigate("/profile")}
                  className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-white/5 bg-slate-50/70 dark:bg-[#070b18]/80 hover:border-[#38bdf8]/50 hover:bg-slate-100/70 dark:hover:bg-slate-800/50 transition-all text-left group flex items-center gap-3"
                >
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Edit Profile</p>
                    <p className="text-[11px] text-slate-400 truncate">Update photo, bio, and details</p>
                  </div>
                </button>

                <button
                  onClick={() => navigate("/about")}
                  className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-white/5 bg-slate-50/70 dark:bg-[#070b18]/80 hover:border-[#38bdf8]/50 hover:bg-slate-100/70 dark:hover:bg-slate-800/50 transition-all text-left group flex items-center gap-3"
                >
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">About PulseChat</p>
                    <p className="text-[11px] text-slate-400 truncate">Features, architecture, and team</p>
                  </div>
                </button>
              </div>

            </div>

          </div>

          {/* Right Column (5 cols): Profile Health & Quarantine Shield */}
          <div className="lg:col-span-5 space-y-6">

            {/* Profile Completion Card */}
            <div className="rounded-3xl border border-slate-200/80 dark:border-white/10 p-5 sm:p-6 bg-white/70 dark:bg-[#0c1228]/70 backdrop-blur-xl shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Profile Completion</h3>
                    <p className="text-[11px] text-slate-400">{completion}% completed</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-[#2dd4bf]">{completion}%</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#6366f1] via-[#38bdf8] to-[#2dd4bf] transition-all duration-500"
                  style={{ width: `${completion}%` }}
                />
              </div>

              {/* Checklist */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                {completionItems.map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-xs">
                    {item.done ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-600 shrink-0" />
                    )}
                    <span className={item.done ? "text-slate-700 dark:text-slate-300 font-medium" : "text-slate-400"}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate("/profile")}
                className="w-full py-2.5 rounded-xl text-xs font-bold border border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-800/80 text-slate-800 dark:text-white hover:border-[#38bdf8]/50 transition-all text-center shadow-sm active:scale-95"
              >
                Complete Profile Setup
              </button>
            </div>

            {/* Blocked Contacts */}
            <div className="rounded-3xl border border-slate-200/80 dark:border-white/10 p-5 sm:p-6 bg-white/70 dark:bg-[#0c1228]/70 backdrop-blur-xl shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldBan className="w-4 h-4 text-rose-500" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Blocked Contacts</h3>
                </div>
                <span className="text-[11px] font-semibold text-slate-400">
                  {stats?.blockedUsers?.length || 0} Blocked
                </span>
              </div>

              {(!stats?.blockedUsers || stats.blockedUsers.length === 0) ? (
                <div className="flex flex-col items-center justify-center py-6 px-4 rounded-2xl bg-slate-50/60 dark:bg-[#070b18]/60 border border-dashed border-slate-200 dark:border-white/5 text-center">
                  <ShieldCheck className="w-7 h-7 text-emerald-500 mb-1.5" />
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">No Blocked Contacts</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Your communication channels are open and protected.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-52 overflow-y-auto custom-scrollbar">
                  {stats.blockedUsers.map((blocked) => (
                    <div
                      key={blocked._id}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200/80 dark:border-white/5 bg-slate-50/80 dark:bg-slate-900/40"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Avatar
                          src={blocked.profilepicture}
                          name={blocked.full_name}
                          id={blocked._id}
                          size="w-8 h-8 text-[10px]"
                          rounded="rounded-xl"
                        />
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {blocked.full_name || "Unknown"}
                        </p>
                      </div>
                      <button
                        onClick={() => unblockUser(blocked._id, blocked.full_name)}
                        className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-rose-500 hover:text-white transition-all shrink-0 ml-2"
                      >
                        Unblock
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* Invite Modal instance triggered from Dashboard */}
      {showInviteModal && (
        <InviteModal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          onOpenChatWithUser={(targetUser) => {
            setShowInviteModal(false);
            if (targetUser?._id) {
              navigate(`/chatpage?chat=${targetUser._id}`);
            }
          }}
        />
      )}
    </div>
  );
};

export default UserDashboard;
