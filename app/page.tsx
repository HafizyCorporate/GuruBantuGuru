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

  const goldBoxStyle = "bg-[#D4AF37]/25 backdrop-blur-[1px] px-6 py-2 inline-block border border-[#D4AF37]/40 shadow-xl";
  const canvasTitleStyle = "text-black font-black italic uppercase leading-none tracking-tighter";

  return (
    <main className="relative w-full bg-black">
      <style jsx global>{`
        html, body { background-color: black; margin: 0; padding: 0; }
      `}</style>

      {/* CANVAS SECTION */}
      <div ref={containerRef} className="relative h-[600vh] w-full">
        <div className="fixed top-0 left-0 w-full h-screen z-0 overflow-hidden">
          <canvas ref={canvasRef} className="w-full h-full object-cover" />
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
            <motion.div style={{ opacity: text1Opacity }} className="absolute flex flex-col items-center w-full">
              <div className={goldBoxStyle}><h1 className={`${canvasTitleStyle} text-[2.6rem] md:text-8xl`}>GURUBANTUGURU</h1></div>
              <div className="mt-4 bg-black px-4 py-1"><p className="font-bold tracking-[0.3em] uppercase text-[9px] md:text-xs text-[#D4AF37]">Asisten AI Untuk Para Guru Indonesia</p></div>
            </motion.div>
            <motion.div style={{ opacity: text2Opacity }} className="absolute w-full px-6 flex flex-col items-center gap-3">
              <div className={goldBoxStyle}><h2 className={`${canvasTitleStyle} text-3xl md:text-7xl`}>Merubah Kebiasaan</h2></div>
              <div className={goldBoxStyle}><h2 className={`${canvasTitleStyle} text-3xl md:text-7xl`}>Yang Lama</h2></div>
            </motion.div>
            <motion.div style={{ opacity: text3Opacity }} className="absolute w-full px-6 flex flex-col items-center gap-3">
              <div className={goldBoxStyle}><h2 className={`${canvasTitleStyle} text-3xl md:text-7xl`}>Menjadi Lebih Modern</h2></div>
              <div className={goldBoxStyle}><h2 className={`${canvasTitleStyle} text-3xl md:text-7xl`}>Dan Efisien</h2></div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* WHITE SECTIONS WRAPPER */}
      <div className="relative z-20 w-full bg-white">
        
        {/* OUR STORY SECTION */}
        <section className="min-h-screen w-full flex flex-col items-center justify-center px-6 py-32 bg-gradient-to-b from-white to-blue-50/30">
          <div className="max-w-4xl w-full text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-5xl md:text-7xl font-black italic tracking-tighter text-black uppercase mb-16"
            >
              Our Story
            </motion.h2>
            <div className="space-y-10 text-black px-4 text-lg md:text-xl leading-relaxed font-light">
              <p className="text-xl md:text-3xl font-semibold italic text-blue-900/80">"Berawal dari mimpi sederhana di tengah keterbatasan teknologi..."</p>
              <p>Kami menyaksikan lelahnya mata para guru di balik tumpukan kertas. Kami berangkat untuk meruntuhkan sekat rumit itu dan menggantinya dengan keajaiban teknologi yang memanusiakan.</p>
            </div>
          </div>
        </section>

        {/* VISI & MISI SECTION (2 KOLOM) */}
        <section className="w-full px-6 py-32 bg-gradient-to-b from-blue-50/30 to-white">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
            
            {/* KOLOM VISI */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="p-8 md:p-12 border-l-4 border-blue-400 bg-blue-50/20 shadow-sm"
            >
              <h3 className="text-4xl md:text-5xl font-black italic tracking-tighter text-black uppercase mb-8">Visi</h3>
              <p className="text-lg md:text-xl leading-relaxed text-gray-800 font-light">
                Menjadi episentrum transformasi digital pendidikan di Indonesia yang tidak hanya mengandalkan kecerdasan buatan, namun mengedepankan empati teknologi. Kami bervisi menciptakan ekosistem di mana setiap guru, dari pelosok hingga kota besar, memiliki asisten pintar yang memungkinkan mereka kembali pada tugas mulia paling mendasar: membentuk karakter dan masa depan manusia tanpa terbelenggu rantai administrasi yang usang.
              </p>
            </motion.div>

            {/* KOLOM MISI */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              className="p-8 md:p-12 border-l-4 border-blue-400 bg-blue-50/20 shadow-sm"
            >
              <h3 className="text-4xl md:text-5xl font-black italic tracking-tighter text-black uppercase mb-8">Misi</h3>
              <p className="text-lg md:text-xl leading-relaxed text-gray-800 font-light">
                Membangun teknologi yang inklusif dan mudah diakses untuk menyederhanakan proses belajar mengajar harian secara revolusioner. Kami berkomitmen untuk mendemokrasikan akses AI bagi pendidik, menyediakan alat kolaborasi yang memangkas waktu kerja efektif, serta terus berinovasi dalam menyajikan konten pendidikan yang adaptif. Misi kami adalah memastikan tidak ada satu pun pahlawan tanpa tanda jasa yang berjalan sendirian di era disrupsi ini.
              </p>
            </motion.div>

          </div>
        </section>

        <footer className="py-12 text-center bg-white border-t border-blue-50">
          <p className="opacity-40 text-[10px] font-black uppercase tracking-[0.5em] text-blue-900">© 2026 GURU BANTU GURU</p>
        </footer>
      </div>
    </main>
  );
}
