import { motion as Motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const SplashScreen = ({ onComplete }) => {
  const [phase, setPhase] = useState("loading");

  useEffect(() => {
    const timer = setTimeout(() => setPhase("complete"), 1700);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {phase !== "complete" && (
        <Motion.div
          key="splash"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed inset-0 z-[9999] flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[#070b18] px-6 text-white"
          role="status"
          aria-label="Loading PulseChat"
        >
          <Motion.div
            aria-hidden="true"
            animate={{ scale: [0.9, 1.15, 0.9], opacity: [0.2, 0.42, 0.2] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute h-72 w-72 rounded-full bg-cyan-400/30 blur-[100px]"
          />

          <div className="relative flex w-full max-w-xs flex-col items-center">
            <Motion.div
              initial={{ opacity: 0, y: 12, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="relative mb-7 flex h-28 w-28 items-center justify-center rounded-[2rem] border border-white/15 bg-white/[0.07] shadow-[0_20px_70px_rgba(56,189,248,0.18)] backdrop-blur-xl"
            >
              <Motion.img
                src="/logo.png"
                alt="PulseChat"
                animate={{ scale: [1, 1.045, 1] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                className="h-20 w-20 object-contain drop-shadow-[0_0_18px_rgba(56,189,248,0.45)]"
              />
              <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full bg-emerald-400 ring-4 ring-[#070b18] shadow-[0_0_14px_rgba(52,211,153,0.8)]" />
            </Motion.div>

            <Motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.4 }}
              className="text-2xl font-bold tracking-tight"
            >
              PulseChat
            </Motion.h1>
            <p className="mt-2 text-center text-sm text-slate-400">
              Your conversations, in sync.
            </p>

            <div
              className="mt-10 h-1 w-44 overflow-hidden rounded-full bg-white/10"
              aria-hidden="true"
            >
              <Motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.7, ease: "easeInOut" }}
                className="h-full origin-left rounded-full bg-gradient-to-r from-indigo-400 via-sky-400 to-teal-300 shadow-[0_0_14px_rgba(56,189,248,0.7)]"
              />
            </div>
            <p className="mt-3 text-[11px] font-medium tracking-[0.18em] text-slate-500">
              GETTING THINGS READY
            </p>
          </div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
