"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const totalFrames = 194;
  
  const { scrollYProgress } = useScroll({ 
    target: containerRef, 
    offset: ["start start", "end end"] 
  });

  // 1. Canvas menghabiskan hampir seluruh scroll (0 sampai 0.98)
  // Ini memastikan gedung jadi modern SEBELUM konten naik.
  const frameIndex = useTransform(scrollYProgress, [0, 0.98], [0, totalFrames - 1], { clamp: true });

  // 2. Teks diatur agar sudah bersih saat gedung modern selesai
  const text1Opacity = useTransform(scrollYProgress, [0, 0.1, 0.2], [1, 1, 0]);
  const text2Opacity = useTransform(scrollYProgress, [0.3, 0.4, 0.5, 0.6], [0, 1, 1, 0]);
  const text3Opacity = useTransform(scrollYProgress, [0.7, 0.85, 0.95], [0, 1, 0]);
  
  // 3. KUNCI JAWABAN: Konten naik HANYA di 1% terakhir (0.99 ke 1.0)
  // Jadi canvas 'habis' dulu di 0.98, lalu pas dikit lagi mentok (0.99), konten langsung naik.
  const contentY = useTransform(scrollYProgress, [0.99, 1], ["100vh", "0vh"]);

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
    const context = canvasRef.current.getContext("2d", { alpha: false });
    let lastFrame = -1;

    const render = (val: number) => {
      const currentIndex = Math.floor(val);
      if (currentIndex === lastFrame) return;
      
      const img = images[currentIndex];
      if (img && context) {
        const canvas = canvasRef.current!;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        const x = (canvas.width / 2) - (img.width / 2) * scale;
        const y = (canvas.height / 2) - (img.height / 2) * scale;
        context.drawImage(img, x, y, img.width * scale, img.height * scale);
        lastFrame = currentIndex;
      }
    };

    const unsubscribe = frameIndex.on("change", (latest) => {
      requestAnimationFrame(() => render(latest));
    });

    return () => unsubscribe();
  }, [isLoaded, images, frameIndex]);

  return (
    <main className="bg-white text-[#001a41]">
      <AnimatePresence>
        {!isLoaded && (
          <motion.div exit={{ opacity: 0 }} className="fixed inset-0 z-[999] bg-white flex flex-col items-center justify-center">
            <h2 className="text-2xl font-black italic text-blue-600">GURU BANTU GURU</h2>
            <p className="mt-2 text-xs font-bold text-gray-400">LOADING {progress}%</p>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="fixed top-0 w-full z-[100] px-6 py-6 flex justify-between items-center mix-blend-difference">
        <div className="text-xl font-black text-white italic tracking-tighter uppercase">GURU BANTU GURU</div>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          className="text-white font-bold uppercase text-[10px] tracking-[0.2em] bg-blue-600 px-5 py-2.5 rounded-full hover:scale-105 transition-transform"
        >
          {isMenuOpen ? "Close" : "Menu"}
        </button>
      </nav>

      {/* Gunakan 1000vh agar kontrol scroll presisi */}
      <section ref={containerRef} className="relative h-[1000vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <canvas ref={canvasRef} className="w-full h-full object-cover" />
          
          <div className="absolute inset-0 flex items-center justify-center text-center px-6 pointer-events-none">
            <motion.div style={{ opacity: text1Opacity }} className="absolute">
              <h2 className="text-4xl md:text-6xl font-black italic text-white tracking-tighter leading-none">GURUBANTUGURU</h2>
              <p className="text-blue-400 font-bold tracking-[0.3em] uppercase text-[10px] md:text-xs mt-4">Asisten AI Untuk Para Guru Indonesia</p>
            </motion.div>

            <motion.div style={{ opacity: text2Opacity }} className="absolute">
              <h2 className="text-3xl md:text-5xl font-black italic text-white uppercase">Merubah Kebiasaan <br/> Yang Lama</h2>
            </motion.div>

            <motion.div style={{ opacity: text3Opacity }} className="absolute">
              <h2 className="text-3xl md:text-5xl font-black italic text-white uppercase">Menjadi Lebih Modern <br/> Dan Efisien</h2>
            </motion.div>
          </div>
          <div className="absolute inset-0 bg-black/10 pointer-events-none" />
        </div>

        <motion.div style={{ y: contentY }} className="relative z-20 bg-white shadow-[0_-30px_60px_rgba(0,0,0,0.2)] rounded-t-[50px] md:rounded-t-[100px]">
          <section id="ourstory" className="py-40 px-6 bg-white border-t border-gray-100 rounded-t-[50px] md:rounded-t-[100px]">
            <div className="max-w-4xl mx-auto text-center">
              <span className="text-blue-600 font-bold tracking-[0.3em] uppercase text-xs mb-4 block">The Mission</span>
              <h3 className="text-6xl md:text-8xl font-black italic uppercase mb-10 tracking-tighter">OUR STORY</h3>
              <p className="text-xl md:text-3xl text-gray-500 font-medium italic leading-relaxed">
                Berawal dari sekolah yang <span className="text-blue-600 font-bold">gaptek</span>. 
                Kami hadir untuk memerdekakan waktu guru yang tercuri oleh administrasi purba melalui AI.
              </p>
            </div>
          </section>
          {/* Sisa konten sama... */}
        </motion.div>
      </section>
    </main>
  );
}
