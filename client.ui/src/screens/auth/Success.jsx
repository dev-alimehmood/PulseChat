import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import AuthLayout from "./AuthLayout";

const Success = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : 1));
    }, 1000);

    const timer = setTimeout(() => {
      navigate("/login");
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <AuthLayout centered={true}>
      <div className="flex flex-col items-center text-center py-4 sm:py-6">
        
        {/* Animated Success Badge */}
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#2dd4bf]/40 via-[#38bdf8]/30 to-[#6366f1]/30 blur-xl animate-pulse" />
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
            className="relative w-20 h-20 rounded-3xl bg-[#2dd4bf]/15 border border-[#2dd4bf]/40 flex items-center justify-center text-[#2dd4bf] shadow-[0_0_35px_rgba(45,212,191,0.3)]"
          >
            <CheckCircle2 className="w-10 h-10 text-[#2dd4bf]" />
          </motion.div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2dd4bf]/10 border border-[#2dd4bf]/30 text-xs font-semibold text-[#2dd4bf] mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Security Verified</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-3">
          Password Updated!
        </h2>

        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
          Your credentials have been safely encrypted and saved. Your account is ready for sign in.
        </p>

        {/* Countdown Badge */}
        <div className="p-3 mb-8 w-full rounded-2xl bg-slate-100 dark:bg-[#0f152d]/80 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-600 dark:text-slate-300 flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#2dd4bf] animate-ping" />
          <span>Redirecting to login in <strong className="text-[#38bdf8]">{countdown}s</strong>...</span>
        </div>

        {/* Direct Action Button */}
        <Link
          to="/login"
          className="w-full bg-gradient-to-r from-[#6366f1] via-[#38bdf8] to-[#2dd4bf] text-slate-950 font-bold py-3.5 rounded-2xl shadow-[0_0_25px_rgba(45,212,191,0.35)] hover:shadow-[0_0_40px_rgba(45,212,191,0.55)] transition-all duration-300 flex justify-center items-center gap-2 text-sm group"
        >
          <span>Sign In Immediately</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </AuthLayout>
  );
};

export default Success;
