"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const totalFrames = 194;
  
  const { scrollYProgress } = useScroll({ 
    target: containerRef, 
    offset: ["start start", "end end"] 
  });

  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, totalFrames - 1]);

  const text1Opacity = useTransform(scrollYProgress, [0, 0.1, 0.2], [1, 1, 0]);
  const text2Opacity = useTransform(scrollYProgress, [0.35, 0.5, 0.6], [0, 1, 0]);
  const text3Opacity = useTransform(scrollYProgress, [0.75, 0.85, 0.95], [0, 1, 0]);

  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let count = 0;

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      img.src = `/ezgif-frame-${i.toString().padStart(3, '0')}.jpg`;
      img.onload = () => {
        count++;
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
  }, [images, frameIndex]);

  // SETTINGAN OPACITY TEXT SHADOW (KOLOM TULISAN) YANG TIPIS
  const subtleTextStyle = {
    WebkitTextStroke: "0.5px rgba(255,255,255,0.3)", // Garis pinggir sangat tipis & transparan
    color: "white", // Warna teks utama putih agar clean
    textShadow: "0 0 8px rgba(0,0,0,0.2)", // Shadow hitam sangat tipis biar gak "tebal"
  };

  return (
    <main className="relative w-full bg-black">
      <style jsx global>{`
        html, body { background-color: black; margin: 0; padding: 0; }
      `}</style>

      {/* CONTAINER CANVAS */}
      <div ref={containerRef} className="relative h-[600vh] w-full">
        <div className="fixed top-0 left-0 w-full h-screen z-0 overflow-hidden">
          <canvas ref={canvasRef} className="w-full h-full object-cover" />
          
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
            <motion.div style={{ opacity: text1Opacity }} className="absolute flex flex-col items-center w-full">
              <h1 className="text-[2.6rem] md:text-8xl font-black italic tracking-tighter leading-[0.85] uppercase" style={subtleTextStyle}>
                GURUBANTUGURU
              </h1>
              <p className="font-bold tracking-[0.4em] uppercase text-[9px] md:text-xs mt-4 text-white/80">
                Asisten AI Untuk Para Guru Indonesia
              </p>
            </motion.div>

            <motion.div style={{ opacity: text2Opacity }} className="absolute w-full px-6">
              <h2 className="text-3xl md:text-7xl font-black italic uppercase leading-none tracking-tighter" style={subtleTextStyle}>
                Merubah Kebiasaan <br/> Yang Lama
              </h2>
            </motion.div>

            <motion.div style={{ opacity: text3Opacity }} className="absolute w-full px-6">
              <h2 className="text-3xl md:text-7xl font-black italic uppercase leading-none tracking-tighter" style={subtleTextStyle}>
                Menjadi Lebih Modern <br/> Dan Efisien
              </h2>
            </motion.div>
          </div>
        </div>
      </div>

      {/* OUR STORY: Menutup Canvas di akhir scroll */}
      <section className="relative z-20 w-full bg-white">
        <div className="min-h-screen w-full flex flex-col items-center justify-center px-6 py-32 bg-gradient-to-b from-white via-white to-blue-50">
          <div className="max-w-4xl w-full text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-5xl md:text-7xl font-black italic tracking-tighter text-black uppercase mb-16"
            >
              Our Story
            </motion.h2>

            <div className="space-y-10 text-black px-4">
              <p className="text-xl md:text-3xl font-semibold leading-tight italic text-blue-900/80">
                "Berawal dari mimpi sederhana di tengah keterbatasan teknologi, kami melihat cahaya yang meredup di mata para pendidik bangsa."
              </p>
              
              <p className="text-lg md:text-xl leading-relaxed font-light">
                Kami menyaksikan lelahnya mata mereka di balik tumpukan kertas, raga yang terkuras hanya untuk administrasi yang seolah tak pernah usai. Kami berangkat untuk meruntuhkan sekat-sekat rumit itu dan menggantinya dengan <span className="font-bold underline decoration-blue-500">keajaiban teknologi yang memanusiakan.</span>
              </p>

              <div className="h-[2px] w-32 bg-gradient-to-r from-transparent via-blue-400 to-transparent mx-auto my-12" />

              <p className="text-lg md:text-xl leading-relaxed italic text-gray-700">
                Guru Bantu Guru hadir agar tak ada lagi guru yang merasa tertinggal. Karena saat beban guru terangkat, saat itulah masa depan bangsa benar-benar mulai <span className="font-bold text-blue-700">bertumbuh dan bersemi.</span>
              </p>
            </div>
          </div>
        </div>

        <footer className="py-12 text-center bg-blue-50">
          <p className="opacity-40 text-[10px] font-black uppercase tracking-[0.5em] text-blue-900">
            © 2026 GURU BANTU GURU
          </p>
        </footer>
      </section>
    </main>
  );
}
