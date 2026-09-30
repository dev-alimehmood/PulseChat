import { useState, useEffect } from "react"
import "./Css/Style.css"
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import AppLayout from "./layouts/AppLayout"
import Activateaccount from "./screens/auth/Activateaccount"
import ForgotPassword from "./screens/auth/Forgetpassword"
import ResetPassword from "./screens/auth/Resetpassword"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Success from "./screens/auth/Success"
import Signup from "./screens/auth/Signup"
import Login from "./screens/auth/Login"
import OTP from "./screens/auth/OTP"
import P404 from "./screens/P404"
import ImageUpload from "./layouts/Uploading/ImageUpload"
import Chatpage from "./screens/Chatpage"
import { useAuth } from "./context/auth"
import SplashScreen from "./components/shared/SplashScreen"
import AboutApp from "./screens/info/AboutApp"
import LandingPage from "./screens/LandingPage"
import { useWebPush } from "./hooks/useWebPush"
import AdminLayout from "./layouts/AdminLayout"
import DashboardHome from "./screens/admin/DashboardHome"
import UserManagement from "./screens/admin/UserManagement"
import ChatManagement from "./screens/admin/ChatManagement"
import UserDashboard from "./screens/user/UserDashboard"
import Profile from "./screens/user/Profile"
import SecurityPage from "./screens/SecurityPage"
import TeamPage from "./screens/TeamPage"
import BlogPage from "./screens/BlogPage"
import FounderDocumentary from "./screens/FounderDocumentary"
import BackToTop from "./components/shared/BackToTop"

// Automatically scroll window to top whenever location path changes
const ScrollToTop = () => {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

const RootRoute = ({ toggleDark, isDark }) => {
  const [Auth] = useAuth()
  if (!Auth.isReady) return null
  if (Auth?.User) {
    return <Navigate to="/chatpage" replace />
  }
  return <LandingPage toggleDark={toggleDark} isDark={isDark} />
}

const Elecrto = () => {
  const [Auth] = useAuth()
  const [initialLoading, setInitialLoading] = useState(false)
  
  // Setup Web Push Subscriptions
  useWebPush()
  
  const [dark, setDark] = useState(() => {
    // Check local storage or system preference on initial load
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme) {
        return savedTheme === 'dark'
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })

  useEffect(() => {
    const root = window.document.documentElement
    if (dark) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [dark])

  const toggleDark = () => setDark((prev) => !prev)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d1b] text-slate-900 dark:text-white transition-colors duration-500 font-['Inter','Segoe_UI',sans-serif]">
      <div className="opacity-100">
        <Router>
          <ScrollToTop />
          <BackToTop />
          <ToastContainer theme={dark ? "dark" : "light"} />
        <Routes>
          <Route path="/" element={<RootRoute toggleDark={toggleDark} isDark={dark} />} />
          <Route path="/security" element={<SecurityPage toggleDark={toggleDark} isDark={dark} />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/founder-documentary" element={<FounderDocumentary toggleDark={toggleDark} isDark={dark} />} />
          
          <Route element={<AppLayout toggleDark={toggleDark} isDark={dark} />}>
            <Route path="/chatpage" element={<Chatpage toggleDark={toggleDark} isDark={dark} />} />
            <Route path="/about" element={<AboutApp />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/:token" element={<Activateaccount />} />
          <Route path="/forgetpassword" element={<ForgotPassword />} />
          <Route path="/otp" element={<OTP />} />
          <Route path="/resetpassword/:token" element={<ResetPassword />} />
          <Route path="/success" element={<Success />} />
          <Route path="/imageupload" element={<ImageUpload />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="chats" element={<ChatManagement />} />
          </Route>

          <Route path="/*" element={<P404 />} />
        </Routes>
      </Router>
      </div>
    </div>
  )
}

export default Elecrto