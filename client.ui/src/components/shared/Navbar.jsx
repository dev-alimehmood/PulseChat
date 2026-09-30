import { useState } from "react";
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
  Film,
  Menu,
  X
} from "lucide-react";

const Navbar = () => {
  const [Auth] = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isHome = location.pathname === "/";

  const closeMenu = () => setIsMobileMenuOpen(false);

  const handlePulseAiClick = () => {
    closeMenu();
    if (location.pathname === "/") {
      window.dispatchEvent(new Event("open-pulse-ai"));
    } else {
      navigate("/", { state: { openPulseAi: true } });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-3xl bg-[#090d1b]/95 border-b border-white/10 shadow-2xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-4">
          <Link to="/" onClick={closeMenu} className="flex items-center gap-3.5 group">
            <div className="relative">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-[#6366f1] via-[#38bdf8] to-[#2dd4bf] p-[1.5px] shadow-[0_0_25px_rgba(45,212,191,0.3)] group-hover:shadow-[0_0_35px_rgba(56,189,248,0.5)] group-hover:scale-105 transition-all duration-300">
                <div className="w-full h-full bg-[#0b1021] rounded-[14px] flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-[#38bdf8] group-hover:text-[#2dd4bf] transition-colors" />
                </div>
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#2dd4bf] rounded-full ring-4 ring-[#090d1b] animate-pulse" />
            </div>

            <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-sans">
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
            onClick={handlePulseAiClick}
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

        {/* Action CTAs + Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {Auth?.User ? (
            <button
              onClick={() => navigate("/chatpage")}
              className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#6366f1] via-[#38bdf8] to-[#2dd4bf] text-white font-semibold shadow-[0_0_25px_rgba(45,212,191,0.35)] hover:shadow-[0_0_35px_rgba(45,212,191,0.5)] transition-all transform hover:-translate-y-0.5 text-xs sm:text-sm border border-white/20"
            >
              <span>Workspace</span>
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
                className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#6366f1] via-[#38bdf8] to-[#2dd4bf] text-white font-semibold text-xs sm:text-sm shadow-[0_0_25px_rgba(45,212,191,0.35)] hover:shadow-[0_0_35px_rgba(45,212,191,0.5)] transition-all border border-white/20 shrink-0"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Link>
            </>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all md:hidden cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 text-teal-400" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#080c1a]/98 backdrop-blur-3xl px-4 py-5 space-y-3 shadow-2xl animate-fade-in-down border-t border-white/5">
          <Link
            to="/"
            onClick={closeMenu}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-sm font-medium ${
              isHome ? "bg-teal-500/10 border-teal-500/30 text-teal-300 font-bold" : "bg-white/5 border-white/5 text-slate-200 hover:bg-white/10"
            }`}
          >
            <Home className="w-4 h-4 text-indigo-400" />
            <span>Home</span>
          </Link>

          <button
            onClick={handlePulseAiClick}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/5 text-slate-200 hover:bg-white/10 transition-all text-sm font-medium text-left cursor-pointer"
          >
            <Bot className="w-4 h-4 text-cyan-400" />
            <span>Pulse AI Assistant</span>
          </button>

          <Link
            to="/team"
            onClick={closeMenu}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-sm font-medium ${
              location.pathname === "/team" ? "bg-teal-500/10 border-teal-500/30 text-teal-300 font-bold" : "bg-white/5 border-white/5 text-slate-200 hover:bg-white/10"
            }`}
          >
            <Users className="w-4 h-4 text-indigo-400" />
            <span>Our Team (Ali & Moeez)</span>
          </Link>

          <Link
            to="/founder-documentary"
            onClick={closeMenu}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-sm font-medium ${
              location.pathname === "/founder-documentary" ? "bg-teal-500/10 border-teal-500/30 text-teal-300 font-bold" : "bg-white/5 border-white/5 text-teal-300 font-bold"
            }`}
          >
            <Film className="w-4 h-4 text-cyan-400" />
            <span>Technical Keynote Documentary</span>
          </Link>

          <Link
            to="/security"
            onClick={closeMenu}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-sm font-medium ${
              location.pathname === "/security" ? "bg-teal-500/10 border-teal-500/30 text-teal-300 font-bold" : "bg-white/5 border-white/5 text-slate-200 hover:bg-white/10"
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>Security & Zero-Trust</span>
          </Link>

          <Link
            to="/blog"
            onClick={closeMenu}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-sm font-medium ${
              location.pathname === "/blog" ? "bg-teal-500/10 border-teal-500/30 text-teal-300 font-bold" : "bg-white/5 border-white/5 text-slate-200 hover:bg-white/10"
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Blog & Technical Logs</span>
          </Link>

          {!Auth?.User && (
            <div className="pt-2 border-t border-white/10 flex items-center gap-3">
              <Link
                to="/login"
                onClick={closeMenu}
                className="flex-1 py-2.5 text-center rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-xs"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={closeMenu}
                className="flex-1 py-2.5 text-center rounded-xl bg-gradient-to-r from-[#6366f1] via-[#38bdf8] to-[#2dd4bf] text-slate-950 font-bold text-xs"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;

