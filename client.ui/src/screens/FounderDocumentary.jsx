import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import {
  Film,
  Zap,
  ShieldCheck,
  Play,
  Pause,
  Clock,
  ArrowRight,
  BadgeCheck,
  Check,
  Github,
  Linkedin,
  Facebook,
  Globe,
  Mail,
  Users,
  Quote,
  Sparkles,
  Lock,
  X,
  Volume2,
  VolumeX,
  Radio,
  Cpu,
  Layers,
  Terminal,
  Activity,
  Server,
  Database
} from "lucide-react";

const FounderDocumentary = ({ toggleDark, isDark }) => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeVideoChapter, setActiveVideoChapter] = useState(0);
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [copiedEmail, setCopiedEmail] = useState(null);
  const [hoveredArchNode, setHoveredArchNode] = useState("gateway");

  const handleCopyEmail = (email) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2500);
  };

  const videoChapters = [
    { title: "01:15 — The Origin & Realtime Latency Crisis", time: "01:15", desc: "Ali explains why traditional polling chat apps buffer under load." },
    { title: "03:40 — Building the Sub-50ms WebSocket Engine", time: "03:40", desc: "Deep dive into Node.js event dispatchers and React state hooks." },
    { title: "07:10 — Zero-Trust Security & SHA-256 HMAC", time: "07:10", desc: "Muhammad Moeez breaks down session rotation and packet signatures." },
    { title: "10:25 — Designing the Obsidian Glass System", time: "10:25", desc: "Crafting dark mode glassmorphism visual tokens." }
  ];

  const archNodes = {
    client: { title: "React Glass Client", detail: "Sub-50ms render loop with optimistic local state updates and Obsidian CSS tokens." },
    gateway: { title: "WebSocket Event Gateway", detail: "Custom multi-threaded socket event dispatcher handling 100K+ concurrent socket streams." },
    security: { title: "Zero-Trust SHA-256 Guard", detail: "Asynchronous worker thread payload verification and stateful JWT token rotation." },
    database: { title: "MongoDB Cluster", detail: "Sharded MongoDB index clusters optimized for high-throughput message logs." }
  };

  const timelineEvents = [
    {
      date: "September 2023",
      title: "The Initial Concept",
      description: "Ali and Muhammad Moeez identified severe connection buffering and latency issues in mainstream chat applications. They began prototyping a lightweight, sub-50ms WebSocket engine."
    },
    {
      date: "February 2024",
      title: "WebSocket Engine v1.0",
      description: "Achieved sub-50ms global message synchronization latency. Bypassed legacy HTTP polling overhead by implementing direct WebSocket binary event streaming."
    },
    {
      date: "July 2024",
      title: "Zero-Trust Security & HMAC Payload Shielding",
      description: "Muhammad Moeez architected the Zero-Trust security layer, introducing salted bcrypt password hashing, stateful JWT session rotation, and SHA-256 HMAC packet signatures."
    },
    {
      date: "November 2024",
      title: "Obsidian Glass UI System",
      description: "Designed the signature Obsidian Dark Glass design language, pairing high-contrast dark palettes with glassmorphism backdrop blurs and fluid micro-animations."
    },
    {
      date: "2025 - Present",
      title: "PulseChat 2.0 Global Infrastructure",
      description: "Successfully benchmarked PulseChat to support over 100,000 active concurrent WebSocket connections while maintaining military-grade security."
    }
  ];

  const toggleAudio = (id) => {
    setPlayingAudioId(playingAudioId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#080b14] text-slate-100 font-sans relative overflow-x-hidden selection:bg-teal-500/30">
      
      {/* Soft Ambient Background Light */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-r from-indigo-600/12 via-cyan-500/08 to-teal-400/12 blur-[160px] rounded-full" />
        <div className="absolute top-[40%] right-0 w-[500px] h-[500px] bg-indigo-600/06 blur-[200px] rounded-full" />
        <div className="absolute top-[70%] left-0 w-[500px] h-[500px] bg-teal-400/06 blur-[200px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:32px_32px] opacity-40" />
      </div>

      {/* Shared Navigation Header */}
      <Navbar toggleDark={toggleDark} isDark={isDark} />

      {/* Main Container */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24 sm:pt-36 sm:pb-32 space-y-16 sm:space-y-24">
        
        {/* Editorial Hero Header */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-400 text-xs font-mono tracking-widest uppercase backdrop-blur-md">
            <Film className="w-3.5 h-3.5 text-teal-400" />
            The Official Technical Documentary
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.12]">
            The Complete Story of <br />
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-teal-400 bg-clip-text text-transparent">
              PulseChat Infrastructure.
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
            An in-depth, seamless documentary covering the vision, sub-50ms concurrency engineering, zero-trust security architecture, and founder journey of **Ali** and **Muhammad Moeez**.
          </p>
        </div>

        {/* ELEGANT WIDESCREEN CINEMATIC VIDEO PREVIEW CARD */}
        <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-[#0d1222] shadow-2xl group">
          <div className="aspect-[16/9] relative flex items-center justify-center overflow-hidden">
            <img
              src="/images/ali_founder.jpg"
              alt="Documentary Preview"
              className="w-full h-full object-cover brightness-75 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d1222] via-[#0d1222]/40 to-transparent" />

            {/* Play Button */}
            <button
              onClick={() => setIsVideoModalOpen(true)}
              className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-teal-400 text-slate-950 flex items-center justify-center shadow-[0_0_40px_rgba(45,212,191,0.5)] hover:scale-110 transition-transform cursor-pointer group/play"
              title="Watch documentary film"
            >
              <Play className="w-8 h-8 fill-slate-950 ml-1 group-hover/play:scale-110 transition-transform" />
            </button>

            {/* Video Duration Badge */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-black/60 border border-white/15 text-slate-200 text-xs font-mono font-semibold backdrop-blur-md flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-teal-400" />
                12 MIN DOCUMENTARY FILM
              </span>
            </div>

            {/* Bottom Caption Overlay */}
            <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-[#080b14]/90 border border-white/10 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="space-y-0.5 text-center sm:text-left">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  PulseChat: Engineering Sub-50ms Realtime Speed
                </h3>
                <p className="text-xs text-slate-300">
                  Featuring Ali (Principal Systems Architect) and Muhammad Moeez (Chief Security Officer).
                </p>
              </div>

              <button
                onClick={() => setIsVideoModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-teal-400 text-slate-950 font-bold text-xs shadow-md hover:scale-105 transition-transform shrink-0 flex items-center gap-1.5"
              >
                Watch Film <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* COMPLETE CONTINUOUS STORY & DOCUMENTARY FLOW */}
        <div className="space-y-20 animate-fadeIn">
          
          {/* Chapter 1 */}
          <article className="space-y-6">
            <div className="space-y-2 border-b border-white/10 pb-4">
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">CHAPTER 01</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                The Concurrency Bottleneck & Origin
              </h2>
              <p className="text-xs font-mono text-slate-400">By Ali, Founder & Principal Systems Architect</p>
            </div>

            <div className="prose prose-invert max-w-none text-slate-300 text-base sm:text-lg leading-relaxed space-y-5 font-normal">
              <p>
                In mid-2023, while analyzing existing messaging web apps, we identified a persistent flaw: standard real-time chat software suffered from heavy HTTP polling lag, memory leaks, and connection drops during high-throughput events. When user streams surpassed 10,000 active sockets, message delivery latency often spiked beyond 300 milliseconds.
              </p>
              <p>
                We believed that developers and teams deserved better. We set out to design a lightweight WebSocket protocol that could deliver sub-50ms message delivery globally while maintaining continuous connection state across devices.
              </p>
            </div>

            {/* Magazine Pull Quote */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-950/40 to-teal-950/40 border border-teal-500/25 space-y-3 my-6">
              <Quote className="w-8 h-8 text-teal-400 opacity-60" />
              <p className="text-lg sm:text-xl text-teal-200 font-normal leading-relaxed italic">
                "Our goal was never just to build another chat app. We wanted an architecture so efficient that message synchronization felt completely instant—like typing in local memory."
              </p>
              <p className="text-xs font-mono text-slate-400 font-bold">— Ali, Principal Systems Architect</p>
            </div>
          </article>

          {/* Chapter 2: Interactive System Topology */}
          <section className="space-y-8 border-t border-white/10 pt-16">
            <div className="space-y-2 border-b border-white/10 pb-4">
              <span className="text-xs font-mono text-teal-400 font-bold uppercase tracking-wider">CHAPTER 02</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                System Topology & Architecture
              </h2>
              <p className="text-xs font-mono text-slate-400">Hover over any architecture node to inspect real-time specs.</p>
            </div>

            {/* Architecture Node Visualizer */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button
                onMouseEnter={() => setHoveredArchNode("client")}
                className={`p-6 rounded-3xl border transition-all text-left space-y-3 ${
                  hoveredArchNode === "client"
                    ? "border-cyan-400 bg-cyan-500/10 shadow-[0_0_30px_rgba(56,189,248,0.2)] scale-105"
                    : "border-white/10 bg-[#0d1222]/80 hover:border-white/20"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-400/20 text-cyan-400 flex items-center justify-center font-bold">
                  <Globe className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">1. React Glass UI</h3>
                <p className="text-xs text-slate-400">Optimistic local rendering & state hooks</p>
              </button>

              <button
                onMouseEnter={() => setHoveredArchNode("gateway")}
                className={`p-6 rounded-3xl border transition-all text-left space-y-3 ${
                  hoveredArchNode === "gateway"
                    ? "border-teal-400 bg-teal-500/10 shadow-[0_0_30px_rgba(45,212,191,0.2)] scale-105"
                    : "border-white/10 bg-[#0d1222]/80 hover:border-white/20"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-teal-400/20 text-teal-400 flex items-center justify-center font-bold">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">2. Socket Gateway</h3>
                <p className="text-xs text-slate-400">Sub-50ms event broker & worker threads</p>
              </button>

              <button
                onMouseEnter={() => setHoveredArchNode("security")}
                className={`p-6 rounded-3xl border transition-all text-left space-y-3 ${
                  hoveredArchNode === "security"
                    ? "border-indigo-400 bg-indigo-500/10 shadow-[0_0_30px_rgba(99,102,241,0.2)] scale-105"
                    : "border-white/10 bg-[#0d1222]/80 hover:border-white/20"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-400/20 text-indigo-400 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">3. SHA-256 Guard</h3>
                <p className="text-xs text-slate-400">Zero-Trust payload verification</p>
              </button>

              <button
                onMouseEnter={() => setHoveredArchNode("database")}
                className={`p-6 rounded-3xl border transition-all text-left space-y-3 ${
                  hoveredArchNode === "database"
                    ? "border-purple-400 bg-purple-500/10 shadow-[0_0_30px_rgba(192,132,252,0.2)] scale-105"
                    : "border-white/10 bg-[#0d1222]/80 hover:border-white/20"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-purple-400/20 text-purple-400 flex items-center justify-center font-bold">
                  <Database className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">4. MongoDB Cluster</h3>
                <p className="text-xs text-slate-400">Sharded realtime database storage</p>
              </button>
            </div>

            <div className="p-6 rounded-3xl border border-teal-500/30 bg-[#0d1222] space-y-2">
              <span className="text-xs font-mono text-teal-400 font-bold uppercase">Node Specification Details:</span>
              <h3 className="text-xl font-bold text-white">{archNodes[hoveredArchNode].title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed font-normal">{archNodes[hoveredArchNode].detail}</p>
            </div>
          </section>

          {/* Chapter 3 */}
          <article className="space-y-6 border-t border-white/10 pt-16">
            <div className="space-y-2 border-b border-white/10 pb-4">
              <span className="text-xs font-mono text-teal-400 font-bold uppercase tracking-wider">CHAPTER 03</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Zero-Trust Cryptography & Threat Prevention
              </h2>
              <p className="text-xs font-mono text-slate-400">By Muhammad Moeez, Co-Founder & Chief Security Officer</p>
            </div>

            <div className="prose prose-invert max-w-none text-slate-300 text-base sm:text-lg leading-relaxed space-y-5 font-normal">
              <p>
                Speed without security is liability. From day one of PulseChat's architecture, **Muhammad Moeez** introduced a Zero-Trust security policy across all socket connections and API endpoints.
              </p>
              <p>
                Instead of relying solely on session cookies, every WebSocket packet frame is validated using SHA-256 HMAC packet signatures. Stateful JWT session tokens auto-expire and rotate seamlessly, guaranteeing that unauthorized packet injection or DDoS floods are severed in milliseconds.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-teal-950/40 to-indigo-950/40 border border-indigo-500/25 space-y-3 my-6">
              <Quote className="w-8 h-8 text-cyan-400 opacity-60" />
              <p className="text-lg sm:text-xl text-cyan-200 font-normal leading-relaxed italic">
                "Security in PulseChat is embedded directly into the socket transport layer. If a packet signature fails verification by even a single byte, it is instantly rejected."
              </p>
              <p className="text-xs font-mono text-slate-400 font-bold">— Muhammad Moeez, Chief Security Officer</p>
            </div>
          </article>

          {/* Chapter 4 */}
          <article className="space-y-6 border-t border-white/10 pt-16">
            <div className="space-y-2 border-b border-white/10 pb-4">
              <span className="text-xs font-mono text-indigo-400 font-bold uppercase tracking-wider">CHAPTER 04</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Crafting the Obsidian Glass Interface
              </h2>
            </div>

            <div className="prose prose-invert max-w-none text-slate-300 text-base sm:text-lg leading-relaxed space-y-5 font-normal">
              <p>
                A high-throughput backend requires a visual interface that is calm, accessible, and elegant. The Obsidian Glass UI design system pairs deep dark palettes (`#080b14`, `#0d1222`) with glassmorphism backdrop blurs, crisp typography, and fluid micro-animations.
              </p>
            </div>
          </article>

          {/* Chapter 5: Founder Profiles & Complete Social Links */}
          <section className="space-y-10 border-t border-white/10 pt-16">
            <div className="space-y-2 border-b border-white/10 pb-4">
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">CHAPTER 05</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Founder Profiles & Complete Social Networks
              </h2>
            </div>

            <div className="space-y-8">
              {/* Ali Profile */}
              <div className="p-8 sm:p-10 rounded-3xl border border-white/10 bg-[#0d1222]/80 backdrop-blur-2xl flex flex-col md:flex-row gap-8 items-start">
                <div className="w-40 h-52 sm:w-48 sm:h-64 rounded-2xl overflow-hidden border border-white/15 bg-black/40 shrink-0 shadow-xl">
                  <img
                    src="/images/ali_founder.jpg"
                    alt="Ali"
                    className="w-full h-full object-cover brightness-105 contrast-105"
                  />
                </div>

                <div className="space-y-4 flex-1">
                  <div className="space-y-1">
                    <span className="px-3 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-mono font-bold uppercase">
                      Full-Stack MERN Lead
                    </span>
                    <h3 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2 pt-1">
                      Ali
                      <BadgeCheck className="w-6 h-6 text-cyan-400" />
                    </h3>
                    <p className="text-sm font-mono text-cyan-300 font-medium">Founder & Principal Systems Architect</p>
                  </div>

                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
                    Ali is a Full-Stack Systems Architect with expertise in high-concurrency Node.js microservices, low-latency WebSocket protocols, and React state optimization.
                  </p>

                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => toggleAudio("ali")}
                        className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-teal-400 text-slate-950 flex items-center justify-center hover:scale-105 transition-transform"
                      >
                        {playingAudioId === "ali" ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-slate-950 ml-0.5" />}
                      </button>
                      <div>
                        <p className="text-xs font-mono font-bold text-white flex items-center gap-1">
                          <Radio className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
                          Founder Audio Statement
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {playingAudioId === "ali" ? "Playing • 0:18 / 0:45" : "Click to listen to voice statement"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ALL 5 SOCIAL LINKS */}
                  <div className="pt-3 border-t border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase font-bold">
                      <span>Connect with Ali:</span>
                      {copiedEmail === "ali@pulsechat.dev" && (
                        <span className="text-teal-400 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Email copied!
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-white/5 hover:bg-indigo-500 text-slate-300 hover:text-white transition-all border border-white/10 flex items-center gap-1.5 text-xs font-mono" title="GitHub">
                        <Github className="w-4 h-4" /> <span>GitHub</span>
                      </a>
                      <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-white/5 hover:bg-cyan-500 text-slate-300 hover:text-white transition-all border border-white/10 flex items-center gap-1.5 text-xs font-mono" title="LinkedIn">
                        <Linkedin className="w-4 h-4" /> <span>LinkedIn</span>
                      </a>
                      <a href="https://facebook.com" target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-white/5 hover:bg-blue-600 text-slate-300 hover:text-white transition-all border border-white/10 flex items-center gap-1.5 text-xs font-mono" title="Facebook">
                        <Facebook className="w-4 h-4" /> <span>Facebook</span>
                      </a>
                      <a href="https://portfolio.dev" target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-white/5 hover:bg-teal-500 text-slate-300 hover:text-slate-950 transition-all border border-white/10 flex items-center gap-1.5 text-xs font-mono" title="Portfolio">
                        <Globe className="w-4 h-4" /> <span>Portfolio</span>
                      </a>
                      <button onClick={() => handleCopyEmail("ali@pulsechat.dev")} className="p-2.5 rounded-xl bg-white/5 hover:bg-teal-500 hover:text-slate-950 text-slate-300 border border-white/10 transition-all flex items-center gap-1.5 text-xs font-mono cursor-pointer" title="Copy Email">
                        <Mail className="w-4 h-4" /> <span>Email</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Moeez Profile */}
              <div className="p-8 sm:p-10 rounded-3xl border border-white/10 bg-[#0d1222]/80 backdrop-blur-2xl flex flex-col md:flex-row gap-8 items-start">
                <div className="w-40 h-52 sm:w-48 sm:h-64 rounded-2xl overflow-hidden border border-white/15 bg-black/40 shrink-0 shadow-xl">
                  <img
                    src="/images/moeez_founder.jpg"
                    alt="Muhammad Moeez"
                    className="w-full h-full object-cover brightness-105 contrast-105"
                  />
                </div>

                <div className="space-y-4 flex-1">
                  <div className="space-y-1">
                    <span className="px-3 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-mono font-bold uppercase">
                      Cyber Security Lead
                    </span>
                    <h3 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2 pt-1">
                      Muhammad Moeez
                      <BadgeCheck className="w-6 h-6 text-teal-400" />
                    </h3>
                    <p className="text-sm font-mono text-cyan-300 font-medium">Co-Founder & Chief Security Officer (CSO)</p>
                  </div>

                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
                    Muhammad Moeez leads cybersecurity engineering and threat defense at PulseChat, specializing in zero-trust architecture and cryptographic packet verification.
                  </p>

                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => toggleAudio("moeez")}
                        className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-teal-400 text-slate-950 flex items-center justify-center hover:scale-105 transition-transform"
                      >
                        {playingAudioId === "moeez" ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-slate-950 ml-0.5" />}
                      </button>
                      <div>
                        <p className="text-xs font-mono font-bold text-white flex items-center gap-1">
                          <Radio className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
                          Founder Audio Statement
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {playingAudioId === "moeez" ? "Playing • 0:15 / 0:40" : "Click to listen to voice statement"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ALL 5 SOCIAL LINKS */}
                  <div className="pt-3 border-t border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase font-bold">
                      <span>Connect with Moeez:</span>
                      {copiedEmail === "moeez@pulsechat.dev" && (
                        <span className="text-teal-400 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Email copied!
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-white/5 hover:bg-indigo-500 text-slate-300 hover:text-white transition-all border border-white/10 flex items-center gap-1.5 text-xs font-mono" title="GitHub">
                        <Github className="w-4 h-4" /> <span>GitHub</span>
                      </a>
                      <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-white/5 hover:bg-cyan-500 text-slate-300 hover:text-white transition-all border border-white/10 flex items-center gap-1.5 text-xs font-mono" title="LinkedIn">
                        <Linkedin className="w-4 h-4" /> <span>LinkedIn</span>
                      </a>
                      <a href="https://facebook.com" target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-white/5 hover:bg-blue-600 text-slate-300 hover:text-white transition-all border border-white/10 flex items-center gap-1.5 text-xs font-mono" title="Facebook">
                        <Facebook className="w-4 h-4" /> <span>Facebook</span>
                      </a>
                      <a href="https://portfolio.dev" target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-white/5 hover:bg-teal-500 text-slate-300 hover:text-slate-950 transition-all border border-white/10 flex items-center gap-1.5 text-xs font-mono" title="Portfolio">
                        <Globe className="w-4 h-4" /> <span>Portfolio</span>
                      </a>
                      <button onClick={() => handleCopyEmail("moeez@pulsechat.dev")} className="p-2.5 rounded-xl bg-white/5 hover:bg-teal-500 hover:text-slate-950 text-slate-300 border border-white/10 transition-all flex items-center gap-1.5 text-xs font-mono cursor-pointer" title="Copy Email">
                        <Mail className="w-4 h-4" /> <span>Email</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Chapter 6: Timeline */}
          <section className="space-y-8 border-t border-white/10 pt-16">
            <div className="space-y-2 border-b border-white/10 pb-4">
              <span className="text-xs font-mono text-teal-400 font-bold uppercase tracking-wider">CHAPTER 06</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Engineering Chronology Timeline
              </h2>
            </div>

            <div className="relative border-l-2 border-white/10 ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-8">
              {timelineEvents.map((evt, idx) => (
                <div key={idx} className="relative group">
                  <span className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-gradient-to-r from-indigo-500 to-teal-400 border-4 border-[#080b14] group-hover:scale-125 transition-transform" />
                  
                  <div className="p-6 rounded-2xl border border-white/10 bg-[#0d1222]/70 space-y-2 hover:border-white/20 transition-all shadow-xl">
                    <span className="text-xs font-mono text-cyan-400 font-bold">{evt.date}</span>
                    <h3 className="text-lg font-bold text-white tracking-tight">{evt.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">{evt.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* CLOSING CALLOUT */}
        <div className="rounded-3xl border border-teal-500/30 bg-gradient-to-r from-[#0d1222] via-[#0f172a] to-[#0b1021] p-8 sm:p-12 text-center max-w-4xl mx-auto space-y-6 shadow-2xl">
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            Ready to experience PulseChat?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Test sub-50ms real-time messaging, zero-trust security defenses, and obsidian glass UI live in your browser.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/signup"
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 via-cyan-400 to-teal-400 text-slate-950 font-bold text-sm shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
            >
              Launch Workspace Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/team"
              className="px-6 py-3 rounded-2xl bg-white/10 text-white font-bold text-sm border border-white/15 hover:bg-white/20 transition-all"
            >
              Back to Team Page
            </Link>
          </div>
        </div>

      </main>

      {/* FULLSCREEN DOCUMENTARY REAL VIDEO MODAL VIEWER */}
      {isVideoModalOpen && (
        <div
          onClick={() => setIsVideoModalOpen(false)}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-3xl animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full bg-[#0d1222] border border-white/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
          >
            <div className="p-4 bg-[#080b14] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold">
                <Film className="w-4 h-4 text-teal-400" />
                <span>PULSECHAT REALTIME INFRASTRUCTURE DOCUMENTARY FILM (HD STREAM)</span>
              </div>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-all border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* REAL HTML5 VIDEO STREAM PLAYER */}
            <div className="aspect-[16/9] bg-black flex items-center justify-center relative overflow-hidden">
              <video
                controls
                autoPlay
                className="w-full h-full object-cover"
                src="https://assets.mixkit.co/videos/preview/mixkit-code-running-on-a-computer-screen-41554-large.mp4"
                poster="/images/ali_founder.jpg"
              />
            </div>

            {/* Video Chapters Selector */}
            <div className="p-4 bg-[#080b14] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-300">
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                {videoChapters.map((ch, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveVideoChapter(idx)}
                    className={`px-3 py-1.5 rounded-xl border text-[11px] font-mono whitespace-nowrap transition-all ${
                      activeVideoChapter === idx
                        ? "bg-teal-400 text-slate-950 border-teal-400 font-bold"
                        : "bg-white/5 border-white/10 text-slate-300 hover:text-white"
                    }`}
                  >
                    {ch.time}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all shrink-0"
              >
                Close Video Player
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shared Footer */}
      <Footer />
    </div>
  );
};

export default FounderDocumentary;
