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

  // LOGIKA SCROLL SEQUENCE
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Memetakan scroll (0 ke 1) menjadi index gambar (1 ke 50)
  const frameIndex = useTransform(scrollYProgress, [0, 1], [1, 50]);
  const [currentFrame, setCurrentFrame] = useState(1);

  useEffect(() => {
    return frameIndex.on("change", (latest) => {
      setCurrentFrame(Math.round(latest));
    });
  }, [frameIndex]);

  // Efek Animasi Teks saat Scroll
  const textOpacity = useTransform(scrollYProgress, [0, 0.5, 0.8], [1, 1, 0]);
  const textScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.8]);

  return (
    <main className="relative bg-black">
      {/* NAVBAR - Dibuat Transparan agar Cinematic */}
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

      {/* MOBILE MENU */}
      <div className={`fixed inset-0 bg-blue-900 z-[90] flex flex-col items-center justify-center gap-8 text-white text-3xl font-bold transition-all duration-500 font-[family-name:var(--font-outfit)] ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
        <a href="#visi" onClick={() => setIsOpen(false)}>VISI</a>
        <a href="#produk" onClick={() => setIsOpen(false)}>PRODUK</a>
        <a href="#kontak" onClick={() => setIsOpen(false)}>KONTAK</a>
      </div>

      {/* HERO SECTION: IMAGE SEQUENCE */}
      <section ref={containerRef} className="relative h-[400vh] bg-black">
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
          
          {/* Render Gambar Berdasarkan Scroll */}
          <img
            src={`/sequence/frame-${currentFrame}.webp`}
            alt="Cinematic Sequence"
            className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105"
          />

          {/* Vignette Gelap */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black" />

          {/* Teks Utama Cinematic */}
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

          {/* Scroll Indicator Minimalis */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-40">
            <div className="w-[1px] h-24 bg-gradient-to-b from-blue-500 to-transparent" />
            <span className="text-[10px] text-white tracking-[1em] uppercase rotate-90 origin-left ml-2">Scroll</span>
          </div>
        </div>
      </section>

      {/* WRAPPER KONTEN PUTIH (Muncul saat scroll bawah) */}
      <div className="relative z-20 bg-white">
        
        {/* VISI & MISI */}
        <section id="visi" className="py-40 px-6 max-w-6xl mx-auto font-[family-name:var(--font-outfit)]">
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col md:flex-row items-center gap-16">
            <div className="md:w-1/2">
              <h2 className="text-6xl font-black text-blue-900 mb-8 italic uppercase tracking-tighter leading-none">Visi Kami</h2>
              <p className="text-2xl text-slate-600 leading-relaxed font-light">Menjadi mitra utama guru Indonesia dalam digitalisasi pendidikan, menghapus hambatan administrasi untuk menciptakan generasi cerdas.</p>
            </div>
            <div className="md:w-1/2 bg-blue-50 rounded-[4rem] p-6 rotate-3 shadow-2xl overflow-hidden border border-blue-100">
              <img src="/img-guru-1.jpg" className="rounded-[3rem] -rotate-3 hover:rotate-0 transition-transform duration-1000 w-full h-[500px] object-cover" alt="Guru" />
            </div>
          </motion.div>
        </section>

        {/* PRODUK SECTION */}
        <section id="produk" className="py-40 px-6 bg-slate-50 font-[family-name:var(--font-outfit)]">
          <div className="max-w-7xl mx-auto space-y-40">
            {/* SOAL AI */}
            <div className="flex flex-col md:flex-row items-center gap-20">
              <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} className="md:w-1/2">
                <div className="bg-white p-16 rounded-[4rem] shadow-2xl border border-blue-50">
                  <span className="text-7xl mb-8 block">⚡</span>
                  <h3 className="text-5xl font-black text-blue-900 mb-6 uppercase italic tracking-tighter">Soal AI</h3>
                  <p className="text-slate-500 text-xl mb-6">Buat bank soal berkualitas tinggi dari materi apa pun dalam hitungan detik.</p>
                  <PlayStoreButton link="https://play.google.com/store/apps/details?id=com.soalai.app" />
                </div>
              </motion.div>
              <div className="md:w-1/2">
                <img src="/preview-soal.png" className="rounded-[4rem] shadow-2xl border-[12px] border-white w-full" alt="Preview Soal AI" />
              </div>
            </div>

            {/* JAWABAN AI */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-20">
              <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} className="md:w-1/2">
                <div className="bg-slate-950 text-white p-16 rounded-[4rem] shadow-2xl">
                  <span className="text-7xl mb-8 block">🧠</span>
                  <h3 className="text-5xl font-black text-blue-400 mb-6 uppercase italic tracking-tighter">Jawaban AI</h3>
                  <p className="text-slate-400 text-xl mb-6">Koreksi otomatis yang akurat dengan umpan balik personal untuk setiap siswa.</p>
                  <PlayStoreButton link="https://play.google.com/store/apps/details?id=com.jawabanai.app" />
                </div>
              </motion.div>
              <div className="md:w-1/2">
                <img src="/preview-jawaban.png" className="rounded-[4rem] shadow-2xl border-[12px] border-slate-900 w-full" alt="Preview Jawaban AI" />
              </div>
            </div>
          </div>
        </section>

        {/* KONTAK */}
        <section id="kontak" className="py-40 px-6 max-w-4xl mx-auto text-center font-[family-name:var(--font-outfit)]">
          <h2 className="text-7xl font-black text-slate-950 mb-16 uppercase italic tracking-tighter">Siap Bergabung?</h2>
          <div className="bg-white p-12 md:p-20 rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border border-slate-100 text-left">
            <p className="text-blue-600 font-bold text-sm mb-6 uppercase tracking-[0.4em]">Hubungi Kami</p>
            <p className="text-3xl md:text-5xl font-black mb-2 text-slate-900 tracking-tight">+62 822 4040 0388</p>
            <p className="text-xl md:text-3xl font-medium mb-12 text-slate-400 italic">GuruBantuGuru@gmail.com</p>
            <button className="w-full bg-blue-600 text-white py-8 rounded-3xl font-black text-xl hover:bg-blue-700 shadow-2xl shadow-blue-500/40 transition-all uppercase tracking-widest">
              Kirim Pesan via WA
            </button>
          </div>
        </section>

        <footer className="py-16 text-center text-[10px] font-black tracking-[0.6em] text-slate-300 uppercase border-t font-[family-name:var(--font-outfit)]">
          © 2026 GURUBANTUGURU — Empowering Indonesia
        </footer>
      </div>
    </main>
  );
}
