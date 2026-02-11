"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  const totalFrames = 121; 

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, totalFrames - 1]);

  // Efek Gerakan Teks (Opacity & Y)
  const introOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const introY = useTransform(scrollYProgress, [0, 0.15], [0, -50]);

  const promo1Opacity = useTransform(scrollYProgress, [0.25, 0.35, 0.45, 0.55], [0, 1, 1, 0]);
  const promo1Y = useTransform(scrollYProgress, [0.25, 0.35, 0.55], [20, 0, -20]);

  const promo2Opacity = useTransform(scrollYProgress, [0.65, 0.75, 0.85, 0.95], [0, 1, 1, 0]);
  const promo2Y = useTransform(scrollYProgress, [0.65, 0.75, 0.95], [20, 0, -20]);

  // Style Bayangan Putih untuk Teks Hitam
  const textShadowStyle = {
    textShadow: "0px 0px 15px rgba(255, 255, 255, 0.9), 0px 0px 5px rgba(255, 255, 255, 0.7)"
  };

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
        let dW, dH, dX, dY;
        if (imgRatio > canvasRatio) {
          dH = canvas.height; dW = canvas.height * imgRatio;
          dX = (canvas.width - dW) / 2; dY = 0;
        } else {
          dW = canvas.width; dH = canvas.width / imgRatio;
          dX = 0; dY = (canvas.height - dH) / 2;
        }
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, dX, dY, dW, dH);
      }
    };
    const unsubscribe = frameIndex.on("change", (latest) => renderCanvas(latest));
    renderCanvas(0);
    return () => unsubscribe();
  }, [isLoaded, images, frameIndex]);

  return (
    <main className="relative bg-white font-[family-name:var(--font-outfit)]">
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-[100] px-6 py-8 flex justify-between items-center mix-blend-difference">
        <div className="text-2xl font-black text-black tracking-tighter uppercase italic" style={textShadowStyle}>GuruBantu</div>
        <button className="p-2"><div className="w-8 h-[2px] bg-black mb-1.5" /><div className="w-8 h-[2px] bg-black" /></button>
      </nav>

      {/* HERO SECTION */}
      <section ref={containerRef} className="relative h-[800vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />

          {/* 1. PEMBUKAAN (Besar & Hitam dengan Bayangan Putih) */}
          <motion.div style={{ opacity: introOpacity, y: introY, ...textShadowStyle }} className="relative z-10 text-center px-6">
            <span className="text-black font-bold tracking-[0.4em] uppercase text-xs mb-4 block">Inovasi Digital Guru</span>
            <h1 className="text-6xl md:text-9xl font-black text-black leading-none uppercase tracking-tighter italic">
              Guru Bantu Guru
            </h1>
            <p className="text-black text-xl md:text-2xl font-bold mt-6 tracking-wide">
              Asisten meringankan kerja guru.
            </p>
          </motion.div>

          {/* 2. PROMOSI 1 (Scroll 2x) */}
          <motion.div style={{ opacity: promo1Opacity, y: promo1Y, ...textShadowStyle }} className="absolute z-10 text-center px-6">
            <h2 className="text-4xl md:text-7xl font-black text-black tracking-tighter leading-tight uppercase italic">
              Buat Soal Tak Lagi <br /> Menyita Waktu.
            </h2>
            <p className="text-black mt-4 text-xl font-bold">AI merancang soal berkualitas dalam hitungan detik.</p>
          </motion.div>

          {/* 3. PROMOSI 2 (Scroll 4x) */}
          <motion.div style={{ opacity: promo2Opacity, y: promo2Y, ...textShadowStyle }} className="absolute z-10 text-center px-6">
            <h2 className="text-4xl md:text-7xl font-black text-black tracking-tighter leading-tight uppercase italic">
              Cerdas, Otomatis, <br /> & Terpersonalisasi.
            </h2>
            <p className="text-black mt-4 text-xl font-bold">Teknologi yang mengerti kurikulum Anda sepenuhnya.</p>
          </motion.div>
        </div>
      </section>

      {/* OUR STORY SECTION */}
      <div className="relative z-20 bg-white text-black">
        <section className="py-40 px-6 max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-bold tracking-[0.5em] uppercase text-xs block mb-6">Our Story</span>
            <h3 className="text-6xl md:text-8xl font-black tracking-tighter italic uppercase">Lahir dari <br /> Ruang Kelas.</h3>
          </div>
          <div className="space-y-8 text-xl leading-relaxed font-medium text-gray-800 text-center">
            <p>
              GuruBantu tidak lahir di meja perkantoran yang dingin, melainkan dari tumpukan kertas koreksi di meja guru yang larut malam masih terjaga. Kami melihat betapa banyak energi guru habis untuk administrasi, padahal jantung pendidikan adalah interaksi dengan siswa.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
