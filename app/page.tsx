"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";

const PlayStoreButton = ({ link }: { link: string }) => (
  <motion.a
    href={link}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="flex items-center gap-3 bg-black text-white px-6 py-3 rounded-2xl border border-white/10 hover:border-blue-500 transition-all w-fit shadow-xl mt-6"
  >
    <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Play Store" className="h-8" />
    <div className="text-left font-[family-name:var(--font-outfit)]">
      <p className="text-[10px] uppercase leading-none opacity-60 font-bold">Get it on</p>
      <p className="text-lg font-bold leading-tight">Google Play</p>
    </div>
  </motion.a>
);

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const totalFrames = 192; 
  const frameIndex = useTransform(scrollYProgress, [0, 1], [1, totalFrames]);
  const [currentFrame, setCurrentFrame] = useState(1);

  // LOGIKA UPDATE FRAME YANG LEBIH RINGAN
  useEffect(() => {
    const unsubscribe = frameIndex.on("change", (latest) => {
      const rounded = Math.round(latest);
      if (rounded !== currentFrame) {
        setCurrentFrame(rounded);
      }
    });
    return () => unsubscribe();
  }, [frameIndex, currentFrame]);

  // PRELOAD GAMBAR DI SISI CLIENT (Gak bakal bikin timeout saat build)
  useEffect(() => {
    const preloadImages = () => {
      for (let i = 1; i <= totalFrames; i++) {
        const img = new Image();
        img.src = `/ezgif-frame-${i.toString().padStart(3, '0')}.jpg`;
      }
    };
    preloadImages();
  }, []);

  return (
    <main className="relative bg-black overflow-x-hidden">
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-[100] bg-black/20 backdrop-blur-md border-b border-white/10 px-6 py-4 flex justify-between items-center font-[family-name:var(--font-outfit)]">
        <div className="text-2xl font-black text-white tracking-tighter italic">GURUBANTU</div>
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden z-[101] p-2 text-white">
          Menu
        </button>
        <div className="hidden md:flex gap-8 font-bold text-xs uppercase tracking-widest text-white/70">
          <a href="#visi" className="hover:text-blue-400">Visi</a>
          <a href="#produk" className="hover:text-blue-400">Produk</a>
          <a href="#kontak" className="bg-blue-600 text-white px-6 py-2 rounded-full">Hubungi Kami</a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section ref={containerRef} className="relative h-[800vh] bg-black">
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
          
          <img
            src={`/ezgif-frame-${currentFrame.toString().padStart(3, '0')}.jpg`}
            alt="Sequence"
            className="absolute inset-0 w-full h-full object-cover opacity-60 transition-none"
            loading="eager"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black" />

          <motion.div 
            style={{ 
              opacity: useTransform(scrollYProgress, [0, 0.7, 0.9], [1, 1, 0]),
              scale: useTransform(scrollYProgress, [0, 0.9], [1, 0.8])
            }}
            className="relative z-10 text-center px-4 font-[family-name:var(--font-outfit)]"
          >
            <h1 className="text-5xl md:text-[120px] font-[900] text-white leading-none uppercase tracking-tighter mb-4">
              GURU BANTU GURU
            </h1>
            <p className="text-sm md:text-xl text-blue-400 font-light tracking-[0.4em] uppercase">
              Membantu mencerdaskan anak bangsa
            </p>
          </motion.div>
        </div>
      </section>

      {/* KONTEN */}
      <div className="relative z-20 bg-white py-20">
        <section id="visi" className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-5xl font-black text-blue-900 mb-6 italic uppercase">Visi Kami</h2>
          <p className="text-xl text-slate-600">Menjadi mitra utama guru Indonesia dalam digitalisasi pendidikan.</p>
        </section>

        <section id="produk" className="bg-slate-50 py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-5xl font-black text-blue-900 mb-10 italic uppercase">Produk</h2>
            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-blue-50">
              <h3 className="text-3xl font-bold mb-4">Soal AI</h3>
              <p className="text-slate-500 mb-6">Buat bank soal dalam hitungan detik.</p>
              <PlayStoreButton link="https://play.google.com/store/apps/details?id=com.soalai.app" />
            </div>
          </div>
        </section>

        <footer id="kontak" className="py-20 text-center border-t mt-20">
          <p className="text-slate-400 font-bold tracking-widest uppercase text-xs">© 2026 GURUBANTUGURU</p>
        </footer>
      </div>
    </main>
  );
}
