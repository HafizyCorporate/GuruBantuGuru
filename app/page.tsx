"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";

const PlayStoreButton = ({ link }: { link: string }) => (
  <motion.a
    href={link}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="flex items-center gap-3 bg-black text-white px-6 py-3 rounded-2xl border border-white/10 hover:border-blue-500 transition-all w-fit shadow-xl mt-6"
  >
    <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Play Store" className="h-8" />
    <div className="text-left font-[family-name:var(--font-outfit)]">
      <p className="text-[10px] uppercase leading-none opacity-60 font-bold">Get it on</p>
      <p className="text-lg font-bold leading-tight">Google Play</p>
    </div>
  </motion.a>
);

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // CONFIG: 192 Foto
  const totalFrames = 192; 
  const frameIndex = useTransform(scrollYProgress, [0, 1], [1, totalFrames]);
  const [currentFrame, setCurrentFrame] = useState(1);

  useEffect(() => {
    return frameIndex.on("change", (latest) => {
      setCurrentFrame(Math.round(latest));
    });
  }, [frameIndex]);

  const textOpacity = useTransform(scrollYProgress, [0, 0.7, 0.9], [1, 1, 0]);
  const textScale = useTransform(scrollYProgress, [0, 0.9], [1, 0.8]);

  return (
    <main className="relative bg-black">
      <nav className="fixed top-0 w-full z-[100] bg-black/20 backdrop-blur-md border-b border-white/10 px-6 py-4 flex justify-between items-center font-[family-name:var(--font-outfit)]">
        <div className="text-2xl font-black text-white tracking-tighter italic">GURUBANTU</div>
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden z-[101] p-2">
          <div className={`w-7 h-1 bg-white mb-1 transition-all ${isOpen ? "rotate-45 translate-y-2" : ""}`} />
          <div className={`w-7 h-1 bg-white mb-1 transition-all ${isOpen ? "opacity-0" : ""}`} />
          <div className={`w-7 h-1 bg-white transition-all ${isOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
        <div className="hidden md:flex gap-8 font-bold text-xs uppercase tracking-widest text-white/70">
          <a href="#visi" className="hover:text-blue-400 transition">Visi</a>
          <a href="#produk" className="hover:text-blue-400 transition">Produk</a>
          <a href="#kontak" className="bg-blue-600 text-white px-6 py-2 rounded-full shadow-lg shadow-blue-500/20">Hubungi Kami</a>
        </div>
      </nav>

      <section ref={containerRef} className="relative h-[800vh] bg-black">
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
          
          {/* PATH DISESUAIKAN: Langsung ke root folder public */}
          <img
            key={currentFrame}
            src={`/ezgif-frame-${currentFrame.toString().padStart(3, '0')}.jpg`}
            alt="Sequence"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black" />

          <motion.div 
            style={{ opacity: textOpacity, scale: textScale }}
            className="relative z-10 text-center px-4 font-[family-name:var(--font-outfit)]"
          >
            <h1 className="text-5xl md:text-[120px] font-[900] text-white leading-none uppercase tracking-tighter mb-4">
              GURU BANTU GURU
            </h1>
            <p className="text-sm md:text-xl text-blue-400 font-light tracking-[0.4em] uppercase">
              Kami hadir membantu untuk mencerdaskan anak bangsa
            </p>
          </motion.div>

          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-40">
            <div className="w-[1px] h-24 bg-gradient-to-b from-blue-500 to-transparent" />
            <span className="text-[10px] text-white tracking-[1em] uppercase rotate-90 origin-left ml-2 font-bold">Scroll</span>
          </div>
        </div>
      </section>

      {/* KONTEN PUTIH */}
      <div className="relative z-20 bg-white">
        <section id="visi" className="py-40 px-6 max-w-6xl mx-auto font-[family-name:var(--font-outfit)]">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="md:w-1/2">
              <h2 className="text-6xl font-black text-blue-900 mb-8 italic uppercase tracking-tighter leading-none">Visi Kami</h2>
              <p className="text-2xl text-slate-600 leading-relaxed font-light">Menjadi mitra utama guru Indonesia dalam digitalisasi pendidikan.</p>
            </div>
            <div className="md:w-1/2 bg-blue-50 rounded-[4rem] p-6 shadow-2xl">
              <div className="w-full h-[500px] bg-slate-200 rounded-[3rem] animate-pulse flex items-center justify-center text-slate-400 italic">Foto Guru</div>
            </div>
          </div>
        </section>

        {/* PRODUK SECTION */}
        <section id="produk" className="py-40 px-6 bg-slate-50 font-[family-name:var(--font-outfit)]">
          <div className="max-w-7xl mx-auto space-y-40">
            <div className="flex flex-col md:flex-row items-center gap-20">
              <div className="md:w-1/2">
                <div className="bg-white p-16 rounded-[4rem] shadow-2xl border border-blue-50">
                  <span className="text-7xl mb-8 block">⚡</span>
                  <h3 className="text-5xl font-black text-blue-900 mb-6 uppercase italic">Soal AI</h3>
                  <p className="text-slate-500 text-xl mb-6">Buat bank soal dalam hitungan detik.</p>
                  <PlayStoreButton link="https://play.google.com/store/apps/details?id=com.soalai.app" />
                </div>
              </div>
              <div className="md:w-1/2 bg-slate-200 h-[400px] rounded-[4rem] animate-pulse" />
            </div>
          </div>
        </section>

        <section id="kontak" className="py-40 px-6 max-w-4xl mx-auto text-center font-[family-name:var(--font-outfit)]">
          <h2 className="text-7xl font-black text-slate-950 mb-16 uppercase italic tracking-tighter leading-none">Siap Bergabung?</h2>
          <button className="w-full bg-blue-600 text-white py-8 rounded-3xl font-black text-xl hover:bg-blue-700 shadow-2xl shadow-blue-500/40 uppercase">
            Kirim Pesan via WA
          </button>
        </section>

        <footer className="py-16 text-center text-[10px] font-black tracking-[0.6em] text-slate-300 uppercase border-t font-[family-name:var(--font-outfit)]">
          © 2026 GURUBANTUGURU — Empowering Indonesia
        </footer>
      </div>
    </main>
  );
}
