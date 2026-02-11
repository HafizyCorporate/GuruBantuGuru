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

  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let count = 0;
    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      img.src = `/ezgif-frame-${i.toString().padStart(3, '0')}.jpg`;
      img.onload = () => {
        count++;
        const currentProgress = Math.floor((count / totalFrames) * 100);
        setProgress(currentProgress);
        if (count === totalFrames) {
          setIsLoaded(true);
        }
      };
      loadedImages[i - 1] = img;
    }
    setImages(loadedImages);
    document.body.style.overflow = "unset";
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    const context = canvasRef.current.getContext("2d", { alpha: false });
    
    const render = (val: number) => {
      const currentIndex = Math.floor(val);
      const img = images[currentIndex];
      
      if (img && context) {
        const canvas = canvasRef.current!;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        const x = (canvas.width / 2) - (img.width / 2) * scale;
        const y = (canvas.height / 2) - (img.height / 2) * scale;
        context.drawImage(img, x, y, img.width * scale, img.height * scale);
      }
    };

    const unsubscribe = frameIndex.on("change", (latest) => {
      requestAnimationFrame(() => render(latest));
    });

    return () => unsubscribe();
  }, [images]);

  // Style Teks Hitam dengan Cahaya Putih agar kontras
  const textStyle = {
    filter: "drop-shadow(0 0 12px rgba(255,255,255,1))",
    color: "black"
  };

  return (
    <main className="relative bg-white">
      <nav className="fixed top-0 w-full z-[100] px-6 py-6 flex justify-between items-center mix-blend-difference">
        <div className="text-xl font-black text-white italic tracking-tighter uppercase">
          GURU BANTU GURU
        </div>
      </nav>

      <section ref={containerRef} className="relative h-[600vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          
          <canvas ref={canvasRef} className="w-full h-full object-cover" />
          
          <div className="absolute inset-0 flex items-center justify-center text-center px-6 pointer-events-none">
            
            <motion.div style={{ opacity: text1Opacity, ...textStyle }} className="absolute flex flex-col items-center">
              <h2 className="text-5xl md:text-8xl font-black italic tracking-tighter leading-none">
                GURUBANTUGURU
              </h2>
              <p className="font-bold tracking-[0.4em] uppercase text-[10px] md:text-xs mt-4">
                Asisten AI Untuk Para Guru Indonesia
              </p>

              {/* LOADING SCREEN BERJALAN 0-100% */}
              {!isLoaded && (
                <div className="mt-10 flex flex-col items-center gap-2">
                  <div className="w-48 h-[2px] bg-black/10 overflow-hidden rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                    <motion.div 
                      className="h-full bg-black" 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-[12px] font-black italic tracking-tighter">
                    LOADING {progress}%
                  </span>
                </div>
              )}
            </motion.div>

            <motion.div style={{ opacity: text2Opacity, ...textStyle }} className="absolute">
              <h2 className="text-4xl md:text-7xl font-black italic uppercase leading-none tracking-tighter">
                Merubah Kebiasaan <br/> Yang Lama
              </h2>
            </motion.div>

            <motion.div style={{ opacity: text3Opacity, ...textStyle }} className="absolute">
              <h2 className="text-4xl md:text-7xl font-black italic uppercase leading-none tracking-tighter">
                Menjadi Lebih Modern <br/> Dan Efisien
              </h2>
            </motion.div>

          </div>
        </div>
      </section>

      <footer className="bg-white py-6 text-center">
        <p className="opacity-20 text-[10px] font-black uppercase tracking-[0.5em]">© 2026 GURU BANTU GURU</p>
      </footer>
    </main>
  );
}
