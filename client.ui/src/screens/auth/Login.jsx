import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowRight, ShieldCheck, Zap, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import apis from "../../config/apis";
import { errortoast, successtoast, warningtoast } from "../../toastify/toastify";
import { useAuth } from "../../context/auth";
import { motion } from "framer-motion";
import AuthLayout from "./AuthLayout";
import { getFriendlyErrorMessage } from "../../utils/friendlyError";

const Login = () => {
  const [Auth, setAuth] = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if ((Auth?.token || Auth?.User) && Auth?.isReady) {
      navigate("/chatpage", { replace: true });
    }
  }, [Auth, navigate]);

  if ((Auth?.token || Auth?.User) && Auth?.isReady) {
    return null;
  }

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const changehandler = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
  };

  const loginhandler = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!user.email || !user.password) {
      const msg = "Please provide both email and password";
      setErrorMessage(msg);
      warningtoast(msg);
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post(`${apis.auth}/login`, user);
      const { error, warning, success } = data;

      if (error) {
        const friendly = getFriendlyErrorMessage(error, "Login failed. Please verify your credentials.");
        setErrorMessage(friendly);
        errortoast(friendly);
        setLoading(false);
        return;
      }

      if (warning) {
        warningtoast(warning);
        setLoading(false);
        return;
      }

      if (success) {
        const userData = data.User || data.user;

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(userData));

        setAuth({
          User: userData,
          token: data.token,
          isReady: true,
        });

        successtoast(success);
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err?.response?.data || err.message);
      const friendly = getFriendlyErrorMessage(err, "Login failed. Please verify your credentials.");
      setErrorMessage(friendly);
      errortoast(friendly);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      heroTitle="Real-time communication, elevated to perfection."
      heroSubtitle="Log back into PulseChat to stay connected with your team, enjoy crystal-clear audio, and experience military-grade privacy."
      cardTitle="Welcome Back"
      cardSubtitle="Enter your account credentials to access your conversations."
    >
      <form onSubmit={loginhandler} className="space-y-3.5 sm:space-y-4">
        
        {/* Inline Error Notice */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2.5 leading-relaxed shadow-sm"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
            <span className="font-medium">{errorMessage}</span>
          </motion.div>
        )}

        {/* Email Address */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Email Address
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#38bdf8] transition-colors">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={changehandler}
              placeholder="alex@pulsechat.io"
              required
              autoComplete="email"
              className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-slate-50 dark:bg-[#0f152d]/80 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/20 focus:bg-white dark:focus:bg-[#121936] transition-all duration-300 shadow-sm text-xs sm:text-sm"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Password
            </label>
            <Link
              to="/forgetpassword"
              className="text-xs font-semibold text-[#6366f1] dark:text-[#38bdf8] hover:text-[#2dd4bf] transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#38bdf8] transition-colors">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={user.password}
              onChange={changehandler}
              placeholder="••••••••••••"
              required
              autoComplete="current-password"
              className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-slate-50 dark:bg-[#0f152d]/80 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/20 focus:bg-white dark:focus:bg-[#121936] transition-all duration-300 shadow-sm text-xs sm:text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center justify-between pt-0.5">
          <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-600 dark:text-slate-400">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-[#38bdf8] focus:ring-[#38bdf8] bg-slate-100 dark:bg-slate-800"
            />
            <span>Keep me logged in on this browser</span>
          </label>
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="w-full mt-2 bg-gradient-to-r from-[#6366f1] via-[#38bdf8] to-[#2dd4bf] text-slate-950 font-bold py-3 rounded-2xl shadow-[0_0_25px_rgba(45,212,191,0.35)] hover:shadow-[0_0_40px_rgba(45,212,191,0.55)] transition-all duration-300 flex justify-center items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              <span>Authenticating...</span>
            </div>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </motion.button>

        {/* Switch to Signup */}
        <div className="pt-3.5 text-center border-t border-slate-200/80 dark:border-white/10">
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Don't have an account yet?{" "}
            <Link
              to="/signup"
              className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#818cf8] via-[#38bdf8] to-[#2dd4bf] hover:opacity-80 transition-opacity"
            >
              Create Account
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;
