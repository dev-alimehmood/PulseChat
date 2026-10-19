import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Zap, ShieldCheck, Cpu, Users, Globe, MessageSquare, 
  Mail, Phone, MapPin, ExternalLink, Heart, Server, Database, Code2, 
  Rocket, Radio, EyeOff, Mic, Cloud, Layers, Activity, Lock, 
  CheckCircle2, Sparkles, Volume2, BellRing, Share2, Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/auth";
import Avatar from "../../components/shared/Avatar";

const AboutApp = () => {
  const [auth] = useAuth();
  const navigate = useNavigate();

  const fadeIn = { 
    hidden: { opacity: 0, y: 20 }, 
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } 
  };
  
  const staggerContainer = { 
    hidden: { opacity: 0 }, 
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } } 
  };

  const coreArchitecturalPillars = [
    {
      icon: Radio,
      badge: "WEBSOCKET FABRIC",
      title: "Realtime WebSocket Engine",
      color: "from-sky-500 to-indigo-600",
      accent: "text-sky-400",
      bgLight: "bg-sky-500/10",
      borderColor: "border-sky-500/20",
      description: "Powered by Socket.io with multi-client socket pooling. Allows seamless concurrent sessions across multiple browser tabs and devices without state contention.",
      features: [
        "Sub-15ms message delivery across live sockets",
        "Multi-tab socket pooling with automatic connection cleanup",
        "Real-time typing detection & automated stop triggers",
        "Interactive 'Pulse' tactile pinging alert system"
      ]
    },
    {
      icon: EyeOff,
      badge: "STEALTH PRIVACY",
      title: "Zero-Leak Presence Cloak",
      color: "from-purple-500 to-indigo-600",
      accent: "text-purple-400",
      bgLight: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      description: "Enterprise privacy controls allow users to activate Stealth Mode, completely masking their active green dot and online state from all conversation and search queries.",
      features: [
        "One-click Stealth Mode with instant socket broadcast",
        "Server-enforced query suppression (never leaks via API)",
        "Granular contact quarantine & bi-directional blocking",
        "Automatic lastSeen timestamp privacy preservation"
      ]
    },
    {
      icon: Mic,
      badge: "CLOUD MEDIA PIPELINE",
      title: "Voice Notes & AWS S3 Storage",
      color: "from-emerald-500 to-teal-600",
      accent: "text-teal-400",
      bgLight: "bg-teal-500/10",
      borderColor: "border-teal-500/20",
      description: "In-browser high-fidelity voice recording using the MediaRecorder API paired with an AWS S3 cloud media pipeline and client-side image compression.",
      features: [
        "Studio-quality voice notes with waveform audio streaming",
        "Client-side image compression reducing bandwidth by 80%",
        "Direct AWS S3 pre-signed storage with streaming proxy",
        "Instant inline audio scrubbing and duration playback"
      ]
    },
    {
      icon: Layers,
      badge: "REACTIVE MERN CORE",
      title: "Production MERN Infrastructure",
      color: "from-amber-500 to-rose-600",
      accent: "text-amber-400",
      bgLight: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
      description: "Full-stack MERN architecture featuring MongoDB Atlas replica sets, Express 4 RESTful controllers, React 18, and Tailwind CSS responsive styling.",
      features: [
        "MongoDB Atlas replica sets with index-optimized lookups",
        "State-driven JWT authentication with bcrypt encryption",
        "Framer Motion micro-animations with 60fps fluidity",
        "Adaptive dark and light modes with custom scrollbars"
      ]
    }
  ];

  const systemFeatures = [
    {
      icon: MessageSquare,
      title: "Real-time Messaging",
      desc: "Instant message synchronization across all connected devices with read receipts and delivery indicators."
    },
    {
      icon: Radio,
      title: "Live Presence & Stealth Cloak",
      desc: "Toggle your online visibility at any moment. Choose between live broadcast and total incognito stealth."
    },
    {
      icon: Mic,
      title: "Voice Audio Clips",
      desc: "Capture and dispatch voice messages with native audio recording and low-latency cloud playback."
    },
    {
      icon: ShieldCheck,
      title: "Quarantine & Isolation",
      desc: "Isolate unwanted contacts with one click. Restrict unwanted communication and unblock anytime."
    },
    {
      icon: Zap,
      title: "Tactile 'Pulse' Pings",
      desc: "Send an instant visual alert to friends directly within the chat window to grab their attention."
    },
    {
      icon: BellRing,
      title: "Cross-Platform Push Notifications",
      desc: "Web Push integration with custom service workers ensures you never miss a message even while offline."
    }
  ];

  const lifecycleSteps = [
    {
      step: "01",
      title: "Client Action & Compression",
      desc: "User drafts a message, captures voice audio, or selects media. Images are compressed client-side to minimize latency."
    },
    {
      step: "02",
      title: "Encrypted Socket Dispatch",
      desc: "Payload is transmitted across authenticated WebSockets with JWT token validation and participant routing."
    },
    {
      step: "03",
      title: "Persistent Ledger & Cloud Storage",
      desc: "Messages are committed to MongoDB Atlas with timestamps; audio and images are archived in Amazon AWS S3."
    },
    {
      step: "04",
      title: "Multi-Client Broadcast & Receipts",
      desc: "The socket gateway dispatches the payload to all target device rooms, emitting delivered and seen receipts in real-time."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b18] text-slate-900 dark:text-slate-100 overflow-x-hidden selection:bg-[#38bdf8]/30 transition-colors duration-500">
      
      {/* ── Navigation Header ── */}
      <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-white/70 dark:bg-[#0c1228]/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/10 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-100/80 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all text-xs font-semibold active:scale-95 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="PulseChat" className="w-8 h-8 object-contain drop-shadow-[0_0_10px_rgba(56,189,248,0.4)]" />
            <span className="text-base font-extrabold bg-gradient-to-r from-[#6366f1] via-[#38bdf8] to-[#2dd4bf] bg-clip-text text-transparent">
              PulseChat System Architecture
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 ml-auto">
          <button
            onClick={() => navigate("/dashboard")}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#38bdf8]/10 text-[#0284c7] dark:text-[#38bdf8] hover:bg-[#38bdf8]/20 transition-all border border-[#38bdf8]/20"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Workspace</span>
          </button>

          {auth?.User && (
            <Avatar
              src={auth.User.profilepicture}
              name={auth.User.full_name}
              id={auth.User._id}
              size="w-9 h-9 text-xs"
              rounded="rounded-2xl"
              className="shadow-md border border-white/20"
            />
          )}
        </div>
      </header>

      <main className="pt-12 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-24">

        {/* ── 1. Hero Section ── */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="text-center pt-8 pb-12 relative"
        >
          {/* Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-[#6366f1]/15 via-[#38bdf8]/15 to-[#2dd4bf]/10 blur-[120px] rounded-full pointer-events-none -z-10" />
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-200/60 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-xs font-mono font-semibold text-slate-700 dark:text-[#38bdf8] mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span>ENTERPRISE SPECIFICATION • PRODUCTION v2.4</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6">
            Engineered for Speed, <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#6366f1] via-[#38bdf8] to-[#2dd4bf] bg-clip-text text-transparent">
              Privacy, and Real-Time Scale.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            PulseChat delivers high-concurrency instant messaging with bi-directional WebSockets, 
            zero-leak stealth presence, cloud voice notes, and high-performance MERN architecture.
          </p>

          {/* Quick Metrics Badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs font-mono">
            <span className="px-3.5 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 shadow-sm flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Sub-15ms Sockets</span>
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 shadow-sm flex items-center gap-1.5">
              <EyeOff className="w-3.5 h-3.5 text-purple-400" />
              <span>Stealth Mode Cloaking</span>
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 shadow-sm flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5 text-teal-400" />
              <span>AWS S3 Voice Pipeline</span>
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 shadow-sm flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Quarantine Isolation</span>
            </span>
          </div>
        </motion.section>

        {/* ── 2. Core Architectural Pillars (The 4 Engines) ── */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#38bdf8] block mb-2">
              FOUNDATIONAL PILLARS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              The Four Architectural Pillars
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Each system module was designed from first principles to guarantee reliability, low latency, and uncompromising privacy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coreArchitecturalPillars.map((pillar, idx) => {
              const IconComp = pillar.icon;
              return (
                <motion.div
                  key={idx}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={fadeIn}
                  className="rounded-3xl border border-slate-200/80 dark:border-white/10 p-6 sm:p-8 bg-white/80 dark:bg-[#0c1228]/80 backdrop-blur-xl shadow-xl shadow-slate-200/30 dark:shadow-none hover:border-[#38bdf8]/40 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-2xl ${pillar.bgLight} border ${pillar.borderColor} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                        <IconComp className={`w-6 h-6 ${pillar.accent}`} />
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-slate-500 dark:text-slate-400">
                        {pillar.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
                      {pillar.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-5">
                      {pillar.description}
                    </p>

                    <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-white/5">
                      {pillar.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                          <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${pillar.accent}`} />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── 3. High-Performance Technology Stack Strip ── */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeIn}
          className="p-8 sm:p-12 rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-[#0c1228] to-slate-900 border border-white/10 text-white relative overflow-hidden shadow-2xl"
        >
          {/* Ambient light glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#38bdf8]/15 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#6366f1]/15 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative z-10 text-center mb-10">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#38bdf8] font-bold block mb-2">
              SYSTEM FOUNDATION
            </span>
            <h2 className="text-2xl sm:text-4xl font-black">Full-Stack MERN + Cloud Pipeline</h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mt-2">
              Built on battle-tested technologies engineered for horizontal scalability and high concurrency.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 relative z-10">
            {[
              { title: "MongoDB Atlas", desc: "Replica Set NoSQL Layer", icon: Database, color: "text-emerald-400", bg: "bg-emerald-400/10" },
              { title: "Express.js", desc: "REST & Middleware API", icon: Server, color: "text-slate-300", bg: "bg-slate-300/10" },
              { title: "React 18", desc: "Interactive UI & Framer", icon: Code2, color: "text-cyan-400", bg: "bg-cyan-400/10" },
              { title: "Node.js & Sockets", desc: "Non-blocking Event Loop", icon: Cpu, color: "text-teal-400", bg: "bg-teal-400/10" }
            ].map((stack, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col items-center text-center hover:bg-white/10 transition-colors"
              >
                <div className={`w-12 h-12 rounded-xl ${stack.bg} flex items-center justify-center mb-3`}>
                  <stack.icon className={`w-6 h-6 ${stack.color}`} />
                </div>
                <p className="text-sm font-bold text-white">{stack.title}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{stack.desc}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── 4. End-to-End Real-Time Message Lifecycle ── */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#38bdf8] block mb-2">
              DISPATCH LIFECYCLE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              End-to-End Delivery Sequence
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              What occurs in under 15 milliseconds between sending a message and peer acknowledgment.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {lifecycleSteps.map((step, idx) => (
              <motion.div
                key={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={fadeIn}
                className="rounded-3xl border border-slate-200/80 dark:border-white/10 p-6 bg-white/70 dark:bg-[#0c1228]/70 backdrop-blur-xl shadow-lg relative flex flex-col justify-between"
              >
                <div>
                  <span className="text-2xl font-black font-mono text-[#38bdf8] mb-3 block">
                    {step.step}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── 5. Feature Matrix Grid ── */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#38bdf8] block mb-2">
              FEATURE SUITE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Engineered For Modern Collaboration
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Every detail is tuned for seamless communication, privacy isolation, and intuitive interactions.
            </p>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {systemFeatures.map((feat, idx) => (
              <motion.div
                key={idx}
                variants={fadeIn}
                className="p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-[#0c1228]/70 backdrop-blur-xl shadow-lg hover:-translate-y-1 transition-transform group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#38bdf8]/10 text-[#0284c7] dark:text-[#38bdf8] border border-[#38bdf8]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5">
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {feat.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ── 6. Leadership & Engineering Vision (Co-Founders Dedication) ── */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="py-10 space-y-10"
        >
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#38bdf8] block mb-2">
              LEADERSHIP & ENGINEERING VISION
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3">
              Dedicated to the Co-Founders
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
              PulseChat was conceived and built through the close collaboration of Ali Mehmood and Muhammad Moeez — uniting ultra-low latency WebSocket engineering with military-grade Zero-Trust cryptographic security.
            </p>
          </div>

          {/* Dual Founders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* Founder 1: Ali Mehmood */}
            <div className="p-8 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-white/10 bg-gradient-to-b from-white to-slate-50 dark:from-[#0c1228] dark:to-[#070b18] backdrop-blur-2xl shadow-2xl relative overflow-hidden flex flex-col justify-between group hover:border-[#38bdf8]/50 transition-all">
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#38bdf8]/20 to-transparent blur-2xl pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl p-1 bg-gradient-to-tr from-[#6366f1] via-[#38bdf8] to-[#2dd4bf] shadow-xl shadow-[#38bdf8]/25 group-hover:scale-105 transition-transform duration-300">
                    <div className="w-full h-full rounded-[22px] overflow-hidden bg-slate-900 border border-white/20">
                      <img
                        src="/ali.jpeg"
                        alt="Mr. Ali Mehmood"
                        className="w-full h-full object-cover object-top hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#38bdf8]/10 text-[#0284c7] dark:text-[#38bdf8] border border-[#38bdf8]/25 text-[10px] font-mono font-bold tracking-wider uppercase">
                    Co-Founder & Architect
                  </span>
                </div>

                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-1">
                  Mr. Ali Mehmood
                </h3>
                <p className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 mb-4">
                  Principal Systems Architect & Lead Engineer
                </p>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  Architect of PulseChat's multi-tenant WebSocket fabric, sub-15ms message pooling, AWS S3 cloud media pipeline, and high-fluidity reactive MERN user interface.
                </p>

                <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-white/5 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#38bdf8] shrink-0" />
                    <span>Real-Time WebSocket Fabric & Concurrency</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#38bdf8] shrink-0" />
                    <span>AWS S3 High-Fidelity Audio & Cloud Media Pipeline</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#38bdf8] shrink-0" />
                    <span>Reactive Full-Stack MERN Architecture</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">Systems & Infrastructure</span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#38bdf8]">
                  <span>Lead Architect</span>
                </span>
              </div>
            </div>

            {/* Founder 2: Muhammad Moeez */}
            <div className="p-8 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-white/10 bg-gradient-to-b from-white to-slate-50 dark:from-[#0c1228] dark:to-[#070b18] backdrop-blur-2xl shadow-2xl relative overflow-hidden flex flex-col justify-between group hover:border-emerald-500/50 transition-all">
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-emerald-500/20 to-transparent blur-2xl pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl p-1 bg-gradient-to-tr from-emerald-400 via-teal-500 to-indigo-600 shadow-xl shadow-emerald-500/25 group-hover:scale-105 transition-transform duration-300">
                    <div className="w-full h-full rounded-[22px] overflow-hidden bg-slate-900 border border-white/20">
                      <img
                        src="/Moeez.jpeg"
                        alt="Mr. Muhammad Moeez"
                        className="w-full h-full object-cover object-top hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 text-[10px] font-mono font-bold tracking-wider uppercase">
                    Co-Founder & Security
                  </span>
                </div>

                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-1">
                  Mr. Muhammad Moeez
                </h3>
                <p className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 mb-4">
                  Chief Security Officer (CSO) & Threat Defense Lead
                </p>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  Architect of PulseChat's Zero-Trust cybersecurity perimeter, session rotation guards, SHA-256 HMAC packet verification, and zero-leak stealth privacy cloaking.
                </p>

                <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-white/5 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Zero-Trust Cybersecurity & Cryptographic Hardening</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Zero-Leak Stealth Presence & Privacy Isolation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Stateful JWT Rotation & Threat Mitigation</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">Cybersecurity & Defense</span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400">
                  <span>Chief Security Officer</span>
                </span>
              </div>
            </div>

          </div>

          {/* Unifying Philosophy Banner */}
          <div className="max-w-5xl mx-auto rounded-3xl border border-slate-200/80 dark:border-white/10 p-6 sm:p-8 bg-gradient-to-r from-[#6366f1]/10 via-[#38bdf8]/10 to-[#2dd4bf]/10 backdrop-blur-xl shadow-lg flex flex-col sm:flex-row items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#6366f1] via-[#38bdf8] to-[#2dd4bf] text-white flex items-center justify-center shrink-0 shadow-lg">
              <Shield className="w-7 h-7" />
            </div>
            <div className="text-center sm:text-left min-w-0">
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                The Confluence of Velocity and Zero-Trust Security
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                Ali Mehmood and Muhammad Moeez engineered PulseChat to establish a modern standard in real-time collaboration: eliminating the trade-off between blazing sub-15ms speed and military-grade user privacy.
              </p>
            </div>
          </div>
        </motion.section>

        {/* ── 7. Support & Inquiries ── */}
        <section className="space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#38bdf8] block mb-2">
              COMMUNICATION CHANNELS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Connect With the Engineering Team
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {[
              { icon: Mail, label: "Direct Inquiries", value: "support@pulsechat.app", href: "mailto:support@pulsechat.app", color: "text-[#38bdf8]" },
              { icon: Phone, label: "Hotline", value: "+1 (555) 785-7324", color: "text-emerald-500" },
              { icon: MapPin, label: "Engineering HQ", value: "Innovation District, Cloud Lab", color: "text-purple-500" }
            ].map((contact, idx) => (
              <motion.a
                key={idx}
                variants={fadeIn}
                href={contact.href || "#"}
                className="flex flex-col items-center p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-[#0c1228]/70 backdrop-blur-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all text-center group"
              >
                <div className={`w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${contact.color}`}>
                  <contact.icon className="w-6 h-6" />
                </div>
                <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">{contact.label}</p>
                <p className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">{contact.value}</p>
                {contact.href && <ExternalLink className="w-4 h-4 mt-3 text-slate-400 group-hover:text-[#38bdf8] transition-colors" />}
              </motion.a>
            ))}
          </div>
        </section>

      </main>

      {/* ── Production Animated Footer ── */}
      <footer className="w-full pt-16 pb-12 border-t border-slate-200/80 dark:border-white/10 relative overflow-hidden flex flex-col items-center justify-center bg-white/40 dark:bg-[#070b18]/60 backdrop-blur-2xl">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 bg-[#38bdf8]/15 blur-[80px] rounded-full pointer-events-none" />

        <div className="flex flex-col items-center gap-1.5 mb-8 relative z-10">
          <div className="flex items-center gap-3">
            <motion.img
              src="/logo.png"
              alt="PulseChat Logo"
              animate={{ scale: [1, 1.12, 1], rotate: [0, 3, -3, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              className="w-11 h-11 object-contain drop-shadow-[0_0_20px_rgba(56,189,248,0.5)]"
            />
            <span className="font-black text-3xl sm:text-4xl tracking-tight">
              <span className="text-red-500">Pulse</span>
              <span className="text-sky-500">Chat</span>
            </span>
          </div>
          <p className="text-[11px] font-mono font-bold text-slate-400 dark:text-slate-500 tracking-[0.3em] uppercase mt-1">
            Communication • Evolved
          </p>
        </div>

        {/* Powered By Badge */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 relative z-10 bg-white/80 dark:bg-[#0c1228]/80 px-7 py-3.5 rounded-full border border-slate-200 dark:border-white/10 shadow-xl backdrop-blur-md">
          <span className="text-slate-500 dark:text-slate-400 font-bold tracking-widest uppercase text-[11px]">
            Designed & Engineered By
          </span>
          <div className="w-px h-5 bg-slate-300 dark:bg-slate-700 hidden sm:block" />
          <div className="text-sm sm:text-base font-black tracking-tight bg-gradient-to-r from-[#6366f1] via-[#38bdf8] to-[#2dd4bf] bg-clip-text text-transparent flex items-center gap-2 flex-wrap justify-center">
            <span>Ali Mehmood</span>
            <span className="text-slate-400 font-normal">&</span>
            <span>Muhammad Moeez</span>
            <motion.div
              animate={{ scale: [1, 1.35, 1] }}
              transition={{ repeat: Infinity, duration: 1.6 }}
            >
              <Heart className="w-4 h-4 text-red-500 fill-red-500 inline-block" />
            </motion.div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutApp;
