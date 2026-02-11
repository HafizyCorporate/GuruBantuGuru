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

  // Alur: Gambar (0-85%), Teks Zoom (85-100%)
  const frameIndex = useTransform(scrollYProgress, [0, 0.85], [0, totalFrames - 1]);
  const textOpacity = useTransform(scrollYProgress, [0.84, 0.86, 0.98, 1], [0, 1, 1, 0]);
  const textScale = useTransform(scrollYProgress, [0.85, 1], [1, 35]);
  const canvasOpacity = useTransform(scrollYProgress, [0.95, 1], [1, 0]);

  // Preload Images
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

  // Logika Render Full Screen (Anti Black Bar)
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

        let drawWidth, drawHeight, offsetX, offsetY;

        // Logika Cover agar Full Layar
        if (imgRatio > canvasRatio) {
          drawHeight = canvas.height;
          drawWidth = canvas.height * imgRatio;
          offsetX = (canvas.width - drawWidth) / 2;
          offsetY = 0;
        } else {
          drawWidth = canvas.width;
          drawHeight = canvas.width / imgRatio;
          offsetX = 0;
          offsetY = (canvas.height - drawHeight) / 2;
        }

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      }
    };

    const unsubscribe = frameIndex.on("change", (latest) => renderCanvas(latest));
    renderCanvas(0);
    return () => unsubscribe();
  }, [isLoaded, images, frameIndex]);

  return (
    // Berubah menjadi bg-white (Latar Terang)
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

      {/* NAVBAR BIRU - PUTIH */}
      <nav className="fixed top-0 w-full z-[100] px-6 py-8 flex justify-between items-center">
        <div className="text-2xl font-black text-blue-600 tracking-tighter uppercase italic drop-shadow-sm">
          GuruBantu
        </div>
        <button className="flex flex-col gap-1.5 p-2 group">
          <div className="w-8 h-[2px] bg-blue-600" />
          <div className="w-8 h-[2px] bg-blue-600" />
          <div className="w-5 h-[2px] bg-blue-600 self-end" />
        </button>
      </nav>

      {/* HERO SECTION */}
      <section ref={containerRef} className="relative h-[1500vh] bg-white">
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
          
          {/* Canvas Full Screen */}
          <motion.canvas
            ref={canvasRef}
            style={{ opacity: canvasOpacity }}
            className="absolute inset-0 w-full h-full"
          />

          {/* Overlay Putih Transparan (Agar gambar terlihat lebih terang/bersih) */}
          <div className="absolute inset-0 bg-white/10" />

          {/* TEKS ZOOM: Muncul setelah frame selesai */}
          <motion.div 
            style={{ scale: textScale, opacity: textOpacity }}
            className="relative z-10 pointer-events-none"
          >
            <h1 className="text-6xl md:text-[140px] font-black text-blue-600 leading-none uppercase tracking-tighter text-center italic drop-shadow-xl">
              GURU BANTU <br /> GURU
            </h1>
          </motion.div>
        </div>
      </section>

      {/* KONTEN BERIKUTNYA */}
      <div className="relative z-20 bg-white text-blue-900">
        <section className="py-60 px-6 max-w-5xl mx-auto text-center">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-blue-500 font-bold tracking-[0.6em] uppercase text-xs block mb-12"
          >
            Misi Kami
          </motion.span>
          <motion.p 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="text-4xl md:text-7xl font-light leading-none tracking-tighter"
          >
            Digitalisasi Pendidikan <br /> 
            <span className="text-blue-600 font-bold italic">Tanpa Batas.</span>
          </motion.p>
        </section>
      </div>
    </main>
  );
}
