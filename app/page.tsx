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

  // Opacity teks saat scroll
  const text1Opacity = useTransform(scrollYProgress, [0, 0.15, 0.3], [1, 1, 0]);
  const text2Opacity = useTransform(scrollYProgress, [0.4, 0.55, 0.7], [0, 1, 0]);
  const text3Opacity = useTransform(scrollYProgress, [0.8, 0.95, 1], [0, 1, 1]);

  // PAKSA BACKGROUND HITAM SEJAK AWAL
  useEffect(() => {
    document.documentElement.style.backgroundColor = "#000000";
    document.body.style.backgroundColor = "#000000";
    
    // Kunci scroll sampai gambar pertama minimal muncul
    document.body.style.overflow = "hidden";
  }, []);

  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let count = 0;

    // LOAD SEMUA GAMBAR
    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      img.src = `/ezgif-frame-${i.toString().padStart(3, '0')}.jpg`;
      img.onload = () => {
        count++;
        setProgress(Math.floor((count / totalFrames) * 100));
        
        // Begitu gambar pertama (atau beberapa frame awal) kelar, buka kuncinya
        if (count === 10) {
            document.body.style.overflow = "unset";
        }

        if (count === totalFrames) {
          setImages(loadedImages);
          setIsLoaded(true);
        }
      };
      loadedImages[i - 1] = img;
    }
  }, []);

  // FUNGSI GAMBAR KE CANVAS
  const draw = (img: HTMLImageElement, context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
    const x = (canvas.width / 2) - (img.width / 2) * scale;
    const y = (canvas.height / 2) - (img.height / 2) * scale;
    context.drawImage(img, x, y, img.width * scale, img.height * scale);
  };

  useEffect(() => {
    const context = canvasRef.current?.getContext("2d", { alpha: false });
    if (!context || !canvasRef.current) return;

    // Render frame pertama segera jika sudah ada di array
    if (images[0]) draw(images[0], context, canvasRef.current);

    const unsubscribe = frameIndex.on("change", (latest) => {
      const img = images[Math.floor(latest)];
      if (img && canvasRef.current) {
        draw(img, context, canvasRef.current);
      }
    });
    return () => unsubscribe();
  }, [images, frameIndex]);

  // STYLE TEKS: Hitam dengan Glow Putih (Lebih Kecil)
  const glowStyle = {
    filter: "drop-shadow(0 0 10px rgba(255,255,255,0.8))",
    color: "black"
  };

  return (
    <main className="relative min-h-screen bg-black">
      {/* CSS INJECTION UNTUK MEMBUNUH WARNA PUTIH */}
      <style jsx global>{`
        html, body { background-color: #000000 !important; color: white; }
        * { box-sizing: border-box; }
      `}</style>

      <nav className="fixed top-0 w-full z-[100] px-6 py-6 flex justify-between items-center mix-blend-difference">
        <div className="text-lg font-black text-white italic tracking-tighter uppercase">
          GURU BANTU GURU
        </div>
      </nav>

      <section ref={containerRef} className="relative h-[600vh] bg-black">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          
          {/* CANVAS UTAMA */}
          <canvas 
            ref={canvasRef} 
            className="absolute inset-0 w-full h-full object-cover z-0" 
            style={{ backgroundColor: '#000000' }}
          />
          
          <div className="relative z-10 h-full w-full flex flex-col items-center justify-center text-center px-8 pointer-events-none">
            
            {/* TEXT 1 (DIPERSEDIAKAN LEBIH KECIL) */}
            <motion.div style={{ opacity: text1Opacity, ...glowStyle }} className="absolute flex flex-col items-center w-full">
              <h1 className="text-4xl md:text-7xl font-black italic tracking-tighter leading-none uppercase">
                GURUBANTUGURU
              </h1>
              <p className="font-bold tracking-[0.2em] uppercase text-[9px] md:text-xs mt-3">
                Asisten AI Untuk Para Guru Indonesia
              </p>

              {/* PERSENTASE LOADING DI BAWAH TULISAN */}
              {!isLoaded && (
                <div className="mt-8 flex flex-col items-center gap-2">
                  <div className="w-24 h-[1px] bg-white/20 overflow-hidden">
                    <motion.div 
                      className="h-full bg-white" 
                      animate={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-[9px] font-bold text-white/50 tracking-widest">
                    {progress}%
                  </span>
                </div>
              )}
            </motion.div>

            {/* TEXT 2 */}
            <motion.div style={{ opacity: text2Opacity, ...glowStyle }} className="absolute w-full">
              <h2 className="text-3xl md:text-6xl font-black italic uppercase leading-tight tracking-tighter">
                Merubah Kebiasaan <br/> Yang Lama
              </h2>
            </motion.div>

            {/* TEXT 3 */}
            <motion.div style={{ opacity: text3Opacity, ...glowStyle }} className="absolute w-full">
              <h2 className="text-3xl md:text-6xl font-black italic uppercase leading-tight tracking-tighter">
                Menjadi Lebih Modern <br/> Dan Efisien
              </h2>
            </motion.div>

          </div>
        </div>
      </section>

      <footer className="relative z-20 bg-black py-4 text-center">
        <p className="opacity-30 text-[8px] font-bold uppercase tracking-[0.3em] text-white">
          © 2026 GURU BANTU GURU
        </p>
      </footer>
    </main>
  );
}
