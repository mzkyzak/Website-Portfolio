import React, { useEffect } from "react"
import Navbar from "./components/Navbar"
import PreLoader from "./components/PreLoader"
import Home from "./sections/Home"
import AnimatedBackground from "./components/AnimatedBackground"

import AOS from "aos"
import "aos/dist/aos.css"

export default function App() {
  useEffect(() => {
    AOS.init({
      once: false, // animasi ULANG saat scroll (sesuai request kamu)
      duration: 1000,
      easing: "ease-out-cubic",
      offset: 60,
    })
  }, [])

  return (
    <div className="relative min-h-screen overflow-x-hidden scroll-smooth bg-[#030014] text-white">

      {/* 🌌 BACKGROUND GLOBAL (WAJIB PALING ATAS) */}
      <AnimatedBackground />

      {/* 🔄 PRELOADER */}
      <PreLoader />

      {/* 🔝 NAVBAR */}
      <div className="relative z-20">
        <Navbar />
      </div>

      {/* 📦 MAIN CONTENT */}
      <main className="relative z-10">
        <Home />
      </main>

      {/* 👉 Footer bisa ditaruh di sini kalau belum ada di Home */}
    </div>
  )
}