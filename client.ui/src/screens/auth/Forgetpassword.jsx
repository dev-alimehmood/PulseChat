import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowRight, ShieldCheck, KeyRound, Clock, CheckCircle2 } from "lucide-react";
import axios from "axios";
import apis from "../../config/apis";
import { errortoast, successtoast, warningtoast } from "../../toastify/toastify";
import { motion } from "framer-motion";
import AuthLayout from "./AuthLayout";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: "" });
  const [loading, setLoading] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const changehandler = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const forgethandler = async (e) => {
    e.preventDefault();
    if (!user.email) {
      warningtoast("Please enter your registered email address");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(`${apis.auth}/forget-password`, user);
      const { error, warning, success } = data;

      if (error) {
        errortoast(error);
        return;
      }
      if (warning) {
        warningtoast(warning);
        return;
      }
      if (success) {
        successtoast(success);
        setSubmittedEmail(user.email);
        setTimeout(() => {
          navigate("/otp");
        }, 1500);
      }
    } catch (err) {
      console.error("Forget password error:", err?.response?.data || err.message);
      errortoast(err?.response?.data?.message || err?.response?.data?.error || "Failed to send recovery OTP");
    } finally {
      setLoading(false);
    }
  };

  const securityHeroWidget = (
    <div className="space-y-3 pt-2">
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-3 shadow-xl">
        <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-[#38bdf8]" />
            <span className="text-xs font-bold text-white tracking-wide">Multi-Layer Identity Verification</span>
          </div>
          <span className="text-[10px] font-mono text-[#2dd4bf] bg-[#2dd4bf]/10 px-2 py-0.5 rounded-full border border-[#2dd4bf]/20">
            SECURE
          </span>
        </div>
        
        <p className="text-xs text-slate-200 leading-relaxed font-normal">
          For your account security, recovery tokens are cryptographically randomized, valid for 10 minutes, and strictly single-use.
        </p>

        <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-slate-300">
          <div className="flex items-center gap-1.5 text-cyan-300">
            <Clock className="w-3.5 h-3.5" /> 10-Min Expiry
          </div>
          <div className="flex items-center gap-1.5 text-[#2dd4bf]">
            <CheckCircle2 className="w-3.5 h-3.5" /> Direct Email Delivery
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AuthLayout
      heroTitle="Recover and Reclaim Your Account."
      heroSubtitle="Forgot your credentials? We've got you covered. Provide your email address and we'll instantly generate an authorized 5-digit verification code."
      cardTitle="Reset Password"
      cardSubtitle="Enter your registered email address to receive an instant verification code."
      heroWidget={securityHeroWidget}
    >
      <form onSubmit={forgethandler} className="space-y-5">
        
        {/* Email Address */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            Registered Email Address
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#38bdf8] transition-colors">
              <Mail className="w-5 h-5" />
            </div>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={changehandler}
              placeholder="alex@pulsechat.io"
              required
              autoComplete="email"
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-[#0f152d]/80 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/20 focus:bg-white dark:focus:bg-[#121936] transition-all duration-300 shadow-sm text-sm"
            />
          </div>
        </div>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="w-full mt-2 bg-gradient-to-r from-[#6366f1] via-[#38bdf8] to-[#2dd4bf] text-slate-950 font-bold py-3.5 rounded-2xl shadow-[0_0_25px_rgba(45,212,191,0.35)] hover:shadow-[0_0_40px_rgba(45,212,191,0.55)] transition-all duration-300 flex justify-center items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              <span>Generating Code...</span>
            </div>
          ) : (
            <>
              <span>Send Verification Code</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </motion.button>

        {/* Back to Login Link */}
        <div className="pt-4 text-center border-t border-slate-200/80 dark:border-white/10">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Remembered your password?{" "}
            <Link
              to="/login"
              className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#818cf8] via-[#38bdf8] to-[#2dd4bf] hover:opacity-80 transition-opacity"
            >
              Back to Sign In
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
