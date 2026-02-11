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

  // Gambar berubah hanya di 50% scroll pertama, sisa 50% konten meluncur di atasnya
  const frameIndex = useTransform(scrollYProgress, [0, 0.5], [0, totalFrames - 1]);
  // Opacity untuk meredupkan gambar saat konten masuk
  const canvasOpacity = useTransform(scrollYProgress, [0.4, 0.6], [1, 0.2]);

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
      const currentIndex = Math.min(Math.floor(val), totalFrames - 1);
      if (currentIndex === lastFrame || currentIndex < 0) return;
      
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
    <main className="bg-[#000a1a] text-white">
      <AnimatePresence>
        {!isLoaded && (
          <motion.div exit={{ opacity: 0 }} className="fixed inset-0 z-[999] bg-black flex flex-col items-center justify-center">
            <h2 className="text-3xl font-black italic text-blue-500 tracking-tighter">GURU BANTU GURU</h2>
            <p className="mt-2 text-xs font-bold opacity-50 uppercase tracking-widest">Memuat AI {progress}%</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav Hamburger */}
      <nav className="fixed top-0 w-full z-[100] px-8 py-8 flex justify-between items-center mix-blend-difference">
        <div className="text-2xl font-black italic tracking-tighter">GURU BANTU GURU</div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex flex-col gap-1.5 items-end group">
          <div className="w-8 h-1 bg-white rounded-full transition-all group-hover:w-10"></div>
          <div className="w-5 h-1 bg-white rounded-full transition-all group-hover:w-10"></div>
        </button>
      </nav>

      {/* Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween' }} className="fixed inset-0 z-[150] bg-blue-600 flex flex-col p-12 justify-center gap-8">
             <button onClick={() => setIsMenuOpen(false)} className="absolute top-10 right-10 text-xl font-bold uppercase italic border-2 border-white px-6 py-2 rounded-full">Tutup</button>
             {["Our Story", "Visi & Misi", "Produk", "Contact"].map((m, i) => (
               <a key={i} href={`#${m.toLowerCase().replace(" ", "")}`} onClick={() => setIsMenuOpen(false)} className="text-6xl font-black italic uppercase hover:text-black transition-colors">{m}</a>
             ))}
          </motion.div>
        )}
      </AnimatePresence>

      <section ref={containerRef} className="relative h-[800vh]">
        {/* Sticky Canvas Container */}
        <motion.div style={{ opacity: canvasOpacity }} className="sticky top-0 h-screen w-full overflow-hidden">
          <canvas ref={canvasRef} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#000a1a]"></div>
        </motion.div>

        {/* Konten Meluncur di Atas Canvas */}
        <div className="relative z-10 -mt-[100vh]">
          
          {/* Section: Cerita Kami */}
          <section id="ourstory" className="min-h-screen flex items-center justify-center px-6 py-40">
            <motion.div initial={{ opacity: 0, y: 100 }} whileInView={{ opacity: 1, y: 0 }} className="max-w-4xl backdrop-blur-md bg-white/5 p-12 rounded-[50px] border border-white/10 text-center">
              <span className="text-blue-500 font-bold tracking-[0.3em] uppercase text-xs mb-4 block underline underline-offset-8">The Legacy</span>
              <h2 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter mb-10 leading-none">CERITA <br /> KAMI.</h2>
              <p className="text-xl md:text-2xl text-gray-300 font-medium italic leading-relaxed">
                Lahir dari keresahan di meja guru yang penuh tumpukan kertas. Kami membawa AI bukan untuk menggantikan, tapi untuk <span className="text-blue-500 font-bold italic">memerdekakan</span> waktu Anda.
              </p>
            </motion.div>
          </section>

          {/* Section: Visi & Misi (Bento Style) */}
          <section className="min-h-screen px-6 py-40 bg-white text-[#001a41] rounded-t-[100px]">
            <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
              <motion.div whileHover={{ y: -10 }} className="md:col-span-2 bg-blue-600 p-16 rounded-[60px] text-white flex flex-col justify-end min-h-[400px]">
                <h3 className="text-xl font-bold uppercase tracking-widest opacity-50 mb-4">Visi</h3>
                <p className="text-4xl md:text-7xl font-black italic tracking-tighter leading-none">MEMPERSINGKAT KERJA MANUAL HINGGA 80%.</p>
              </motion.div>
              <motion.div whileHover={{ y: -10 }} className="bg-gray-100 p-12 rounded-[60px] flex flex-col justify-between">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-black italic">!</div>
                <div>
                  <h3 className="text-xl font-bold uppercase tracking-widest opacity-50 mb-4">Misi</h3>
                  <p className="text-2xl font-bold italic leading-tight text-gray-600">Menyediakan alat AI yang ramah, cepat, dan akurat untuk setiap guru di pelosok negeri.</p>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Section: Produk Kami (Transisi Imajinatif) */}
          <section id="produk" className="py-40 bg-gray-50 text-[#001a41] px-6">
            <div className="max-w-6xl mx-auto space-y-40">
              
              {/* Product 1: Soal AI */}
              <div className="flex flex-col md:flex-row items-center gap-20">
                <motion.div initial={{ x: -100, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} className="flex-1">
                  <h4 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter text-blue-600 leading-none mb-6">01<br />SOAL AI.</h4>
                  <p className="text-xl md:text-2xl text-gray-500 font-medium italic leading-relaxed">
                    Ucapkan selamat tinggal pada begadang. AI kami menyusun soal ujian HOTS sesuai materi kurikulum Anda dalam hitungan detik.
                  </p>
                  <button className="mt-10 bg-black text-white px-10 py-5 rounded-full font-black italic uppercase tracking-tighter hover:bg-blue-600 transition-colors">Coba Sekarang</button>
                </motion.div>
                <div className="flex-1 bg-white aspect-square rounded-[80px] shadow-2xl flex items-center justify-center text-gray-200 text-3xl font-black italic">PRVIEW SOAL AI</div>
              </div>

              {/* Product 2: Jawaban AI */}
              <div className="flex flex-col md:flex-row-reverse items-center gap-20">
                <motion.div initial={{ x: 100, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} className="flex-1">
                  <h4 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter text-blue-600 leading-none mb-6">02<br />JAWABAN AI.</h4>
                  <p className="text-xl md:text-2xl text-gray-500 font-medium italic leading-relaxed">
                    Cukup jepret kamera ke lembar jawaban siswa. Koreksi otomatis, nilai instan, dan analisis kelemahan siswa langsung di tangan Anda.
                  </p>
                  <button className="mt-10 bg-black text-white px-10 py-5 rounded-full font-black italic uppercase tracking-tighter hover:bg-blue-600 transition-colors">Coba Sekarang</button>
                </motion.div>
                <div className="flex-1 bg-white aspect-square rounded-[80px] shadow-2xl flex items-center justify-center text-gray-200 text-3xl font-black italic">PREVIEW JAWABAN AI</div>
              </div>

            </div>
          </section>

          {/* Section: Contact */}
          <footer id="contact" className="py-40 bg-[#001a41] px-6 text-white rounded-t-[100px]">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-20">
              <div className="text-center md:text-left">
                <h3 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter mb-8 leading-none">TANYA <br /><span className="text-blue-500 underline decoration-blue-500">KAMI.</span></h3>
                <div className="space-y-4 text-xl font-bold italic opacity-60">
                  <p>support@gurubantuguru.ai</p>
                  <p>+62 812 3344 5566</p>
                </div>
              </div>
              <div className="w-full md:w-[450px] bg-white/10 p-12 rounded-[60px] border border-white/10 backdrop-blur-xl">
                 <h4 className="text-3xl font-black italic uppercase mb-6">AI Agent</h4>
                 <p className="text-gray-400 font-medium italic mb-10 text-lg">Butuh bantuan cepat? Ngobrol dengan asisten AI kami.</p>
                 <button className="w-full bg-blue-600 text-white py-6 rounded-3xl font-black italic uppercase tracking-widest hover:bg-white hover:text-blue-600 transition-all">Chat Sekarang</button>
              </div>
            </div>
            <div className="mt-40 text-center opacity-20 text-[10px] font-black tracking-[1em]">© 2026 GURU BANTU GURU</div>
          </footer>
        </div>
      </section>
    </main>
  );
}
