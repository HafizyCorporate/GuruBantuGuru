"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  const totalFrames = 121; // Sesuai jumlah foto baru Anda

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Logika Scroll Gambar (0% - 100%)
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, totalFrames - 1]);

  // LOGIKA TEKS BERTAHAP (Tanpa Zoom)
  // 1. Teks Pembuka (Muncul di awal, hilang saat scroll mulai jalan)
  const introOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const introY = useTransform(scrollYProgress, [0, 0.15], [0, -50]);

  // 2. Teks Promosi 1 (Muncul setelah scroll sedikit)
  const promo1Opacity = useTransform(scrollYProgress, [0.25, 0.35, 0.45, 0.55], [0, 1, 1, 0]);
  const promo1Y = useTransform(scrollYProgress, [0.25, 0.35, 0.55], [20, 0, -20]);

  // 3. Teks Promosi 2 (Muncul di pertengahan scroll)
  const promo2Opacity = useTransform(scrollYProgress, [0.65, 0.75, 0.85, 0.95], [0, 1, 1, 0]);
  const promo2Y = useTransform(scrollYProgress, [0.65, 0.75, 0.95], [20, 0, -20]);

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

  // Render Canvas Full Screen
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
      {/* LOADING SCREEN */}
      {!isLoaded && (
        <div className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center text-blue-600">
          <div className="text-3xl font-black italic mb-6 tracking-tighter uppercase">GuruBantu</div>
          <div className="w-64 h-[2px] bg-blue-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-[100] px-6 py-8 flex justify-between items-center">
        <div className="text-2xl font-black text-blue-500 tracking-tighter uppercase italic">GuruBantu</div>
        <button className="flex flex-col gap-1.5 p-2"><div className="w-8 h-[2px] bg-blue-500" /><div className="w-8 h-[2px] bg-blue-500" /></button>
      </nav>

      {/* HERO SECTION */}
      <section ref={containerRef} className="relative h-[800vh] bg-white">
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-white/20" />

          {/* 1. PEMBUKAAN (ELEGAN & SIMPEL) */}
          <motion.div style={{ opacity: introOpacity, y: introY }} className="relative z-10 text-center px-6">
            <span className="text-blue-500 font-bold tracking-[0.4em] uppercase text-[10px] mb-4 block">Inovasi Digital Guru</span>
            <h1 className="text-5xl md:text-8xl font-black text-blue-900 leading-none uppercase tracking-tighter italic">
              Guru Bantu Guru
            </h1>
            <p className="text-blue-700 text-lg md:text-xl font-medium mt-4 tracking-wide">
              Asisten meringankan kerja guru.
            </p>
          </motion.div>

          {/* 2. PROMOSI 1 (Scroll 2x) */}
          <motion.div style={{ opacity: promo1Opacity, y: promo1Y }} className="absolute z-10 text-center px-6">
            <h2 className="text-3xl md:text-6xl font-bold text-blue-900 tracking-tighter leading-tight">
              Buat Soal Tak Lagi <br /> Menyita Waktu.
            </h2>
            <p className="text-blue-600 mt-4 text-lg">AI kami merancang soal berkualitas secara otomatis dalam hitungan detik.</p>
          </motion.div>

          {/* 3. PROMOSI 2 (Scroll 4x) */}
          <motion.div style={{ opacity: promo2Opacity, y: promo2Y }} className="absolute z-10 text-center px-6">
            <h2 className="text-3xl md:text-6xl font-bold text-blue-900 tracking-tighter leading-tight">
              Cerdas, Otomatis, <br /> dan Terpersonalisasi.
            </h2>
            <p className="text-blue-600 mt-4 text-lg">Teknologi yang mengerti kurikulum Anda, memudahkan setiap langkah evaluasi.</p>
          </motion.div>
        </div>
      </section>

      {/* OUR STORY SECTION */}
      <div className="relative z-20 bg-white text-blue-900">
        <section className="py-40 px-6 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="text-center mb-16">
            <span className="text-blue-500 font-bold tracking-[0.5em] uppercase text-xs block mb-6">Our Story</span>
            <h3 className="text-5xl md:text-7xl font-black tracking-tighter italic uppercase mb-10">Lahir dari <br /> Ruang Kelas.</h3>
          </motion.div>
          
          <div className="space-y-8 text-lg md:text-xl leading-relaxed font-light text-blue-800 text-center">
            <p>
              GuruBantu tidak lahir di meja perkantoran yang dingin, melainkan dari tumpukan kertas koreksi di meja guru yang larut malam masih terjaga. Kami melihat betapa banyak energi guru habis untuk administrasi, padahal jantung pendidikan adalah interaksi dengan siswa.
            </p>
            <p>
              Didorong oleh semangat solidaritas, kami menciptakan ekosistem di mana teknologi bukan untuk menggantikan peran guru, melainkan menjadi "tangan kanan" yang setia. Dari guru, oleh guru, untuk masa depan pendidikan Indonesia yang lebih cerdas.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
