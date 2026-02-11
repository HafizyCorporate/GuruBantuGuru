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

  // LOCK SCROLL SAMPAI ASET SIAP
  useEffect(() => {
    if (!isLoaded) {
      document.body.style.overflow = "hidden";
      window.scrollTo(0, 0);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isLoaded]);

  // LOAD IMAGES & FORCE FIRST FRAME
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let count = 0;

    // Paksa frame pertama tampil duluan
    const firstImg = new Image();
    firstImg.src = `/ezgif-frame-001.jpg`;
    firstImg.onload = () => {
      if (canvasRef.current) {
        const context = canvasRef.current.getContext("2d");
        draw(firstImg, context, canvasRef.current);
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

  const draw = (img: HTMLImageElement, context: any, canvas: HTMLCanvasElement) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
    const x = (canvas.width / 2) - (img.width / 2) * scale;
    const y = (canvas.height / 2) - (img.height / 2) * scale;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, x, y, img.width * scale, img.height * scale);
  };

  useEffect(() => {
    if (!isLoaded || !canvasRef.current) return;
    const context = canvasRef.current.getContext("2d");
    
    const unsubscribe = frameIndex.on("change", (latest) => {
      const img = images[Math.floor(latest)];
      if (img && context && canvasRef.current) {
        draw(img, context, canvasRef.current);
      }
    });

    return () => unsubscribe();
  }, [isLoaded, images]);

  // Style Teks Glowing agar terlihat di background gelap
  const glowStyle = {
    filter: "drop-shadow(0 0 15px rgba(255,255,255,1)) drop-shadow(0 0 5px rgba(255,255,255,0.8))",
    color: "black"
  };

  return (
    <main className="relative bg-transparent">
      {/* Navbar Minimalis */}
      <nav className="fixed top-0 w-full z-[100] px-6 py-8 flex justify-between items-center mix-blend-difference">
        <div className="text-xl font-black text-white italic tracking-tighter uppercase">
          GURU BANTU GURU
        </div>
      </nav>

      <section ref={containerRef} className="relative h-[600vh] bg-transparent">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          
          {/* CANVAS UTAMA - LANGSUNG TAMPIL */}
          <canvas ref={canvasRef} className="w-full h-full object-cover bg-transparent" />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none">
            
            <motion.div style={{ opacity: text1Opacity, ...glowStyle }} className="absolute flex flex-col items-center">
              <h2 className="text-5xl md:text-8xl font-black italic tracking-tighter leading-none">
                GURUBANTUGURU
              </h2>
              <p className="font-bold tracking-[0.4em] uppercase text-[10px] md:text-xs mt-4">
                Asisten AI Untuk Para Guru Indonesia
              </p>

              {/* INDIKATOR LOADING MINIMALIS */}
              {!isLoaded && (
                <div className="mt-12 flex flex-col items-center gap-2">
                  <div className="w-32 h-[2px] bg-black/10 overflow-hidden">
                    <motion.div 
                      className="h-full bg-black" 
                      animate={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-black italic uppercase tracking-widest">
                    Loading {progress}%
                  </span>
                </div>
              )}
            </motion.div>

            <motion.div style={{ opacity: text2Opacity, ...glowStyle }} className="absolute">
              <h2 className="text-4xl md:text-7xl font-black italic uppercase leading-none tracking-tighter">
                Merubah Kebiasaan <br/> Yang Lama
              </h2>
            </motion.div>

            <motion.div style={{ opacity: text3Opacity, ...glowStyle }} className="absolute">
              <h2 className="text-4xl md:text-7xl font-black italic uppercase leading-none tracking-tighter">
                Menjadi Lebih Modern <br/> Dan Efisien
              </h2>
            </motion.div>

          </div>
        </div>
      </section>

      <footer className="bg-white py-6 text-center border-t border-gray-100">
        <p className="opacity-20 text-[10px] font-black uppercase tracking-[0.5em]">© 2026 GURU BANTU GURU</p>
      </footer>
    </main>
  );
}
