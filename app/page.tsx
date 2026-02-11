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
  
  // Ambil progress scroll murni agar ringan
  const { scrollYProgress } = useScroll({ 
    target: containerRef, 
    offset: ["start start", "end end"] 
  });

  // Mapping langsung ke index frame
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, totalFrames - 1]);

  // Preload Gambar (Tetap perlu agar tidak flicker)
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

  // Render Logic Super Ringan
  useEffect(() => {
    if (!isLoaded || !canvasRef.current) return;
    const context = canvasRef.current.getContext("2d", { alpha: false }); // Optimasi performa: alpha false
    let lastFrame = -1;

    const render = (val: number) => {
      const currentIndex = Math.floor(val);
      if (currentIndex === lastFrame) return; // Jangan gambar ulang jika frame sama
      
      const img = images[currentIndex];
      if (img && context) {
        const canvas = canvasRef.current!;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Simple cover-fit logic
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
            <h2 className="text-2xl font-black italic text-blue-600">LOADING {progress}%</h2>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menu Hamburger Ringan */}
      <nav className="fixed top-0 w-full z-[100] px-6 py-6 flex justify-between items-center mix-blend-difference">
        <div className="text-xl font-black text-white italic">GURU BANTU GURU</div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white font-bold uppercase text-xs tracking-widest bg-blue-600 px-4 py-2 rounded-full">
          {isMenuOpen ? "Close" : "Menu"}
        </button>
      </nav>

      {isMenuOpen && (
        <div className="fixed inset-0 z-[90] bg-blue-600 flex flex-col items-center justify-center gap-6 text-white text-4xl font-black italic uppercase">
          <a href="#ourstory" onClick={() => setIsMenuOpen(false)}>Our Story</a>
          <a href="#produk" onClick={() => setIsMenuOpen(false)}>Produk</a>
          <a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</a>
        </div>
      )}

      {/* Section Scroll Canvas */}
      <section ref={containerRef} className="relative h-[600vh]"> {/* Pendekkan h agar scroll tidak terlalu berat */}
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <canvas ref={canvasRef} className="w-full h-full object-cover" />
        </div>
      </section>

      {/* Section Our Story Ringan */}
      <section id="ourstory" className="py-32 px-6 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-5xl md:text-8xl font-black italic uppercase mb-10 tracking-tighter">OUR STORY</h3>
          <p className="text-xl md:text-2xl text-gray-500 font-medium italic leading-relaxed">
            Berawal dari sekolah yang <span className="text-blue-600 font-bold">gaptek</span>. 
            Kami hadir untuk memerdekakan waktu guru yang tercuri oleh administrasi purba melalui AI.
          </p>
        </div>
      </section>

      {/* Visi Misi Ringan */}
      <section className="bg-blue-600 py-24 px-6 text-white text-center">
        <div className="max-w-4xl mx-auto space-y-10">
          <div>
            <h4 className="uppercase font-bold tracking-widest opacity-70 mb-2">Visi</h4>
            <p className="text-3xl font-black italic uppercase">Hemat waktu guru hingga 80%.</p>
          </div>
          <div>
            <h4 className="uppercase font-bold tracking-widest opacity-70 mb-2">Misi</h4>
            <p className="text-xl font-bold italic text-blue-100">Hapus pusing bikin soal dan koreksi jawaban secara otomatis.</p>
          </div>
        </div>
      </section>

      {/* Produk Section */}
      <section id="produk" className="py-32 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-gray-50 p-10 rounded-[40px] border border-gray-100 shadow-sm">
            <h4 className="text-3xl font-black italic mb-4 text-blue-600">SOAL AI</h4>
            <p className="text-gray-500 mb-6 font-medium italic">Bikin soal ujian instan tanpa pusing.</p>
            <button className="bg-black text-white px-6 py-3 rounded-full font-bold text-sm">DOWNLOAD PLAYSTORE</button>
          </div>
          <div className="bg-gray-50 p-10 rounded-[40px] border border-gray-100 shadow-sm">
            <h4 className="text-3xl font-black italic mb-4 text-blue-600">JAWABAN AI</h4>
            <p className="text-gray-500 mb-6 font-medium italic">Koreksi otomatis cuma pakai kamera HP.</p>
            <button className="bg-black text-white px-6 py-3 rounded-full font-bold text-sm">DOWNLOAD PLAYSTORE</button>
          </div>
        </div>
      </section>

      {/* Review Section */}
      <section className="bg-[#001a41] py-32 px-6 text-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          <div className="p-8 bg-blue-900/30 rounded-3xl border border-blue-800">
            <p className="italic font-bold mb-4 text-lg">"Hidup saya berubah, gak perlu lembur koreksi lagi!"</p>
            <p className="text-blue-400 font-black uppercase text-xs">Ibu Rahma - Guru SMP</p>
          </div>
          <div className="p-8 bg-blue-900/30 rounded-3xl border border-blue-800">
            <p className="italic font-bold mb-4 text-lg">"Fitur Soal AI-nya gila sih, akurat banget!"</p>
            <p className="text-blue-400 font-black uppercase text-xs">Pak Junaidi - Guru SD</p>
          </div>
          <div className="p-8 bg-blue-900/30 rounded-3xl border border-blue-800">
            <p className="italic font-bold mb-4 text-lg">"UI-nya ramah banget buat guru yang gaptek."</p>
            <p className="text-blue-400 font-black uppercase text-xs">Ibu Siska - Guru SMA</p>
          </div>
        </div>
      </section>

      {/* Footer Contact */}
      <footer id="contact" className="py-24 px-6 text-center border-t border-gray-100">
        <h3 className="text-4xl font-black italic mb-10">HUBUNGI KAMI</h3>
        <p className="font-bold text-blue-600 mb-2 uppercase tracking-widest text-sm">Email: support@gurubantu.ai</p>
        <p className="font-bold text-blue-600 uppercase tracking-widest text-sm mb-12">WA: +62 812 3344 5566</p>
        <div className="max-w-md mx-auto p-8 bg-gray-50 rounded-3xl">
          <h4 className="font-black italic mb-4 uppercase">Bantuan Cepat AI</h4>
          <button className="bg-blue-600 text-white w-full py-4 rounded-2xl font-black italic">MULAI CHAT AI</button>
        </div>
        <p className="mt-20 opacity-30 text-[10px] font-black uppercase tracking-[0.4em]">© 2026 GURU BANTU GURU</p>
      </footer>
    </main>
  );
}
