"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const totalFrames = 194;
  // --- OPTIMASI: Batas minimal frame untuk membuka loading screen ---
  const minFramesToStart = 20; 
  
  const { scrollYProgress } = useScroll({ 
    target: containerRef, 
    offset: ["start start", "end end"] 
  });

  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, totalFrames - 1]);

  const text1Opacity = useTransform(scrollYProgress, [0, 0.1, 0.2], [1, 1, 0]);
  const text2Opacity = useTransform(scrollYProgress, [0.35, 0.5, 0.6], [0, 1, 0]);
  const text3Opacity = useTransform(scrollYProgress, [0.75, 0.85, 0.95], [0, 1, 0]);

  useEffect(() => {
    if (!isLoaded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
      document.body.style.overflowX = "hidden";
    }
  }, [isLoaded]);

  // --- OPTIMASI LOADING: Load paralel dan buka pintu lebih cepat ---
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      img.src = `/ezgif-frame-${i.toString().padStart(3, '0')}.jpg`;
      img.onload = () => {
        loadedCount++;
        // Begitu mencapai minimal frame, web langsung bisa diakses
        if (loadedCount === minFramesToStart) {
          setIsLoaded(true);
        }
      };
      loadedImages[i - 1] = img;
    }
    setImages(loadedImages);
  }, []);

  const draw = (img: HTMLImageElement, context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
    const x = (canvas.width / 2) - (img.width / 2) * scale;
    const y = (canvas.height / 2) - (img.height / 2) * scale;
    context.drawImage(img, x, y, img.width * scale, img.height * scale);
  };

  useEffect(() => {
    if (!canvasRef.current || images.length === 0) return;
    const context = canvasRef.current.getContext("2d", { alpha: false });
    if (!context) return;
    const unsubscribe = frameIndex.on("change", (latest) => {
      const img = images[Math.floor(latest)];
      // Tambahan pengecekan img.complete agar tidak kedap-kedip
      if (img && img.complete) {
        requestAnimationFrame(() => draw(img, context, canvasRef.current!));
      }
    });
    if (images[0]) draw(images[0], context, canvasRef.current);
    return () => unsubscribe();
  }, [images, frameIndex]);

  const whiteBoxStyle = "bg-white/40 backdrop-blur-[4px] px-6 py-2 inline-block border border-white/60 shadow-lg";
  const canvasTitleStyle = "text-black font-black italic uppercase leading-none tracking-tighter";

  return (
    <main className="relative w-full bg-black overflow-x-hidden">
      <style jsx global>{`
        html, body { background-color: black; margin: 0; padding: 0; overflow-x: hidden; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .loader {
          border: 3px solid rgba(255, 255, 255, 0.1);
          border-left-color: #ffffff;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }
      `}</style>

      {/* --- HEADER --- */}
      <header className="fixed top-0 left-0 w-full z-[90] p-6 flex justify-between items-center pointer-events-none">
        <div className="pointer-events-auto">
          <h2 className="text-white font-black italic tracking-tighter text-xl md:text-2xl uppercase bg-black/20 backdrop-blur-md px-4 py-1 rounded-lg border border-white/10">
            GURUBANTUGURU
          </h2>
        </div>

        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="pointer-events-auto w-12 h-12 bg-white rounded-full flex flex-col items-center justify-center gap-1.5 shadow-2xl z-[100]"
        >
          <motion.span 
            animate={isMenuOpen ? { rotate: 45, y: 6.5 } : { rotate: 0, y: 0 }} 
            className="w-6 h-0.5 bg-black block" 
          />
          <motion.span 
            animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }} 
            className="w-6 h-0.5 bg-black block" 
          />
          <motion.span 
            animate={isMenuOpen ? { rotate: -45, y: -6.5 } : { rotate: 0, y: 0 }} 
            className="w-6 h-0.5 bg-black block" 
          />
        </button>
      </header>

      {/* --- MENU OVERLAY --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[85] bg-white flex flex-col items-center justify-center gap-8"
          >
            {['Home', 'Our Story', 'Produk', 'Testimoni'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase().replace(' ', '-')}`} 
                onClick={() => setIsMenuOpen(false)}
                className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-black hover:text-blue-600 transition-colors"
              >
                {item}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* SECTION 1: CANVAS */}
      <div ref={containerRef} className="relative h-[600vh] w-full">
        <div className="fixed top-0 left-0 w-full h-screen z-0 overflow-hidden">
          
          {/* --- LOADING OVERLAY (Optimized Transition) --- */}
          <AnimatePresence>
            {!isLoaded && (
              <motion.div 
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }} // Transisi keluar lebih cepat
                className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black"
              >
                <div className="loader mb-4"></div>
                <p className="text-white text-[10px] font-black tracking-[0.3em] uppercase opacity-50 italic">
                    Fast Loading AI...
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <canvas ref={canvasRef} className="w-full h-full object-cover" />
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
            <motion.div style={{ opacity: text1Opacity }} className="absolute flex flex-col items-center w-full">
              <div className={whiteBoxStyle}>
                <h1 className={`${canvasTitleStyle} text-[2.6rem] md:text-8xl`}>GURUBANTUGURU</h1>
              </div>
              <div className="mt-4 bg-black/90 px-4 py-1">
                <p className="font-bold tracking-[0.3em] uppercase text-[9px] md:text-xs text-white">
                    Asisten AI Untuk Para Guru Indonesia
                </p>
              </div>
            </motion.div>

            <motion.div style={{ opacity: text2Opacity }} className="absolute w-full px-6 flex flex-col items-center gap-3">
              <div className={whiteBoxStyle}>
                <h2 className={`${canvasTitleStyle} text-3xl md:text-7xl`}>Merubah Kebiasaan</h2>
              </div>
              <div className={whiteBoxStyle}>
                <h2 className={`${canvasTitleStyle} text-3xl md:text-7xl`}>Yang Lama</h2>
              </div>
            </motion.div>

            <motion.div style={{ opacity: text3Opacity }} className="absolute w-full px-6 flex flex-col items-center gap-3">
              <div className={whiteBoxStyle}>
                <h2 className={`${canvasTitleStyle} text-3xl md:text-7xl`}>Menjadi Lebih Modern</h2>
              </div>
              <div className={whiteBoxStyle}>
                <h2 className={`${canvasTitleStyle} text-3xl md:text-7xl`}>Dan Efisien</h2>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="relative z-20 w-full bg-white">
        {/* ... Konten Our Story dll tetap sama ... */}
        <section id="our-story" className="w-full flex flex-col items-center justify-center px-6 pt-32 pb-12 bg-gradient-to-b from-white to-blue-50/30">
          <div className="max-w-4xl w-full text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-5xl md:text-7xl font-black italic tracking-tighter text-black uppercase mb-16"
            >
              Our Story
            </motion.h2>
            <div className="space-y-10 text-black px-4 text-lg md:text-xl leading-relaxed font-light">
              <p className="text-xl md:text-3xl font-semibold italic text-blue-900/80">"Berawal dari mimpi sederhana di tengah keterbatasan teknologi..."</p>
              <p>Kami menyaksikan lelahnya mata para guru di balik tumpukan kertas. Kami berangkat untuk meruntuhkan sekat rumit itu dan menggantinya dengan keajaiban teknologi yang memanusiakan.</p>
            </div>
          </div>
        </section>
        
        {/* Lanjutkan sisa konten seperti sebelumnya */}
        <footer className="py-12 text-center bg-white border-t border-blue-50">
          <p className="opacity-40 text-[10px] font-black uppercase tracking-[0.5em] text-blue-900">© 2026 GURU BANTU GURU</p>
        </footer>
      </div>
    </main>
  );
}
