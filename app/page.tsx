"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  const totalFrames = 194;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, totalFrames - 1]);

  // Efek Teks di atas Gambar
  const introOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const introY = useTransform(scrollYProgress, [0, 0.12], [0, -80]);
  const promo1Opacity = useTransform(scrollYProgress, [0.25, 0.35, 0.50, 0.60], [0, 1, 1, 0]);
  const promo1Y = useTransform(scrollYProgress, [0.3, 0.4, 0.60], [40, 0, -40]);
  const promo2Opacity = useTransform(scrollYProgress, [0.70, 0.80, 0.90, 0.98], [0, 1, 1, 0]);
  const promo2Y = useTransform(scrollYProgress, [0.75, 0.85, 0.98], [40, 0, -40]);

  const glowStyle = {
    color: "black",
    textShadow: "0 0 25px rgba(255,255,255,1), 0 0 10px rgba(255,255,255,0.8), 0 0 5px rgba(255,255,255,0.6)",
  };

  // LOGIKA PRELOADER (Pencegah Lag)
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let count = 0;

    // Kunci scroll saat loading
    document.body.style.overflow = "hidden";

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      img.src = `/ezgif-frame-${i.toString().padStart(3, '0')}.jpg`;
      img.onload = () => {
        count++;
        const currentProgress = Math.floor((count / totalFrames) * 100);
        setProgress(currentProgress);

        if (count === totalFrames) {
          setTimeout(() => {
            setImages(loadedImages);
            setIsLoaded(true);
            // Buka kunci scroll setelah selesai
            document.body.style.overflow = "auto";
          }, 500); // Delay sedikit agar transisi mulus
        }
      };
      loadedImages[i - 1] = img;
    }
  }, []);

  // Render Canvas
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
      
      {/* 1. HALAMAN LOADING FULL SCREEN (Eksklusif) */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[999] bg-white flex flex-col items-center justify-center"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <h2 className="text-4xl font-black italic text-blue-600 tracking-tighter mb-2">GURUBANTU</h2>
              <p className="text-[10px] tracking-[0.5em] text-gray-400 font-bold uppercase mb-8">Mempersiapkan Pengalaman Terbaik</p>
              
              {/* Progress Bar */}
              <div className="relative w-64 h-[4px] bg-gray-100 rounded-full overflow-hidden mx-auto">
                <motion.div 
                  className="absolute top-0 left-0 h-full bg-blue-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-4 text-2xl font-black text-blue-600 font-mono">{progress}%</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. HALAMAN UTAMA (Hanya muncul/interaktif setelah Loading Selesai) */}
      <div className={isLoaded ? "opacity-100 transition-opacity duration-1000" : "opacity-0"}>
        <nav className="fixed top-0 w-full z-[100] px-6 py-8 flex justify-between items-center mix-blend-difference">
          <div className="text-2xl font-black text-white tracking-tighter uppercase italic">GuruBantu</div>
          <div className="flex flex-col gap-1.5 p-2">
            <div className="w-8 h-[2px] bg-white" />
            <div className="w-5 h-[2px] bg-white self-end" />
          </div>
        </nav>

        <section ref={containerRef} className="relative h-[1000vh]">
          <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />
            
            <motion.div style={{ opacity: introOpacity, y: introY, ...glowStyle }} className="relative z-10 text-center px-6">
              <span className="font-bold tracking-[0.5em] uppercase text-xs mb-4 block">Inovasi Digital Guru</span>
              <h1 className="text-6xl md:text-[120px] font-black leading-[0.9] uppercase tracking-tighter italic">Guru Bantu <br /> Guru</h1>
              <p className="text-xl md:text-3xl font-bold mt-8 italic uppercase">Asisten meringankan kerja guru.</p>
            </motion.div>

            <motion.div style={{ opacity: promo1Opacity, y: promo1Y, ...glowStyle }} className="absolute z-10 text-center px-6 w-full max-w-4xl">
              <h2 className="text-5xl md:text-8xl font-black leading-tight uppercase tracking-tighter italic">Buat Soal <br /> Otomatis Pakai AI</h2>
              <p className="mt-6 text-xl md:text-2xl font-bold uppercase italic">Evaluasi instan, hasil berkualitas.</p>
            </motion.div>

            <motion.div style={{ opacity: promo2Opacity, y: promo2Y, ...glowStyle }} className="absolute z-10 text-center px-6 w-full max-w-4xl">
              <h2 className="text-5xl md:text-8xl font-black leading-tight uppercase tracking-tighter italic">Cerdas & <br /> Terpersonalisasi</h2>
              <p className="mt-6 text-xl md:text-2xl font-bold uppercase italic">Teknologi yang memahami kurikulum Anda.</p>
            </motion.div>
          </div>
        </section>

        <div className="relative z-20 bg-white">
          <section className="py-40 px-6 max-w-3xl mx-auto text-center">
            <span className="text-blue-600 font-bold tracking-[0.5em] uppercase text-xs block mb-6">Our Story</span>
            <h3 className="text-5xl md:text-7xl font-black text-black tracking-tighter italic uppercase mb-12">Lahir Dari <br /> Ruang Kelas</h3>
            <div className="space-y-8 text-lg md:text-xl text-gray-700 leading-relaxed font-medium">
              <p>GuruBantu lahir dari tumpukan kertas koreksi di meja guru yang larut malam masih terjaga.</p>
              <p>Kami hadir membawa teknologi AI untuk memerdekakan waktu mengajar Anda, sehingga guru bisa fokus kembali pada apa yang paling penting: siswa.</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
