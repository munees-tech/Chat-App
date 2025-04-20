import React, { useEffect } from 'react'
import Navbar from "./components/Navbar"
import HomePage from "./pages/HomePage"
import SignupPage from "./pages/SignupPage"
import LoginPage from "./pages/LoginPage"
import Settingpage from "./pages/SettingPage"
import ProfilePage from "./pages/ProfilePage"
import { Routes, Route, Navigate } from "react-router-dom"
import { useAuthStore } from './store/useStoreAuth.js';
import { useThemeStore } from './store/useThemeStore.js'
import {Loader} from "lucide-react"
import {Toaster} from "react-hot-toast"


const App = () => {
  const { authUser, chackAuth, isCheckingAuth , onlineUsers} = useAuthStore();

  console.log(onlineUsers)

  const {theme} = useThemeStore()
  useEffect(() => {
    chackAuth()
  }, [chackAuth])

  
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);


  if (isCheckingAuth && !authUser)
    return (
      <div className='flex justify-center items-center h-screen'>
        <Loader className='size-10 animate-spin' />
      </div>
    )

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={<Settingpage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
      <Toaster/>
    </div>
  )
}

export default App