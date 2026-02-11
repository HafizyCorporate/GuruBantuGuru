"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  const totalFrames = 192;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // 1. ZONA GAMBAR: 0% - 85% scroll untuk menghabiskan semua frame
  const frameIndex = useTransform(scrollYProgress, [0, 0.85], [0, totalFrames - 1]);
  
  // 2. ZONA TEKS: Muncul & Zoom setelah 85% (Gambar sudah di frame terakhir)
  const textOpacity = useTransform(scrollYProgress, [0, 0.84, 0.85, 0.98, 1], [0, 0, 1, 1, 0]);
  const textScale = useTransform(scrollYProgress, [0.85, 1], [1, 30]);
  
  // 3. TRANSISI AKHIR: Gambar tetap 100% terlihat sampai teks hampir menutupi layar
  const canvasOpacity = useTransform(scrollYProgress, [0.9, 1], [1, 0]);

  // PRELOAD IMAGES
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

  // LOGIKA RENDER CANVAS (FULL SCREEN COVER)
  useEffect(() => {
    if (!isLoaded || !canvasRef.current) return;
    const context = canvasRef.current.getContext("2d");

    const renderCanvas = (index: number) => {
      const img = images[Math.floor(index)];
      if (img && context && canvasRef.current) {
        const canvas = canvasRef.current;
        
        // Logika Object-Fit: Cover
        const imgRatio = img.width / img.height;
        const canvasRatio = canvas.width / canvas.height;
        let dWidth = canvas.width;
        let dHeight = canvas.height;
        let dx = 0;
        let dy = 0;

        if (imgRatio > canvasRatio) {
          dWidth = canvas.height * imgRatio;
          dx = (canvas.width - dWidth) / 2;
        } else {
          dHeight = canvas.width / imgRatio;
          dy = (canvas.height - dHeight) / 2;
        }

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, dx, dy, dWidth, dHeight);
      }
    };

    const unsubscribe = frameIndex.on("change", (latest) => renderCanvas(latest));
    renderCanvas(0); // Render frame awal
    return () => unsubscribe();
  }, [isLoaded, images, frameIndex]);

  // Handle Resize Window
  useEffect(() => {
    const resize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener("resize", resize);
    resize();
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <main className="relative bg-black">
      {/* LOADING SCREEN */}
      {!isLoaded && (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center text-white font-[family-name:var(--font-outfit)]">
          <div className="text-3xl font-black italic mb-6 tracking-tighter uppercase">GuruBantu</div>
          <div className="w-64 h-[2px] bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <span className="mt-4 text-[10px] tracking-[0.6em] opacity-40 uppercase">Loading {progress}%</span>
        </div>
      )}

      {/* HERO SECTION */}
      <section ref={containerRef} className="relative h-[1500vh] bg-black">
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
          
          {/* Canvas: Full Layar & Selalu di Bawah Teks */}
          <motion.canvas
            ref={canvasRef}
            style={{ opacity: canvasOpacity }}
            className="absolute inset-0 w-full h-full"
          />

          {/* Overlay Tipis agar Teks Terbaca */}
          <div className="absolute inset-0 bg-black/10" />

          {/* TEKS: Zoom setelah Frame Selesai */}
          <motion.div 
            style={{ scale: textScale, opacity: textOpacity }}
            className="relative z-10 pointer-events-none font-[family-name:var(--font-outfit)]"
          >
            <h1 className="text-6xl md:text-[140px] font-black text-white leading-none uppercase tracking-tighter text-center italic drop-shadow-2xl">
              GURU BANTU <br /> GURU
            </h1>
          </motion.div>

          {/* Indikator Scroll */}
          <motion.div 
            style={{ opacity: useTransform(scrollYProgress, [0, 0.05], [1, 0]) }}
            className="absolute bottom-12 flex flex-col items-center gap-4 opacity-40"
          >
            <div className="w-[1px] h-20 bg-gradient-to-b from-blue-500 to-transparent" />
            <span className="text-[10px] text-white tracking-[1em] uppercase rotate-90 ml-2 font-bold">Scroll</span>
          </motion.div>
        </div>
      </section>

      {/* SEKSI CONTENT */}
      <div className="relative z-20 bg-black text-white font-[family-name:var(--font-outfit)]">
        <section className="py-60 px-6 max-w-5xl mx-auto text-center">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-blue-500 font-bold tracking-[0.6em] uppercase text-xs block mb-12"
          >
            Visi Kami
          </motion.span>
          <motion.p 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="text-3xl md:text-7xl font-light leading-none tracking-tighter"
          >
            Teknologi untuk <br /> 
            <span className="text-blue-600 font-bold">Mencerdaskan Bangsa.</span>
          </motion.p>
        </section>
      </div>
    </main>
  );
}
