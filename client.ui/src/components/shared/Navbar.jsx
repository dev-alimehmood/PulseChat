import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/auth";
import {
  MessageSquare,
  Home,
  Radio,
  ShieldCheck,
  Users,
  FileText,
  Sun,
  Moon,
  ArrowRight,
  Bot,
  Film
} from "lucide-react";

const Navbar = () => {
  const [Auth] = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === "/";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-3xl bg-[#090d1b]/95 border-b border-white/10 shadow-2xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#6366f1] via-[#38bdf8] to-[#2dd4bf] p-[1.5px] shadow-[0_0_25px_rgba(45,212,191,0.3)] group-hover:shadow-[0_0_35px_rgba(56,189,248,0.5)] group-hover:scale-105 transition-all duration-300">
                <div className="w-full h-full bg-[#0b1021] rounded-[14px] flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-[#38bdf8] group-hover:text-[#2dd4bf] transition-colors" />
                </div>
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#2dd4bf] rounded-full ring-4 ring-[#090d1b] animate-pulse" />
            </div>

            <span className="text-2xl font-black tracking-tight text-white font-sans">
              PulseChat
            </span>
          </Link>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <Link
            to="/"
            className={`transition-colors flex items-center gap-2 group ${
              isHome ? "text-[#34d399] font-bold" : "hover:text-[#34d399]"
            }`}
          >
            <Home className="w-4 h-4 text-[#818cf8] group-hover:text-[#34d399] transition-colors" />
            <span>Home</span>
          </Link>
          <button
            onClick={() => {
              window.dispatchEvent(new Event("open-pulse-ai"));
            }}
            className="hover:text-[#34d399] transition-colors flex items-center gap-2 group cursor-pointer"
          >
            <Bot className="w-4 h-4 text-[#38bdf8] group-hover:text-[#34d399] transition-colors" />
            <span>Pulse AI</span>
          </button>
          <Link
            to="/security"
            className={`transition-colors flex items-center gap-2 group ${
              location.pathname === "/security" ? "text-[#34d399] font-bold" : "hover:text-[#34d399]"
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[#2dd4bf] group-hover:text-[#34d399] transition-colors" />
            <span>Security</span>
          </Link>
          <Link
            to="/team"
            className={`transition-colors flex items-center gap-2 group ${
              location.pathname === "/team" ? "text-[#34d399] font-bold" : "hover:text-[#34d399]"
            }`}
          >
            <Users className="w-4 h-4 text-[#818cf8] group-hover:text-[#34d399] transition-colors" />
            <span>Our Team</span>
          </Link>
          <Link
            to="/founder-documentary"
            className={`transition-colors flex items-center gap-2 group ${
              location.pathname === "/founder-documentary" ? "text-[#34d399] font-bold" : "hover:text-[#34d399]"
            }`}
          >
            <Film className="w-4 h-4 text-[#38bdf8] group-hover:text-[#34d399] transition-colors" />
            <span>Documentary</span>
          </Link>
          <Link
            to="/blog"
            className={`transition-colors flex items-center gap-2 group ${
              location.pathname === "/blog" ? "text-[#34d399] font-bold" : "hover:text-[#34d399]"
            }`}
          >
            <FileText className="w-4 h-4 text-[#34d399] group-hover:text-[#34d399] transition-colors" />
            <span>Blog</span>
          </Link>
        </nav>

        {/* Action CTAs */}
        <div className="flex items-center gap-4">
          {Auth?.User ? (
            <button
              onClick={() => navigate("/chatpage")}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#6366f1] via-[#38bdf8] to-[#2dd4bf] text-white font-semibold shadow-[0_0_25px_rgba(45,212,191,0.35)] hover:shadow-[0_0_35px_rgba(45,212,191,0.5)] transition-all transform hover:-translate-y-0.5 text-sm border border-white/20"
            >
              <span>Launch Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden sm:inline-flex px-4 py-2.5 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#6366f1] via-[#38bdf8] to-[#2dd4bf] text-white font-semibold text-sm shadow-[0_0_25px_rgba(45,212,191,0.35)] hover:shadow-[0_0_35px_rgba(45,212,191,0.5)] transition-all transform hover:-translate-y-0.5 border border-white/20"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
