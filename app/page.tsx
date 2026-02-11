"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false); // Status loading gambar
  const [loadedCount, setLoadedCount] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const totalFrames = 192; 
  const frameIndex = useTransform(scrollYProgress, [0, 1], [1, totalFrames]);
  const [currentFrame, setCurrentFrame] = useState(1);

  useEffect(() => {
    const unsubscribe = frameIndex.on("change", (latest) => {
      setCurrentFrame(Math.round(latest));
    });
    return () => unsubscribe();
  }, [frameIndex]);

  // LOGIKA PRELOAD AGGRESIF
  useEffect(() => {
    let mounted = true;
    const preloadImages = async () => {
      const promises = Array.from({ length: totalFrames }, (_, i) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = `/ezgif-frame-${(i + 1).toString().padStart(3, '0')}.jpg`;
          img.onload = () => {
            setLoadedCount(prev => prev + 1);
            resolve(img);
          };
          img.onerror = resolve; // Tetap lanjut jika 1 gambar gagal
        });
      });

      await Promise.all(promises);
      if (mounted) setIsLoaded(true);
    };

    preloadImages();
    return () => { mounted = false; };
  }, []);

  return (
    <main className="relative bg-black overflow-x-hidden">
      {/* LOADING SCREEN (Mencegah Layar Hitam) */}
      {!isLoaded && (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center text-white">
          <div className="text-2xl font-black italic mb-4 animate-pulse">GURUBANTU</div>
          <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-300" 
              style={{ width: `${(loadedCount / totalFrames) * 100}%` }}
            />
          </div>
          <p className="mt-4 text-[10px] tracking-widest uppercase opacity-50">Menyiapkan Pengalaman Cinematic...</p>
        </div>
      )}

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-[100] bg-black/20 backdrop-blur-md border-b border-white/10 px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-black text-white tracking-tighter italic">GURUBANTU</div>
        <div className="hidden md:flex gap-8 font-bold text-xs uppercase tracking-widest text-white/70">
          <a href="#visi">Visi</a>
          <a href="#produk">Produk</a>
          <a href="#kontak" className="bg-blue-600 text-white px-6 py-2 rounded-full">Hubungi Kami</a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section ref={containerRef} className="relative h-[800vh] bg-black">
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
          {/* Gambar Utama */}
          <img
            src={`/ezgif-frame-${currentFrame.toString().padStart(3, '0')}.jpg`}
            alt="Sequence"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
            priority="true" // Jika pakai Next Image, tapi karena pakai img biasa, ini opsional
          />
          
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black" />

          <motion.div 
             style={{ opacity: useTransform(scrollYProgress, [0, 0.7, 0.9], [1, 1, 0]) }}
             className="relative z-10 text-center px-4"
          >
            <h1 className="text-5xl md:text-[100px] font-black text-white leading-none uppercase tracking-tighter">
              GURU BANTU GURU
            </h1>
          </motion.div>
        </div>
      </section>

      {/* KONTEN BERIKUTNYA */}
      <div className="relative z-20 bg-white min-h-screen pt-20">
          <section id="visi" className="max-w-4xl mx-auto px-6 text-center">
              <h2 className="text-5xl font-black text-blue-900 italic mb-6">VISI KAMI</h2>
              <p className="text-slate-600 text-xl leading-relaxed">Membantu digitalisasi pendidikan Indonesia tanpa batas.</p>
          </section>
      </div>
    </main>
  );
}
