import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { errortoast, successtoast } from "../../toastify/toastify.js";
import apis from "../../config/apis";
import axios from "axios";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, ArrowRight, Sparkles } from "lucide-react";
import AuthLayout from "./AuthLayout";

const Activateaccount = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // 'verifying' | 'success' | 'error'
  const [message, setMessage] = useState("Verifying security token and preparing your account...");
  const hasCalled = useRef(false);

  useEffect(() => {
    if (!token || hasCalled.current) return;
    hasCalled.current = true;

    const createaccount = async () => {
      try {
        const { data } = await axios.post(`${apis.auth}/signup`, { token });
        const { error, success } = data;

        if (error) {
          setStatus("error");
          setMessage(error);
          errortoast(error);
        } else if (success) {
          setStatus("success");
          setMessage(success);
          successtoast(success);
          setTimeout(() => {
            navigate("/login");
          }, 2500);
        }
      } catch (err) {
        setStatus("error");
        const errMsg = err?.response?.data?.message || err?.response?.data?.error || "Activation failed or link expired.";
        setMessage(errMsg);
        errortoast(errMsg);
      }
    };

    createaccount();
  }, [token, navigate]);

  return (
    <AuthLayout centered={true}>
      <div className="flex flex-col items-center text-center py-6">
        
        {status === "verifying" && (
          <div className="flex flex-col items-center">
            {/* Glowing Logo with Spinner */}
            <div className="relative mb-6">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#6366f1]/30 via-[#38bdf8]/30 to-[#2dd4bf]/30 blur-xl animate-pulse" />
              <div className="relative w-20 h-20 rounded-3xl bg-[#0f152d] border border-[#38bdf8]/40 flex items-center justify-center text-3xl shadow-[0_0_35px_rgba(56,189,248,0.25)]">
                <span className="animate-pulse">🫀</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <div className="w-4 h-4 border-2 border-[#38bdf8] border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-mono text-[#38bdf8] uppercase tracking-wider font-semibold">
                Activating Account
              </span>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Validating Token
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
              {message}
            </p>
          </div>
        )}

        {status === "success" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center"
          >
            <div className="relative mb-6">
              <div className="absolute inset-0 rounded-full bg-[#2dd4bf]/40 blur-xl animate-pulse" />
              <div className="relative w-20 h-20 rounded-3xl bg-[#2dd4bf]/15 border border-[#2dd4bf]/40 flex items-center justify-center text-[#2dd4bf] shadow-[0_0_35px_rgba(45,212,191,0.3)]">
                <CheckCircle2 className="w-10 h-10" />
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2dd4bf]/10 border border-[#2dd4bf]/30 text-xs font-semibold text-[#2dd4bf] mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verified & Active</span>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Welcome to PulseChat!
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed mb-6">
              {message} Redirecting to login...
            </p>

            <Link
              to="/login"
              className="w-full bg-gradient-to-r from-[#6366f1] via-[#38bdf8] to-[#2dd4bf] text-slate-950 font-bold py-3.5 rounded-2xl shadow-[0_0_25px_rgba(45,212,191,0.35)] flex justify-center items-center gap-2 text-sm"
            >
              <span>Go to Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center"
          >
            <div className="relative mb-6">
              <div className="absolute inset-0 rounded-full bg-red-500/30 blur-xl" />
              <div className="relative w-20 h-20 rounded-3xl bg-red-500/15 border border-red-500/40 flex items-center justify-center text-red-500 shadow-[0_0_35px_rgba(239,68,68,0.25)]">
                <AlertCircle className="w-10 h-10" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Activation Error
            </h2>
            <p className="text-sm text-red-400 max-w-xs leading-relaxed mb-6">
              {message}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Link
                to="/signup"
                className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-white/5 transition-colors"
              >
                Sign Up Again
              </Link>
              <Link
                to="/login"
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#6366f1] via-[#38bdf8] to-[#2dd4bf] text-slate-950 text-xs font-bold shadow-md hover:shadow-lg transition-all"
              >
                Go to Login
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </AuthLayout>
  );
};

export default Activateaccount;
