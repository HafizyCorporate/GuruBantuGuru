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
  const text3Opacity = useTransform(scrollYProgress, [0.8, 0.95], [0, 1]);

  // --- LOGIKA ANTI-SCROLL SEBELUM LOAD BERES ---
  useEffect(() => {
    if (!isLoaded) {
      document.body.style.overflow = "hidden"; // Kunci scroll
    } else {
      document.body.style.overflow = "auto"; // Buka scroll
    }
  }, [isLoaded]);

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
    
    // Cleanup pas komponen unmount
    return () => { document.body.style.overflow = "auto"; };
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
      <nav className="fixed top-0 w-full z-[100] px-6 py-6 flex justify-between items-center">
        <div className="text-xl font-black text-white mix-blend-difference italic tracking-tighter uppercase">
          GURU BANTU GURU
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white font-bold uppercase text-[10px] tracking-[0.2em] bg-black px-5 py-2.5 rounded-full">
          {isMenuOpen ? "Close" : "Menu"}
        </button>
      </nav>

      <section ref={containerRef} className="relative h-[600vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <canvas ref={canvasRef} className="w-full h-full object-cover" />

          {/* LOADING INDICATOR DI TENGAH */}
          <AnimatePresence>
            {!isLoaded && (
              <motion.div 
                exit={{ opacity: 0 }} 
                className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md"
              >
                <div className="relative flex items-center justify-center">
                    <div className="w-20 h-20 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span className="absolute text-[14px] font-black text-white">{progress}%</span>
                </div>
                <p className="mt-6 text-[11px] font-black italic tracking-[0.5em] text-white uppercase animate-pulse">
                  Tunggu sebentar...
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* TEKS CANVAS DENGAN KOLOM GLASSMORPHISM */}
          <div className="absolute inset-0 flex items-center justify-center text-center px-6 pointer-events-none">
            
            <motion.div style={{ opacity: text1Opacity }} className="absolute bg-white/30 backdrop-blur-2xl p-8 md:p-12 rounded-[50px] border border-white/20 shadow-2xl">
              <h2 className="text-4xl md:text-7xl font-black italic text-black tracking-tighter leading-none">GURUBANTUGURU</h2>
              <p className="text-black/70 font-bold tracking-[0.3em] uppercase text-[10px] md:text-xs mt-4">Asisten AI Untuk Para Guru Indonesia</p>
            </motion.div>

            <motion.div style={{ opacity: text2Opacity }} className="absolute bg-white/30 backdrop-blur-2xl p-8 md:p-12 rounded-[50px] border border
