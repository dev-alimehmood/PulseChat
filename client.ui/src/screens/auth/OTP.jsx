import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import OtpInput from "react-otp-input";
import apis from "../../config/apis";
import axios from "axios";
import { motion } from "framer-motion";
import { KeyRound, ArrowRight, RefreshCw, CheckCircle2, ShieldAlert } from "lucide-react";
import { errortoast, successtoast, warningtoast } from "../../toastify/toastify";
import AuthLayout from "./AuthLayout";

const OTP = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ otp: "" });
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const changeHandler = (otp) => {
    setUser({ otp });
  };

  const otphandler = async (e) => {
    if (e) e.preventDefault();
    if (!user.otp || user.otp.length < 5) {
      warningtoast("Please enter all 5 digits of your verification code");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(`${apis.auth}/otp`, user);
      if (data.error) {
        errortoast(data.error);
      }
      if (data.warning) {
        warningtoast(data.warning);
      }
      if (data.success) {
        successtoast(data.success.message || "OTP verified successfully");
        const token = data.success.token || "";
        setTimeout(() => {
          navigate(`/resetpassword/${token}`);
        }, 1500);
      }
    } catch (err) {
      console.error("OTP verification error:", err?.response?.data || err.message);
      errortoast(err?.response?.data?.message || err?.response?.data?.error || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const otpHeroWidget = (
    <div className="space-y-3 pt-2">
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-3 shadow-xl">
        <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#38bdf8]" />
            <span className="text-xs font-bold text-white tracking-wide">Anti-Tamper Token Validation</span>
          </div>
          <span className="text-[10px] font-mono text-[#2dd4bf] bg-[#2dd4bf]/10 px-2 py-0.5 rounded-full border border-[#2dd4bf]/20">
            ENCRYPTED
          </span>
        </div>
        
        <p className="text-xs text-slate-200 leading-relaxed font-normal">
          Every OTP is matched against your active session hash. Once confirmed, you will be granted immediate access to configure your new password.
        </p>

        <div className="flex items-center gap-2 text-[11px] text-[#2dd4bf] pt-1">
          <CheckCircle2 className="w-3.5 h-3.5" /> Direct SSL Handshake
        </div>
      </div>
    </div>
  );

  return (
    <AuthLayout
      heroTitle="Validate Your Authorized Session."
      heroSubtitle="Confirm your identity with the 5-digit verification code sent to your email to safely regain access to your conversations."
      cardTitle="Enter Verification Code"
      cardSubtitle="Type in the 5-digit security code dispatched to your registered email address."
      heroWidget={otpHeroWidget}
    >
      <form onSubmit={otphandler} className="space-y-4 sm:space-y-4.5">
        
        {/* Visual Key Emblem */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#6366f1]/20 via-[#38bdf8]/20 to-[#2dd4bf]/20 border border-[#38bdf8]/40 flex items-center justify-center text-[#38bdf8] shadow-[0_0_20px_rgba(56,189,248,0.2)]">
              <KeyRound className="w-6 h-6" />
            </div>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-white dark:border-[#0c1228]" />
          </div>
        </div>

        {/* OTP Input Container */}
        <div className="flex justify-center w-full py-1" dir="ltr">
          <OtpInput
            value={user.otp}
            onChange={changeHandler}
            numInputs={5}
            shouldAutoFocus
            inputType="tel"
            renderSeparator={<span className="w-2 sm:w-2.5" />}
            renderInput={(props) => (
              <input
                {...props}
                className="!w-11 h-13 sm:!w-13 sm:h-14 bg-slate-50 dark:bg-[#0f152d]/90 rounded-2xl border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xl sm:text-2xl font-black font-mono text-center focus:outline-none focus:ring-2 focus:ring-[#38bdf8]/30 focus:border-[#38bdf8] focus:bg-white dark:focus:bg-[#131b3b] transition-all duration-300 shadow-sm"
              />
            )}
            containerStyle="flex justify-center items-center"
          />
        </div>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading || user.otp.length < 5}
          className="w-full bg-gradient-to-r from-[#6366f1] via-[#38bdf8] to-[#2dd4bf] text-slate-950 font-bold py-3 rounded-2xl shadow-[0_0_25px_rgba(45,212,191,0.35)] hover:shadow-[0_0_40px_rgba(45,212,191,0.55)] transition-all duration-300 flex justify-center items-center gap-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed group cursor-pointer"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              <span>Verifying Code...</span>
            </div>
          ) : (
            <>
              <span>Verify & Continue</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </motion.button>

        {/* Resend & Back Navigation */}
        <div className="pt-3.5 border-t border-slate-200/80 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div>
            Didn't receive code?{" "}
            {resendCooldown > 0 ? (
              <span className="font-mono text-[#38bdf8]">Resend in {resendCooldown}s</span>
            ) : (
              <Link
                to="/forgetpassword"
                className="font-bold text-[#38bdf8] hover:text-[#2dd4bf] inline-flex items-center gap-1 transition-colors"
              >
                <RefreshCw className="w-3 h-3" /> Resend Code
              </Link>
            )}
          </div>

          <Link
            to="/login"
            className="font-bold text-slate-700 dark:text-slate-300 hover:text-[#38bdf8] transition-colors"
          >
            Back to Sign In
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default OTP;
