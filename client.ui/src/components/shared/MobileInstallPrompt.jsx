import { useState, useEffect } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Download, X, Share, PlusSquare, Sparkles, CheckCircle2 } from "lucide-react";
import usePWAInstall from "../../hooks/usePWAInstall";

export const MobileInstallPrompt = () => {
  const { isInstallable, isInstalled, isIOS, installApp } = usePWAInstall();
  const [isVisible, setIsVisible] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    // If already running in standalone mode (already installed), never show
    if (isInstalled) return;

    // Check if on a mobile device or screen
    const checkIsMobile = () => {
      if (typeof window === "undefined") return false;
      const isMobileWidth = window.innerWidth <= 820;
      const isTouchUserAgent = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent || "");
      return isMobileWidth || isTouchUserAgent;
    };

    if (!checkIsMobile()) return;

    // Smooth delay before showing banner so page finishes rendering
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2200);

    return () => clearTimeout(timer);
  }, [isInstalled]);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  const handleInstallClick = async () => {
    if (isIOS) {
      // Toggle iOS Add to Home Screen step-by-step guidance
      setShowIOSGuide((prev) => !prev);
      return;
    }

    if (isInstallable) {
      const accepted = await installApp();
      if (accepted) {
        setIsVisible(false);
      }
    } else {
      // Fallback instruction for browsers where beforeinstallprompt hasn't fired
      setShowIOSGuide(true);
    }
  };

  if (!isVisible || isInstalled) return null;

  return (
    <AnimatePresence>
      <Motion.aside
        aria-label="Install PulseChat App"
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.96 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="fixed bottom-3 inset-x-3 sm:inset-x-auto sm:right-4 sm:bottom-4 z-[9990] max-w-md mx-auto sm:mx-0 select-none"
      >
        <div className="relative rounded-3xl bg-slate-900/95 dark:bg-[#0c1228]/95 border border-slate-700/60 dark:border-white/15 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.55)] p-4 sm:p-5 text-white overflow-hidden">
          
          {/* Top Ambient Gradient Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#6366f1] via-[#38bdf8] to-[#2dd4bf]" />

          {/* Header Row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* App Icon */}
              <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#6366f1]/20 via-[#38bdf8]/15 to-[#2dd4bf]/20 border border-[#38bdf8]/40 shadow-[0_0_20px_rgba(56,189,248,0.35)] p-1 shrink-0 flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="PulseChat"
                  className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]"
                />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900 shadow-[0_0_8px_rgba(52,211,153,0.85)]" />
              </div>

              {/* Title & Tag */}
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black tracking-tight text-white">
                    Install PulseChat
                  </h3>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#2dd4bf] bg-[#2dd4bf]/15 px-1.5 py-0.5 rounded-md border border-[#2dd4bf]/30">
                    App
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                  Install on your phone for a faster, full-screen experience.
                </p>
              </div>
            </div>

            {/* Quick Dismiss Icon */}
            <button
              onClick={handleDismiss}
              aria-label="Close install prompt"
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Perks Strip */}
          <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-white/10 text-[10px] text-slate-300 font-medium">
            <div className="flex items-center gap-1.5 text-cyan-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#38bdf8] shrink-0" />
              <span>Instant Push Notifications</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2dd4bf] shrink-0" />
              <span>Full-Screen Native UI</span>
            </div>
          </div>

          {/* Optional iOS Instructions Drawer */}
          {showIOSGuide && (
            <Motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 p-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-200 space-y-1.5 leading-relaxed"
            >
              <p className="font-bold text-[#38bdf8] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Easy 2-Step Installation:
              </p>
              <ol className="list-decimal pl-4 space-y-1 text-[11px] text-slate-300">
                <li>
                  Tap the <strong className="text-white">Share</strong> button{" "}
                  <Share className="w-3 h-3 inline text-sky-400" /> in your browser toolbar.
                </li>
                <li>
                  Scroll and select{" "}
                  <strong className="text-white">"Add to Home Screen"</strong>{" "}
                  <PlusSquare className="w-3 h-3 inline text-emerald-400" />.
                </li>
              </ol>
            </Motion.div>
          )}

          {/* Action Buttons Row */}
          <div className="flex items-center gap-2 mt-3.5 pt-1">
            <button
              onClick={handleInstallClick}
              className="flex-1 bg-gradient-to-r from-[#6366f1] via-[#38bdf8] to-[#2dd4bf] text-slate-950 font-bold py-2.5 px-3 rounded-xl shadow-[0_0_20px_rgba(45,212,191,0.35)] hover:shadow-[0_0_30px_rgba(45,212,191,0.55)] transition-all duration-300 flex items-center justify-center gap-2 text-xs cursor-pointer active:scale-98"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install PulseChat</span>
            </button>

            <button
              onClick={handleDismiss}
              className="py-2.5 px-3.5 rounded-xl text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold transition-colors cursor-pointer"
            >
              Ignore
            </button>
          </div>
        </div>
      </Motion.aside>
    </AnimatePresence>
  );
};

export default MobileInstallPrompt;
