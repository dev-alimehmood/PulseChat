import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { errortoast, successtoast } from "../../toastify/toastify.js";
import apis from "../../config/apis";
import axios from "axios";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
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
      <div className="flex flex-col items-center text-center py-2 sm:py-4">
        
        {status === "verifying" && (
          <div className="flex flex-col items-center">
            {/* Glowing Logo with Spinner */}
            <div className="relative mb-5">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#6366f1]/30 via-[#38bdf8]/30 to-[#2dd4bf]/30 blur-xl animate-pulse" />
              <div className="relative w-18 h-18 rounded-3xl bg-[#0f152d] border border-[#38bdf8]/40 flex items-center justify-center p-3 shadow-[0_0_35px_rgba(56,189,248,0.25)]">
                <img src="/logo.png" alt="PulseChat" className="w-full h-full object-contain animate-pulse drop-shadow-[0_0_12px_rgba(56,189,248,0.5)]" />
              </div>
            </div>

            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-3.5 h-3.5 border-2 border-[#38bdf8] border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-mono text-[#38bdf8] uppercase tracking-wider font-semibold">
                Activating Account
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-1.5">
              Validating Token
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
              {message}
            </p>
          </div>
        )}

        {status === "success" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center w-full"
          >
            <div className="relative mb-5">
              <div className="absolute inset-0 rounded-full bg-[#2dd4bf]/40 blur-xl animate-pulse" />
              <div className="relative w-18 h-18 rounded-3xl bg-[#2dd4bf]/15 border border-[#2dd4bf]/40 flex items-center justify-center text-[#2dd4bf] shadow-[0_0_35px_rgba(45,212,191,0.3)]">
                <CheckCircle2 className="w-9 h-9" />
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-1.5">
              Welcome to PulseChat!
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed mb-5">
              {message} Redirecting to login...
            </p>

            <Link
              to="/login"
              className="w-full bg-gradient-to-r from-[#6366f1] via-[#38bdf8] to-[#2dd4bf] text-slate-950 font-bold py-3 rounded-2xl shadow-[0_0_25px_rgba(45,212,191,0.35)] flex justify-center items-center gap-2 text-sm"
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
            className="flex flex-col items-center w-full"
          >
            <div className="relative mb-5">
              <div className="absolute inset-0 rounded-full bg-red-500/30 blur-xl" />
              <div className="relative w-18 h-18 rounded-3xl bg-red-500/15 border border-red-500/40 flex items-center justify-center text-red-500 shadow-[0_0_35px_rgba(239,68,68,0.25)]">
                <AlertCircle className="w-9 h-9" />
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-1.5">
              Activation Error
            </h2>
            <p className="text-xs sm:text-sm text-red-400 max-w-xs leading-relaxed mb-5">
              {message}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Link
                to="/signup"
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-white/5 transition-colors text-center"
              >
                Sign Up Again
              </Link>
              <Link
                to="/login"
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#6366f1] via-[#38bdf8] to-[#2dd4bf] text-slate-950 text-xs font-bold shadow-md hover:shadow-lg transition-all text-center"
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
