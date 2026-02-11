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

  // FIX: Bunuh background sistem sejak detik 0
  useEffect(() => {
    document.documentElement.style.background = "none";
    document.body.style.background = "none";
    document.body.style.overflow = "hidden"; // Lock scroll sampai frame 1 nongol
  }, []);

  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let count = 0;

    // LANGSUNG TEMBAK FRAME 1
    const firstImg = new Image();
    firstImg.src = `/ezgif-frame-001.jpg`;
    firstImg.onload = () => {
      if (canvasRef.current) {
        const context = canvasRef.current.getContext("2d", { alpha: false });
        if (context) {
          draw(firstImg, context, canvasRef.current);
          document.body.style.overflow = "unset"; // Begitu gedung nongol, bebas scroll
        }
      }
    };

    // LOAD SISANYA
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
    if (!canvasRef.current) return;
    const context = canvasRef.current.getContext("2d", { alpha: false });
    if (!context) return;
    
    const unsubscribe = frameIndex.on("change", (latest) => {
      const img = images[Math.floor(latest)];
      if (img && canvasRef.current) {
        draw(img, context, canvasRef.current);
      }
    });
    return () => unsubscribe();
  }, [images]);

  // Style Teks: Ukuran Pas + Glow Putih agar tajam
  const glowStyle = {
    filter: "drop-shadow(0 0 15px rgba(255,255,255,1))",
    color: "black"
  };

  return (
    <main className="relative min-h-screen bg-transparent">
      {/* PAKSA TRANSPARAN DI LEVEL GLOBAL */}
      <style jsx global>{`
        html, body { background: transparent !important; }
        * { -webkit-tap-highlight-color: transparent; }
      `}</style>

      <nav className="fixed top-0 w-full z-[100] px-6 py-8 flex justify-between items-center mix-blend-difference">
        <div className="text-xl font-black text-white italic tracking-tighter uppercase">
          GURU BANTU GURU
        </div>
      </nav>

      <section ref={containerRef} className="relative h-[600vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          
          {/* CANVAS: Layer Paling Bawah */}
          <canvas 
            ref={canvasRef} 
            className="absolute inset-0 w-full h-full object-cover z-0" 
          />
          
          <div className="relative z-10 h-full w-full flex flex-col items-center justify-center text-center px-6 pointer-events-none">
            
            {/* TEXT 1: Ukuran di-adjust biar pas */}
            <motion.div style={{ opacity: text1Opacity, ...glowStyle }} className="absolute flex flex-col items-center w-full">
              <h1 className="text-[2.8rem] md:text-8xl font-black italic tracking-tighter leading-[0.9] uppercase">
                GURUBANTUGURU
              </h1>
              <p className="font-bold tracking-[0.3em] uppercase text-[10px] md:text-sm mt-4">
                Asisten AI Untuk Para Guru Indonesia
              </p>

              {/* Progress 0-100% (Tanpa background ganggu) */}
              {!isLoaded && (
                <div className="mt-8 flex flex-col items-center opacity-60">
                  <span className="text-[11px] font-black italic">{progress}%</span>
                  <div className="w-24 h-[1.5px] bg-black/10 mt-1 overflow-hidden">
                    <motion.div 
                      className="h-full bg-black" 
                      animate={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </motion.div>

            {/* TEXT 2 */}
            <motion.div style={{ opacity: text2Opacity, ...glowStyle }} className="absolute w-full px-8">
              <h2 className="text-4xl md:text-7xl font-black italic uppercase leading-none tracking-tighter">
                Merubah Kebiasaan <br/> Yang Lama
              </h2>
            </motion.div>

            {/* TEXT 3 */}
            <motion.div style={{ opacity: text3Opacity, ...glowStyle }} className="absolute w-full px-8">
              <h2 className="text-4xl md:text-7xl font-black italic uppercase leading-none tracking-tighter">
                Menjadi Lebih Modern <br/> Dan Efisien
              </h2>
            </motion.div>

          </div>
        </div>
      </section>

      <footer className="relative z-20 py-6 text-center">
        <p className="opacity-30 text-[9px] font-bold uppercase tracking-[0.4em] text-black">
          © 2026 GURU BANTU GURU
        </p>
      </footer>
    </main>
  );
}
