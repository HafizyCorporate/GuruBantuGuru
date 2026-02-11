"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const totalFrames = 192; 
  const frameIndex = useTransform(scrollYProgress, [0, 0.8], [1, totalFrames]); // Gambar selesai di 80% scroll
  const [currentFrame, setCurrentFrame] = useState(1);

  // LOGIKA ZOOM TEKS (Seperti di video Golda)
  // Teks mulai membesar dari 80% scroll sampai 100%
  const textScale = useTransform(scrollYProgress, [0, 0.8, 1], [1, 1, 12]); // Angka 12 bikin teks super besar
  const textOpacity = useTransform(scrollYProgress, [0, 0.1, 0.8, 0.95], [0, 1, 1, 0]);

  useEffect(() => {
    const unsubscribe = frameIndex.on("change", (latest) => {
      setCurrentFrame(Math.round(latest));
    });
    return () => unsubscribe();
  }, [frameIndex]);

  useEffect(() => {
    const preloadImages = async () => {
      const promises = Array.from({ length: totalFrames }, (_, i) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = `/ezgif-frame-${(i + 1).toString().padStart(3, '0')}.jpg`;
          img.onload = () => { setLoadedCount(prev => prev + 1); resolve(img); };
          img.onerror = resolve;
        });
      });
      await Promise.all(promises);
      setIsLoaded(true);
    };
    preloadImages();
  }, []);

  return (
    <main className="relative bg-black overflow-x-hidden">
      {/* LOADING SCREEN */}
      {!isLoaded && (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center text-white">
          <div className="text-2xl font-black italic mb-4">GURUBANTU</div>
          <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${(loadedCount / totalFrames) * 100}%` }} />
          </div>
        </div>
      )}

      {/* HERO SECTION */}
      <section ref={containerRef} className="relative h-[1000vh] bg-black">
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
          
          {/* Background Image Sequence */}
          <img
            src={`/ezgif-frame-${currentFrame.toString().padStart(3, '0')}.jpg`}
            alt="Sequence"
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />

          {/* Teks yang Membesar (Scroll Zoom) */}
          <motion.div 
            style={{ scale: textScale, opacity: textOpacity }}
            className="relative z-10 flex flex-col items-center justify-center"
          >
            <h1 className="text-5xl md:text-8xl font-black text-white leading-none uppercase tracking-tighter text-center">
              GURU BANTU <br /> GURU
            </h1>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            style={{ opacity: useTransform(scrollYProgress, [0, 0.05], [1, 0]) }}
            className="absolute bottom-12 flex flex-col items-center gap-4 opacity-40"
          >
            <div className="w-[1px] h-20 bg-gradient-to-b from-blue-500 to-transparent" />
            <span className="text-[10px] text-white tracking-[1em] uppercase rotate-90 ml-2">Scroll</span>
          </motion.div>
        </div>
      </section>

      {/* KONTEN BERIKUTNYA (OUR STORY) */}
      <div className="relative z-20 bg-black text-white">
        <section className="py-40 px-6 max-w-4xl mx-auto text-center">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-blue-500 font-bold tracking-[0.4em] uppercase text-sm block mb-8"
          >
            Our Story
          </motion.span>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-4xl font-light leading-relaxed text-slate-300"
          >
            Kami percaya bahwa teknologi seharusnya mempermudah tugas guru, bukan mempersulit. GuruBantu hadir untuk memangkas waktu administrasi agar Anda bisa fokus mengajar.
          </motion.p>
        </section>
      </div>
    </main>
  );
}
