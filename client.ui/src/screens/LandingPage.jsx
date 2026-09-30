import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/auth";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import {
  MessageSquare,
  Zap,
  ShieldCheck,
  BellRing,
  Sparkles,
  ArrowRight,
  Sun,
  Moon,
  CheckCircle2,
  Lock,
  Globe,
  Users,
  Smartphone,
  ChevronDown,
  ChevronUp,
  Send,
  CheckCheck,
  Activity,
  Layers,
  Cpu,
  Radio,
  Sliders,
  Terminal,
  UserPlus,
  Rocket,
  FileText,
  Star,
  Quote,
  Bot,
  X,
  MessageCircle,
  Maximize2
} from "lucide-react";

const LandingPage = ({ toggleDark, isDark }) => {
  const [Auth] = useAuth();
  const navigate = useNavigate();

  // Interactive Live Chat Demo state
  const [demoMessages, setDemoMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hi! I am Pulse AI. How can I help you explore PulseChat today? 🚀",
      time: "Just now"
    }
  ]);
  const [inputMsg, setInputMsg] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeFeatureTab, setActiveFeatureTab] = useState("sockets");
  const [openFaq, setOpenFaq] = useState(null);
  const [isFloatingChatOpen, setIsFloatingChatOpen] = useState(false);

  // Auto-scroll demo & floating chat containers to bottom
  useEffect(() => {
    const heroContainer = document.getElementById("hero-chat-container");
    if (heroContainer) {
      heroContainer.scrollTop = heroContainer.scrollHeight;
    }
    const floatingContainer = document.getElementById("floating-chat-container");
    if (floatingContainer) {
      floatingContainer.scrollTop = floatingContainer.scrollHeight;
    }
  }, [demoMessages, isTyping, isFloatingChatOpen]);

  // Listen for global "open-pulse-ai" event (e.g. from Navbar)
  useEffect(() => {
    const handleOpenAiModal = () => setIsFloatingChatOpen(true);
    window.addEventListener("open-pulse-ai", handleOpenAiModal);
    return () => window.removeEventListener("open-pulse-ai", handleOpenAiModal);
  }, []);

  const handleSendDemoMessage = (textToSend) => {
    const text = textToSend || inputMsg;
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setDemoMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMsg("");
    setIsTyping(true);

    setTimeout(() => {
      const lower = text.toLowerCase().trim();
      let botResponse = "";

      // 0. Complete Founder Protection & Multi-Lingual Abuse Shield (English + Roman Urdu/Hindi)
      const mentionsFounder =
        lower.includes("ali") || lower.includes("moeez") || lower.includes("founder") || lower.includes("creator") ||
        lower.includes("architect") || lower.includes("developer") || lower.includes("owner") || lower.includes("bnanewala") ||
        lower.includes("banane") || lower.includes("banaya") || lower.includes("team") || lower.includes("boss");

      const negativeWords = [
        // English insults & negative terms
        "bad", "fool", "stupid", "idiot", "fake", "worst", "hate", "dumb", "scam", "trash", "useless", "shut up", "lazy", "poor", "horrible", "crap", "shit", "bitch", "nonsense", "fraud", "loser", "bogus", "cheater", "clown", "garbage", "bastard", "asshole", "bullshit", "jerk", "dick", "pussy",
        // Roman Urdu / Hindi insults, slang & abusive terms
        "bagirat", "baghairat", "beghairat", "bageerat", "begairat", "gairat", "ghairat", "bakwas", "bakwaas", "bekar", "bekaar", "bura", "buri", "kutta", "kutte", "kaminey", "kameena", "kamina", "harami", "haraami", "chutiya", "chutia", "chutya", "jahil", "jaahil", "pagal", "paagal", "ganda", "gandi", "kachra", "faltu", "faaltu", "fazool", "dhoka", "dhokebaaz", "chor", "batmeez", "badtameez", "ghatiya", "kuch nahi", "sab bura", "bakwas hai", "bekar hai", "lanat", "laanat", "lanti", "laanti", "chawal", "kanjar", "kanjros", "khabees", "zaleel", "deng", "ullu", "gadha", "bhosd", "gand"
      ];

      const urduWords = [
        "bagirat", "baghairat", "beghairat", "bageerat", "begairat", "gairat", "ghairat", "bakwas", "bakwaas", "bekar", "bekaar", "bura", "buri", "kutta", "kutte", "kaminey", "kameena", "kamina", "harami", "haraami", "chutiya", "chutia", "chutya", "jahil", "jaahil", "pagal", "paagal", "ganda", "gandi", "kachra", "faltu", "faaltu", "fazool", "dhoka", "dhokebaaz", "chor", "batmeez", "badtameez", "ghatiya", "lanat", "laanat", "lanti", "laanti", "chawal", "kanjar", "kanjros", "khabees", "zaleel", "deng", "ullu", "gadha", "bhosd", "gand", "bnanewala", "banane", "banaya"
      ];

      const isNegativeOrAbusive = negativeWords.some((w) => lower.includes(w));
      const politePhrases = ["who", "what", "tell", "meet", "about", "how", "show", "profile", "info", "role", "architect", "security", "cso", "leadership", "lead", "hi", "hello", "hey", "good"];
      const isPoliteFounderQuery = mentionsFounder && politePhrases.some((p) => lower.includes(p)) && !isNegativeOrAbusive;

      const isInsultingFounder = mentionsFounder && (isNegativeOrAbusive || !isPoliteFounderQuery);

      if (isInsultingFounder) {
        botResponse =
          "🛡️ Please keep queries respectful toward our founders (Ali & Muhammad Moeez).\n" +
          "Contact our team directly at ✉️ dev.alimehmood@gmail.com";
      }
      else if (isNegativeOrAbusive) {
        botResponse =
          "I can only answer respectful inquiries regarding PulseChat features, performance, security, or leadership.\n" +
          "Contact: ✉️ dev.alimehmood@gmail.com";
      }
      else if (
        /^(hi|hlo|hello|hey|heyy|heya|hola|greetings|good morning|good afternoon|good evening|yo|sup|whassup)/i.test(lower) ||
        lower === "hi" || lower === "hlo" || lower === "hello" || lower === "hey"
      ) {
        botResponse = "Hey there! 👋 Welcome to PulseChat AI. What would you like to explore today?";
      } else if (
        lower.includes("how are you") || lower.includes("how r u") || lower.includes("how do you do") || lower.includes("doing today")
      ) {
        botResponse = "Ready to help! 🚀 All systems are running smoothly at sub-50ms latency.";
      } else if (
        lower.includes("thank") || lower.includes("thx") || lower.includes("awesome") || lower.includes("great") || lower.includes("cool") || lower.includes("nice") || lower.includes("good job")
      ) {
        botResponse = "You're very welcome! 😊 Let me know if there's anything else you need.";
      }
      else if (
        lower.includes("founder") || lower.includes("creator") || lower.includes("who built") || lower.includes("who made") ||
        lower.includes("ali") || lower.includes("moeez") || lower.includes("owner") || lower.includes("developer") || lower.includes("author")
      ) {
        botResponse =
          "👑 Founders & Leadership:\n" +
          "• Ali (Founder & Systems Architect): MERN architecture, WebSocket engine & UI system.\n" +
          "• Muhammad Moeez (Co-Founder & CSO): Zero-trust security & payload encryption.";
      }
      else if (
        lower.includes("what is pulsechat") || lower.includes("what is this") || lower.includes("tell me about") ||
        lower.includes("about pulsechat") || lower.includes("product") || lower.includes("overview") || lower.includes("what can it do")
      ) {
        botResponse =
          "✨ PulseChat Overview:\n" +
          "• Sub-50ms real-time global WebSocket messaging\n" +
          "• Multi-layer JWT session protection & bcrypt encryption\n" +
          "• Background Web Push notifications & dark glass UI";
      }
      else if (
        lower.includes("speed") || lower.includes("fast") || lower.includes("latency") || lower.includes("performance") ||
        lower.includes("benchmark") || lower.includes("lag") || lower.includes("ms") || lower.includes("socket")
      ) {
        botResponse =
          "⚡ Speed & Benchmarks:\n" +
          "• Under 50ms message sync globally\n" +
          "• Handles 100,000+ active WebSocket connections\n" +
          "• Zero buffer lag push-and-pull socket streaming";
      }
      else if (
        lower.includes("security") || lower.includes("secure") || lower.includes("encrypt") || lower.includes("private") ||
        lower.includes("privacy") || lower.includes("jwt") || lower.includes("bcrypt") || lower.includes("hack") || lower.includes("safe")
      ) {
        botResponse =
          "🛡️ Security Defenses:\n" +
          "• Multi-Layer JWT Auth & bcrypt password hashing\n" +
          "• TLS 1.3 socket encryption & DDoS connection throttling";
      }
      else if (
        lower.includes("photo") || lower.includes("image") || lower.includes("picture") || lower.includes("file") ||
        lower.includes("voice") || lower.includes("audio") || lower.includes("media") || lower.includes("attachment")
      ) {
        botResponse =
          "🎙️ Rich Media Features:\n" +
          "• High-Res photo drag & drop uploads\n" +
          "• Voice notes with live waveform visualizers\n" +
          "• Encrypted file & document attachments";
      }
      else if (
        lower.includes("block") || lower.includes("ban") || lower.includes("mute") || lower.includes("report") || lower.includes("spam")
      ) {
        botResponse =
          "🚫 Moderation & Privacy:\n" +
          "• 1-Click user block & status hide\n" +
          "• Automatic socket rate-limiting & anti-spam defense\n" +
          "• Real-time admin network controls";
      }
      else if (
        lower.includes("slack") || lower.includes("discord") || lower.includes("whatsapp") || lower.includes("versus") || lower.includes("compare") || lower.includes("difference")
      ) {
        botResponse =
          "🔥 Key Advantages:\n" +
          "• Sub-1s instant app load time (no bloated webviews)\n" +
          "• 100% Free with unlimited message logs & Web Push\n" +
          "• Eye-friendly dark obsidian glass UI";
      }
      else if (
        lower.includes("tech") || lower.includes("stack") || lower.includes("mern") || lower.includes("react") ||
        lower.includes("node") || lower.includes("express") || lower.includes("mongodb") || lower.includes("code")
      ) {
        botResponse =
          "💻 Tech Stack:\n" +
          "• Frontend: React.js, Tailwind CSS, Vite\n" +
          "• Backend: Node.js, Express microservices, Socket.io\n" +
          "• Database & PWA: MongoDB, Web Push Service Workers";
      }
      else if (
        lower.includes("admin") || lower.includes("dashboard") || lower.includes("manage") || lower.includes("analytics") || lower.includes("control")
      ) {
        botResponse =
          "📊 Admin Suite:\n" +
          "Executive dashboard to monitor WebSocket threads, server health analytics, user roles, and security policies.";
      }
      else if (
        lower.includes("price") || lower.includes("cost") || lower.includes("free") || lower.includes("pay") || lower.includes("money") || lower.includes("subscription")
      ) {
        botResponse =
          "🎉 100% Free:\n" +
          "No credit card, no subscription fees, and no hidden tier limits.";
      }
      else if (
        lower.includes("started") || lower.includes("join") || lower.includes("account") || lower.includes("sign up") || lower.includes("register") || lower.includes("login")
      ) {
        botResponse =
          "🚀 Get Started:\n" +
          "Click 'Launch Workspace' at the top to sign up in 3 seconds and start messaging!";
      }
      else {
        botResponse =
          "Ask me anything about speed, security, features, or team!\n" +
          "For direct developer support: ✉️ dev.alimehmood@gmail.com";
      }

      setDemoMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: botResponse,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
      setIsTyping(false);
    }, 600);
  };

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const faqs = [
    {
      q: "What makes PulseChat different from standard chat apps?",
      a: "PulseChat is engineered for ultra-low latency with WebSocket v2 protocols, native browser Web Push integration, dynamic dark/light aesthetics, and an effortless user experience."
    },
    {
      q: "How fast is message delivery on PulseChat?",
      a: "Messages are dispatched across connected sockets in under 50 milliseconds globally, providing a true real-time conversation feel."
    },
    {
      q: "Are offline notifications supported?",
      a: "Yes. With native Web Push service workers integrated into PulseChat, users get instant alerts on desktop and mobile devices even when closed."
    },
    {
      q: "How is user authentication secured?",
      a: "We utilize JSON Web Tokens (JWT) stored securely with salted password hashes and protected route guards across both client and server APIs."
    }
  ];

  return (
    <div className="min-h-screen bg-[#07090e] dark:bg-[#07090e] text-slate-100 font-sans selection:bg-indigo-500/30 relative overflow-x-hidden">

      {/* Background Ambient Mesh & Brand Color Glow System */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#090d1b] dark:bg-[#090d1b]">
        {/* Deep Navy/Periwinkle to Teal Light Beams */}
        <div className="absolute -top-48 left-1/2 -translate-x-1/2 w-[1200px] h-[700px] bg-gradient-to-tr from-[#6366f1]/30 via-[#38bdf8]/25 to-[#2dd4bf]/25 blur-[180px] rounded-full animate-pulse-glow" />
        <div className="absolute top-[35%] -left-60 w-[700px] h-[700px] bg-[#4f46e5]/20 blur-[200px] rounded-full animate-pulse-glow" style={{ animationDelay: '3s' }} />
        <div className="absolute top-[55%] -right-60 w-[700px] h-[700px] bg-[#0D9488]/20 blur-[200px] rounded-full animate-pulse-glow" style={{ animationDelay: '6s' }} />
        {/* Ultra-Fine Precision Architectural Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:36px_36px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_65%,transparent_100%)] opacity-80" />
      </div>

      {/* Shared Floating Sticky Top Navigation */}
      <Navbar toggleDark={toggleDark} isDark={isDark} />

      {/* Hero Section */}
      <section className="relative pt-28 pb-24 lg:pt-36 lg:pb-36 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

            {/* Left Hero Content */}
            <div className="lg:col-span-6 space-y-8 text-center lg:text-left">

              {/* Theme Match Badge with Glowing Dot */}
              <div className="inline-flex items-center gap-2.5 px-4.5 py-2 rounded-full border border-[#2dd4bf]/40 bg-[#0f172a]/80 text-[#2dd4bf] text-xs font-mono font-semibold tracking-wide backdrop-blur-xl shadow-[0_0_20px_rgba(45,212,191,0.25)]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2dd4bf] animate-ping" />
                <span>AI-DRIVEN REALTIME INFRASTRUCTURE • V2.4</span>
              </div>

              {/* Bold Title with Animated Flowing Gradient */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] text-white">
                Instant Chat. <br />
                <span className="bg-gradient-to-r from-[#818cf8] via-[#38bdf8] to-[#2dd4bf] bg-clip-text text-transparent animate-gradient-flow drop-shadow-[0_0_40px_rgba(45,212,191,0.35)]">
                  Pure Performance.
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
                PulseChat combines ultra-low latency WebSocket streaming, native Web Push background synchronization, and military-grade JWT session control into an exquisite modern interface.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to={Auth?.User ? "/chatpage" : "/signup"}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#6366f1] via-[#38bdf8] to-[#2dd4bf] text-white font-bold text-base shadow-[0_0_30px_rgba(45,212,191,0.4)] hover:shadow-[0_0_50px_rgba(45,212,191,0.7)] hover:scale-[1.03] active:scale-95 transition-all border border-white/20"
                >
                  <span>{Auth?.User ? "Open Web App" : "Explore Workspace"}</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <a
                  href="#demo"
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl border border-white/15 bg-[#13192e] hover:bg-[#1a233d] text-slate-100 font-semibold text-base transition-all backdrop-blur-xl shadow-lg hover:border-[#2dd4bf]/40"
                >
                  <Activity className="w-4.5 h-4.5 text-[#2dd4bf]" />
                  <span>Try Interactive Demo</span>
                </a>
              </div>

              {/* Feature Highlights with Checkmarks */}
              <div className="pt-6 flex flex-wrap justify-center lg:justify-start gap-6 text-xs sm:text-sm font-medium text-slate-300">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4.5 h-4.5 text-[#2dd4bf]" /> No code required
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4.5 h-4.5 text-[#2dd4bf]" /> Sub-50ms latency
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4.5 h-4.5 text-[#2dd4bf]" /> Military security
                </span>
              </div>

            </div>

            {/* Right Hero Interactive Studio Window with Floating Badges & Equalizer */}
            <div id="demo" className="lg:col-span-6 relative">

              {/* Floating Badge Bottom Right */}
              <div className="hidden sm:flex absolute -bottom-6 -right-6 z-20 items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#0f172a]/90 border border-[#6366f1]/40 text-[#818cf8] text-xs font-mono font-bold shadow-[0_0_30px_rgba(99,102,241,0.3)] backdrop-blur-2xl animate-float-delayed">
                <ShieldCheck className="w-4 h-4 text-[#818cf8]" />
                <span>TLS 1.3 Zero-Leak Encrypted</span>
              </div>

              {/* Main Studio Container */}
              <div className="relative rounded-3xl border border-[#2dd4bf]/40 bg-[#0b1021]/95 p-5 sm:p-7 shadow-[0_0_90px_rgba(45,212,191,0.22)] backdrop-blur-3xl overflow-hidden group">

                {/* Brand Top Ambient Glow Bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#6366f1] via-[#38bdf8] to-[#2dd4bf]" />

                {/* Studio Header */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                  <div className="flex items-center gap-3.5">
                    <div className="relative">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#6366f1] via-[#38bdf8] to-[#2dd4bf] flex items-center justify-center text-white font-black text-sm shadow-lg p-[1.5px]">
                        <div className="w-full h-full bg-[#0b1021] rounded-[14px] flex items-center justify-center text-[#38bdf8] font-mono">
                          PC
                        </div>
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#2dd4bf] border-2 border-[#0b1021] rounded-full animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm text-white">PulseChat AI Assistant</h4>
                        <span className="text-[9px] font-mono uppercase bg-[#2dd4bf]/15 text-[#2dd4bf] border border-[#2dd4bf]/40 px-2 py-0.5 rounded-full font-semibold tracking-wider">
                          LIVE BOT
                        </span>
                      </div>
                      <p className="text-xs text-[#34d399] font-medium flex items-center gap-1.5 mt-0.5">
                        <span className="w-2 h-2 rounded-full bg-[#2dd4bf] animate-ping" />
                        Online • WebSocket v2 Active
                      </p>
                    </div>
                  </div>

                  {/* Equalizer Waveform & Mac OS Window Controls */}
                  <div className="flex items-center gap-4">
                    {/* Live Equalizer Bar Animation */}
                    <div className="hidden sm:flex items-end gap-1 h-6 px-2 py-1 rounded-lg bg-[#13192e] border border-white/10">
                      <span className="w-1 bg-[#6366f1] rounded-full animate-wave-1" />
                      <span className="w-1 bg-[#38bdf8] rounded-full animate-wave-2" />
                      <span className="w-1 bg-[#2dd4bf] rounded-full animate-wave-3" />
                      <span className="w-1 bg-[#34d399] rounded-full animate-wave-4" />
                      <span className="w-1 bg-[#6366f1] rounded-full animate-wave-5" />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                      <span className="w-3 h-3 rounded-full bg-[#38bdf8]/80 shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
                      <span className="w-3 h-3 rounded-full bg-[#2dd4bf]/80 shadow-[0_0_8px_rgba(45,212,191,0.5)]" />
                    </div>
                  </div>
                </div>

                {/* Messages Window with Custom Scrollbar */}
                <div
                  id="hero-chat-container"
                  className="h-64 sm:h-72 overflow-y-auto space-y-3.5 pr-2 custom-scrollbar"
                >
                  {demoMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}
                    >
                      {msg.sender === "bot" ? (
                        <div className="max-w-[88%] p-4 rounded-2xl rounded-bl-none bg-gradient-to-br from-[#11162b] via-[#0d1224] to-[#0a0e1c] border border-white/10 border-l-4 border-l-[#2dd4bf] shadow-xl backdrop-blur-2xl space-y-2">
                          <div className="flex items-center justify-between gap-2 pb-1 border-b border-white/5">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-[#2dd4bf] animate-pulse" />
                              <span className="text-[11px] font-bold text-white tracking-wide">PulseChat AI</span>
                            </div>
                            <span className="text-[9px] font-mono text-[#2dd4bf] bg-[#2dd4bf]/10 border border-[#2dd4bf]/30 px-2 py-0.5 rounded-full font-semibold">
                              ⚡ 38ms SYNC
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                            {msg.text}
                          </p>
                          <div className="text-[10px] text-slate-400 font-mono pt-1 flex items-center justify-between">
                            <span>{msg.time}</span>
                            <span className="text-[#34d399] font-sans">Encrypted Socket</span>
                          </div>
                        </div>
                      ) : (
                        <div className="max-w-[85%] min-w-[110px] px-4 py-2.5 rounded-2xl rounded-br-sm bg-gradient-to-r from-[#6366f1] via-[#38bdf8] to-[#2dd4bf] text-slate-950 shadow-[0_4px_25px_rgba(45,212,191,0.35)] border border-white/20 hover:shadow-[0_6px_30px_rgba(45,212,191,0.5)] transition-all">
                          <div className="flex items-end justify-between gap-3">
                            <p className="text-xs sm:text-sm font-bold text-slate-950 leading-tight flex-1">{msg.text}</p>
                            <div className="text-[10px] flex items-center gap-1 font-mono text-slate-900 font-extrabold shrink-0 select-none pb-0.5">
                              <span>{msg.time}</span>
                              <CheckCheck className="w-3.5 h-3.5 text-slate-900" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-[#13192e] border border-white/10 px-4 py-3 rounded-2xl rounded-bl-none text-xs text-slate-400 flex items-center gap-2 backdrop-blur-xl">
                        <span className="w-2 h-2 bg-[#818cf8] rounded-full animate-bounce" />
                        <span className="w-2 h-2 bg-[#38bdf8] rounded-full animate-bounce [animation-delay:0.2s]" />
                        <span className="w-2 h-2 bg-[#2dd4bf] rounded-full animate-bounce [animation-delay:0.4s]" />
                        <span className="text-[11px] font-mono text-[#2dd4bf]">Pulse Socket Engine dispatching...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Interactive Pills */}
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  <button
                    onClick={() => handleSendDemoMessage("What is PulseChat?")}
                    className="text-[11px] font-mono whitespace-nowrap px-3.5 py-1.5 rounded-full bg-[#13192e]/80 hover:border-[#2dd4bf] hover:text-[#2dd4bf] border border-white/10 text-slate-300 transition-all shadow-sm hover:scale-105"
                  >
                    ✨ What is PulseChat?
                  </button>
                  <button
                    onClick={() => handleSendDemoMessage("How fast are messages delivered?")}
                    className="text-[11px] font-mono whitespace-nowrap px-3.5 py-1.5 rounded-full bg-[#13192e]/80 hover:border-[#2dd4bf] hover:text-[#2dd4bf] border border-white/10 text-slate-300 transition-all shadow-sm hover:scale-105"
                  >
                    ⚡ Fast speed?
                  </button>
                  <button
                    onClick={() => handleSendDemoMessage("Is end-to-end security included?")}
                    className="text-[11px] font-mono whitespace-nowrap px-3.5 py-1.5 rounded-full bg-[#13192e]/80 hover:border-[#2dd4bf] hover:text-[#2dd4bf] border border-white/10 text-slate-300 transition-all shadow-sm hover:scale-105"
                  >
                    🛡️ Is it secure?
                  </button>
                  <button
                    onClick={() => handleSendDemoMessage("What is the tech stack?")}
                    className="text-[11px] font-mono whitespace-nowrap px-3.5 py-1.5 rounded-full bg-[#13192e]/80 hover:border-[#2dd4bf] hover:text-[#2dd4bf] border border-white/10 text-slate-300 transition-all shadow-sm hover:scale-105"
                  >
                    💻 Tech Stack?
                  </button>
                  <button
                    onClick={() => handleSendDemoMessage("Who built PulseChat?")}
                    className="text-[11px] font-mono whitespace-nowrap px-3.5 py-1.5 rounded-full bg-[#13192e]/80 hover:border-[#2dd4bf] hover:text-[#2dd4bf] border border-white/10 text-slate-300 transition-all shadow-sm hover:scale-105"
                  >
                    👑 Meet Founders
                  </button>
                  <button
                    onClick={() => handleSendDemoMessage("Is PulseChat free to use?")}
                    className="text-[11px] font-mono whitespace-nowrap px-3.5 py-1.5 rounded-full bg-[#13192e]/80 hover:border-[#2dd4bf] hover:text-[#2dd4bf] border border-white/10 text-slate-300 transition-all shadow-sm hover:scale-105"
                  >
                    🎉 Is it Free?
                  </button>
                </div>

                {/* Interactive Input Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendDemoMessage();
                  }}
                  className="mt-3 flex items-center gap-2"
                >
                  <input
                    type="text"
                    placeholder="Test live typing here..."
                    value={inputMsg}
                    onChange={(e) => setInputMsg(e.target.value)}
                    className="flex-1 px-4 py-3 text-xs sm:text-sm rounded-xl border border-white/15 bg-[#13192e]/90 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#2dd4bf] focus:ring-1 focus:ring-[#2dd4bf]/40 transition-all"
                  />
                  <button
                    type="submit"
                    className="p-3 rounded-xl bg-gradient-to-r from-[#6366f1] via-[#38bdf8] to-[#2dd4bf] text-slate-950 font-bold hover:scale-105 transition-transform shadow-md shadow-[#2dd4bf]/20"
                  >
                    <Send className="w-4 h-4 text-slate-950" />
                  </button>
                </form>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* HOW IT WORKS - 3 Steps Section */}
      <section className="py-24 relative z-10 border-t border-white/10 bg-[#070b16]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#2dd4bf] font-bold block">
              HOW IT WORKS
            </span>
            <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
              Launch in <span className="bg-gradient-to-r from-[#818cf8] via-[#38bdf8] to-[#2dd4bf] bg-clip-text text-transparent">three steps</span>
            </h2>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
              A clear, performance-driven path from initial account creation to real-time global conversation.
            </p>
          </div>

          {/* 3 Step Cards Grid */}
          <div className="relative">
            {/* Desktop Horizontal Connecting Line */}
            <div className="hidden lg:block absolute top-[52px] left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-[#6366f1]/30 via-[#38bdf8]/50 to-[#2dd4bf]/30 z-0" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">

              {/* Step 1 */}
              <div className="p-8 rounded-3xl border border-white/10 bg-[#13192e]/80 backdrop-blur-2xl hover:border-[#6366f1]/50 hover:shadow-[0_0_40px_rgba(99,102,241,0.25)] transition-all duration-300 relative group flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-[#6366f1] text-white flex items-center justify-center shadow-lg shadow-[#6366f1]/30 group-hover:scale-110 transition-transform">
                      <Layers className="w-7 h-7" />
                    </div>
                    <span className="text-4xl font-black text-white/10 font-mono group-hover:text-white/20 transition-colors">
                      01
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white tracking-tight">
                    Create Account & Authenticate
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed font-normal">
                    Register securely with salted password hashing and JWT session validation. Instant multi-device sync ready from day one.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-8 rounded-3xl border border-white/10 bg-[#13192e]/80 backdrop-blur-2xl hover:border-[#2dd4bf]/50 hover:shadow-[0_0_40px_rgba(45,212,191,0.25)] transition-all duration-300 relative group flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-[#2dd4bf] text-slate-950 flex items-center justify-center shadow-lg shadow-[#2dd4bf]/30 group-hover:scale-110 transition-transform">
                      <Cpu className="w-7 h-7" />
                    </div>
                    <span className="text-4xl font-black text-white/10 font-mono group-hover:text-white/20 transition-colors">
                      02
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white tracking-tight">
                    Find Teammates & Join Rooms
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed font-normal">
                    Search colleagues instantly by email or username. Launch high-speed direct 1-on-1 chats or open collaborative channels.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-8 rounded-3xl border border-white/10 bg-[#13192e]/80 backdrop-blur-2xl hover:border-[#38bdf8]/50 hover:shadow-[0_0_40px_rgba(56,189,248,0.25)] transition-all duration-300 relative group flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#38bdf8] to-[#2dd4bf] text-slate-950 flex items-center justify-center shadow-lg shadow-[#38bdf8]/30 group-hover:scale-110 transition-transform">
                      <Rocket className="w-7 h-7" />
                    </div>
                    <span className="text-4xl font-black text-white/10 font-mono group-hover:text-white/20 transition-colors">
                      03
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white tracking-tight">
                    Launch Realtime Sync
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed font-normal">
                    Experience sub-50ms message delivery with native Web Push service worker alerts keeping you connected even offline.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Feature Showcase Grid Section */}
      <section id="features" className="py-24 border-y border-white/10 bg-[#070b16]/90 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#2dd4bf]/40 bg-[#0f172a]/80 text-[#2dd4bf] text-xs font-mono uppercase tracking-widest">
              <Cpu className="w-3.5 h-3.5 text-[#2dd4bf]" />
              ENGINEERED FOR EXCELLENCE
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Powerful <span className="bg-gradient-to-r from-[#818cf8] via-[#38bdf8] to-[#2dd4bf] bg-clip-text text-transparent">Features. Zero Compromise.</span>
            </h2>
            <p className="text-slate-300 text-base sm:text-lg">
              Designed for performance-first messaging with every modern luxury tool built right into the core architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {/* Card 1 */}
            <div className="p-8 rounded-3xl border border-white/10 bg-[#13192e]/80 backdrop-blur-2xl hover:border-[#818cf8]/50 hover:shadow-[0_0_35px_rgba(129,140,248,0.2)] transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-[#090d1b] border border-white/10 text-[#818cf8] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">WebSocket Engine</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Bi-directional WebSocket pipelines ensure message delivery, typing indicators, and user presences sync in under 50ms.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-8 rounded-3xl border border-white/10 bg-[#13192e]/80 backdrop-blur-2xl hover:border-[#38bdf8]/50 hover:shadow-[0_0_35px_rgba(56,189,248,0.2)] transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-[#090d1b] border border-white/10 text-[#38bdf8] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BellRing className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Web Push Background Sync</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Receive notifications when offline or away from the browser tab with native Web Push service worker integration.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-8 rounded-3xl border border-white/10 bg-[#13192e]/80 backdrop-blur-2xl hover:border-[#2dd4bf]/50 hover:shadow-[0_0_35px_rgba(45,212,191,0.2)] transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-[#090d1b] border border-white/10 text-[#2dd4bf] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Military JWT Session Auth</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Stateful authentication guards with salted hashing protocols guarantee that user data remains private and secure.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-8 rounded-3xl border border-white/10 bg-[#13192e]/80 backdrop-blur-2xl hover:border-[#34d399]/50 hover:shadow-[0_0_35px_rgba(52,211,153,0.2)] transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-[#090d1b] border border-white/10 text-[#34d399] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Instant User Search</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Find colleagues, teammates, or friends instantly by email or username and launch real-time 1-on-1 conversations.
              </p>
            </div>

            {/* Card 5 */}
            <div className="p-8 rounded-3xl border border-white/10 bg-[#13192e]/80 backdrop-blur-2xl hover:border-[#818cf8]/50 hover:shadow-[0_0_35px_rgba(129,140,248,0.2)] transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-[#090d1b] border border-white/10 text-[#818cf8] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Smartphone className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Responsive Fluid Aesthetics</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Tailored for every viewport from compact smartphones to ultra-wide desktop displays with high-contrast dark modes.
              </p>
            </div>

            {/* Card 6 */}
            <div className="p-8 rounded-3xl border border-white/10 bg-[#13192e]/80 backdrop-blur-2xl hover:border-[#38bdf8]/50 hover:shadow-[0_0_35px_rgba(56,189,248,0.2)] transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-[#090d1b] border border-white/10 text-[#38bdf8] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Sliders className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Admin Command Portal</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Comprehensive oversight tools allowing system administrators to manage registered users, monitor active chats, and view metrics.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Realtime Performance Benchmark Matrix Section */}
      <section className="py-24 relative z-10 border-t border-white/10 bg-[#070914]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#38bdf8] font-bold block">
              BENCHMARK SPECIFICATIONS
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              Next-Gen <span className="bg-gradient-to-r from-[#818cf8] via-[#38bdf8] to-[#2dd4bf] bg-clip-text text-transparent">Protocol Performance</span>
            </h2>
            <p className="text-slate-300 text-base sm:text-lg">
              Compare PulseChat's WebSockets against traditional legacy HTTP polling architectures.
            </p>
          </div>

          {/* Luxury Comparison Matrix Table */}
          <div className="rounded-3xl border border-white/10 bg-[#13192e]/90 backdrop-blur-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-[#0b1021]/80 text-xs font-mono uppercase text-slate-400">
                    <th className="py-5 px-6 font-semibold">Architectural Spec</th>
                    <th className="py-5 px-6 font-semibold text-[#2dd4bf] flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#2dd4bf]" /> PulseChat Protocol
                    </th>
                    <th className="py-5 px-6 font-semibold text-slate-400">Legacy HTTP Polling</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm font-medium">
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="py-5 px-6 text-white font-bold">Message Latency</td>
                    <td className="py-5 px-6 text-[#2dd4bf] font-mono font-bold">&lt; 50ms Global Sync</td>
                    <td className="py-5 px-6 text-slate-400 font-mono">1,200ms - 5,000ms+</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="py-5 px-6 text-white font-bold">Background Sync</td>
                    <td className="py-5 px-6 text-[#2dd4bf] font-mono font-bold">Native Web Push VAPID Service Worker</td>
                    <td className="py-5 px-6 text-slate-400 font-mono">Browser Tab Must Stay Open</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="py-5 px-6 text-white font-bold">Network Payload Overhead</td>
                    <td className="py-5 px-6 text-[#2dd4bf] font-mono font-bold">2-Byte Binary Frame Streaming</td>
                    <td className="py-5 px-6 text-slate-400 font-mono">800-Byte HTTP Header Overhead</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="py-5 px-6 text-white font-bold">Authentication Guard</td>
                    <td className="py-5 px-6 text-[#2dd4bf] font-mono font-bold">Stateful JWT + Salted Hashing</td>
                    <td className="py-5 px-6 text-slate-400 font-mono">Stateless Unsigned Sessions</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="py-5 px-6 text-white font-bold">Multi-Device Presence</td>
                    <td className="py-5 px-6 text-[#2dd4bf] font-mono font-bold">Instant Bi-Directional Event Pulse</td>
                    <td className="py-5 px-6 text-slate-400 font-mono">Manual Page Reloads Required</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </section>

      {/* Security & Privacy Showcase */}
      <section id="security" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-[#13192e] via-[#0b1021] to-[#090d1b] p-8 sm:p-14 border border-[#2dd4bf]/30 relative overflow-hidden shadow-2xl">

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
              <div className="lg:col-span-8 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2dd4bf]/20 text-[#2dd4bf] text-xs font-mono">
                  <Lock className="w-3.5 h-3.5 text-[#2dd4bf]" />
                  PRIVACY-FIRST INFRASTRUCTURE
                </div>
                <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                  Your Privacy. <span className="bg-gradient-to-r from-[#818cf8] via-[#38bdf8] to-[#2dd4bf] bg-clip-text text-transparent">Guaranteed by Architecture.</span>
                </h2>
                <p className="text-slate-300 text-base leading-relaxed max-w-2xl">
                  PulseChat guarantees data protection using authenticated token validation, hashed database credentials, and protected socket handshakes across every session.
                </p>
                <div className="pt-2 flex flex-wrap gap-6 text-sm font-medium text-slate-300">
                  <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#2dd4bf]" /> Salted Password Hashes</span>
                  <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#2dd4bf]" /> JWT Token Validation</span>
                  <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#2dd4bf]" /> Protected API Endpoints</span>
                </div>
                <div className="pt-4">
                  <Link
                    to="/security"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2dd4bf]/15 text-[#2dd4bf] border border-[#2dd4bf]/40 font-semibold text-sm hover:bg-[#2dd4bf]/25 transition-all"
                  >
                    <span>View Full Security Specifications</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-4 flex justify-center">
                <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-gradient-to-tr from-[#6366f1]/20 via-[#38bdf8]/20 to-[#2dd4bf]/20 border border-[#2dd4bf]/40 flex items-center justify-center shadow-[0_0_50px_rgba(45,212,191,0.3)]">
                  <ShieldCheck className="w-20 h-20 text-[#2dd4bf] animate-pulse" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Moving Infinite Marquee Testimonials Section */}
      <section id="testimonials" className="py-24 relative z-10 border-t border-white/10 bg-[#070b16] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center space-y-3">
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#2dd4bf] font-bold block">
            CLIENT TESTIMONIALS
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Trusted by <span className="bg-gradient-to-r from-[#818cf8] via-[#38bdf8] to-[#2dd4bf] bg-clip-text text-transparent">Realtime Innovators</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto">
            Hover over any review card to pause the live infinite feed.
          </p>
        </div>

        {/* Continuous Infinite Moving Carousel Track */}
        <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_r,transparent,white_10%,white_90%,transparent)]">
          <div className="animate-marquee gap-6 py-4">

            {/* Array of Testimonial Cards Duplicated for Seamless Loop */}
            {[
              {
                quote: "PulseChat's WebSocket engine reduced our messaging latency to under 40ms. The Web Push background integration keeps our global team instantly notified.",
                name: "David K.",
                role: "VP Engineering @ HyperScale",
                avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
                border: "#2dd4bf"
              },
              {
                quote: "The stateful JWT authentication paired with salted hashing gives our enterprise security team total peace of mind. Exceptional dark theme visual design!",
                name: "Sarah M.",
                role: "Chief Security Officer @ Nexus",
                avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
                border: "#38bdf8"
              },
              {
                quote: "Setup took less than 30 seconds. The live studio demo convinced us immediately—sub-50ms message sync is real.",
                name: "James R.",
                role: "Product Lead @ Velocity",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
                border: "#818cf8"
              },
              {
                quote: "The low-latency socket pipelines allowed our team to streamline remote operations seamlessly. Best real-time chat architecture on the market.",
                name: "Sophia C.",
                role: "Lead Architect @ Quantum",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
                border: "#34d399"
              },
              // Loop duplicate set
              {
                quote: "PulseChat's WebSocket engine reduced our messaging latency to under 40ms. The Web Push background integration keeps our global team instantly notified.",
                name: "David K.",
                role: "VP Engineering @ HyperScale",
                avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
                border: "#2dd4bf"
              },
              {
                quote: "The stateful JWT authentication paired with salted hashing gives our enterprise security team total peace of mind. Exceptional dark theme visual design!",
                name: "Sarah M.",
                role: "Chief Security Officer @ Nexus",
                avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
                border: "#38bdf8"
              },
              {
                quote: "Setup took less than 30 seconds. The live studio demo convinced us immediately—sub-50ms message sync is real.",
                name: "James R.",
                role: "Product Lead @ Velocity",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
                border: "#818cf8"
              },
              {
                quote: "The low-latency socket pipelines allowed our team to streamline remote operations seamlessly. Best real-time chat architecture on the market.",
                name: "Sophia C.",
                role: "Lead Architect @ Quantum",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
                border: "#34d399"
              }
            ].map((card, idx) => (
              <div
                key={idx}
                className="w-[380px] shrink-0 p-8 rounded-3xl border border-white/10 bg-[#13192e]/90 backdrop-blur-2xl hover:border-[#2dd4bf]/50 hover:shadow-[0_0_35px_rgba(45,212,191,0.25)] transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed font-normal">
                    "{card.quote}"
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-white/10 flex items-center gap-3.5">
                  <img
                    src={card.avatar}
                    alt={card.name}
                    className="w-11 h-11 rounded-full object-cover border border-[#2dd4bf]/40"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white">{card.name}</h4>
                    <p className="text-xs text-[#2dd4bf] font-mono">{card.role}</p>
                  </div>
                </div>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="py-24 bg-[#090d1b] border-t border-white/10 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#38bdf8] font-bold block">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              Got Questions? <span className="bg-gradient-to-r from-[#818cf8] via-[#38bdf8] to-[#2dd4bf] bg-clip-text text-transparent">We've Got Answers.</span>
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-white/10 bg-[#13192e]/80 backdrop-blur-xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between font-bold text-white hover:text-[#2dd4bf] transition-colors"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-5 h-5 text-[#2dd4bf] shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-5 text-sm text-slate-300 border-t border-white/10 pt-4 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-b from-[#090d1b] to-[#060812]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
            Ready to experience <span className="bg-gradient-to-r from-[#818cf8] via-[#38bdf8] to-[#2dd4bf] bg-clip-text text-transparent">PulseChat?</span>
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg">
            Join users around the globe communicating in real-time. Setup takes less than 30 seconds.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={Auth?.User ? "/chatpage" : "/signup"}
              className="w-full sm:w-auto px-9 py-4 rounded-2xl bg-gradient-to-r from-[#6366f1] via-[#38bdf8] to-[#2dd4bf] text-white font-bold text-lg shadow-[0_0_35px_rgba(45,212,191,0.4)] hover:scale-105 transition-all border border-white/20"
            >
              {Auth?.User ? "Launch Web App" : "Create Free Account"}
            </Link>
          </div>
        </div>
      </section>

      {/* REAL-TIME AI ASSISTANT CENTERED MODAL & LAUNCHER */}
      {/* Centered Modal Overlay (Hides & Blurs Back Screen) */}
      {isFloatingChatOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-[#04060c]/85 backdrop-blur-2xl animate-fadeIn">
          {/* Modal Card (70% Width on Desktop) */}
          <div className="w-[94vw] lg:w-[70%] max-w-5xl h-[84vh] max-h-[780px] rounded-3xl border border-white/20 bg-[#090d1b]/95 shadow-[0_30px_100px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden animate-scaleUp transition-all duration-300 relative">

            {/* Modal Header */}
            <div className="px-4 py-3 sm:px-5 sm:py-3.5 bg-gradient-to-r from-[#13192e] via-[#0f172a] to-[#090d1b] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative group">
                  <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-[#6366f1] via-[#38bdf8] to-[#2dd4bf] opacity-85 blur-sm group-hover:opacity-100 transition-opacity animate-pulse" />
                  <div className="relative w-10 h-10 rounded-xl bg-[#090d1b] border border-white/20 flex items-center justify-center shadow-inner">
                    <Bot className="w-5 h-5 text-[#2dd4bf] drop-shadow-[0_0_8px_rgba(45,212,191,0.8)]" />
                    <Sparkles className="w-3 h-3 text-[#38bdf8] absolute -top-1 -right-1 animate-spin" style={{ animationDuration: '5s' }} />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">PulseChat AI</h3>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" />
                    Active AI Assistant
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsFloatingChatOpen(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all hover:scale-105 border border-white/10"
                title="Close AI Assistant"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Chat Messages Container */}
            <div
              id="floating-chat-container"
              className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-2 custom-scrollbar bg-gradient-to-b from-[#090d1b] via-[#0b0f20] to-[#0d1224]"
            >
              {demoMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}
                >
                  {msg.sender === "bot" ? (
                    <div className="max-w-[92%] sm:max-w-[82%] px-3.5 py-2.5 rounded-2xl rounded-bl-none bg-[#13192e]/95 border border-white/15 border-l-2 border-l-[#2dd4bf] shadow-md text-slate-200 text-xs sm:text-sm leading-snug whitespace-pre-wrap">
                      <div className="flex items-center justify-between text-[11px] font-mono text-[#2dd4bf] pb-1 mb-1 border-b border-white/10 font-semibold">
                        <span className="flex items-center gap-1">
                          <Bot className="w-3.5 h-3.5 text-[#2dd4bf]" />
                          PULSE AI
                        </span>
                        <span className="text-[10px] text-slate-400 font-normal">{msg.time}</span>
                      </div>
                      {msg.text}
                    </div>
                  ) : (
                    <div className="max-w-[85%] sm:max-w-[75%] px-3.5 py-2 rounded-2xl rounded-br-none bg-gradient-to-r from-[#6366f1] via-[#38bdf8] to-[#2dd4bf] text-slate-950 font-medium text-xs sm:text-sm shadow-md">
                      {msg.text}
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#13192e] border border-white/15 px-3 py-2 rounded-xl rounded-bl-none text-xs text-slate-400 flex items-center gap-2 shadow-md">
                    <span className="w-2 h-2 bg-[#818cf8] rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-[#38bdf8] rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 bg-[#2dd4bf] rounded-full animate-bounce [animation-delay:0.4s]" />
                    <span className="text-[11px] font-mono text-[#2dd4bf]">Pulse AI is generating response...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Interactive Chips */}
            <div className="py-2 px-3 border-t border-white/10 bg-[#0d1224] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <button
                onClick={() => handleSendDemoMessage("Who built PulseChat?")}
                className="text-[11px] font-mono whitespace-nowrap px-3 py-1 rounded-full bg-white/5 hover:bg-[#2dd4bf]/20 hover:text-[#2dd4bf] border border-white/10 text-slate-300 transition-all hover:scale-105"
              >
                👑 Meet Founders
              </button>
              <button
                onClick={() => handleSendDemoMessage("How fast is PulseChat?")}
                className="text-[11px] font-mono whitespace-nowrap px-3 py-1 rounded-full bg-white/5 hover:bg-[#2dd4bf]/20 hover:text-[#2dd4bf] border border-white/10 text-slate-300 transition-all hover:scale-105"
              >
                ⚡ Speed & Engine
              </button>
              <button
                onClick={() => handleSendDemoMessage("Is end-to-end security included?")}
                className="text-[11px] font-mono whitespace-nowrap px-3 py-1 rounded-full bg-white/5 hover:bg-[#2dd4bf]/20 hover:text-[#2dd4bf] border border-white/10 text-slate-300 transition-all hover:scale-105"
              >
                🛡️ Zero-Trust Security
              </button>
              <button
                onClick={() => handleSendDemoMessage("What is the tech stack?")}
                className="text-[11px] font-mono whitespace-nowrap px-3 py-1 rounded-full bg-white/5 hover:bg-[#2dd4bf]/20 hover:text-[#2dd4bf] border border-white/10 text-slate-300 transition-all hover:scale-105"
              >
                💻 Tech Stack
              </button>
              <button
                onClick={() => handleSendDemoMessage("Is PulseChat free?")}
                className="text-[11px] font-mono whitespace-nowrap px-3 py-1 rounded-full bg-white/5 hover:bg-[#2dd4bf]/20 hover:text-[#2dd4bf] border border-white/10 text-slate-300 transition-all hover:scale-105"
              >
                🎉 Is it Free?
              </button>
            </div>

            {/* Modal Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendDemoMessage();
              }}
              className="p-2.5 sm:p-3 border-t border-white/10 bg-[#090d1b] flex items-center gap-2.5"
            >
              <input
                type="text"
                placeholder="Ask Pulse AI about speed, security, features..."
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-white/15 bg-[#13192e] text-white placeholder:text-slate-500 focus:outline-none focus:border-[#2dd4bf] focus:ring-1 focus:ring-[#2dd4bf]/40 transition-all"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#6366f1] via-[#38bdf8] to-[#2dd4bf] text-slate-950 font-bold hover:scale-105 transition-transform flex items-center gap-1.5 shadow-md"
              >
                <span className="hidden sm:inline text-xs uppercase tracking-wider font-extrabold">Send</span>
                <Send className="w-4 h-4 text-slate-950" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating AI Launcher Badge Button (Bottom Right) */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        {/* Desktop Expanded Pill Button */}
        <button
          onClick={() => setIsFloatingChatOpen(!isFloatingChatOpen)}
          className="hidden sm:flex group relative items-center gap-3 px-5 py-3.5 rounded-full bg-gradient-to-r from-[#6366f1] via-[#38bdf8] to-[#2dd4bf] text-slate-950 font-black shadow-[0_0_35px_rgba(45,212,191,0.6)] hover:shadow-[0_0_50px_rgba(45,212,191,0.85)] hover:scale-105 transition-all duration-300 border border-white/40 cursor-pointer"
        >
          <div className="relative flex items-center justify-center">
            <div className="w-8 h-8 rounded-xl bg-slate-950/20 flex items-center justify-center border border-slate-950/20 group-hover:scale-110 transition-transform">
              <Bot className="w-5 h-5 text-slate-950 group-hover:rotate-12 transition-transform drop-shadow" />
            </div>
            <Sparkles className="w-3.5 h-3.5 text-slate-950 absolute -top-1.5 -right-1.5 animate-spin" style={{ animationDuration: "5s" }} />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#090d1b] animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#090d1b]" />
          </div>
          <span className="text-xs font-black tracking-wider uppercase">Pulse AI Assistant</span>
          <span className="ml-1 px-2.5 py-0.5 rounded-full bg-slate-950 text-[#2dd4bf] text-[10px] font-mono font-extrabold shadow-sm">
            {isFloatingChatOpen ? "Close" : "PRO AI"}
          </span>
        </button>

        {/* Mobile Compact Circular Floating Button */}
        <button
          onClick={() => setIsFloatingChatOpen(!isFloatingChatOpen)}
          className="sm:hidden w-12 h-12 rounded-full bg-gradient-to-r from-[#6366f1] via-[#38bdf8] to-[#2dd4bf] text-slate-950 shadow-[0_0_25px_rgba(45,212,191,0.7)] active:scale-95 transition-all flex items-center justify-center border border-white/40 cursor-pointer relative"
          aria-label="Open Pulse AI Assistant"
        >
          <Bot className="w-6 h-6 text-slate-950" />
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#090d1b] animate-pulse" />
        </button>
      </div>

      {/* Enhanced Rich Footer */}
      <Footer />

    </div>
  );
};

export default LandingPage;
