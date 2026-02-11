"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const totalFrames = 194;
  
  const { scrollYProgress } = useScroll({ 
    target: containerRef, 
    offset: ["start start", "end end"] 
  });

  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, totalFrames - 1]);

  const text1Opacity = useTransform(scrollYProgress, [0, 0.15, 0.3], [1, 1, 0]);
  const text2Opacity = useTransform(scrollYProgress, [0.4, 0.55, 0.7], [0, 1, 0]);
  const text3Opacity = useTransform(scrollYProgress, [0.8, 0.95, 1], [0, 1, 1]);

  // LOGIKA LOCK SCROLL: User tidak bisa gerak sampai isLoaded = true
  useEffect(() => {
    if (!isLoaded) {
      document.body.style.overflow = "hidden";
      window.scrollTo(0, 0);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isLoaded]);

  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let count = 0;
    
    // Load frame pertama dulu supaya langsung tampil tanpa nunggu yang lain
    const firstImg = new Image();
    firstImg.src = `/ezgif-frame-001.jpg`;
    
    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      img.src = `/ezgif-frame-${i.toString().padStart(3, '0')}.jpg`;
      img.onload = () => {
        count++;
        setProgress(Math.floor((count / totalFrames) * 100));
        if (count === totalFrames) {
          setImages(loadedImages);
          setIsLoaded(true);
        }
      };
      loadedImages[i - 1] = img;
    }
  }, []);

  useEffect(() => {
    // Render tetap jalan meskipun belum 100% supaya frame awal kelihatan
    const context = canvasRef.current?.getContext("2d", { alpha: false });
    
    const render = (index: number) => {
      const img = images[Math.floor(index)];
      if (img && img.complete && context) {
        const canvas = canvasRef.current!;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        const x = (canvas.width / 2) - (img.width / 2) * scale;
        const y = (canvas.height / 2) - (img.height / 2) * scale;
        context.drawImage(img, x, y, img.width * scale, img.height * scale);
      }
    };

    // Jalankan render awal untuk frame 0
    if (images[0]) render(0);

    const unsubscribe = frameIndex.on("change", (latest) => {
      requestAnimationFrame(() => render(latest));
    });

    return () => unsubscribe();
  }, [images, isLoaded]);

  return (
    <main className="bg-white">
      <nav className="fixed top-0 w-full z-[100] px-6 py-6 flex justify-between items-center">
        <div className="text-xl font-black text-black mix-blend-difference italic tracking-tighter uppercase">
          GURU BANTU GURU
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white font-bold uppercase text-[10px] tracking-[0.2em] bg-black px-5 py-2.5 rounded-full shadow-lg">
          {isMenuOpen ? "Close" : "Menu"}
        </button>
      </nav>

      <section ref={containerRef} className="relative h-[600vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-white">
          {/* Canvas langsung tampil */}
          <canvas ref={canvasRef} className="w-full h-full object-cover" />
          
          <div className="absolute inset-0 flex items-center justify-center text-center px-6 pointer-events-none">
            <motion.div style={{ opacity: text1Opacity }} className="absolute">
              <h2 className="text-5xl md:text-7xl font-black italic text-black tracking-tighter leading-none drop-shadow-[0_2px_10px_rgba(255,255,255,0.8)]">
                GURUBANTUGURU
              </h2>
              <p className="text-black font-bold tracking-[0.3em] uppercase text-[10px] md:text-xs mt-4 drop-shadow-[0_1px_5px_rgba(255,255,255,0.8)]">
                Asisten AI Untuk Para Guru Indonesia
              </p>

              {/* Ikon Loading hanya muncul di bawah teks tanpa nutupin canvas */}
              <AnimatePresence>
                {!isLoaded && (
                  <motion.div 
                    exit={{ opacity: 0 }}
                    className="mt-8 flex flex-col items-center gap-2"
                  >
                    <div className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                    <span className="text-[10px] font-black text-black tracking-widest">{progress}%</span>
                    <p className="text-[8px] font-bold text-black/50 uppercase">Menyiapkan Pengalaman...</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div style={{ opacity: text2Opacity }} className="absolute drop-shadow-[0_2px_10px_rgba(255,255,255,0.8)]">
              <h2 className="text-4xl md:text-6xl font-black italic text-black uppercase leading-none tracking-tighter">
                Merubah Kebiasaan <br/> Yang Lama
              </h2>
            </motion.div>

            <motion.div style={{ opacity: text3Opacity }} className="absolute drop-shadow-[0_2px_10px_rgba(255,255,255,0.8)]">
              <h2 className="text-4xl md:text-6xl font-black italic text-black uppercase leading-none tracking-tighter">
                Menjadi Lebih Modern <br/> Dan Efisien
              </h2>
            </motion.div>
          </div>
        </div>
      </section>

      <footer className="bg-white py-6 text-center border-t border-gray-100">
        <p className="opacity-20 text-[10px] font-black uppercase tracking-[0.5em]">© 2026 GURU BANTU GURU</p>
      </footer>
    </main>
  );
}
