import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sun, Moon, ShieldCheck, Zap, Radio, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export const AuthLayout = ({
  heroTitle = "Connect with your world in real-time.",
  heroSubtitle = "Ultra-fast messaging, military-grade privacy, and instant push synchronization across all your devices.",
  cardTitle,
  cardSubtitle,
  children,
  centered = false,
  heroWidget = null,
}) => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        document.documentElement.classList.contains("dark") ||
        localStorage.getItem("theme") === "dark"
      );
    }
    return true;
  });

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-between overflow-x-hidden bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-white transition-colors duration-500 font-sans selection:bg-[#38bdf8]/30 selection:text-[#38bdf8]">
      
      {/* Background Ambient Glow Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Top-Left Cyan/Indigo Glow */}
        <div className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-[#6366f1]/25 via-[#38bdf8]/20 to-transparent blur-[130px] animate-pulse" />
        
        {/* Bottom-Right Teal/Mint Glow */}
        <div 
          className="absolute -bottom-32 -right-32 w-[540px] h-[540px] rounded-full bg-gradient-to-tl from-[#2dd4bf]/20 via-[#6366f1]/15 to-transparent blur-[140px] animate-pulse" 
          style={{ animationDelay: "3s" }}
        />

        {/* Center Accent Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#38bdf8]/5 blur-[160px] pointer-events-none" />

        {/* Subtle Futuristic Radial Architectural Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.07] dark:opacity-[0.14]" />
      </div>

      {/* Top Floating Navigation Bar */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-6 pb-2 flex items-center justify-between">
        <Link
          to="/"
          className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/70 dark:bg-[#0d1428]/70 border border-slate-200/80 dark:border-white/10 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shadow-sm hover:shadow-md hover:border-[#38bdf8]/50 dark:hover:border-[#38bdf8]/40 backdrop-blur-xl transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4 text-[#38bdf8] group-hover:-translate-x-1 transition-transform" />
          <span>Back to PulseChat</span>
        </Link>

        {/* Theme Toggle Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="p-2.5 rounded-xl bg-white/70 dark:bg-[#0d1428]/70 border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shadow-sm hover:shadow-md hover:border-[#38bdf8]/40 backdrop-blur-xl transition-all duration-300"
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform duration-300" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600 hover:-rotate-12 transition-transform duration-300" />
          )}
        </motion.button>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        {centered ? (
          /* Centered Modal Style (e.g. for Success or Single focused card) */
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full max-w-lg relative"
          >
            <div className="relative rounded-3xl bg-white/90 dark:bg-[#0c1228]/90 border border-slate-200/80 dark:border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.1)] dark:shadow-[0_25px_80px_rgba(0,0,0,0.65)] backdrop-blur-2xl overflow-hidden p-6 sm:p-10">
              {/* Glowing Top Gradient Bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#6366f1] via-[#38bdf8] to-[#2dd4bf]" />
              {children}
            </div>
          </motion.div>
        ) : (
          /* Split Screen Two-Column Layout */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="w-full max-w-6xl rounded-3xl bg-white/85 dark:bg-[#0b1022]/85 border border-slate-200/80 dark:border-white/10 shadow-[0_25px_80px_rgba(15,23,42,0.08)] dark:shadow-[0_30px_90px_rgba(0,0,0,0.7)] backdrop-blur-2xl overflow-hidden flex flex-col lg:flex-row transition-all duration-500"
          >
            {/* Left Side: Brand Showcase Panel */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#0c132c] via-[#090e1f] to-[#060914] text-white p-10 xl:p-12 flex-col justify-between overflow-hidden border-r border-white/5">
              
              {/* Ambient Glowing Blobs on Left Panel */}
              <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-[#6366f1]/20 blur-[90px] pointer-events-none" />
              <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-[#2dd4bf]/20 blur-[90px] pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

              {/* Brand Top Header */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#6366f1]/20 via-[#38bdf8]/15 to-[#2dd4bf]/20 border border-[#38bdf8]/40 shadow-[0_0_25px_rgba(56,189,248,0.35)] backdrop-blur-xl p-1.5">
                    <img src="/logo.png" alt="PulseChat" className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-1.5 ring-white dark:ring-transparent shadow-[0_0_8px_rgba(52,211,153,0.85)]" />
                  </div>
                  <div>
                    <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-[#818cf8] via-[#38bdf8] to-[#2dd4bf] bg-clip-text text-transparent">
                      PulseChat
                    </span>
                    <span className="block text-[10px] font-mono tracking-widest text-[#2dd4bf] uppercase font-bold">
                      Real-Time Platform
                    </span>
                  </div>
                </div>
              </div>

              {/* Middle Hero Section */}
              <div className="relative z-10 my-8 space-y-5">
                <h1 className="text-3xl xl:text-4xl font-extrabold leading-tight tracking-tight text-white">
                  {heroTitle}
                </h1>

                <p className="text-slate-300/90 text-sm xl:text-base leading-relaxed max-w-md">
                  {heroSubtitle}
                </p>

                {/* Optional Custom Hero Widget (e.g. Chat demo, encryption badge, or quote) */}
                {heroWidget ? (
                  heroWidget
                ) : (
                  <div className="space-y-3 pt-2">
                    {/* Live Mini Preview Bubble */}
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-2.5 shadow-xl">
                      <div className="flex items-center justify-between pb-1 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-400" />
                          <span className="text-xs font-semibold text-white tracking-wide">Pulse Real-Time Network</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-300 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                          32ms Sync
                        </span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed font-normal">
                        "Experience lightning-fast instant messaging with end-to-end security and responsive audio notifications across desktop & mobile."
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                        <span className="flex items-center gap-1.5 text-[#2dd4bf]">
                          <ShieldCheck className="w-3.5 h-3.5" /> TLS 1.3 Architecture
                        </span>
                        <span>Enterprise Core</span>
                      </div>
                    </div>

                    {/* Features Matrix Pills */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-2.5">
                        <Zap className="w-4 h-4 text-[#38bdf8] shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-white">Sub-50ms Sockets</p>
                          <p className="text-[10px] text-slate-400">Zero-lag communication</p>
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-2.5">
                        <Radio className="w-4 h-4 text-[#2dd4bf] shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-white">Native Web Push</p>
                          <p className="text-[10px] text-slate-400">Instant offline notifications</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Social Proof Bar */}
              <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2.5">
                    {["from-cyan-400 to-blue-600", "from-purple-400 to-indigo-600", "from-emerald-400 to-teal-600", "from-amber-400 to-rose-600"].map((gradient, i) => (
                      <div
                        key={i}
                        className={`w-8 h-8 rounded-full border-2 border-[#090e1f] bg-gradient-to-tr ${gradient} flex items-center justify-center text-[10px] font-black text-white shadow-md`}
                      >
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">10,000+ Active Users</p>
                    <p className="text-[10px] text-slate-400">Connected in real-time right now</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-[#2dd4bf] font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>99.99% Uptime</span>
                </div>
              </div>
            </div>

            {/* Right Side: Form Panel */}
            <div className="w-full lg:w-1/2 p-6 sm:p-10 xl:p-12 flex flex-col justify-center relative bg-white/70 dark:bg-[#0c1228]/70 backdrop-blur-2xl transition-colors duration-500">
              
              {/* Glowing Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#6366f1] via-[#38bdf8] to-[#2dd4bf]" />

              {/* Mobile Brand Header (Visible only on smaller screens) */}
              <div className="lg:hidden flex items-center justify-between mb-8 pb-5 border-b border-slate-200/80 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#6366f1]/20 via-[#38bdf8]/15 to-[#2dd4bf]/20 border border-[#38bdf8]/40 shadow-[0_0_20px_rgba(56,189,248,0.3)] p-1">
                    <img src="/logo.png" alt="PulseChat" className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(56,189,248,0.4)]" />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-1.5 ring-white dark:ring-transparent shadow-[0_0_8px_rgba(52,211,153,0.85)]" />
                  </div>
                  <div>
                    <span className="text-xl font-black tracking-tight bg-gradient-to-r from-[#818cf8] via-[#38bdf8] to-[#2dd4bf] bg-clip-text text-transparent">
                      PulseChat
                    </span>
                    <span className="block text-[9px] font-mono tracking-widest text-[#2dd4bf] uppercase font-bold">
                      Real-Time Platform
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Online</span>
                </div>
              </div>

              {/* Form Title & Subtitle */}
              {(cardTitle || cardSubtitle) && (
                <div className="mb-8">
                  {cardTitle && (
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
                      {cardTitle}
                    </h2>
                  )}
                  {cardSubtitle && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {cardSubtitle}
                    </p>
                  )}
                </div>
              )}

              {/* Form Body */}
              <div>{children}</div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Subtle Footer info */}
      <footer className="relative z-10 py-4 text-center text-xs text-slate-400 dark:text-slate-500">
        <p>© {new Date().getFullYear()} PulseChat Inc. Protected by End-to-End Encryption & TLS 1.3.</p>
      </footer>
    </div>
  );
};

export default AuthLayout;
