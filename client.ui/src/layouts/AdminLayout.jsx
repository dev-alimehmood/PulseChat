import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from "../context/auth";
import Sidebar from "../components/sidebar/Sidebar";
import { useEffect, useState } from 'react';

const AdminLayout = () => {
  const [auth] = useAuth();
  const navigate = useNavigate();
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme === 'dark';
    }
    return false;
  });

  const toggleDark = () => setDark((prev) => !prev);

  // Redirect if not admin
  useEffect(() => {
    if (auth?.isReady && (!auth?.User || !auth.User.isadmin)) {
      navigate("/");
    }
  }, [auth, navigate]);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#090d1b] font-sans transition-colors duration-300 overflow-hidden">
      <Sidebar toggleDark={toggleDark} isDark={dark} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6 custom-scrollbar relative">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
