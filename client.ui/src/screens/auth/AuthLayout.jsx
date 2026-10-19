import { useEffect } from "react";
import { ShieldCheck, Zap, Radio, CheckCircle2 } from "lucide-react";
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
  // Enforce default light mode on login, signup, otp, and forget password pages
  useEffect(() => {
    const wasDark = document.documentElement.classList.contains("dark");
    document.documentElement.classList.remove("dark");

    return () => {
      // Restore user's saved workspace theme preference when leaving auth pages
      if (wasDark || localStorage.getItem("theme") === "dark") {
        document.documentElement.classList.add("dark");
      }
    };
  }, []);

  return (
    <div className="min-h-screen lg:h-screen lg:max-h-screen lg:overflow-hidden relative flex flex-col justify-between overflow-x-hidden bg-slate-100 text-slate-900 transition-colors duration-500 font-sans selection:bg-[#38bdf8]/30 selection:text-[#38bdf8]">
      
      {/* Background Ambient Glow Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Top-Left Cyan/Indigo Glow */}
        <div className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-[#6366f1]/18 via-[#38bdf8]/15 to-transparent blur-[130px] animate-pulse" />
        
        {/* Bottom-Right Teal/Mint Glow */}
        <div 
          className="absolute -bottom-32 -right-32 w-[540px] h-[540px] rounded-full bg-gradient-to-tl from-[#2dd4bf]/15 via-[#6366f1]/10 to-transparent blur-[140px] animate-pulse" 
          style={{ animationDelay: "3s" }}
        />

        {/* Center Accent Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#38bdf8]/5 blur-[160px] pointer-events-none" />

        {/* Subtle Futuristic Radial Architectural Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.08]" />
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 min-h-0 flex items-center justify-center p-3 sm:p-5 lg:p-6 w-full max-w-6xl mx-auto my-auto">
        {centered ? (
          /* Centered Modal Style (e.g. for Success, OTP, or focused cards) */
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full max-w-md relative my-auto"
          >
            <div className="relative rounded-3xl bg-white/95 border border-slate-200/80 shadow-[0_25px_80px_rgba(0,0,0,0.12)] backdrop-blur-2xl overflow-hidden p-6 sm:p-8 max-h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar">
              {/* Glowing Top Gradient Bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#6366f1] via-[#38bdf8] to-[#2dd4bf]" />
              {children}
            </div>
          </motion.div>
        ) : (
          /* Split Screen Two-Column Layout */
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full max-h-[calc(100vh-4rem)] rounded-3xl bg-white/95 border border-slate-200/80 shadow-[0_20px_70px_rgba(0,0,0,0.08)] backdrop-blur-2xl overflow-hidden flex flex-col lg:flex-row transition-all duration-500 my-auto"
          >
            {/* Left Side: Brand Showcase Panel */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#0c132c] via-[#090e1f] to-[#060914] text-white p-6 xl:p-8 flex-col justify-between overflow-hidden border-r border-white/5">
              
              {/* Ambient Glowing Blobs on Left Panel */}
              <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-[#6366f1]/20 blur-[90px] pointer-events-none" />
              <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-[#2dd4bf]/20 blur-[90px] pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

              {/* Brand Top Header */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#6366f1]/20 via-[#38bdf8]/15 to-[#2dd4bf]/20 border border-[#38bdf8]/40 shadow-[0_0_20px_rgba(56,189,248,0.35)] backdrop-blur-xl p-1">
                    <img src="/logo.png" alt="PulseChat" className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-1.5 ring-white dark:ring-transparent shadow-[0_0_8px_rgba(52,211,153,0.85)]" />
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
              </div>

              {/* Middle Hero Section */}
              <div className="relative z-10 my-4 xl:my-5 space-y-3.5">
                <h1 className="text-2xl xl:text-3xl font-extrabold leading-snug tracking-tight text-white">
                  {heroTitle}
                </h1>

                <p className="text-slate-300/90 text-xs xl:text-sm leading-relaxed max-w-md">
                  {heroSubtitle}
                </p>

                {/* Optional Custom Hero Widget (e.g. Chat demo, encryption badge, or quote) */}
                {heroWidget ? (
                  heroWidget
                ) : (
                  <div className="space-y-2.5 pt-1">
                    {/* Live Mini Preview Bubble */}
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-2 shadow-xl">
                      <div className="flex items-center justify-between pb-1 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-400" />
                          <span className="text-xs font-semibold text-white tracking-wide">Pulse Real-Time Network</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-300 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                          32ms Sync
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-200 leading-relaxed font-normal">
                        "Experience lightning-fast instant messaging with end-to-end security and responsive audio notifications across desktop & mobile."
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-0.5">
                        <span className="flex items-center gap-1.5 text-[#2dd4bf]">
                          <ShieldCheck className="w-3.5 h-3.5" /> TLS 1.3 Architecture
                        </span>
                        <span>Enterprise Core</span>
                      </div>
                    </div>

                    {/* Features Matrix Pills */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-[#38bdf8] shrink-0" />
                        <div>
                          <p className="text-[11px] font-bold text-white">Sub-50ms Sockets</p>
                          <p className="text-[9px] text-slate-400">Zero-lag delivery</p>
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-2">
                        <Radio className="w-4 h-4 text-[#2dd4bf] shrink-0" />
                        <div>
                          <p className="text-[11px] font-bold text-white">Native Web Push</p>
                          <p className="text-[9px] text-slate-400">Instant background alerts</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Social Proof Bar */}
              <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex -space-x-2">
                    {["from-cyan-400 to-blue-600", "from-purple-400 to-indigo-600", "from-emerald-400 to-teal-600", "from-amber-400 to-rose-600"].map((gradient, i) => (
                      <div
                        key={i}
                        className={`w-7 h-7 rounded-full border-2 border-[#090e1f] bg-gradient-to-tr ${gradient} flex items-center justify-center text-[9px] font-black text-white shadow-md`}
                      >
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-white">10,000+ Active Users</p>
                    <p className="text-[9px] text-slate-400">Connected in real-time</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-[#2dd4bf] font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>99.99% Uptime</span>
                </div>
              </div>
            </div>

            {/* Right Side: Form Panel */}
            <div className="w-full lg:w-1/2 p-5 sm:p-7 xl:p-8 flex flex-col justify-center relative bg-white/95 backdrop-blur-2xl transition-colors duration-500 overflow-y-auto custom-scrollbar max-h-full">
              
              {/* Glowing Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#6366f1] via-[#38bdf8] to-[#2dd4bf]" />

              {/* Mobile Brand Header (Visible only on smaller screens) */}
              <div className="lg:hidden flex items-center justify-between mb-4 pb-3 border-b border-slate-200/80 dark:border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#6366f1]/20 via-[#38bdf8]/15 to-[#2dd4bf]/20 border border-[#38bdf8]/40 shadow-[0_0_15px_rgba(56,189,248,0.3)] p-1">
                    <img src="/logo.png" alt="PulseChat" className="w-full h-full object-contain" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-white dark:ring-transparent" />
                  </div>
                  <div>
                    <span className="text-lg font-black tracking-tight bg-gradient-to-r from-[#818cf8] via-[#38bdf8] to-[#2dd4bf] bg-clip-text text-transparent">
                      PulseChat
                    </span>
                    <span className="block text-[8px] font-mono tracking-widest text-[#2dd4bf] uppercase font-bold">
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
                <div className="mb-4 sm:mb-5">
                  {cardTitle && (
                    <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-1">
                      {cardTitle}
                    </h2>
                  )}
                  {cardSubtitle && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
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
      <footer className="relative z-10 shrink-0 py-2 text-center text-[11px] text-slate-400 dark:text-slate-500">
        <p>© {new Date().getFullYear()} PulseChat Inc. Protected by End-to-End Encryption & TLS 1.3.</p>
      </footer>
    </div>
  );
};

export default AuthLayout;
