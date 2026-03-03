import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PreLoader() {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("loading");

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setStage("welcome"), 600);
          setTimeout(() => setStage("done"), 3000);
          return 100;
        }
        return p + Math.random() * 2.5;
      });
    }, 35);

    return () => clearInterval(interval);
  }, []);

  if (stage === "done") return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-[#060111] flex items-center justify-center overflow-hidden">

      {/* 🔥 BACKGROUND NYALA HALUS */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.55, 0.3] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[700px] h-[700px] bg-red-600/40 blur-[180px] rounded-full"
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ff003320,transparent_65%)]" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.06]" />
      <div className="absolute inset-0 shadow-[inset_0_0_220px_rgba(0,0,0,0.9)]" />

      <AnimatePresence mode="wait">
        {stage === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -30 }}
            className="relative z-10 flex flex-col items-center"
          >
            {/* 🔢 ANGKA */}
            <motion.div
              animate={{ opacity: [0.75, 1, 0.75] }}
              transition={{ duration: 1.6, repeat: Infinity }}
              className="text-[130px] md:text-[170px] font-bold text-white tracking-tight"
            >
              {Math.floor(progress)}
              <span className="text-red-500">%</span>
            </motion.div>

            {/* 🔴 TEKS SEDANG */}
            <div className="mt-1 text-[14px] md:text-[15px] font-bold uppercase tracking-[0.35em] text-red-500">
              Sedang memasuki website
            </div>

            {/* 📊 LOADING BAR */}
            <div className="mt-20 w-80 h-[7px] bg-white/10 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-red-500 via-red-400 to-white shadow-[0_0_25px_rgba(239,68,68,1)]"
              />
            </div>
          </motion.div>
        )}

        {stage === "welcome" && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 text-center"
          >
            <div className="text-[14px] font-bold uppercase tracking-[0.4em] text-red-500 mb-4">
              Welcome To Portfolio
            </div>

            <h1 className="text-5xl md:text-5xl font-bold uppercase tracking-tight text-white">
              MZKYZAK
            </h1>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}