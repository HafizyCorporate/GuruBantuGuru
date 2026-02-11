"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  // TOTAL 194 GAMBAR
  const totalFrames = 194;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // MENGUBAH SCROLL JADI FRAME: 0% scroll = frame 0, 100% scroll = frame 193
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, totalFrames - 1]);

  // ANIMASI TEKS (Hitam dengan Glow Putih agar tajam)
  const introOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const introY = useTransform(scrollYProgress, [0, 0.1], [0, -40]);

  const promo1Opacity = useTransform(scrollYProgress, [0.2, 0.35, 0.5, 0.65], [0, 1, 1, 0]);
  const promo1Y = useTransform(scrollYProgress, [0.2, 0.35, 0.65], [30, 0, -30]);

  const promo2Opacity = useTransform(scrollYProgress, [0.75, 0.85, 0.95, 1], [0, 1, 1, 0]);
  const promo2Y = useTransform(scrollYProgress, [0.75, 0.85, 1], [30, 0, -30]);

  const glowStyle = {
    color: "black",
    textShadow: "0 0 25px rgba(255,255,255,1), 0 0 12px rgba(255,255,255,0.8), 0 0 6px rgba(255,255,255,0.5)",
  };

  // PRELOAD SEMUA GAMBAR (Penting agar tidak lag saat scroll)
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let count = 0;
    document.body.style.overflow = "hidden";

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      img.src = `/ezgif-frame-${i.toString().padStart(3, '0')}.jpg`;
      img.onload = () => {
        count++;
        setProgress(Math.floor((count / totalFrames) * 100));
        if (count === totalFrames) {
          setTimeout(() => {
            setImages(loadedImages);
            setIsLoaded(true);
            document.body.style.overflow = "auto";
          }, 500);
        }
      };
      loadedImages[i - 1] = img;
    }
  }, []);

  // LOGIKA MENGGAMBAR KE CANVAS (Full Screen Cover)
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
      
      {/* LOADING SCREEN (Lock Scroll) */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div exit={{ opacity: 0 }} className="fixed inset-0 z-[999] bg-white flex flex-col items-center justify-center text-blue-600">
            <h2 className="text-4xl font-black italic tracking-tighter mb-4">GURUBANTU</h2>
            <div className="w-64 h-[2px] bg-gray-100 rounded-full overflow-hidden">
              <motion.div className="h-full bg-blue-600" animate={{ width: `${progress}%` }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={isLoaded ? "block" : "hidden"}>
        {/* CONTAINER UTAMA (Scroll Panjang) */}
        <section ref={containerRef} className="relative h-[1200vh]">
          {/* STICKY CANVAS: Gambar diam di tempat, Frame berubah sesuai jempol user */}
          <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-white">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />
            
            {/* Teks bergantian di atas gambar */}
            <motion.div style={{ opacity: introOpacity, y: introY, ...glowStyle }} className="relative z-10 text-center px-6">
              <h1 className="text-6xl md:text-[110px] font-black uppercase tracking-tighter italic leading-none">Guru Bantu <br /> Guru</h1>
              <p className="text-xl md:text-2xl font-bold mt-6 italic">Asisten meringankan kerja guru.</p>
            </motion.div>

            <motion.div style={{ opacity: promo1Opacity, y: promo1Y, ...glowStyle }} className="absolute z-10 text-center px-6">
              <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none text-center">Buat Soal <br /> Otomatis</h2>
              <p className="mt-6 text-xl md:text-2xl font-bold italic uppercase tracking-tighter">Efisiensi Maksimal dengan AI.</p>
            </motion.div>

            <motion.div style={{ opacity: promo2Opacity, y: promo2Y, ...glowStyle }} className="absolute z-10 text-center px-6">
              <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none text-center">Cerdas & <br /> Personal</h2>
              <p className="mt-6 text-xl md:text-2xl font-bold italic uppercase tracking-tighter">Solusi Masa Depan Pendidikan.</p>
            </motion.div>
          </div>
        </section>

        {/* SECTION AKHIR (Muncul menyapu ke atas) */}
        <section className="relative z-20 bg-white py-40 px-6 shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-blue-600 font-bold tracking-[0.5em] uppercase text-xs block mb-6">Our Story</span>
            <h3 className="text-5xl md:text-7xl font-black tracking-tighter italic uppercase mb-12 text-black">Lahir Dari <br /> Ruang Kelas</h3>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-medium">
              GuruBantu lahir dari tumpukan kertas koreksi di meja guru yang larut malam masih terjaga. Kami hadir membawa teknologi AI untuk memerdekakan waktu mengajar Anda.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
