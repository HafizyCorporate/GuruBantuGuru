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
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, totalFrames - 1]);

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

  // Canvas Render
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
    <main className="bg-[#fcfdff] text-[#001a41] overflow-x-hidden">
      
      {/* LOADING SCREEN */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div exit={{ opacity: 0 }} className="fixed inset-0 z-[999] bg-white flex flex-col items-center justify-center">
            <h2 className="text-3xl font-black italic text-blue-600 animate-pulse tracking-tighter">GURU BANTU GURU</h2>
            <p className="mt-4 font-bold text-gray-400 text-xs tracking-widest uppercase">Initializing AI {progress}%</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <nav className="fixed top-0 w-full z-[100] px-8 py-8 flex justify-between items-center mix-blend-difference">
        <div className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">
          Guru <span className="text-blue-500 font-extrabold italic">Bantu</span> Guru
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="group flex flex-col gap-1.5 items-end">
          <div className="w-10 h-1 bg-white rounded-full transition-all group-hover:bg-blue-500"></div>
          <div className="w-6 h-1 bg-white rounded-full transition-all group-hover:w-10"></div>
        </button>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 100 }} className="fixed inset-0 z-[150] bg-blue-600 text-white flex flex-col items-center justify-center gap-10">
             <button onClick={() => setIsMenuOpen(false)} className="absolute top-10 right-10 font-black italic uppercase text-sm border-2 border-white px-4 py-2 rounded-full">Close [x]</button>
             {["Our Story", "Visi & Misi", "Produk", "Contact"].map((m) => (
               <a key={m} href={`#${m.toLowerCase().replace(" ", "")}`} onClick={() => setIsMenuOpen(false)} className="text-5xl font-black italic uppercase tracking-tighter hover:skew-x-12 transition-transform">{m}</a>
             ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* CANVAS SECTION */}
      <section ref={containerRef} className="relative h-[600vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-white">
          <canvas ref={canvasRef} className="w-full h-full object-cover shadow-2xl" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/20"></div>
        </div>
      </section>

      {/* ================= CONTENT START ================= */}

      {/* CERITA KAMI - THE STICKY OVERLAP */}
      <section id="ourstory" className="relative z-20 py-40 px-6 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-20">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} className="md:w-1/2">
            <span className="text-blue-600 font-black tracking-[0.4em] uppercase text-xs block mb-6 underline decoration-4 underline-offset-8">History</span>
            <h2 className="text-7xl md:text-9xl font-black italic uppercase leading-none tracking-tighter text-[#001a41]">CERITA<br /><span className="text-blue-600 underline">KAMI.</span></h2>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} className="md:w-1/2 text-2xl md:text-3xl text-gray-500 font-medium leading-relaxed italic space-y-8 border-l-8 border-blue-50 px-8">
            <p>Lahir dari ruang kelas yang berdebu, di mana teknologi seringkali dianggap musuh. Kami melihat guru-guru hebat kehabisan energi bukan karena mendidik, melainkan karena <span className="text-[#001a41] font-black">administrasi purba</span>.</p>
            <p>Kami hadir sebagai <span className="text-blue-600 font-bold italic underline">pelayan digital</span>, memerdekakan waktu yang tercuri agar guru bisa kembali menjadi inspirasi, bukan sekadar pengoreksi kertas.</p>
          </motion.div>
        </div>
      </section>

      {/* VISI & MISI - THE BENTO GRID */}
      <section id="visi&misi" className="relative z-20 bg-[#f0f4ff] py-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* VISI CARD */}
          <motion.div whileHover={{ y: -10 }} className="md:col-span-2 bg-gradient-to-br from-[#001a41] to-blue-900 p-16 rounded-[60px] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 text-[180px] font-black opacity-5 tracking-tighter group-hover:scale-125 transition-transform">VISI</div>
            <h4 className="text-xs font-black uppercase tracking-[0.5em] mb-10 text-blue-400">Our Vision</h4>
            <p className="text-4xl md:text-7xl font-black italic leading-none tracking-tighter uppercase italic">
              MEMERDEKAKAN <br />WAKTU GURU <br /><span className="text-blue-400 font-black">HINGGA 80%.</span>
            </p>
          </motion.div>

          {/* MISI CARD */}
          <motion.div whileHover={{ y: -10 }} className="bg-white p-12 rounded-[60px] border-2 border-blue-100 flex flex-col justify-between shadow-xl">
            <div className="h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black italic">!</div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.5em] mb-4 text-gray-400">Our Mission</h4>
              <p className="text-2xl font-bold italic leading-tight text-[#001a41]">Menghapus "Sakit Kepala" saat menyusun soal & koreksi. Kami ingin guru hanya fokus menyentuh hati dan masa depan murid.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PRODUK KAMI - THE INTERACTIVE CARDS */}
      <section id="produk" className="relative z-20 py-40 bg-white px-6">
        <div className="max-w-6xl mx-auto text-center mb-32">
          <h3 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter leading-none mb-4">THE TOOLS.</h3>
          <p className="text-blue-600 font-black tracking-widest uppercase">Inovasi yang Meringankan Beban Anda</p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
          
          {/* PRODUCT 1 - SOAL AI */}
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} className="group relative">
            <div className="bg-[#f8faff] aspect-[4/5] rounded-[80px] mb-10 overflow-hidden border-2 border-transparent group-hover:border-blue-600 transition-all flex flex-col items-center justify-center p-12 shadow-inner relative">
              <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
              <div className="text-center z-10">
                 <h4 className="text-5xl font-black italic uppercase tracking-tighter mb-6">SOAL <span className="text-blue-600 underline">AI.</span></h4>
                 <p className="text-lg text-gray-500 font-medium italic mb-10 leading-relaxed">Generator soal cerdas yang memahami kurikulum. Cukup masukkan materi, dan biarkan AI menyusun soal HOTS dalam hitungan detik.</p>
                 <a href="#" className="inline-block bg-[#001a41] text-white px-10 py-5 rounded-full font-black italic uppercase tracking-tighter group-hover:bg-blue-600 transition-colors shadow-lg shadow-blue-200">Get it on Play Store</a>
              </div>
            </div>
          </motion.div>

          {/* PRODUCT 2 - JAWABAN AI */}
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} className="group relative md:mt-32">
            <div className="bg-[#f8faff] aspect-[4/5] rounded-[80px] mb-10 overflow-hidden border-2 border-transparent group-hover:border-blue-600 transition-all flex flex-col items-center justify-center p-12 shadow-inner relative">
              <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
              <div className="text-center z-10">
                 <h4 className="text-5xl font-black italic uppercase tracking-tighter mb-6">JAWABAN <span className="text-blue-600 underline">AI.</span></h4>
                 <p className="text-lg text-gray-500 font-medium italic mb-10 leading-relaxed">Asisten koreksi otomatis. Scan lembar jawaban murid lewat kamera HP, nilai dan analisis langsung keluar. Akurat & Instant.</p>
                 <a href="#" className="inline-block bg-[#001a41] text-white px-10 py-5 rounded-full font-black italic uppercase tracking-tighter group-hover:bg-blue-600 transition-colors shadow-lg shadow-blue-200">Get it on Play Store</a>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* CONTACT & AI AGENT - THE FUTURE LOOK */}
      <footer id="contact" className="relative z-20 bg-[#001a41] py-32 px-6 rounded-t-[100px]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-20">
          
          <div className="text-white text-center md:text-left">
            <h2 className="text-6xl md:text-8xl font-black italic uppercase leading-none tracking-tighter mb-10">KEEP IN<br /><span className="text-blue-500 underline decoration-blue-500">TOUCH.</span></h2>
            <div className="space-y-4">
              <p className="text-2xl font-bold italic opacity-60 hover:opacity-100 transition-opacity">halo@gurubantuguru.ai</p>
              <p className="text-2xl font-bold italic opacity-60 hover:opacity-100 transition-opacity">+62 812-3344-5566</p>
            </div>
          </div>

          <div className="w-full md:w-[450px] bg-white/5 backdrop-blur-2xl p-12 rounded-[60px] border border-white/10 shadow-2xl relative group">
            <div className="absolute -top-6 -left-6 h-20 w-20 bg-blue-600 rounded-full flex items-center justify-center text-3xl animate-bounce shadow-xl">🤖</div>
            <h4 className="text-white text-3xl font-black italic uppercase mb-4 tracking-tighter">AI Assistant</h4>
            <p className="text-blue-200/60 font-medium italic mb-10">Butuh bantuan teknis cepat? Ngobrol dengan asisten AI kami yang aktif 24/7.</p>
            <button className="w-full bg-blue-600 text-white py-6 rounded-3xl font-black italic uppercase tracking-widest hover:bg-white hover:text-blue-600 transition-all shadow-xl shadow-blue-900/50">Mulai Chatting AI</button>
          </div>

        </div>

        <div className="mt-40 text-center opacity-10">
          <p className="text-[10px] font-black tracking-[1em] text-white uppercase italic">Guru Bantu Guru — Future of Education © 2026</p>
        </div>
      </footer>

    </main>
  );
}
