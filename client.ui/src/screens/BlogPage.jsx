import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import {
  FileText,
  ArrowRight,
  Clock,
  User,
  Zap,
  Radio,
  ShieldCheck,
  Cpu,
  Sparkles
} from "lucide-react";

const BlogPage = ({ toggleDark, isDark }) => {
  const posts = [
    {
      id: 1,
      title: "Achieving Sub-50ms Message Sync with WebSocket v2",
      excerpt: "Deep dive into bi-directional binary frame streaming, socket connection pooling, and payload compression algorithms.",
      category: "ARCHITECTURE",
      author: "Alex Thorne",
      readTime: "6 min read",
      date: "Sep 28, 2026",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80",
      accent: "#6366f1"
    },
    {
      id: 2,
      title: "Native Web Push Service Workers for Background Delivery",
      excerpt: "How native browser service workers allow background message dispatching when browser tabs are closed.",
      category: "ENGINEERING",
      author: "Sophia Chen",
      readTime: "4 min read",
      date: "Sep 24, 2026",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
      accent: "#2dd4bf"
    },
    {
      id: 3,
      title: "Zero-Trust JWT Token Handshaking in Node.js",
      excerpt: "Designing stateful session control middleware with salted bcrypt passwords and HTTP-only cookie guards.",
      category: "SECURITY",
      author: "Elena Rostova",
      readTime: "8 min read",
      date: "Sep 19, 2026",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80",
      accent: "#38bdf8"
    },
    {
      id: 4,
      title: "Building Obsidian Dark Mode Themes for Next-Gen Web Apps",
      excerpt: "Exploring color contrast, glassmorphic backdrop filters, ambient light beam CSS mesh gradients, and fluid typography.",
      category: "DESIGN",
      author: "Marcus Vance",
      readTime: "5 min read",
      date: "Sep 12, 2026",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80",
      accent: "#34d399"
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
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 sm:pt-36 sm:pb-24 space-y-20">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#2dd4bf]/40 bg-[#0f172a]/80 text-[#2dd4bf] text-xs font-mono tracking-widest uppercase backdrop-blur-xl shadow-inner">
            <Sparkles className="w-4 h-4 text-[#2dd4bf]" />
            ENGINEERING & DESIGN JOURNAL
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            Latest Articles & <br />
            <span className="bg-gradient-to-r from-[#818cf8] via-[#38bdf8] to-[#2dd4bf] bg-clip-text text-transparent">
              Technical Insights.
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            In-depth guides on real-time messaging performance, web push service workers, session security, and dark mode UI engineering.
          </p>
        </div>

        {/* Featured Post Card */}
        <div className="rounded-3xl border border-white/10 bg-[#13192e]/90 backdrop-blur-2xl p-8 lg:p-12 hover:border-[#2dd4bf]/50 transition-all duration-300 group grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-2xl">
          <div className="lg:col-span-7 space-y-5">
            <span className="text-xs font-mono uppercase bg-[#2dd4bf]/20 text-[#2dd4bf] border border-[#2dd4bf]/40 px-3 py-1 rounded-full font-bold">
              FEATURED STORY
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight group-hover:text-[#38bdf8] transition-colors">
              {posts[0].title}
            </h2>
            <p className="text-slate-300 text-base leading-relaxed">
              {posts[0].excerpt}
            </p>
            <div className="flex items-center gap-6 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-[#2dd4bf]" /> {posts[0].author}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#38bdf8]" /> {posts[0].readTime}</span>
              <span>{posts[0].date}</span>
            </div>
          </div>
          <div className="lg:col-span-5 rounded-2xl overflow-hidden aspect-video border border-white/10">
            <img src={posts[0].image} alt="Featured" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.slice(1).map((post) => (
            <div
              key={post.id}
              className="rounded-3xl border border-white/10 bg-[#13192e]/80 backdrop-blur-2xl p-6 hover:border-[#2dd4bf]/50 hover:shadow-[0_0_35px_rgba(45,212,191,0.2)] transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="relative mb-6 overflow-hidden rounded-2xl aspect-video border border-white/10">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="font-mono uppercase font-bold text-[#2dd4bf]">
                    {post.category}
                  </span>
                  <span className="text-slate-400">{post.readTime}</span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 leading-snug group-hover:text-[#38bdf8] transition-colors">
                  {post.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6 font-normal">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>{post.author}</span>
                <span className="flex items-center gap-1 text-[#2dd4bf] group-hover:translate-x-1 transition-transform">
                  Read Article <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

      </main>

      {/* Shared Rich Footer */}
      <Footer />
    </div>
  );
};

export default BlogPage;
