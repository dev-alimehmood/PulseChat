import React from "react";
import { motion } from "framer-motion";

const SIZE_MAP = {
  xs: "w-5 h-5",
  sm: "w-7 h-7",
  md: "w-9 h-9",
  lg: "w-12 h-12",
  xl: "w-16 h-16",
  "2xl": "w-20 h-20",
  hero: "w-24 h-24 sm:w-28 sm:h-28",
};

export default function PulseLogo({
  size = "md",
  showText = false,
  animated = false,
  badge = false,
  className = "",
  onClick,
}) {
  const sizeClass = SIZE_MAP[size] || size;

  const logoImage = (
    <motion.img
      src="/logo.png"
      alt="PulseChat Official Logo"
      whileHover={animated ? { scale: 1.08, rotate: [0, -3, 3, 0] } : undefined}
      whileTap={animated ? { scale: 0.95 } : undefined}
      transition={{ duration: 0.3 }}
      className={`object-contain select-none pointer-events-none transition-all duration-300 drop-shadow-md dark:drop-shadow-[0_0_14px_rgba(56,189,248,0.4)] ${sizeClass} ${className}`}
    />
  );

  const content = badge ? (
    <div className="relative inline-flex items-center justify-center p-2 rounded-2xl bg-white/70 dark:bg-[#0c1228]/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-lg shadow-slate-200/50 dark:shadow-black/50 group">
      {logoImage}
    </div>
  ) : (
    logoImage
  );

  if (!showText) {
    return onClick ? (
      <button onClick={onClick} className="inline-flex items-center justify-center cursor-pointer focus:outline-none">
        {content}
      </button>
    ) : (
      content
    );
  }

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-3 select-none ${onClick ? "cursor-pointer" : ""}`}
    >
      {content}
      <div className="flex flex-col">
        <span className="text-xl sm:text-2xl font-black tracking-tight font-sans leading-none flex items-center">
          <span className="bg-gradient-to-r from-red-500 via-rose-500 to-indigo-500 bg-clip-text text-transparent">
            Pulse
          </span>
          <span className="bg-gradient-to-r from-sky-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
            Chat
          </span>
        </span>
        <span className="text-[9px] font-mono tracking-[0.25em] text-slate-400 dark:text-slate-500 uppercase font-bold mt-0.5">
          Realtime Encrypted
        </span>
      </div>
    </div>
  );
}
