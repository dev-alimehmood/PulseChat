import { motion } from "framer-motion";
import { MessageSquare, LayoutDashboard, ArrowLeft, Shield, Radio } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const P404 = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden selection:bg-[#38bdf8]/30 transition-colors duration-500">
      
      {/* Background Ambient Mesh Light */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-[#6366f1]/20 via-[#38bdf8]/15 to-[#2dd4bf]/20 blur-[160px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#4f46e5]/10 blur-[180px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(148,163,184,0.12)_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:32px_32px] opacity-75 pointer-events-none" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-lg mx-auto flex flex-col items-center text-center px-4"
      >
        {/* Brand Heartbeat Emblem */}
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-3xl bg-white dark:bg-[#0c1228] border border-slate-200/90 dark:border-white/10 flex items-center justify-center shadow-2xl shadow-indigo-500/10 dark:shadow-black/50 p-3">
            <img src="/logo.png" alt="PulseChat" className="w-full h-full object-contain animate-pulse drop-shadow-[0_0_12px_rgba(56,189,248,0.5)]" />
          </div>
          <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-rose-500 ring-2 ring-white dark:ring-transparent animate-ping" />
          <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-rose-500 ring-2 ring-white dark:ring-transparent" />
        </div>

        {/* 404 Status Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-500 text-xs font-mono font-semibold tracking-wider uppercase mb-4 shadow-sm">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>Error 404 — Channel Not Found</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-3">
          Signal Disconnected
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
          The channel or page you are trying to reach doesn't exist, was relocated, or your session frequency changed.
        </p>

        {/* Action Grid */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/chatpage")}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-[#6366f1] via-[#38bdf8] to-[#2dd4bf] text-white shadow-[0_0_25px_rgba(45,212,191,0.35)] hover:opacity-95 transition-all flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Open PulseChat</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/dashboard")}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl text-xs sm:text-sm font-semibold border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <LayoutDashboard className="w-4 h-4 text-[#38bdf8]" />
            <span>Go to Dashboard</span>
          </motion.button>
        </div>

        {/* Secondary Back Link */}
        <button
          onClick={() => navigate(-1)}
          className="mt-6 inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to previous screen</span>
        </button>
      </motion.div>
    </div>
  );
};

export default P404;
