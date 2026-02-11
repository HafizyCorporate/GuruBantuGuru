"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  // SEKARANG 121 FOTO
  const totalFrames = 121; 

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Alur: Gambar (0-85%), Teks Zoom Muncul (85-100%)
  const frameIndex = useTransform(scrollYProgress, [0, 0.85], [0, totalFrames - 1]);
  const textOpacity = useTransform(scrollYProgress, [0.84, 0.86, 0.98, 1], [0, 1, 1, 0]);
  const textScale = useTransform(scrollYProgress, [0.85, 1], [1, 35]);
  const canvasOpacity = useTransform(scrollYProgress, [0.95, 1], [1, 0]);

  // PRELOAD IMAGES
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let count = 0;
    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      // Format file sesuai permintaan: ezgif-frame-001.jpg
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

  // LOGIKA RENDER FULL SCREEN (COVER)
  useEffect(() => {
    if (!isLoaded || !canvasRef.current) return;
    const context = canvasRef.current.getContext("2d");

    const renderCanvas = (index: number) => {
      const img = images[Math.floor(index)];
      if (img && context && canvasRef.current) {
        const canvas = canvasRef.current;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const canvasRatio = canvas.width / canvas.height;
        const imgRatio = img.width / img.height;

        let dWidth, dHeight, dx, dy;

        // Memastikan gambar memenuhi layar (Center Crop)
        if (imgRatio > canvasRatio) {
          dHeight = canvas.height;
          dWidth = canvas.height * imgRatio;
          dx = (canvas.width - dWidth) / 2;
          dy = 0;
        } else {
          dWidth = canvas.width;
          dHeight = canvas.width / imgRatio;
          dx = 0;
          dy = (canvas.height - dHeight) / 2;
        }

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, dx, dy, dWidth, dHeight);
      }
    };

    const unsubscribe = frameIndex.on("change", (latest) => renderCanvas(latest));
    renderCanvas(0);
    return () => unsubscribe();
  }, [isLoaded, images, frameIndex]);

  return (
    <main className="relative bg-white font-[family-name:var(--font-outfit)]">
      
      {/* LOADING SCREEN TERANG */}
      {!isLoaded && (
        <div className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center text-blue-600">
          <div className="text-3xl font-black italic mb-6 tracking-tighter uppercase">GuruBantu</div>
          <div className="w-64 h-[2px] bg-blue-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <span className="mt-4 text-[10px] tracking-[0.5em] opacity-60 uppercase font-bold">Memuat {progress}%</span>
        </div>
      )}

      {/* NAVBAR BIRU - PUTIH (GAYA GOLDA) */}
      <nav className="fixed top-0 w-full z-[100] px-6 py-8 flex justify-between items-center">
        <div className="text-2xl font-black text-blue-400 tracking-tighter uppercase italic drop-shadow-sm">
          GuruBantu
        </div>
        <button className="flex flex-col gap-1.5 p-2 group">
          <div className="w-8 h-[2px] bg-blue-400" />
          <div className="w-8 h-[2px] bg-blue-400" />
          <div className="w-5 h-[2px] bg-blue-400 self-end" />
        </button>
      </nav>

      {/* HERO SECTION DENGAN 1200vh SUPAYA SCROLL MULUS */}
      <section ref={containerRef} className="relative h-[1200vh] bg-white">
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
          
          <motion.canvas
            ref={canvasRef}
            style={{ opacity: canvasOpacity }}
            className="absolute inset-0 w-full h-full"
          />

          <div className="absolute inset-0 bg-white/5" />

          {/* TEKS ZOOM: MUNCUL SETELAH FRAME 121 */}
          <motion.div 
            style={{ scale: textScale, opacity: textOpacity }}
            className="relative z-10 pointer-events-none"
          >
            <h1 className="text-6xl md:text-[140px] font-black text-blue-500 leading-none uppercase tracking-tighter text-center italic">
              GURU BANTU <br /> GURU
            </h1>
          </motion.div>
        </div>
      </section>

      {/* CONTENT */}
      <div className="relative z-20 bg-white text-blue-900">
        <section className="py-60 px-6 max-w-5xl mx-auto text-center">
          <motion.p 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="text-4xl md:text-7xl font-light leading-none tracking-tighter"
          >
            Digitalisasi Pendidikan <br /> 
            <span className="text-blue-500 font-bold italic">Mencerdaskan Bangsa.</span>
          </motion.p>
        </section>
      </div>
    </main>
  );
}
