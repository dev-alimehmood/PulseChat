import { useState } from "react";
import { Formik, Form, Field } from "formik";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import apis from "../../config/apis";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, ShieldCheck, CheckCircle2, ArrowRight, AlertCircle, Check } from "lucide-react";
import AuthLayout from "./AuthLayout";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverMessage, setServerMessage] = useState({ type: "", text: "" });

  const calculateStrength = (pass) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score += 25;
    if (/[A-Z]/.test(pass)) score += 25;
    if (/[0-9]/.test(pass)) score += 25;
    if (/[^A-Za-z0-9]/.test(pass)) score += 25;
    return score;
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setServerMessage({ type: "", text: "" });

    if (!values.password || !values.confirm_password) {
      setServerMessage({ type: "error", text: "Please fill out both password fields." });
      setSubmitting(false);
      return;
    }

    if (values.password !== values.confirm_password) {
      setServerMessage({ type: "error", text: "Passwords do not match." });
      setSubmitting(false);
      return;
    }

    try {
      const { data } = await axios.put(`${apis.auth}/reset-password/${token}`, values);
      const { error, warning, success } = data;

      if (error) {
        setServerMessage({ type: "error", text: error });
      } else if (warning) {
        setServerMessage({ type: "warning", text: warning });
      } else if (success) {
        setServerMessage({ type: "success", text: success });
        setTimeout(() => {
          navigate("/success");
        }, 1500);
      }
    } catch (err) {
      console.error("Reset password error:", err?.response?.data || err.message);
      setServerMessage({
        type: "error",
        text: err?.response?.data?.message || err?.response?.data?.error || "Failed to reset password. Link may have expired.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const resetHeroWidget = (
    <div className="space-y-3 pt-2">
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-3 shadow-xl">
        <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#38bdf8]" />
            <span className="text-xs font-bold text-white tracking-wide">Security Recommendations</span>
          </div>
          <span className="text-[10px] font-mono text-[#38bdf8] bg-[#38bdf8]/10 px-2 py-0.5 rounded-full border border-[#38bdf8]/20">
            PRO-TIPS
          </span>
        </div>
        
        <p className="text-xs text-slate-200 leading-relaxed font-normal">
          Use a unique password with mixed alphanumeric characters and symbols that you haven't used on other platforms.
        </p>

        <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-slate-300">
          <div className="flex items-center gap-1.5 text-[#2dd4bf]">
            <CheckCircle2 className="w-3.5 h-3.5" /> 8+ Characters
          </div>
          <div className="flex items-center gap-1.5 text-cyan-300">
            <CheckCircle2 className="w-3.5 h-3.5" /> Numbers & Symbols
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AuthLayout
      heroTitle="Secure Your PulseChat Identity."
      heroSubtitle="Create a new, resilient password to safeguard your chat history, voice exchanges, and shared media files."
      cardTitle="Reset Password"
      cardSubtitle="Enter and confirm your new account password to complete the reset procedure."
      heroWidget={resetHeroWidget}
    >
      {/* Server Message Banner */}
      {serverMessage.text && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 mb-6 rounded-2xl border text-xs sm:text-sm font-semibold flex items-center gap-3 backdrop-blur-xl ${
            serverMessage.type === "error"
              ? "bg-red-500/10 text-red-500 border-red-500/30"
              : serverMessage.type === "warning"
              ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
              : "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
          }`}
        >
          {serverMessage.type === "error" ? (
            <AlertCircle className="w-5 h-5 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          )}
          <span>{serverMessage.text}</span>
        </motion.div>
      )}

      <Formik
        initialValues={{ password: "", confirm_password: "" }}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, handleBlur, isSubmitting }) => {
          const strength = calculateStrength(values.password);
          const passwordsMatch =
            values.password &&
            values.confirm_password &&
            values.password === values.confirm_password;

          return (
            <Form className="space-y-5">
              
              {/* New Password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  New Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#38bdf8] transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <Field
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••••••"
                    required
                    className="w-full pl-12 pr-12 py-3.5 bg-slate-50 dark:bg-[#0f152d]/80 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/20 focus:bg-white dark:focus:bg-[#121936] transition-all duration-300 shadow-sm text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Strength Meter */}
                {values.password && (
                  <div className="mt-2.5 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-500 dark:text-slate-400">Password Strength</span>
                      <span
                        className={`font-bold ${
                          strength < 50
                            ? "text-red-400"
                            : strength < 100
                            ? "text-amber-400"
                            : "text-[#2dd4bf]"
                        }`}
                      >
                        {strength < 50 ? "Weak" : strength < 100 ? "Medium" : "Strong"}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 rounded-full ${
                          strength < 50
                            ? "bg-red-500"
                            : strength < 100
                            ? "bg-amber-400"
                            : "bg-gradient-to-r from-[#38bdf8] to-[#2dd4bf]"
                        }`}
                        style={{ width: `${strength}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Confirm New Password
                  </label>
                  {passwordsMatch && (
                    <span className="text-[11px] font-mono text-[#2dd4bf] inline-flex items-center gap-1 font-semibold">
                      <Check className="w-3.5 h-3.5" /> Matched
                    </span>
                  )}
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#38bdf8] transition-colors">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <Field
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirm_password"
                    placeholder="••••••••••••"
                    required
                    className={`w-full pl-12 pr-12 py-3.5 bg-slate-50 dark:bg-[#0f152d]/80 border rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#38bdf8]/20 focus:bg-white dark:focus:bg-[#121936] transition-all duration-300 shadow-sm text-sm ${
                      passwordsMatch
                        ? "border-[#2dd4bf]/70 focus:border-[#2dd4bf]"
                        : "border-slate-200 dark:border-white/10 focus:border-[#38bdf8]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 bg-gradient-to-r from-[#6366f1] via-[#38bdf8] to-[#2dd4bf] text-slate-950 font-bold py-3.5 rounded-2xl shadow-[0_0_25px_rgba(45,212,191,0.35)] hover:shadow-[0_0_40px_rgba(45,212,191,0.55)] transition-all duration-300 flex justify-center items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Updating Password...</span>
                  </div>
                ) : (
                  <>
                    <span>Confirm New Password</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>

              {/* Back to Login Link */}
              <div className="pt-4 text-center border-t border-slate-200/80 dark:border-white/10">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-[#38bdf8] transition-colors"
                >
                  Cancel and return to Login
                </Link>
              </div>
            </Form>
          );
        }}
      </Formik>
    </AuthLayout>
  );
};

export default ResetPassword;
