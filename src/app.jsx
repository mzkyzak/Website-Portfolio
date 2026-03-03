import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

// Import Komponen
import Navbar from "./components/Navbar";
import PreLoader from "./components/PreLoader";
import Footer from "./components/Footer";
import Home from "./sections/Home";

export default function App() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className="bg-[#030014] text-white overflow-x-hidden scroll-smooth selection:bg-red-500/30">
      <PreLoader />
      <Navbar />
      
      <main className="relative z-10">
        <Home />
      </main>

      <Footer />
    </div>
  );
}