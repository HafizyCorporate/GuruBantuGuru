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

  // ANIMASI TEKS (Opacity & Gerakan ke Atas)
  const introOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const introY = useTransform(scrollYProgress, [0, 0.15], [0, -100]);

  const promo1Opacity = useTransform(scrollYProgress, [0.25, 0.35, 0.45, 0.55], [0, 1, 1, 0]);
  const promo1Y = useTransform(scrollYProgress, [0.3, 0.4], [50, 0]);

  const promo2Opacity = useTransform(scrollYProgress, [0.65, 0.75, 0.85, 0.95], [0, 1, 1, 0]);
  const promo2Y = useTransform(scrollYProgress, [0.7, 0.8], [50, 0]);

  // STYLE KHUSUS TEKS DI ATAS GAMBAR (Hitam Glow Putih)
  const glowStyle = {
    color: "black",
    textShadow: "0 0 20px rgba(255,255,255,1), 0 0 10px rgba(255,255,255,0.8), 0 0 5px rgba(255,255,255,0.5)",
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
    <main className="relative bg-white font-[family-name:var(--font-outfit)] overflow-x-hidden">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-[100] px-6 py-8 flex justify-between items-center mix-blend-difference">
        <div className="text-2xl font-black text-white tracking-tighter uppercase italic">GuruBantu</div>
        <div className="flex flex-col gap-1.5 p-2"><div className="w-8 h-[2px] bg-white" /><div className="w-5 h-[2px] bg-white self-end" /></div>
      </nav>

      {/* HERO SECTION (GAMBAR + TEKS GLOW) */}
      <section ref={containerRef} className="relative h-[800vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
          
          {/* Teks 1: Pembuka */}
          <motion.div style={{ opacity: introOpacity, y: introY, ...glowStyle }} className="relative z-10 text-center px-6">
            <span className="font-bold tracking-[0.5em] uppercase text-xs mb-4 block">Inovasi Digital Guru</span>
            <h1 className="text-6xl md:text-[120px] font-black leading-[0.9] uppercase tracking-tighter italic">
              Guru Bantu <br /> Guru
            </h1>
            <p className="text-xl md:text-3xl font-bold mt-8 italic">Asisten meringankan kerja guru.</p>
          </motion.div>

          {/* Teks 2: Promo AI (Scroll 2x) */}
          <motion.div style={{ opacity: promo1Opacity, y: promo1Y, ...glowStyle }} className="absolute z-10 text-center px-6 w-full max-w-4xl">
            <h2 className="text-5xl md:text-8xl font-black leading-tight uppercase tracking-tighter italic">
              Buat Soal <br /> Otomatis Pakai AI
            </h2>
            <p className="mt-6 text-xl md:text-2xl font-bold">Rancang evaluasi berkualitas dalam hitungan detik.</p>
          </motion.div>

          {/* Teks 3: Promo Kurikulum (Scroll 4x) */}
          <motion.div style={{ opacity: promo2Opacity, y: promo2Y, ...glowStyle }} className="absolute z-10 text-center px-6 w-full max-w-4xl">
            <h2 className="text-5xl md:text-8xl font-black leading-tight uppercase tracking-tighter italic">
              Cerdas & <br /> Terpersonalisasi
            </h2>
            <p className="mt-6 text-xl md:text-2xl font-bold">Teknologi yang mengerti gaya mengajar Anda.</p>
          </motion.div>
        </div>
      </section>

      {/* OUR STORY (BERSIH - TANPA GLOW) */}
      <div className="relative z-20 bg-white">
        <section className="py-40 px-6 max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="text-blue-600 font-bold tracking-[0.5em] uppercase text-xs block mb-6">Our Story</span>
            <h3 className="text-5xl md:text-7xl font-black text-black tracking-tighter italic uppercase mb-12">Lahir Dari <br /> Ruang Kelas</h3>
            <div className="space-y-8 text-lg md:text-xl text-gray-700 leading-relaxed font-medium">
              <p>GuruBantu tidak lahir di meja perkantoran yang dingin, melainkan dari tumpukan kertas koreksi di meja guru yang larut malam masih terjaga.</p>
              <p>Kami melihat energi guru habis untuk administrasi, padahal jantung pendidikan adalah interaksi dengan siswa. Kami hadir menjadi "tangan kanan" yang setia bagi setiap guru Indonesia.</p>
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
}
