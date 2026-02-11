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

  const text1Opacity = useTransform(scrollYProgress, [0, 0.1, 0.2], [1, 1, 0]);
  const text2Opacity = useTransform(scrollYProgress, [0.35, 0.5, 0.6], [0, 1, 0]);
  const text3Opacity = useTransform(scrollYProgress, [0.75, 0.9, 1], [0, 1, 1]);

  useEffect(() => {
    // Bunuh flicker putih/hitam di level sistem
    document.documentElement.style.background = "transparent";
    document.body.style.background = "transparent";
    
    const loadedImages: HTMLImageElement[] = [];
    let count = 0;

    // Load Frame 1 Instan
    const firstImg = new Image();
    firstImg.src = `/ezgif-frame-001.jpg`;
    firstImg.onload = () => {
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d", { alpha: false });
        if (ctx) draw(firstImg, ctx, canvasRef.current);
      }
    };

    // Async Load sisanya
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
    if (!canvasRef.current || images.length === 0) return;
    const context = canvasRef.current.getContext("2d", { alpha: false });
    if (!context) return;
    
    const unsubscribe = frameIndex.on("change", (latest) => {
      const img = images[Math.floor(latest)];
      if (img) requestAnimationFrame(() => draw(img, context, canvasRef.current!));
    });
    return () => unsubscribe();
  }, [images]);

  // JURUS BIAR TEKS KELIHATAN: Garis pinggir (Stroke) + Shadow
  const hollowTextStyle = {
    WebkitTextStroke: "1px white",
    color: "black",
    textShadow: "0 0 10px rgba(255,255,255,0.5)",
  };

  return (
    <main className="relative bg-transparent">
      <style jsx global>{`
        html, body { background: transparent !important; margin: 0; padding: 0; overflow-x: hidden; }
      `}</style>

      <nav className="fixed top-0 w-full z-50 px-6 py-8 flex justify-between items-center mix-blend-difference">
        <div className="text-sm font-black text-white italic tracking-tighter uppercase">
          GURU BANTU GURU
        </div>
      </nav>

      <section ref={containerRef} className="relative h-[500vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />
          
          <div className="relative z-10 h-full w-full flex flex-col items-center justify-center text-center px-4 pointer-events-none">
            
            {/* TEXT 1 - UKURAN DI-ADJUST BIAR PAS DI HP */}
            <motion.div style={{ opacity: text1Opacity }} className="absolute flex flex-col items-center w-full">
              <h1 className="text-[2.6rem] md:text-8xl font-black italic tracking-tighter leading-[0.85] uppercase" style={hollowTextStyle}>
                GURUBANTUGURU
              </h1>
              <p className="font-bold tracking-[0.4em] uppercase text-[9px] md:text-xs mt-4 text-white mix-blend-difference">
                Asisten AI Untuk Para Guru Indonesia
              </p>

              {!isLoaded && (
                <div className="mt-10 flex flex-col items-center">
                  <span className="text-[10px] font-black text-white mix-blend-difference">{progress}%</span>
                  <div className="w-20 h-[1px] bg-white/30 mt-1">
                    <motion.div className="h-full bg-white" animate={{ width: `${progress}%` }} />
                  </div>
                </div>
              )}
            </motion.div>

            {/* TEXT 2 */}
            <motion.div style={{ opacity: text2Opacity }} className="absolute w-full px-6">
              <h2 className="text-3xl md:text-7xl font-black italic uppercase leading-none tracking-tighter" style={hollowTextStyle}>
                Merubah Kebiasaan <br/> Yang Lama
              </h2>
            </motion.div>

            {/* TEXT 3 */}
            <motion.div style={{ opacity: text3Opacity }} className="absolute w-full px-6">
              <h2 className="text-3xl md:text-7xl font-black italic uppercase leading-none tracking-tighter" style={hollowTextStyle}>
                Menjadi Lebih Modern <br/> Dan Efisien
              </h2>
            </motion.div>

          </div>
        </div>
      </section>
    </main>
  );
}
