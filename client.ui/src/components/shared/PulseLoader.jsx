import React from "react";
import { motion } from "framer-motion";

/**
 * PulseLoader — Signature Themed Animated Loading Experience
 * 
 * Theme Attributes:
 * - Animated ECG Heartbeat Waveform (Cyan / Neon Red glow)
 * - Breathing PulseChat 3D Emblem with radial cyan/indigo aura
 * - Shimmering gradient progress track
 * - Adaptive light/dark glassmorphic container
 * 
 * Props:
 * @param {"fullscreen" | "page" | "card" | "inline"} variant - Display mode
 * @param {string} message - Human-friendly status text
 * @param {string} subtext - Optional subtle caption
 * @param {"sm" | "md" | "lg"} size - Emblem scale
 * @param {boolean} showCard - Whether to wrap in a glass card (default true for page/card)
 */
export default function PulseLoader({
  variant = "page",
  message = "Loading...",
  subtext = "",
  size = "md",
  showCard = true,
  className = "",
}) {
  const isFullscreen = variant === "fullscreen";
  const isInline = variant === "inline";

  // Size mapping for logo emblem
  const logoDimensions = {
    sm: "w-10 h-10",
    md: "w-14 h-14",
    lg: "w-20 h-20",
  }[size] || "w-14 h-14";

  const loaderContent = (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      
      {/* ── 1. Breathing Ambient Glow Aura ── */}
      <motion.div
        animate={{
          scale: [0.85, 1.15, 0.85],
          opacity: [0.35, 0.65, 0.35],
        }}
        transition={{
          duration: 2.4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute w-44 h-44 rounded-full bg-gradient-to-tr from-[#6366f1]/30 via-[#38bdf8]/35 to-[#2dd4bf]/25 blur-3xl pointer-events-none"
      />

      {/* ── 2. Floating 3D Logo Emblem with Pulse Rhythm ── */}
      <div className="relative mb-4">
        {/* Soft background tile */}
        <motion.div
          animate={{
            y: [-2, 2, -2],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative rounded-3xl p-3 bg-white/80 dark:bg-[#0c1228]/85 backdrop-blur-2xl border border-slate-200/90 dark:border-white/10 shadow-xl shadow-slate-200/60 dark:shadow-black/60 flex items-center justify-center"
        >
          <motion.img
            src="/logo.png"
            alt="PulseChat"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={`${logoDimensions} object-contain drop-shadow-[0_0_14px_rgba(56,189,248,0.5)]`}
          />

          {/* Active Emerald Vital Dot */}
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]"></span>
          </span>
        </motion.div>
      </div>

      {/* ── 3. Animated ECG Pulse Waveform ── */}
      <div className="w-36 h-8 relative flex items-center justify-center my-1 overflow-hidden">
        <svg
          viewBox="0 0 160 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Subtle background baseline */}
          <path
            d="M0 18 H50 L56 6 L64 30 L72 10 L80 24 L86 18 H160"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-slate-200 dark:text-white/10"
          />

          {/* Animated Glowing ECG Stroke */}
          <motion.path
            d="M0 18 H50 L56 6 L64 30 L72 10 L80 24 L86 18 H160"
            stroke="url(#pulse-gradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, pathOffset: 0 }}
            animate={{
              pathLength: [0.15, 0.45, 0.15],
              pathOffset: [0, 1],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              filter: "drop-shadow(0 0 6px rgba(56, 189, 248, 0.8))",
            }}
          />

          <defs>
            <linearGradient id="pulse-gradient" x1="0" y1="0" x2="160" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.2" />
              <stop offset="45%" stopColor="#ef4444" />
              <stop offset="65%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#2dd4bf" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* ── 4. Shimmering Linear Progress Track ── */}
      <div className="w-40 h-1 bg-slate-200/80 dark:bg-white/10 rounded-full overflow-hidden mt-2 relative">
        <motion.div
          animate={{
            x: ["-100%", "150%"],
          }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-1/2 h-full bg-gradient-to-r from-transparent via-[#38bdf8] to-transparent rounded-full shadow-[0_0_10px_rgba(56,189,248,0.8)]"
        />
      </div>

      {/* ── 5. Human-Friendly Message & Subtext ── */}
      {message && (
        <p className="text-xs sm:text-sm font-semibold tracking-tight text-slate-700 dark:text-slate-200 mt-3 text-center">
          {message}
        </p>
      )}

      {subtext && (
        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 text-center max-w-xs">
          {subtext}
        </p>
      )}

    </div>
  );

  // Fullscreen view
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50/85 dark:bg-[#070b18]/90 backdrop-blur-xl p-4">
        {showCard ? (
          <div className="p-8 sm:p-10 rounded-3xl bg-white/70 dark:bg-[#0c1228]/70 border border-slate-200/80 dark:border-white/10 shadow-2xl backdrop-blur-2xl max-w-sm w-full flex flex-col items-center">
            {loaderContent}
          </div>
        ) : (
          loaderContent
        )}
      </div>
    );
  }

  // Inline view
  if (isInline) {
    return loaderContent;
  }

  // Page / Section view
  return (
    <div className="min-h-[50vh] w-full flex items-center justify-center p-6">
      {showCard ? (
        <div className="p-8 sm:p-10 rounded-3xl bg-white/60 dark:bg-[#0c1228]/60 border border-slate-200/70 dark:border-white/10 shadow-xl backdrop-blur-2xl max-w-sm w-full flex flex-col items-center">
          {loaderContent}
        </div>
      ) : (
        loaderContent
      )}
    </div>
  );
}
