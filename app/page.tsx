"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const totalFrames = 194;
  
  const { scrollYProgress } = useScroll({ 
    target: containerRef, 
    offset: ["start start", "end end"] 
  });

  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, totalFrames - 1]);

  const text1Opacity = useTransform(scrollYProgress, [0, 0.15, 0.3], [1, 1, 0]);
  const text2Opacity = useTransform(scrollYProgress, [0.4, 0.55, 0.7], [0, 1, 0]);
  const text3Opacity = useTransform(scrollYProgress, [0.8, 0.95, 1], [0, 1, 1]);

  // Hapus semua pengunci warna sistem
  useEffect(() => {
    document.documentElement.style.background = "none";
    document.body.style.background = "none";
  }, []);

  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let count = 0;

    // Load frame 1 secepat mungkin
    const firstImg = new Image();
    firstImg.src = `/ezgif-frame-001.jpg`;
    firstImg.onload = () => {
      if (canvasRef.current) {
        const context = canvasRef.current.getContext("2d");
        if (context) draw(firstImg, context, canvasRef.current);
      }
    };

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

  const draw = (img: HTMLImageElement, context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
    const x = (canvas.width / 2) - (img.width / 2) * scale;
    const y = (canvas.height / 2) - (img.height / 2) * scale;
    context.drawImage(img, x, y, img.width * scale, img.height * scale);
  };

  useEffect(() => {
    const context = canvasRef.current?.getContext("2d");
    if (!context || !canvasRef.current) return;

    const unsubscribe = frameIndex.on("change", (latest) => {
      const img = images[Math.floor(latest)];
      if (img && canvasRef.current) {
        draw(img, context, canvasRef.current);
      }
    });
    return () => unsubscribe();
  }, [images, frameIndex]);

  // Efek cahaya teks agar tidak tenggelam di gambar
  const glowStyle = {
    filter: "drop-shadow(0 0 10px rgba(255,255,255,1))",
    color: "black"
  };

  return (
    <main className="relative min-h-screen">
      {/* PAKSA SEMUA JADI TRANSPARAN AGAR LANGSUNG TEMBUS KE CANVAS */}
      <style jsx global>{`
        html, body { background: none !important; background-color: transparent !important; }
        main { background: none !important; }
      `}</style>

      <nav className="fixed top-0 w-full z-[100] px-6 py-6 flex justify-between items-center mix-blend-difference">
        <div className="text-base font-black text-white italic tracking-tighter uppercase">
          GURU BANTU GURU
        </div>
      </nav>

      <section ref={containerRef} className="relative h-[600vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          
          {/* CANVAS: Langsung Tampil Tanpa Background Layer */}
          <canvas 
            ref={canvasRef} 
            className="absolute inset-0 w-full h-full object-cover z-0" 
          />
          
          <div className="relative z-10 h-full w-full flex flex-col items-center justify-center text-center px-10 pointer-events-none">
            
            <motion.div style={{ opacity: text1Opacity, ...glowStyle }} className="absolute flex flex-col items-center w-full">
              <h1 className="text-3xl md:text-6xl font-black italic tracking-tighter leading-none uppercase">
                GURUBANTUGURU
              </h1>
              <p className="font-bold tracking-[0.2em] uppercase text-[8px] md:text-[10px] mt-3">
                Asisten AI Untuk Para Guru Indonesia
              </p>

              {/* PROGRESS BERJALAN DI BAWAH TULISAN */}
              {!isLoaded && (
                <div className="mt-6 flex flex-col items-center">
                  <span className="text-[10px] font-bold italic tracking-widest">
                    {progress}%
                  </span>
                  <div className="w-20 h-[1px] bg-black/20 mt-1">
                    <motion.div 
                      className="h-full bg-black" 
                      animate={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </motion.div>

            <motion.div style={{ opacity: text2Opacity, ...glowStyle }} className="absolute w-full px-4">
              <h2 className="text-2xl md:text-5xl font-black italic uppercase leading-tight tracking-tighter">
                Merubah Kebiasaan <br/> Yang Lama
              </h2>
            </motion.div>

            <motion.div style={{ opacity: text3Opacity, ...glowStyle }} className="absolute w-full px-4">
              <h2 className="text-2xl md:text-5xl font-black italic uppercase leading-tight tracking-tighter">
                Menjadi Lebih Modern <br/> Dan Efisien
              </h2>
            </motion.div>

          </div>
        </div>
      </section>

      <footer className="relative z-20 py-4 text-center">
        <p className="opacity-40 text-[8px] font-bold uppercase tracking-[0.3em] text-black">
          © 2026 GURU BANTU GURU
        </p>
      </footer>
    </main>
  );
}
