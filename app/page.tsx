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

  // Canvas habis di 0.99 (99% scroll)
  const frameIndex = useTransform(scrollYProgress, [0, 0.99], [0, totalFrames - 1], { clamp: true });

  // Teks sekarang warna hitam (diubah di class) dan opacity diatur
  const text1Opacity = useTransform(scrollYProgress, [0, 0.1, 0.2], [1, 1, 0]);
  const text2Opacity = useTransform(scrollYProgress, [0.3, 0.4, 0.5, 0.6], [0, 1, 1, 0]);
  const text3Opacity = useTransform(scrollYProgress, [0.7, 0.85, 0.99], [0, 1, 1]);

  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let count = 0;
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
    if (!isLoaded || !canvasRef.current) return;
    const context = canvasRef.current.getContext("2d", { alpha: false });
    let lastFrame = -1;

    const render = (val: number) => {
      const currentIndex = Math.floor(val);
      if (currentIndex === lastFrame) return;
      
      const img = images[currentIndex];
      if (img && context) {
        const canvas = canvasRef.current!;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        const x = (canvas.width / 2) - (img.width / 2) * scale;
        const y = (canvas.height / 2) - (img.height / 2) * scale;
        context.drawImage(img, x, y, img.width * scale, img.height * scale);
        lastFrame = currentIndex;
      }
    };

    const unsubscribe = frameIndex.on("change", (latest) => {
      requestAnimationFrame(() => render(latest));
    });

    return () => unsubscribe();
  }, [isLoaded, images, frameIndex]);

  return (
    <main className="bg-white">
      {/* Navbar - Teks menu hitam agar keliatan di atas canvas */}
      <nav className="fixed top-0 w-full z-[100] px-6 py-6 flex justify-between items-center">
        <div className="text-xl font-black text-black italic tracking-tighter uppercase">GURU BANTU GURU</div>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          className="text-white font-bold uppercase text-[10px] tracking-[0.2em] bg-black px-5 py-2.5 rounded-full"
        >
          {isMenuOpen ? "Close" : "Menu"}
        </button>
      </nav>

      <section ref={containerRef} className="relative h-[800vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {/* Canvas Utama */}
          <canvas ref={canvasRef} className="w-full h-full object-cover" />

          {/* INPUT LOADING DI ATAS CANVAS (Muncul sebelum load selesai) */}
          <AnimatePresence>
            {!isLoaded && (
              <motion.div 
                exit={{ opacity: 0 }} 
                className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm"
              >
                <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-black"
                  />
                </div>
                <p className="mt-4 text-[10px] font-black italic tracking-widest text-black uppercase">
                  Processing Guru Bantu AI {progress}%
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* TEKS CANVAS - SEMUA JADI HITAM */}
          <div className="absolute inset-0 flex items-center justify-center text-center px-6 pointer-events-none">
            <motion.div style={{ opacity: text1Opacity }} className="absolute">
              <h2 className="text-4xl md:text-6xl font-black italic text-black tracking-tighter leading-none">GURUBANTUGURU</h2>
              <p className="text-black/60 font-bold tracking-[0.3em] uppercase text-[10px] md:text-xs mt-4">Asisten AI Untuk Para Guru Indonesia</p>
            </motion.div>

            <motion.div style={{ opacity: text2Opacity }} className="absolute">
              <h2 className="text-3xl md:text-5xl font-black italic text-black uppercase leading-none">Merubah Kebiasaan <br/> Yang Lama</h2>
            </motion.div>

            <motion.div style={{ opacity: text3Opacity }} className="absolute">
              <h2 className="text-3xl md:text-5xl font-black italic text-black uppercase leading-none">Menjadi Lebih Modern <br/> Dan Efisien</h2>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FOOTER SIMPLE (Tanpa Our Story) */}
      <footer className="relative z-30 bg-white py-10 text-center">
        <p className="opacity-40 text-[10px] font-black uppercase tracking-[0.5em]">© 2026 GURU BANTU GURU</p>
      </footer>
    </main>
  );
}
