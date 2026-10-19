import { Link } from "react-router-dom";
import { MessageSquare } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-[#05070f] py-16 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="PulseChat"
                className="w-9 h-9 object-contain drop-shadow-[0_0_12px_rgba(56,189,248,0.4)]"
              />
              <span className="font-black text-white text-xl tracking-tight font-sans flex items-center">
                <span className="text-red-500">Pulse</span>
                <span className="text-sky-400">Chat</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Next-generation real-time communication platform built on ultra-low latency WebSockets, Web Push alerts, and military-grade JWT session controls.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>All Systems Operational • 99.99% Uptime</span>
            </div>
          </div>

          {/* Column 1: Navigation */}
          <div className="space-y-3 text-sm">
            <h4 className="font-bold text-white uppercase text-xs tracking-wider font-mono">Product</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="/#features" className="hover:text-[#2dd4bf] transition-colors">Features Grid</Link></li>
              <li><Link to="/#demo" className="hover:text-[#2dd4bf] transition-colors">Pulse AI Assistant</Link></li>
              <li><Link to="/#testimonials" className="hover:text-[#2dd4bf] transition-colors">Testimonials</Link></li>
              <li><Link to="/#faq" className="hover:text-[#2dd4bf] transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Column 2: Resources */}
          <div className="space-y-3 text-sm">
            <h4 className="font-bold text-white uppercase text-xs tracking-wider font-mono">Company</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="/security" className="hover:text-[#2dd4bf] transition-colors">Security Specs</Link></li>
              <li><Link to="/team" className="hover:text-[#2dd4bf] transition-colors">Our Team</Link></li>
              <li><Link to="/blog" className="hover:text-[#2dd4bf] transition-colors">Blog & Journal</Link></li>
              <li><Link to="/about" className="hover:text-[#2dd4bf] transition-colors">About App</Link></li>
            </ul>
          </div>

          {/* Column 3: Access */}
          <div className="space-y-3 text-sm">
            <h4 className="font-bold text-white uppercase text-xs tracking-wider font-mono">Portal</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="/login" className="hover:text-[#2dd4bf] transition-colors">Sign In</Link></li>
              <li><Link to="/signup" className="hover:text-[#2dd4bf] transition-colors">Create Account</Link></li>
              <li><Link to="/chatpage" className="hover:text-[#2dd4bf] transition-colors">Launch Workspace</Link></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} PulseChat Technologies Inc. All rights reserved.
            <span className="hidden sm:inline mx-2 text-slate-600">•</span>
            <span className="block sm:inline text-slate-400">Co-Founded & Engineered by <span className="text-slate-200 font-semibold">Ali Mehmood</span> & <span className="text-slate-200 font-semibold">Muhammad Moeez</span></span>
          </div>
          <div className="flex gap-6">
            <Link to="/security" className="hover:text-[#2dd4bf] transition-colors">Privacy Policy</Link>
            <Link to="/security" className="hover:text-[#2dd4bf] transition-colors">Terms of Service</Link>
            <Link to="/security" className="hover:text-[#2dd4bf] transition-colors">Security Compliance</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
