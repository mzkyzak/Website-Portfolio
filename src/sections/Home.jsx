import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

// ===== UI ICONS (FONT AWESOME & LUCIDE) =====
import {
  FaExternalLinkAlt,
  FaCode,
  FaAward,
  FaArrowRight,
  FaDownload,
  FaSearchPlus,
  FaTimes
} from "react-icons/fa";

import { 
  MapPin, 
  GraduationCap, 
  Code2, 
  Award, 
  ChevronRight, 
  User 
} from "lucide-react";

// ===== DATA & LIB =====
import { listProyek, listTools, listCertificates } from "../data";
import Swal from "sweetalert2";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";

// Ini untuk menampilan Portfolio 
const listOS = [
  { name: "Windows", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/windows8/windows8-original.svg" },
  { name: "Android", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg" },
  { name: "Ubuntu",  logo:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ubuntu/ubuntu-original.svg" },
  { name: "Linux", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg" }
];

export const listDesignTools = [
  { name: "Figma", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
  { name: "Unity", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/unity/unity-original.svg" },
  { name: "Canva", logo: "https://www.vectorlogo.zone/logos/canva/canva-icon.svg" }, 
  { name: "Lightroom", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b6/Adobe_Photoshop_Lightroom_CC_logo.svg" },
  { name: "Capcut", logo: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Capcut-icon.svg" },
];

const listSocials = [
  { name: "LinkedIn", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg", url: "https://www.linkedin.com/in/taufiq-ikhsan-muzaky-42ab26388/" },
  { name: "WhatsApp", logo: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg", url: "https://wa.me/6285810192529" },
  { name: "Instagram", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg", url: "https://www.instagram.com/mzky_zak" },
  { name: "GitHub", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg", url: "https://github.com/mzkyzak" },
  { name: "TikTok", logo: "https://www.svgrepo.com/show/333611/tiktok.svg", url: "https://www.tiktok.com/@mzky896" },
  { name: "Youtube", logo: "https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg", url: "https://www.youtube.com/@mzky896" },
];

// Helper untuk menghindari error jika renderIcon dipanggil
const renderIcon = (name) => {
  return <FaCode />;
};

// --- KOMPONEN: BACKGROUND ANIMASI BINTANG ---
const Starfield = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -200]);

  return (
    <motion.div style={{ y }} className="fixed inset-0 -z-20 pointer-events-none">
      {[...Array(60)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-white rounded-full opacity-30"
          style={{
            width: Math.random() * 4 + 1 + "px",
            height: Math.random() * 2 + 1 + "px",
            left: Math.random() * 100 + "%",
            top: Math.random() * 100 + "%",
          }}
          animate={{
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: Math.random() * 1.5 + 0.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </motion.div>
  );
};

// --- KOMPONEN: MOUSE SPOTLIGHT (WARNA LEBIH CERAH) ---
const MouseSpotlight = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div 
      className="fixed inset-0 z-50 pointer-events-none transition-opacity duration-300"
      style={{
        background: `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, rgba(220, 38, 38, 0.15), transparent 80%)`
      }}
    />
  );
};

const TypingText = () => {
  const words = ["Kreatif", "Inovatif", "Usaha"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [words.length]);

  return (
    <div className="h-[1.2em] overflow-hidden flex items-center justify-center md:justify-start">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="text-red-500 inline-block font-bold italic drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

export default function Home() {
  // --- 1. STATE (Sudah ada di kodemu) ---
  const [activeTab, setActiveTab] = useState("projects");
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- 2. PASTE KODE INI DI SINI (SOLUSI ERROR) ---
  const nextSlide = (e) => {
    if (e) e.stopPropagation();
    const images = selectedProject?.images || [];
    if (images.length === 0) return;
    setCurrentImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = (e) => {
    if (e) e.stopPropagation();
    const images = selectedProject?.images || [];
    if (images.length === 0) return;
    setCurrentImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  // ... sisa kode lainnya

  useEffect(() => {
    AOS.init({ 
      duration: 2000, 
      once: false, 
      mirror: true,
      easing: 'ease-out-back'
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    Swal.fire({ 
      title: "Sending...", 
      text: "Mohon tunggu sebentar",
      background: '#030014',
      color: '#fff',
      allowOutsideClick: false, 
      didOpen: () => Swal.showLoading() 
    });

    try {
      const formSubmitUrl = 'https://formsubmit.co/ajax/taufiqikhsanmuzaky18@gmail.com';
      const payload = {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        _subject: 'New Message from Portfolio: ' + formData.name,
        _captcha: 'false',
        _template: 'table'
      };

      const response = await axios.post(formSubmitUrl, payload);

      if (response.status === 200) {
        Swal.fire({
          title: 'Berhasil!',
          text: 'Pesan Anda telah mendarat di inbox saya.',
          icon: 'success',
          background: '#030014',
          color: '#fff',
          confirmButtonColor: '#dc2626',
          timer: 3000
        });
        setFormData({ name: "", email: "", message: "" });
      }
    } catch (error) {
      Swal.fire({
        title: 'Gagal!',
        text: 'Ada kendala koneksi.',
        icon: 'error',
        background: '#030014',
        color: '#fff',
        confirmButtonColor: '#dc2626'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#030014] text-slate-300 min-h-screen font-jakarta overflow-x-hidden selection:bg-red-600/30">
      
      <Starfield />
      <MouseSpotlight />

      {/* HERO SECTION */}
      <section
        id="home"
        className="min-h-screen flex items-center justify-center px-6 relative z-10 overflow-hidden"
      >
        <div className="max-w-6xl w-full grid md:grid-cols-2 gap-10 items-center">

          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 mb-6 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-red-400 text-[10px] font-bold uppercase tracking-widest">
                mzkyzak
              </span>
            </div>

            <h1 className="font-outfit text-4xl md:text-5xl lg:text-6xl font-extrabold text-white uppercase leading-tight mb-4 tracking-tight">
              <motion.span
                animate={{
                  textShadow: [
                    "0px 0px 10px #ef4444",
                    "0px 0px 30px #ef4444",
                    "0px 0px 10px #ef4444",
                  ],
                }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                Taufiq Ikhsan Muzaky
              </motion.span>
              <br />
              <TypingText />
            </h1>

            <p className="text-slate-400 text-base md:text-lg max-w-md mb-8 leading-relaxed">
          Kepribadian saya terbentuk melalui kegiatan yang melatih kedisiplinan, kerja sama tim, tanggung jawab, kepemimpinan, serta kepedulian sosial. Saya menciptakan dan mengembangkan website, game, serta aplikasi untuk membangun solusi digital yang fungsional dan ramah pengguna. Melalui portofolio ini, Anda dapat menjelajahi berbagai proyek pengembangan perangkat lunak yang telah saya kerjakan.
            </p>

            <div className="flex gap-4">
              <motion.a
                href="#portfolio"
                whileHover={{ scale: 1.08, boxShadow: "0 0 40px rgba(220,38,38,0.6)" }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3.5 bg-red-600 text-white text-xs font-bold rounded-xl
                shadow-[0_0_30px_rgba(220,38,38,0.4)]
                flex items-center gap-2 uppercase tracking-widest transition-all"
              >
                Portfolio me <FaArrowRight size={12} />
              </motion.a>

              <motion.a
                href="#about"
                whileHover={{ scale: 1.06, backgroundColor: "rgba(255,255,255,0.1)" }}
                className="px-8 py-3.5 glass-effect text-white text-xs font-bold rounded-xl
                flex items-center gap-2 uppercase tracking-widest border border-white/10"
              >
                Profile <User size={14} />
              </motion.a>
            </div>
          </motion.div>

          {/* RIGHT CONTENT (GIF) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
            className="relative flex justify-center md:justify-end"
          >
            <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center">
              <div className="absolute inset-0 bg-red-600/10 blur-[120px] rounded-full animate-pulse" />
              <motion.img
                src="/website_mzkyzak.gif"
                alt="Development Animation"
                className="relative z-10 w-full h-auto drop-shadow-[0_0_50px_rgba(220,38,38,0.3)]"
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </div>
      </section>

{/* ABOUT SECTION – PROFESSIONAL REMEMBERABLE */}
<section
  id="about"
  className="relative z-10 overflow-hidden bg-[#030014] py-28 px-6"
>
  {/* 🌌 BACKGROUND LIVING GLOW */}
  <div className="pointer-events-none absolute inset-0">
    <motion.div
      animate={{ opacity: [0.2, 0.45, 0.2], scale: [1, 1.2, 1] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-red-600/20 blur-[140px]"
    />
    <motion.div
      animate={{ opacity: [0.15, 0.35, 0.15], scale: [1, 1.15, 1] }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      className="absolute -bottom-[10%] -right-[10%] h-[40%] w-[40%] rounded-full bg-blue-600/20 blur-[140px]"
    />
  </div>

  {/* BORDER GLOW */}
  <motion.div
    aria-hidden
    animate={{ opacity: [0.15, 0.35, 0.15] }}
    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    className="pointer-events-none absolute inset-0 border border-white/10"
  >
    <div className="absolute inset-0 border border-red-500/20 blur-md" />
  </motion.div>

  <div className="relative z-10 mx-auto max-w-5xl">
    <div className="grid items-center gap-14 lg:grid-cols-12">

      {/* LEFT */}
      <div className="lg:col-span-5 flex flex-col items-center">
        {/* AVATAR */}
        <div className="relative">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 blur opacity-20" />
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative h-72 w-72 overflow-hidden rounded-full border-[6px] border-[#030014] md:h-80 md:w-80"
          >
            <img
              src="/Profile.jpg"
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </motion.div>
        </div>

        {/* QUICK STATS */}
        <div className="mt-12 grid w-full max-w-sm grid-cols-2 gap-4">
          {[
            { label: "Location", value: "Jakarta, ID", color: "red" },
            { label: "Education", value: "SMKN 2 JKT", color: "blue" },
          ].map((item, i) => (
            <motion.div
              key={i}
              animate={{
                boxShadow: [
                  "0 0 0 rgba(0,0,0,0)",
                  item.color === "red"
                    ? "0 0 25px rgba(239,68,68,0.18)"
                    : "0 0 25px rgba(59,130,246,0.18)",
                  "0 0 0 rgba(0,0,0,0)",
                ],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: i }}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md"
            >
              <p
                className={`mb-1 text-[13px] font-mono uppercase tracking-widest ${
                  item.color === "red"
                    ? "text-red-500/60"
                    : "text-blue-500/60"
                }`}
              >
                {item.label}
              </p>
              <p className="text-sm font-bold text-white">{item.value}</p>
            </motion.div>
          ))}
        </div>

        {/* PROJECT & CERTIFICATE */}
        <div className="mt-6 grid w-full max-w-sm grid-cols-2 gap-4">
          {[
            { title: "Projects", count: "6+", icon: "📁", color: "red" },
            { title: "Certificates", count: "20+", icon: "🎓", color: "blue" },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4, scale: 1.02 }}
              animate={{
                boxShadow: [
                  "0 0 0 rgba(0,0,0,0)",
                  item.color === "red"
                    ? "0 0 25px rgba(239,68,68,0.25)"
                    : "0 0 25px rgba(59,130,246,0.25)",
                  "0 0 0 rgba(0,0,0,0)",
                ],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: i }}
              className="group cursor-default rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p
                    className={`text-xs font-mono uppercase tracking-widest ${
                      item.color === "red" ? "text-red-400" : "text-blue-400"
                    }`}
                  >
                    {item.title}
                  </p>
                  <p className="text-xl font-bold text-white">{item.count}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* RIGHT */}
      <div className="lg:col-span-7 space-y-10">
        <div className="relative inline-block">
          <div className="absolute -inset-2 rounded-xl bg-gradient-to-r from-red-500/20 to-blue-500/20 blur-md animate-pulse" />
          <h3 className="relative text-4xl font-bold uppercase tracking-tight text-white md:text-5xl">
            About{" "}
            <span className="bg-gradient-to-r from-red-400 to-blue-400 bg-clip-text text-transparent">
              Me
            </span>
          </h3>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-xl text-base leading-relaxed text-slate-400 md:text-lg"
        >
          Perkenalkan, nama saya{" "}
          <span className="relative font-medium italic text-white">
            Taufiq Ikhsan Muzaky (Zaky) 
            <motion.span
              aria-hidden
              animate={{ scaleX: [0, 1, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-0 -bottom-1 h-[2px] w-full origin-left bg-gradient-to-r from-red-500 to-blue-500"
            />
          </span>
          Saya adalah Seorang siswa Dari jurusan Rekayasa Perangkat Lunak Di sekolah Smkn 2 Jakarta Pusat karena saya memiliki minat dalam pengembangan aplikasi, game dan website. Dan Berpengalaman mengerjakan berbagai proyek sekolah dan mandiri, saya berfokus pada pembuatan solusi digital yang responsif, fungsional, dan ramah pengguna.
        </motion.p>

        <a
          href="/CV_Taufiq_ikhsan_muzaky.pdf"
          download
          className="relative inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-8 py-3.5 text-xs font-bold tracking-[0.25em] text-white transition-all hover:border-red-500/50"
        >
          DOWNLOAD CV
          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500/20 to-blue-500/20 opacity-0 blur-md transition-opacity hover:opacity-100" />
        </a>
      </div>
    </div>
  </div>
</section>

 {/* PORTFOLIO SECTION */}
<section id="portfolio" className="py-24 px-6 relative z-10 overflow-hidden">
  <div className="max-w-6xl mx-auto">
    
    {/* TITLE */}
    <div className="mb-12" data-aos="fade-right">
      <motion.h3 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter">
        Portfolio 
      </motion.h3>
      <motion.div initial={{ width: 0 }} whileInView={{ width: "100px" }} className="h-2 bg-red-600 mt-2 rounded-full shadow-[0_0_10px_#dc2626]" />
    </div>

    {/* NAVIGATION TABS (PREMIUM & BOLD) */}
<div className="flex justify-center mb-20" data-aos="fade-up">
  <div className="flex flex-wrap justify-center gap-2 p-2 bg-white/5 backdrop-blur-3xl rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden">
    {["projects", "certificates", "tech", "design", "os"].map((tab) => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`px-8 md:px-10 py-4 rounded-[1.5rem] text-[11px] font-[900] uppercase tracking-[0.25em] transition-all duration-500 relative group
        ${activeTab === tab ? "text-white" : "text-slate-500 hover:text-slate-200"}`}
      >
        {/* ANIMASI BACKGROUND AKTIF (SNAPPY & GLOW) */}
        {activeTab === tab && (
          <motion.div 
            layoutId="activeTab" 
            className="absolute inset-0 bg-red-600 rounded-[1.5rem] z-0 shadow-[0_10px_30px_rgba(220,38,38,0.5)]"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        
        {/* EFEK HOVER GARIS BAWAH TIPIS (SAAT TIDAK AKTIF) */}
        {activeTab !== tab && (
          <span className="absolute bottom-2 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-red-600/50 group-hover:w-1/2 transition-all duration-300" />
        )}

        <span className="relative z-10 flex items-center gap-2">
          {tab}
        </span>
      </button>
    ))}
  </div>
</div>

    {/* CONTENT GRID */}
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        
       {/* 1. PROJECTS TAB (SINKRON DENGAN CERTIFICATES) */}
{activeTab === "projects" && (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
    {listProyek.map((proyek, index) => (
      <motion.div 
        key={proyek.id} 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }} // Animasi ulang saat scroll up/down
        transition={{ 
          duration: 0.8, 
          delay: index * 0.1,
          ease: [0.25, 0.4, 0, 1] 
        }}
        className="group relative cursor-pointer"
      >
        {/* CONTAINER GAMBAR (GAYA PREMIUM GALLERY) */}
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-b from-white/5 to-transparent aspect-video flex items-center justify-center transition-all duration-700 group-hover:border-red-600/50 group-hover:shadow-[0_20px_50px_rgba(220,38,38,0.15)]">
          
          {/* EFEK GLOW DI BELAKANG GAMBAR */}
          <div className="absolute inset-0 bg-red-600/0 group-hover:bg-red-600/5 blur-3xl transition-all duration-700" />

          {/* GAMBAR PROYEK DENGAN SOFT ZOOM & FLOAT (SAMA DENGAN CERT) */}
          <motion.img 
            src={proyek.img} 
            alt={proyek.title} 
            className="w-full h-full object-cover"
            animate={{ y: [0, -8, 0] }}
            transition={{ 
              duration: 6, 
              repeat: Infinity, 
              ease: "easeInOut", 
              delay: index * 0.2 
            }}
            whileHover={{ scale: 1.1 }}
            onClick={() => {
              setSelectedProject(proyek);
              setCurrentImgIndex(0);
            }}
          />

          {/* OVERLAY INFO SAAT HOVER (MODERN GRADIENT) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8 pointer-events-none">
             <motion.div
               initial={{ y: 20, opacity: 0 }}
               whileInView={{ y: 0, opacity: 1 }}
               transition={{ duration: 0.4 }}
             >
               <p className="text-white text-[10px] font-black uppercase tracking-[0.2em]">
                 Click Untuk Zoom View
               </p>
             </motion.div>
          </div>
          
          {/* EFEK SHINE (KILATAN CAHAYA) */}
          <div className="absolute top-0 -inset-full h-full w-1/2 z-20 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:animate-shine pointer-events-none" />
        </div>

        {/* INFO TEXT (TITLES & SUBTITLE) */}
        <div className="mt-6 px-4">
          <span className="text-red-500 text-[15px] font-black uppercase tracking-[0.3em]">
            {proyek.subtitle}
          </span>
          
          <h4 className="text-white font-black text-2xl uppercase tracking-tighter leading-tight mt-2 group-hover:text-red-500 transition-colors duration-300">
            {proyek.title}
          </h4>
          
          {/* UNDERLINE & LINK */}
          <div className="flex items-center justify-between gap-3 mt-4">
            <div className="flex items-center gap-3">
              <div className="h-[2px] w-8 bg-red-600 group-hover:w-12 transition-all duration-500 shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
              <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.2em] group-hover:text-white transition-colors">
                Lihat Project
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    ))}
  </div>
)}

       {/* 2. CERTIFICATES TAB (PREMIUM GALLERY STYLE) */}
{activeTab === "certificates" && (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
    {listCertificates.map((cert, index) => (
      <motion.div
        key={cert.id}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ 
          duration: 0.8, 
          delay: index * 0.1,
          ease: [0.25, 0.4, 0, 1] // Custom cubic-bezier untuk gerakan elegan
        }}
        className="group relative cursor-pointer"
      >
        {/* CONTAINER GAMBAR DENGAN FRAME PROFESSIONAL */}
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/5 to-transparent aspect-[4/3] flex items-center justify-center transition-all duration-700 group-hover:border-red-600/50 group-hover:shadow-[0_20px_50px_rgba(220,38,38,0.15)]">
          
          {/* EFEK GLOW DI BELAKANG GAMBAR */}
          <div className="absolute inset-0 bg-red-600/0 group-hover:bg-red-600/5 blur-3xl transition-all duration-700" />

          {/* GAMBAR SERTIFIKAT DENGAN SOFT ZOOM & FLOAT */}
          <motion.img 
            src={cert.img} 
            alt={cert.title} 
            className="w-full h-full object-cover"
            animate={{ 
              y: [0, -5, 0],
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: index * 0.2 
            }}
            whileHover={{ scale: 1.1 }}
          />

          {/* OVERLAY INFO SAAT HOVER (MODERN GRADIENT) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
             <motion.div
               initial={{ y: 20, opacity: 0 }}
               whileHover={{ y: 0, opacity: 1 }}
               transition={{ duration: 0.4 }}
             >
               <span className="bg-red-600 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-3 inline-block">
                 Verifikasi✅
               </span>
               <p className="text-white text-[10px] font-bold uppercase tracking-[0.3em] opacity-80">
                 Pada Tanggal: {cert.date || "2025 - 2026"}
               </p>
             </motion.div>
          </div>
        </div>

        {/* INFO TEXT (TITLES & ISSUER) */}
        <div className="mt-6 text-center md:text-left px-4">
          <h4 className="text-white font-black text-xl uppercase tracking-tighter leading-tight group-hover:text-red-500 transition-colors duration-300">
            {cert.title}
          </h4>
          
          <div className="flex items-center justify-center md:justify-start gap-3 mt-3">
            <div className="h-[1px] w-8 bg-red-600/50 group-hover:w-12 transition-all duration-500" />
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] group-hover:text-slate-300 transition-colors">
              {cert.issuer}
            </p>
          </div>
        </div>

        {/* EFEK REFLEKSI CAHAYA (SHINE) SAAT HOVER */}
        <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:animate-shine pointer-events-none" />
      </motion.div>
    ))}
  </div>
)}

      {/* 3. TECH TAB (ELITE MICRO-INTERACTIONS) */}
{activeTab === "tech" && (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
    {listTools.map((tool, i) => (
      <motion.div 
        key={i} 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: i * 0.05 }}
        whileHover={{ y: -10, transition: { duration: 0.3 } }}
        className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-10 flex flex-col items-center justify-center gap-6 transition-all duration-500 group relative overflow-hidden hover:border-red-600/40 hover:shadow-[0_20px_40px_rgba(220,38,38,0.1)]"
      >
        {/* RADIAL GLOW BACKGROUND */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/0 via-transparent to-red-600/0 group-hover:from-red-600/10 group-hover:to-transparent transition-all duration-700 opacity-50" />
        
        {/* FLOATING AMBIENT ORB */}
        <div className="absolute -top-10 -left-10 w-24 h-24 bg-red-600/0 blur-[60px] group-hover:bg-red-600/20 transition-all duration-700 rounded-full" />

        <div className="w-16 h-16 flex items-center justify-center relative z-10">
          <motion.img 
            src={tool.logo} 
            alt={tool.name} 
            className="w-full h-full object-contain"
            // Efek Melayang Halus (Infinite)
            animate={{ 
              y: [0, -8, 0],
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: i * 0.1 
            }}
            // Efek Reaksi saat Hover
            whileHover={{ 
              scale: 1.25,
              rotate: [0, 10, -10, 0],
              filter: "drop-shadow(0 0 20px rgba(220, 38, 38, 0.6))",
            }}
          />
        </div>

        {/* TYPOGRAPHY DENGAN LETTER SPACING MEWAH */}
        <div className="relative z-10 flex flex-col items-center">
        <h4 className="text-white font-black text-2xl uppercase tracking-tighter leading-tight mt-2 group-hover:text-red-500 transition-colors duration-300">
            {tool.name}
          </h4>
          {/* INDICATOR DOT */}
          <motion.div 
            initial={{ width: 0 }}
            whileHover={{ width: "100%" }}
            className="h-[2px] bg-red-600 mt-2 rounded-full transition-all duration-500"
          />
        </div>

        {/* SCANNER LIGHT EFFECT (BIASANYA ADA DI WEB TECH LUAR NEGERI) */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-transparent via-white/[0.02] to-transparent -translate-y-full group-hover:translate-y-full transition-transform duration-[1.5s] ease-in-out pointer-events-none" />
      </motion.div>


    ))}
  </div>
)}

{/* 5. DESIGN TAB (SOFTWARE TOOLS - SYNCED WITH TECH TAB) */}
{activeTab === "design" && (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
    {listDesignTools.map((tool, i) => (
      <motion.div 
        key={i} 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: i * 0.05 }}
        whileHover={{ y: -10, transition: { duration: 0.3 } }}
        className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-10 flex flex-col items-center justify-center gap-6 transition-all duration-500 group relative overflow-hidden hover:border-red-600/40 hover:shadow-[0_20px_40px_rgba(220,38,38,0.1)]"
      >
        {/* RADIAL GLOW BACKGROUND */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/0 via-transparent to-red-600/0 group-hover:from-red-600/10 group-hover:to-transparent transition-all duration-700 opacity-50" />
        
        {/* FLOATING AMBIENT ORB */}
        <div className="absolute -top-10 -left-10 w-24 h-24 bg-red-600/0 blur-[60px] group-hover:bg-red-600/20 transition-all duration-700 rounded-full" />

        <div className="w-16 h-16 flex items-center justify-center relative z-10">
          <motion.img 
            src={tool.logo} 
            alt={tool.name} 
            className="w-full h-full object-contain"
            // Efek Melayang Halus (Infinite Floating)
            animate={{ 
              y: [0, -8, 0],
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: i * 0.1 
            }}
            // Efek Reaksi saat Hover (Glow & Rotate)
            whileHover={{ 
              scale: 1.25,
              rotate: [0, 10, -10, 0],
              filter: "drop-shadow(0 0 15px rgba(220, 38, 38, 0.6))",
            }}
          />
        </div>

        {/* TYPOGRAPHY DENGAN LETTER SPACING */}
        <div className="relative z-10 flex flex-col items-center">
            <h4 className="text-white font-black text-2xl uppercase tracking-tighter leading-tight mt-2 group-hover:text-red-500 transition-colors duration-300">
            {tool.name}
          </h4>
          {/* INDICATOR LINE */}
          <motion.div 
            initial={{ width: 0 }}
            whileHover={{ width: "100%" }}
            className="h-[2px] bg-red-600 mt-2 rounded-full transition-all duration-500"
          />
        </div>

        {/* SCANNER LIGHT EFFECT (BIASANYA ADA DI WEB TECH LUAR NEGERI) */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-transparent via-white/[0.02] to-transparent -translate-y-full group-hover:translate-y-full transition-transform duration-[1.5s] ease-in-out pointer-events-none" />
      </motion.div>
    ))}
  </div>
)}
        {activeTab === "os" && (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
    {listOS.map((os, i) => (
      <motion.div 
        key={i} 
        // ANIMASI SCROLL: Muncul dari bawah ke atas (identik dengan sertifikat)
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ 
          duration: 0.8, 
          delay: i * 0.1, 
          ease: [0.25, 0.4, 0, 1] 
        }}
        whileHover={{ y: -15, scale: 1.02 }}
        className="bg-white/5 border border-white/10 rounded-[3.5rem] p-12 flex flex-col items-center gap-10 group relative overflow-hidden transition-all duration-500 hover:border-red-600/40 hover:shadow-[0_30px_60px_rgba(220,38,38,0.15)]"
      >
        {/* ATMOSPHERIC GLOW BACKDROP */}
        <div className="absolute inset-0 bg-gradient-to-t from-red-600/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        <div className="w-24 h-24 flex items-center justify-center relative">
          {/* BACKGROUND BLUR RED */}
          <div className="absolute inset-0 bg-red-600/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700" />
          
          <motion.img 
            src={os.logo} 
            alt={os.name} 
            className="w-full h-full object-contain relative z-10 transition-all duration-500 group-hover:drop-shadow-[0_0_20px_rgba(239,68,68,0.4)]"
            // Efek Floating Otomatis (Internasional Style)
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 2, -2, 0]
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: i * 0.2 
            }}
          />
        </div>

        <div className="text-center relative z-10">
           <h4 className="text-white font-black text-2xl uppercase tracking-tighter leading-tight mt-2 group-hover:text-red-500 transition-colors duration-300">
            {os.name}
          </h4>
          
          {/* INDICATOR LINE DENGAN TRANSISI HALUS */}
          <div className="relative h-1 w-12 mx-auto mt-4 bg-white/10 rounded-full overflow-hidden">
            <div className="absolute inset-0 bg-red-600 w-0 group-hover:w-full transition-all duration-700 ease-out" />
          </div>
        </div>

        {/* GLOSS EFFECT SHINE (Sama dengan Sertifikat) */}
        <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:animate-shine pointer-events-none" />
      </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>

    {/* MODAL DETAIL (Slider Foto Tetap Ada) */}
    <AnimatePresence>
      {selectedProject && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-4 md:p-10"
          onClick={() => setSelectedProject(null)}
        >
          <motion.div 
            initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[#05011a] border border-white/10 w-full max-w-6xl h-fit max-h-[90vh] rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* SLIDER GAMBAR */}
            <div className="relative flex-1 bg-black flex items-center justify-center min-h-[350px] overflow-hidden">
              <motion.img 
                key={currentImgIndex}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                src={selectedProject.images && selectedProject.images.length > 0 ? selectedProject.images[currentImgIndex] : selectedProject.img} 
                className="max-w-full max-h-[70vh] object-contain p-4"
              />
              {selectedProject.images?.length > 1 && (
                <div className="absolute inset-x-6 flex justify-between items-center pointer-events-none">
                  <button onClick={prevSlide} className="pointer-events-auto p-4 bg-white/5 hover:bg-red-600 rounded-full text-white transition-all"><ChevronRight className="rotate-180" /></button>
                  <button onClick={nextSlide} className="pointer-events-auto p-4 bg-white/5 hover:bg-red-600 rounded-full text-white transition-all"><ChevronRight /></button>
                </div>
              )}
            </div>
            {/* DETAIL TEKS */}
            <div className="w-full md:w-[450px] p-10 md:p-14 bg-[#05011a] border-l border-white/5 relative">
              <button className="absolute top-8 right-8 text-white/20 hover:text-red-500 transition-colors" onClick={() => setSelectedProject(null)}><FaTimes size={28} /></button>
              <span className="text-red-500 text-[11px] font-black uppercase tracking-[0.4em] mb-4 block">Project Overview</span>
              <h2 className="text-4xl font-black text-white uppercase leading-none mb-6 tracking-tighter">{selectedProject.title}</h2>
              <p className="text-slate-400 text-lg leading-relaxed italic mb-8">"{selectedProject.description}"</p>
              {selectedProject.link && (
                <a href={selectedProject.link} target="_blank" rel="noopener noreferrer" className="w-full py-4 bg-red-600 hover:bg-red-700 text-white text-center rounded-xl font-black uppercase tracking-widest text-[11px] transition-all flex items-center justify-center gap-3">
                  Lihat Project <FaExternalLinkAlt size={14} />
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
</section>
{/* CONTACT SECTION */}
<section id="contact" className="py-20 px-6 relative z-10 overflow-hidden">
  {/* --- RUNNING TEXT ANIMATION (MARQUEE) --- */}
  <div className="absolute top-0 left-0 w-full overflow-hidden bg-red-600/5 py-4 border-y border-white/5 pointer-events-none">
    <motion.div 
      animate={{ x: [0, -1000] }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="flex whitespace-nowrap gap-10"
    >
      {[...Array(10)].map((_, i) => (
        <span key={i} className="text-white/20 text-sm font-black uppercase tracking-[0.5em]">
          Mari • kita • Berkolaborasi • Terbuka untuk Proyek •
        </span>
      ))}
    </motion.div>
  </div>

  <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
    <div className="w-[400px] h-[400px] bg-red-600/10 rounded-full blur-[120px] animate-pulse" />
  </div>

  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className="max-w-5xl mx-auto bg-white/[0.02] backdrop-blur-xl p-8 md:p-16 border border-white/10 rounded-[2rem] relative"
  >
    <div className="grid md:grid-cols-2 gap-12 relative z-10 items-center">
      
      {/* KIRI: INFO & SOCIALS */}
      <div className="space-y-8">
        <div>
          <h2 className="text-4xl md:text-5xl font-outfit font-black uppercase tracking-tighter text-white">
            Hubungi kami
          </h2>
          <p className="text-slate-400 text-lg mt-4 max-w-sm">
            Ada yang ingin ditanyakan? Kirimin saya pesan dan mari Diskusi?
          </p>
          <p className="text-slate-400 text-lg mt-4 max-w-sm">
            Let's go to connect with me❤️
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {listSocials.map((social, i) => (
            <motion.a 
              key={i} 
              href={social.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              whileHover={{ y: -5 }} 
              className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-red-600/50 transition-all group overflow-hidden relative"
            >
              {/* Background Glow Merah saat Hover */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                whileHover={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 bg-red-600/10 blur-xl z-0" 
              />
              
              {/* Logo Gambar Natural dengan Animasi Goyang */}
              <div className="w-6 h-6 relative z-10 flex items-center justify-center">
               <motion.img 
                  src={social.logo} 
                  alt={social.name} 
   
                className={`w-full h-full object-contain transition-all duration-300 
             ${social.name.toLowerCase() === 'github' || social.name.toLowerCase() === 'tiktok' 
             ? 'brightness-0 invert' 
                    : ''}`}
                     whileHover={{ 
             rotate: [0, 10, -10, 10, 0], 
                scale: 1.2,
                 transition: { duration: 0.5, repeat: Infinity } 
                }}
             />
         </div>

              <span className="text-sm font-bold text-white group-hover:text-red-500 relative z-10 transition-colors">
                {social.name}
              </span>
            </motion.a>
          ))}
        </div>
      </div>

      {/* KANAN: FORM */}
      <motion.form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <input 
            type="text" 
            name="name" 
            placeholder="Nama Lengkap" 
            value={formData.name} 
            onChange={handleChange} 
            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-red-600 transition-all placeholder:text-slate-600" 
            required 
          />
          <input 
            type="email" 
            name="email" 
            placeholder="Alamat Email" 
            value={formData.email} 
            onChange={handleChange} 
            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-red-600 transition-all placeholder:text-slate-600" 
            required 
          />
          <textarea 
            name="message" 
            placeholder="Pesan Anda" 
            value={formData.message} 
            onChange={handleChange} 
            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white h-32 outline-none focus:border-red-600 transition-all placeholder:text-slate-600 resize-none" 
            required 
          />
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl uppercase tracking-widest text-sm transition-all shadow-lg shadow-red-600/20 disabled:opacity-50"
        >
          {isSubmitting ? "TRANSMITTING..." : "Kirim Sekarang"}
        </motion.button>
      </motion.form>

    </div>
  </motion.div>
</section>

     {/* FOOTER SECTION */}
      <footer className="py-12 border-t border-white/5 relative z-10 overflow-hidden">
        {/* Efek Cahaya Halus di Footer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-red-600/50 to-transparent" />
        
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col items-center justify-center gap-6">
            WEBSITE PORFOLIO Taufiq ikhsan muzaky

            {/* Teks Utama Footer */}
            <div className="text-center">
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="text-px20 md:text-sm font-medium text-slate-500 tracking-wide"
              >
                © {new Date().getFullYear()} 
              </motion.p>
              
              <motion.div 
                initial={{ y: 10, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-2"
              >
                <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.6em] text-white/40 italic">
                  Website Portfolio By: 
                  <span className="text-red-600 ml-2 drop-shadow-[0_0_10px_rgba(220,38,38,0.4)]">
                    mzkyzak
                  </span>
                </span>
              </motion.div>
            </div>

            {/* Garis Dekoratif Kecil */}
            <div className="w-12 h-[2px] bg-red-600/20 rounded-full" />
          </div>
        </div>
      </footer>
    </div> // Penutup Main Container
  );
}