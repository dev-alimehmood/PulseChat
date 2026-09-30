import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import {
  ShieldCheck,
  Lock,
  Key,
  Server,
  FileText,
  CheckCircle2,
  Cpu,
  RefreshCw,
  EyeOff,
  Activity
} from "lucide-react";

const SecurityPage = ({ toggleDark, isDark }) => {
  const securityFeatures = [
    {
      icon: <Lock className="w-8 h-8 text-[#2dd4bf]" />,
      title: "End-to-End Encryption Protocol",
      desc: "Every message payload sent via PulseSockets is secured using modern TLS 1.3 encryption handshakes in transit, ensuring zero plaintext exposure."
    },
    {
      icon: <Key className="w-8 h-8 text-[#818cf8]" />,
      title: "JWT Session Authentication",
      desc: "Stateful token validation signed with HMAC SHA-256 keys guarantees zero-trust identity verification across client-server interactions."
    },
    {
      icon: <Server className="w-8 h-8 text-[#38bdf8]" />,
      title: "Salted Password Cryptography",
      desc: "User credentials are protected using multi-round salted bcrypt hashing protocols, safeguarding password data against rainbow table attacks."
    },
    {
      icon: <EyeOff className="w-8 h-8 text-[#34d399]" />,
      title: "Zero-Knowledge Data Isolation",
      desc: "Private channel keys are isolated per user session. Administrative logs only track metadata and network health, never conversation text."
    },
    {
      icon: <RefreshCw className="w-8 h-8 text-[#818cf8]" />,
      title: "Automatic Session Expiry",
      desc: "Granular token lifespans and background refresh routines shield user accounts from session hijacking or prolonged token theft."
    },
    {
      icon: <Cpu className="w-8 h-8 text-[#2dd4bf]" />,
      title: "Distributed DDOS Shielding",
      desc: "WebSocket rate-limiting and connection throttling prevent flood attacks, guaranteeing 99.99% operational uptime standard."
    }
  ];

  return (
    <div className="min-h-screen bg-[#090d1b] text-slate-100 font-sans relative overflow-x-hidden selection:bg-[#2dd4bf]/30">
      
      {/* Background Ambient Mesh Light */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-tr from-[#6366f1]/20 via-[#38bdf8]/15 to-[#2dd4bf]/20 blur-[180px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:36px_36px] opacity-70" />
      </div>

      {/* Shared Sticky Navigation Header */}
      <Navbar toggleDark={toggleDark} isDark={isDark} />

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 sm:pt-36 sm:pb-24 space-y-24">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#2dd4bf]/40 bg-[#0f172a]/80 text-[#2dd4bf] text-xs font-mono tracking-widest uppercase backdrop-blur-xl shadow-inner">
            <ShieldCheck className="w-4 h-4 text-[#2dd4bf]" />
            ENTERPRISE SECURITY SPECIFICATION
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            Security & Privacy. <br />
            <span className="bg-gradient-to-r from-[#818cf8] via-[#38bdf8] to-[#2dd4bf] bg-clip-text text-transparent">
              Engineered into the Core.
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Discover how PulseChat protects realtime communications using authenticated socket handshakes, cryptographic salt validation, and zero-knowledge session guards.
          </p>
        </div>

        {/* Security Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {securityFeatures.map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl border border-white/10 bg-[#13192e]/80 backdrop-blur-2xl hover:border-[#2dd4bf]/50 hover:shadow-[0_0_35px_rgba(45,212,191,0.2)] transition-all duration-300 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#090d1b] border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                {item.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Architecture Guarantee Card */}
        <div className="rounded-3xl border border-[#2dd4bf]/30 bg-gradient-to-br from-[#13192e] via-[#0b1021] to-[#090d1b] p-8 sm:p-14 shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2dd4bf]/20 text-[#2dd4bf] text-xs font-mono">
              <CheckCircle2 className="w-4 h-4" />
              COMPLIANCE & PROTECTION GUARANTEE
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Built for Strict Privacy Standards
            </h2>
            <p className="text-slate-300 text-base leading-relaxed">
              Our real-time engine enforces strict cross-origin checks (CORS), strict JWT payload validation middleware, and tokenized Web Push authentication keys (`VAPID`) across every message lifecycle.
            </p>
            <div className="pt-4 flex flex-wrap gap-6 text-sm font-semibold text-slate-200">
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4.5 h-4.5 text-[#2dd4bf]" /> TLS 1.3 Encrypted Socket Pipe</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4.5 h-4.5 text-[#2dd4bf]" /> Salted Bcrypt Token Hashing</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4.5 h-4.5 text-[#2dd4bf]" /> Protected Route Handlers</span>
            </div>
          </div>
        </div>

      </main>

      {/* Shared Rich Footer */}
      <Footer />
    </div>
  );
};

export default SecurityPage;
