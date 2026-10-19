import { useFormik } from "formik";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, CheckCircle2, UserPlus, ExternalLink } from "lucide-react";
import { SignUpSchema } from "../../Schemas/Index";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import apis from "../../config/apis";
import { errortoast, successtoast } from "../../toastify/toastify";
import { motion } from "framer-motion";
import AuthLayout from "./AuthLayout";
import { getFriendlyErrorMessage } from "../../utils/friendlyError";
import { useAuth } from "../../context/auth";

const SignUp = () => {
  const [Auth] = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if ((Auth?.token || Auth?.User) && Auth?.isReady) {
      navigate("/chatpage", { replace: true });
    }
  }, [Auth, navigate]);

  if ((Auth?.token || Auth?.User) && Auth?.isReady) {
    return null;
  }

  const [searchParams] = useSearchParams();
  const refUserId = searchParams.get("ref") || "";
  const inviteEmail = searchParams.get("email") || "";

  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const getEmailProvider = (email) => {
    if (!email) return null;
    const lower = email.toLowerCase();
    if (lower.includes("gmail")) return { name: "Gmail", url: "https://mail.google.com" };
    if (lower.includes("yahoo")) return { name: "Yahoo Mail", url: "https://mail.yahoo.com" };
    if (lower.includes("outlook") || lower.includes("hotmail")) return { name: "Outlook", url: "https://outlook.live.com" };
    if (lower.includes("icloud")) return { name: "iCloud Mail", url: "https://www.icloud.com/mail" };
    return null;
  };

  const { values, errors, handleSubmit, handleChange, handleBlur, touched } = useFormik({
    enableReinitialize: true,
    initialValues: {
      full_name: "",
      email: inviteEmail || "",
      password: "",
      confirm_password: "",
    },
    validationSchema: SignUpSchema,

    onSubmit: async (formValues, action) => {
      try {
        setLoading(true);

        const payload = { ...formValues, refUserId: refUserId || null };
        const { data } = await axios.post(`${apis.auth}/pre-signup`, payload);
        const { success, error } = data;

        if (success) {
          successtoast(success);
          setUserEmail(formValues.email);
          setEmailSent(true);
          action.resetForm();
        }

        if (error) {
          action.setFieldError("email", getFriendlyErrorMessage(error, "An account with this email already exists."));
        }
      } catch (err) {
        console.error("Signup error:", err?.response?.data || err.message);
        const friendly = getFriendlyErrorMessage(err, "Registration failed. Please check your data and try again.");
        errortoast(friendly);
      } finally {
        setLoading(false);
      }
    },
  });

  const provider = getEmailProvider(userEmail);

  // Password Requirement Indicators
  const hasUpper = /[A-Z]/.test(values.password);
  const hasLower = /[a-z]/.test(values.password);
  const hasNumber = /[0-9]/.test(values.password);
  const hasLength = values.password.length >= 6;

  return (
    <AuthLayout
      heroTitle="Step into the Next-Gen Chat Ecosystem."
      heroSubtitle="Experience true sub-50ms latency messaging, end-to-end privacy, and crystal-clear audio calls from any browser."
      cardTitle={emailSent ? "" : "Create Your Account"}
      cardSubtitle={emailSent ? "" : "Sign up in 30 seconds to connect with your team and peers."}
    >
      {emailSent ? (
        /* Email Verification Dispatched Screen */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center py-6 sm:py-8"
        >
          {/* Animated Envelope with Glow Rings */}
          <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#6366f1]/30 via-[#38bdf8]/30 to-[#2dd4bf]/30 blur-xl animate-pulse" />
            <div className="relative w-20 h-20 rounded-3xl bg-[#38bdf8]/15 border border-[#38bdf8]/40 flex items-center justify-center text-[#38bdf8] shadow-[0_0_35px_rgba(56,189,248,0.25)]">
              <Mail className="w-10 h-10 animate-bounce" style={{ animationDuration: "2s" }} />
            </div>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
            Check Your Inbox
          </h3>

          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed mb-6">
            We have dispatched an activation link to:
            <span className="block mt-1 font-mono font-bold text-sm text-[#38bdf8] bg-[#38bdf8]/10 py-1.5 px-3 rounded-xl border border-[#38bdf8]/20 mt-2">
              {userEmail}
            </span>
          </p>

          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto mb-8">
            Click the link in the email to activate your account and start chatting immediately.
          </p>

          {provider && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.open(provider.url, "_blank")}
              className="w-full bg-gradient-to-r from-[#6366f1] via-[#38bdf8] to-[#2dd4bf] text-slate-950 font-bold py-3.5 rounded-2xl shadow-[0_0_25px_rgba(45,212,191,0.35)] hover:shadow-[0_0_35px_rgba(45,212,191,0.55)] transition-all duration-300 flex justify-center items-center gap-2 text-sm cursor-pointer mb-4"
            >
              <span>Open {provider.name}</span>
              <ExternalLink className="w-4 h-4" />
            </motion.button>
          )}

          <div className="pt-4 border-t border-slate-200/80 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span>Didn't receive email? Check spam.</span>
            <button
              onClick={() => setEmailSent(false)}
              className="font-bold text-[#38bdf8] hover:text-[#2dd4bf] transition-colors"
            >
              Edit email or retry
            </button>
          </div>
        </motion.div>
      ) : (
        /* Signup Form */
        <div>
          {/* Invite Welcome Banner */}
          {refUserId && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-2xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 flex items-center gap-3.5 backdrop-blur-md"
            >
              <div className="w-10 h-10 rounded-xl bg-[#38bdf8]/10 text-[#38bdf8] flex items-center justify-center shrink-0">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Invited by a Teammate
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Complete signup to automatically connect with your inviter.
                </p>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#38bdf8] transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  name="full_name"
                  value={values.full_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Sarah Jenkins"
                  className={`w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-[#0f152d]/80 border rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#38bdf8]/20 focus:bg-white dark:focus:bg-[#121936] transition-all duration-300 shadow-sm text-sm ${
                    errors.full_name && touched.full_name
                      ? "border-red-500/80 focus:border-red-500"
                      : "border-slate-200 dark:border-white/10 focus:border-[#38bdf8]"
                  }`}
                />
              </div>
              {errors.full_name && touched.full_name && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1 font-medium pl-1">
                  {errors.full_name}
                </p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#38bdf8] transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="sarah@pulsechat.io"
                  className={`w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-[#0f152d]/80 border rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#38bdf8]/20 focus:bg-white dark:focus:bg-[#121936] transition-all duration-300 shadow-sm text-sm ${
                    errors.email && touched.email
                      ? "border-red-500/80 focus:border-red-500"
                      : "border-slate-200 dark:border-white/10 focus:border-[#38bdf8]"
                  }`}
                />
              </div>
              {errors.email && touched.email && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1 font-medium pl-1">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#38bdf8] transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="••••••••••••"
                  className={`w-full pl-12 pr-12 py-3 bg-slate-50 dark:bg-[#0f152d]/80 border rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#38bdf8]/20 focus:bg-white dark:focus:bg-[#121936] transition-all duration-300 shadow-sm text-sm ${
                    errors.password && touched.password
                      ? "border-red-500/80 focus:border-red-500"
                      : "border-slate-200 dark:border-white/10 focus:border-[#38bdf8]"
                  }`}
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

              {/* Password Requirement Badges */}
              <div className="flex flex-wrap items-center gap-2 mt-2 pt-1 text-[10px]">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono ${
                    hasUpper ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30" : "bg-slate-100 dark:bg-white/5 text-slate-400"
                  }`}
                >
                  {hasUpper ? "✓" : "•"} 1 Uppercase
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono ${
                    hasLower ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30" : "bg-slate-100 dark:bg-white/5 text-slate-400"
                  }`}
                >
                  {hasLower ? "✓" : "•"} 1 Lowercase
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono ${
                    hasNumber ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30" : "bg-slate-100 dark:bg-white/5 text-slate-400"
                  }`}
                >
                  {hasNumber ? "✓" : "•"} 1 Number
                </span>
              </div>

              {errors.password && touched.password && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1 font-medium pl-1">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Confirm Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#38bdf8] transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirm_password"
                  value={values.confirm_password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="••••••••••••"
                  className={`w-full pl-12 pr-12 py-3 bg-slate-50 dark:bg-[#0f152d]/80 border rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#38bdf8]/20 focus:bg-white dark:focus:bg-[#121936] transition-all duration-300 shadow-sm text-sm ${
                    errors.confirm_password && touched.confirm_password
                      ? "border-red-500/80 focus:border-red-500"
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
              {errors.confirm_password && touched.confirm_password && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1 font-medium pl-1">
                  {errors.confirm_password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-gradient-to-r from-[#6366f1] via-[#38bdf8] to-[#2dd4bf] text-slate-950 font-bold py-3.5 rounded-2xl shadow-[0_0_25px_rgba(45,212,191,0.35)] hover:shadow-[0_0_40px_rgba(45,212,191,0.55)] transition-all duration-300 flex justify-center items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          {/* Switch to Login */}
          <div className="pt-5 mt-5 text-center border-t border-slate-200/80 dark:border-white/10">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#818cf8] via-[#38bdf8] to-[#2dd4bf] hover:opacity-80 transition-opacity"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      )}
    </AuthLayout>
  );
};

export default SignUp;