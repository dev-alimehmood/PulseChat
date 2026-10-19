import { Outlet, useLocation, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import Sidebar from "../components/sidebar/Sidebar";

const AppLayout = ({ toggleDark, isDark }) => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isChat = location.pathname === "/chatpage" || location.pathname === "/";
  const isChatOpenOnMobile = isChat && Boolean(searchParams.get("chat"));

  useEffect(() => {
    // Always lock window scroll to (0,0) when in the app layout
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    if (isChat) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
      };
    }
  }, [location.pathname, isChat]);

  return (
    <div className="flex h-screen h-[100dvh] max-h-screen overflow-hidden bg-slate-50 text-slate-900 transition-colors duration-500 dark:bg-[#07090e] dark:text-slate-100 relative selection:bg-[#38bdf8]/30">
      
      {/* Background Ambient Mesh & Precision Dot Grid (Matching Landing Page) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-slate-50 dark:bg-[#090d1b] transition-colors duration-500">
        <div className="hidden dark:block absolute -top-48 left-1/4 w-[900px] h-[550px] bg-gradient-to-tr from-[#6366f1]/20 via-[#38bdf8]/15 to-[#2dd4bf]/15 blur-[160px] rounded-full pointer-events-none animate-pulse-glow" />
        <div className="hidden dark:block absolute bottom-0 right-0 w-[700px] h-[700px] bg-[#4f46e5]/10 blur-[180px] rounded-full pointer-events-none" />
        <div className="hidden dark:block absolute top-[40%] -right-40 w-[500px] h-[500px] bg-[#0D9488]/15 blur-[170px] rounded-full pointer-events-none" />
        {/* Architectural Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(148,163,184,0.12)_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:32px_32px] opacity-75 pointer-events-none" />
      </div>

      <Sidebar toggleDark={toggleDark} isDark={isDark} className={isChatOpenOnMobile ? "hidden md:flex" : "flex"} />
      <div className="flex min-w-0 flex-1 flex-col h-full max-h-screen overflow-hidden relative z-10">
        <main className={`flex-1 min-h-0 h-full relative ${isChat ? "overflow-hidden" : "overflow-y-auto custom-scrollbar"}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
