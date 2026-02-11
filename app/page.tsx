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

  // Animasi frame murni mengikuti scroll (0 sampai 1)
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, totalFrames - 1]);

  // Kontrol Opacity Teks
  const text1Opacity = useTransform(scrollYProgress, [0, 0.15, 0.3], [1, 1, 0]);
  const text2Opacity = useTransform(scrollYProgress, [0.4, 0.55, 0.7], [0, 1, 0]);
  const text3Opacity = useTransform(scrollYProgress, [0.8, 0.95, 1], [0, 1, 1]);

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
    <main className="bg-black">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-[100] px-6 py-6 flex justify-between items-center">
        <div className="text-xl font-black text-white mix-blend-difference italic tracking-tighter uppercase">
          GURU BANTU GURU
        </div>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          className="text-white font-bold uppercase text-[10px] tracking-[0.2em] bg-black px-5 py-2.5 rounded-full"
        >
          {isMenuOpen ? "Close" : "Menu"}
        </button>
      </nav>

      <section ref={containerRef} className="relative h-[600vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <canvas ref={canvasRef} className="w-full h-full object-cover" />

          {/* IKON MENUNGGU (Loading Spinner) */}
          <AnimatePresence>
            {!isLoaded && (
              <motion.div 
                exit={{ opacity: 0 }} 
                className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/10 backdrop-blur-md"
              >
                <div className="relative flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span className="absolute text-[12px] font-black text-white">{progress}%</span>
                </div>
                <p className="mt-4 text-[10px] font-black italic tracking-[0.4em] text-white uppercase">Loading AI...</p>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* TEKS DENGAN KOLOM BLUR (Biar Jelas & Gak Norak) */}
          <div className="absolute inset-0 flex items-center justify-center text-center px-6 pointer-events-none">
            
            <motion.div style={{ opacity: text1Opacity }} className="absolute bg-white/30 backdrop-blur-xl p-8 rounded-[40px] border border-white/10 shadow-2xl">
              <h2 className="text-4xl md:text-6xl font-black italic text-black tracking-tighter leading-none">GURUBANTUGURU</h2>
              <p className="text-black/70 font-bold tracking-[0.3em] uppercase text-[10px] md:text-xs mt-4">Asisten AI Untuk Para Guru Indonesia</p>
            </motion.div>

            <motion.div style={{ opacity: text2Opacity }} className="absolute bg-white/30 backdrop-blur-xl p-8 rounded-[40px] border border-white/10 shadow-2xl">
              <h2 className="text-3xl md:text-5xl font-black italic text-black uppercase leading-none">Merubah Kebiasaan <br/> Yang Lama</h2>
            </motion.div>

            <motion.div style={{ opacity: text3Opacity }} className="absolute bg-white/30 backdrop-blur-xl p-8 rounded-[40px] border border-white/10 shadow-2xl">
              <h2 className="text-3xl md:text-5xl font-black italic text-black uppercase leading-none">Menjadi Lebih Modern <br/> Dan Efisien</h2>
            </motion.div>

          </div>
        </div>
      </section>

      <footer className="bg-white py-8 text-center">
        <p className="opacity-30 text-[10px] font-black uppercase tracking-[0.5em]">© 2026 GURU BANTU GURU</p>
      </footer>
    </main>
  );
}
