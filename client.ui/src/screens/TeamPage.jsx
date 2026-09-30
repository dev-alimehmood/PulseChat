import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import {
  Users,
  Github,
  Linkedin,
  Facebook,
  Globe,
  Mail,
  Sparkles,
  ShieldCheck,
  Code2,
  Cpu,
  Zap,
  Lock,
  BadgeCheck,
  Check,
  ArrowRight,
  Layers,
  Activity,
  Award,
  Film
} from "lucide-react";

const TeamPage = ({ toggleDark, isDark }) => {
  const [copiedEmail, setCopiedEmail] = useState(null);

  const handleCopyEmail = (email) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2500);
  };

  const founders = [
    {
      id: "ali",
      name: "Ali",
      role: "Founder & Principal Systems Architect",
      badge: "Full-Stack & Realtime Lead",
      portrait: "/images/ali_founder.jpg",
      bio: "Ali is a Full-Stack Systems Architect with a passion for building high-concurrency web applications. He engineered PulseChat's sub-50ms WebSocket engine, multi-device state synchronization, and obsidian glass design system from the ground up.",
      highlights: [
        "Architected custom multi-threaded WebSocket event pipeline handling 100K+ socket streams.",
        "Designed the dark mode obsidian glass visual identity and fluid micro-interactions.",
        "Built scalable MERN microservice APIs with real-time push notification delivery."
      ],
      skills: ["React.js", "Node.js & Express", "WebSockets / Socket.io", "MongoDB", "Tailwind CSS", "PWA & Web Push"],
      stats: [
        { value: "< 50ms", label: "Global Sync Latency" },
        { value: "100K+", label: "Socket Streams" },
        { value: "99.99%", label: "Uptime Target" }
      ],
      socials: {
        github: "https://github.com/dev-alimehmood",
        linkedin: "https://www.linkedin.com/in/dev-alimehmood/",
        facebook: "https://www.facebook.com/profile.php?id=100089938369939&sk=friends",
        portfolio: "https://alimehmood.netlify.app/",
        email: "dev.alimehmood@gmail.com"
      },
      accentColor: "from-indigo-500 via-cyan-400 to-teal-400",
      tagColor: "bg-indigo-500/10 border-indigo-500/30 text-indigo-400"
    },
    {
      id: "moeez",
      name: "Muhammad Moeez",
      role: "Co-Founder & Chief Security Officer",
      badge: "Cyber Defense & Encryption Lead",
      portrait: "/images/moeez_founder.jpg",
      bio: "Muhammad Moeez directs cybersecurity engineering and network threat defense for PulseChat. He specializes in zero-trust authentication protocols, cryptographic hashing, and automated DDoS rate-limiting to protect user data.",
      highlights: [
        "Implemented stateful JWT authentication guards with auto-expiring session rotation.",
        "Engineered SHA-256 HMAC payload hashing and tamper-evident packet signatures.",
        "Architected sub-millisecond anti-DDoS socket connection rate-limiting and firewall rules."
      ],
      skills: ["Cybersecurity", "SHA-256 Cryptography", "Zero-Trust Auth", "Penetration Testing", "DDoS Defense", "OAuth2 & JWT"],
      stats: [
        { value: "100%", label: "Zero-Trust Score" },
        { value: "SHA-256", label: "Payload Shielding" },
        { value: "0 Leaks", label: "Security Audit" }
      ],
      socials: {
        github: "https://github.com/moeezrj",
        linkedin: "https://www.linkedin.com/in/moeezrj/",
        facebook: "https://www.facebook.com/moeez17",
        portfolio: "https://portfolio.devhttps://sites.google.com/view/moeez-seo-gp/home?fbclid=IwY2xjawUqE6NleHRuA2FlbQIxMABwZG9mAXNydGMGYXBwX2lkEDIyMjAzOTE3ODgyMDA4OTIAAR64XxYuJMyzV-IK2nLbh5fcvtlP6dF3TlYuj6h_xFiQp8cXQk6_glCm61d5kQ_aem_lmMtMZaSmWvfKrJ7OWa03w",
        email: "moeezrj17@gmail.com"
      },
      accentColor: "from-teal-400 via-cyan-400 to-indigo-500",
      tagColor: "bg-teal-500/10 border-teal-500/30 text-teal-400"
    }
  ];

  const values = [
    {
      icon: Zap,
      title: "Real-Time Concurrency",
      description: "Sub-50ms WebSocket event delivery engineered for zero buffering and instant global message synchronization."
    },
    {
      icon: ShieldCheck,
      title: "Zero-Trust Defenses",
      description: "Military-grade SHA-256 HMAC payload hashing, multi-layer JWT authentication, and automatic DDoS rate-limiting."
    },
    {
      icon: Sparkles,
      title: "Obsidian Glass Design",
      description: "Crafted with dark-mode glassmorphism aesthetics, accessible contrast, and fluid micro-animations."
    }
  ];

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 font-sans relative overflow-x-hidden selection:bg-[#2dd4bf]/30">
      
      {/* Soft Ambient Background Mesh */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-r from-indigo-600/15 via-cyan-500/10 to-teal-400/15 blur-[160px] rounded-full" />
        <div className="absolute top-[40%] right-0 w-[500px] h-[500px] bg-indigo-600/08 blur-[200px] rounded-full" />
        <div className="absolute top-[70%] left-0 w-[500px] h-[500px] bg-teal-400/08 blur-[200px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:32px_32px] opacity-40" />
      </div>

      {/* Navigation Header */}
      <Navbar toggleDark={toggleDark} isDark={isDark} />

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 sm:pt-36 sm:pb-28 space-y-20 lg:space-y-28">
        
        {/* Page Hero Title */}
        <div className="text-center max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-400 text-xs font-mono tracking-wider uppercase backdrop-blur-md animate-fade-in-down">
            <Users className="w-3.5 h-3.5 text-teal-400" />
            Leadership & Engineering Team
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.15] animate-fade-in-up delay-100">
            Built by engineers, <br />
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-teal-400 bg-clip-text text-transparent animate-text-shimmer">
              designed for scale.
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-normal animate-fade-in-up delay-200 px-2">
            Meet the architects of PulseChat — dedicated to building low-latency real-time communication, robust network security, and effortless glass interfaces.
          </p>

          <div className="pt-2 animate-fade-in-up delay-300">
            <Link
              to="/founder-documentary"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-cyan-400 to-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg hover:scale-105 transition-transform"
            >
              <Film className="w-4 h-4" />
              Watch Full Founder Documentary 🎬
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </Link>
          </div>
        </div>

        {/* Founder Cards Grid (2-Column Desktop Side-by-Side) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">
          {founders.map((founder, idx) => (
            <div
              key={founder.id}
              className={`rounded-3xl border border-white/10 bg-[#0d1222]/80 backdrop-blur-2xl p-5 sm:p-8 flex flex-col justify-between space-y-6 hover:border-white/20 transition-all duration-300 shadow-2xl group animate-scale-in ${
                idx === 0 ? "delay-200" : "delay-400"
              }`}
            >
              {/* Header Info with Portrait */}
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                  {/* Clean Human Portrait Frame */}
                  <div className="w-32 h-40 sm:w-36 sm:h-48 rounded-2xl overflow-hidden border border-white/15 bg-black/40 shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-500">
                    <img
                      src={founder.portrait}
                      alt={founder.name}
                      className="w-full h-full object-cover brightness-105 contrast-105"
                    />
                  </div>

                  <div className="space-y-2 text-center sm:text-left flex-1 min-w-0 w-full">
                    <span className={`inline-block px-3 py-0.5 rounded-full border text-[11px] font-mono font-semibold uppercase tracking-wider ${founder.tagColor}`}>
                      {founder.badge}
                    </span>

                    <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center justify-center sm:justify-start gap-2">
                      {founder.name}
                      <BadgeCheck className="w-6 h-6 text-cyan-400 shrink-0" />
                    </h2>

                    <p className="text-xs sm:text-sm text-cyan-300 font-mono font-medium">
                      {founder.role}
                    </p>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal pt-1">
                      {founder.bio}
                    </p>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-2">
                  {founder.stats.map((stat, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-2.5 sm:p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-center space-y-0.5"
                    >
                      <div className="text-sm sm:text-lg font-bold bg-gradient-to-r from-indigo-400 via-cyan-300 to-teal-400 bg-clip-text text-transparent">
                        {stat.value}
                      </div>
                      <div className="text-[9px] sm:text-[10px] text-slate-400 font-medium leading-tight">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Key Contributions List */}
                <div className="space-y-2.5 pt-2">
                  <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                    Key Engineering Contributions
                  </h3>
                  <ul className="space-y-2">
                    {founder.highlights.map((item, hIdx) => (
                      <li key={hIdx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                        <Check className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technical Stack Tags */}
                <div className="pt-2 space-y-2">
                  <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                    Core Technical Stack
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {founder.skills.map((skill, kIdx) => (
                      <span
                        key={kIdx}
                        className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-xs font-mono"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Social Communication Links */}
              <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <a
                    href={founder.socials.github}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-indigo-500 hover:text-white text-slate-300 border border-white/10 transition-all duration-300"
                    title="GitHub"
                  >
                    <Github className="w-4 h-4" />
                  </a>

                  <a
                    href={founder.socials.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-cyan-500 hover:text-white text-slate-300 border border-white/10 transition-all duration-300"
                    title="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>

                  <a
                    href={founder.socials.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-blue-600 hover:text-white text-slate-300 border border-white/10 transition-all duration-300"
                    title="Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>

                  <a
                    href={founder.socials.portfolio}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-teal-500 hover:text-white text-slate-300 border border-white/10 transition-all duration-300"
                    title="Portfolio"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                </div>

                <button
                  onClick={() => handleCopyEmail(founder.socials.email)}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-teal-500 hover:text-slate-950 text-slate-300 text-xs font-mono font-medium border border-white/10 transition-all flex items-center gap-2 cursor-pointer"
                  title="Copy email address"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{copiedEmail === founder.socials.email ? "Copied!" : "Contact"}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Core Principles Section */}
        <div className="space-y-10 pt-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono text-cyan-400 font-bold tracking-widest uppercase">
              Core Principles
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight animate-fade-in-up">
              Engineering with purpose
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed px-2">
              Every socket connection, UI token, and security policy in PulseChat is designed with three fundamental pillars.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {values.map((val, idx) => {
              const IconComponent = val.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl border border-white/10 bg-[#0d1222]/60 backdrop-blur-xl hover:border-white/20 transition-all space-y-3 animate-scale-in"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-teal-400 text-slate-950 flex items-center justify-center font-bold shadow-md">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {val.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    {val.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Closing Contact Callout */}
        <div className="rounded-3xl border border-teal-500/30 bg-gradient-to-r from-[#0d1222] via-[#0f172a] to-[#0b1021] p-6 sm:p-12 text-center max-w-4xl mx-auto space-y-5 shadow-2xl animate-fade-in-up">
          <h2 className="text-xl sm:text-4xl font-bold text-white tracking-tight">
            Interested in learning more about PulseChat?
          </h2>
          <p className="text-slate-300 text-xs sm:text-base max-w-xl mx-auto leading-relaxed">
            Reach out directly to our founders for architectural inquiries, technical partnerships, or platform feedback.
          </p>
          <div className="pt-2">
            <a
              href="mailto:ali@pulsechat.dev"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 via-cyan-400 to-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg hover:scale-105 transition-transform"
            >
              <Mail className="w-4 h-4" />
              Get in Touch with Founders
              <ArrowRight className="w-4 h-4 ml-1" />
            </a>
          </div>
        </div>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default TeamPage;
