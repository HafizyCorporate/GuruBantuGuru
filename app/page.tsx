"use client";

import { motion } from "framer-motion";
import { useState } from "react";

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

  return (
    <main className="relative">
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-[100] bg-white/80 backdrop-blur-xl border-b border-blue-50 px-6 py-4 flex justify-between items-center font-[family-name:var(--font-outfit)]">
        <div className="text-2xl font-black text-blue-700 tracking-tighter italic">GURUBANTU</div>
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden z-[101] p-2">
          <div className={`w-7 h-1 bg-blue-900 mb-1 transition-all ${isOpen ? "rotate-45 translate-y-2" : ""}`} />
          <div className={`w-7 h-1 bg-blue-900 mb-1 transition-all ${isOpen ? "opacity-0" : ""}`} />
          <div className={`w-7 h-1 bg-blue-900 transition-all ${isOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
        <div className="hidden md:flex gap-8 font-bold text-xs uppercase tracking-widest text-slate-500">
          <a href="#visi" className="hover:text-blue-600 transition">Visi</a>
          <a href="#produk" className="hover:text-blue-600 transition">Produk</a>
          <a href="#kontak" className="bg-blue-600 text-white px-6 py-2 rounded-full shadow-lg shadow-blue-200">Hubungi Kami</a>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`fixed inset-0 bg-blue-600 z-[90] flex flex-col items-center justify-center gap-8 text-white text-3xl font-bold transition-all duration-500 font-[family-name:var(--font-outfit)] ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
        <a href="#visi" onClick={() => setIsOpen(false)}>VISI</a>
        <a href="#produk" onClick={() => setIsOpen(false)}>PRODUK</a>
        <a href="#kontak" onClick={() => setIsOpen(false)}>KONTAK</a>
      </div>

      {/* HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center bg-slate-950 overflow-hidden font-[family-name:var(--font-outfit)]">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-40">
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="relative z-10 text-center px-6">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-6 leading-[0.9]">
            REVOLUSI <br /> <span className="text-blue-400">PENDIDIKAN.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-blue-100/70 text-lg md:text-2xl max-w-2xl mx-auto font-light mb-10">
            Fokus mengajar, biarkan AI urus administrasi. Hemat waktu hingga 80%.
          </motion.p>
          <a href="#produk" className="bg-white text-blue-900 px-10 py-4 rounded-full font-bold text-lg shadow-2xl hover:bg-blue-50 transition-all">Lihat Aplikasi</a>
        </div>
      </section>

      {/* VISI & MISI */}
      <section id="visi" className="py-32 px-6 max-w-6xl mx-auto font-[family-name:var(--font-outfit)]">
        <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex flex-col md:flex-row items-center gap-16 mb-40">
          <div className="md:w-1/2">
            <h2 className="text-5xl font-black text-blue-900 mb-6 italic uppercase tracking-tighter">Visi Kami</h2>
            <p className="text-xl text-slate-600 leading-relaxed font-light">Menjadi mitra utama guru Indonesia dalam digitalisasi pendidikan, menghapus hambatan administrasi untuk menciptakan generasi cerdas.</p>
          </div>
          <div className="md:w-1/2 bg-blue-100 rounded-[3rem] p-4 rotate-3 shadow-2xl overflow-hidden">
            <img src="/img-guru-1.jpg" className="rounded-[2.5rem] -rotate-3 hover:rotate-0 transition-transform duration-700" alt="Guru" />
          </div>
        </motion.div>
      </section>

      {/* PRODUK: SOAL AI */}
      <section id="produk" className="py-32 px-6 bg-slate-50 font-[family-name:var(--font-outfit)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-20 mb-40">
            <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} className="md:w-1/2">
              <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-blue-50">
                <span className="text-6xl mb-6 block">⚡</span>
                <h3 className="text-4xl font-black text-blue-900 mb-6 uppercase italic tracking-tighter">Soal AI</h3>
                <p className="text-slate-500 text-lg mb-4">Buat bank soal berkualitas tinggi dari materi apa pun dalam hitungan detik.</p>
                <PlayStoreButton link="https://play.google.com/store/apps/details?id=com.soalai.app" />
              </div>
            </motion.div>
            <div className="md:w-1/2">
              <img src="/preview-soal.png" className="rounded-[3rem] shadow-2xl border-8 border-white" alt="Preview Soal AI" />
            </div>
          </div>

          {/* PRODUK: JAWABAN AI */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-20">
            <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} className="md:w-1/2">
              <div className="bg-slate-900 text-white p-12 rounded-[3rem] shadow-2xl">
                <span className="text-6xl mb-6 block">🧠</span>
                <h3 className="text-4xl font-black text-blue-400 mb-6 uppercase italic tracking-tighter">Jawaban AI</h3>
                <p className="text-slate-400 text-lg mb-4">Koreksi otomatis yang akurat dengan umpan balik personal untuk setiap siswa.</p>
                <PlayStoreButton link="https://play.google.com/store/apps/details?id=com.jawabanai.app" />
              </div>
            </motion.div>
            <div className="md:w-1/2">
              <img src="/preview-jawaban.png" className="rounded-[3rem] shadow-2xl border-8 border-slate-900" alt="Preview Jawaban AI" />
            </div>
          </div>
        </div>
      </section>

      {/* KONTAK */}
      <section id="kontak" className="py-32 px-6 max-w-4xl mx-auto text-center font-[family-name:var(--font-outfit)]">
        <h2 className="text-5xl font-black text-slate-950 mb-12 uppercase italic tracking-tighter leading-none">Siap Bergabung?</h2>
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 text-left">
          <p className="text-blue-600 font-bold text-xs mb-4 uppercase tracking-[0.3em]">Hubungi Kami</p>
          <p className="text-2xl font-black mb-1 text-slate-900">+62 822 4040 0388</p>
          <p className="text-2xl font-black mb-10 text-slate-900">GuruBantuGuru@gmail.com</p>
          <button className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-700 shadow-xl shadow-blue-200 uppercase tracking-widest">Kirim Pesan via WA</button>
        </div>
      </section>

      <footer className="py-12 text-center text-[10px] font-black tracking-[0.5em] text-slate-400 uppercase border-t font-[family-name:var(--font-outfit)]">
        © 2026 GURUBANTUGURU — Empowering Indonesia
      </footer>
    </main>
  );
}
