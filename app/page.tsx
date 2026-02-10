"use client";

import { motion } from "framer-motion";
import { useState } from "react";

// Tombol Playstore
const PlayStoreButton = ({ link }: { link: string }) => (
  <motion.a
    href={link}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="flex items-center gap-3 bg-black text-white px-6 py-3 rounded-2xl border border-white/10 hover:border-blue-500 transition-all w-fit shadow-xl"
  >
    <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Play Store" className="h-8" />
    <div className="text-left">
      <p className="text-[10px] uppercase leading-none opacity-60">Get it on</p>
      <p className="text-lg font-bold leading-tight">Google Play</p>
    </div>
  </motion.a>
);

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <main className="bg-white text-slate-900">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-[100] bg-white/70 backdrop-blur-xl border-b border-blue-50 px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-black text-blue-700 tracking-tighter italic">GURUBANTU</div>
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden z-[101] p-2">
          <div className={`w-7 h-1 bg-blue-900 mb-1 transition-all ${isOpen ? "rotate-45 translate-y-2" : ""}`} />
          <div className={`w-7 h-1 bg-blue-900 mb-1 transition-all ${isOpen ? "opacity-0" : ""}`} />
          <div className={`w-7 h-1 bg-blue-900 transition-all ${isOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
        <div className="hidden md:flex gap-8 font-bold text-xs uppercase tracking-widest text-slate-500">
          <a href="#visi" className="hover:text-blue-600 transition">Visi</a>
          <a href="#misi" className="hover:text-blue-600 transition">Misi</a>
          <a href="#produk" className="hover:text-blue-600 transition">Produk</a>
          <a href="#kontak" className="bg-blue-600 text-white px-6 py-2 rounded-full">Hubungi Kami</a>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`fixed inset-0 bg-blue-600 z-[90] flex flex-col items-center justify-center gap-8 text-white text-3xl font-bold transition-all duration-500 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
        <a href="#visi" onClick={() => setIsOpen(false)}>VISI</a>
        <a href="#misi" onClick={() => setIsOpen(false)}>MISI</a>
        <a href="#produk" onClick={() => setIsOpen(false)}>PRODUK</a>
        <a href="#kontak" onClick={() => setIsOpen(false)}>KONTAK</a>
      </div>

      {/* HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center bg-slate-950 overflow-hidden">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-40">
          <source src="https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-a-cloud-server-and-data-22630-large.mp4" type="video/mp4" />
        </video>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="relative z-10 text-center px-6">
          <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-6 leading-none">REVOLUSI <br /> <span className="text-blue-400">PENDIDIKAN.</span></h1>
          <p className="text-blue-100/70 text-lg md:text-2xl max-w-2xl mx-auto font-light mb-10">Integrasi AI terbaik untuk guru Indonesia. Hemat waktu, maksimalkan inspirasi.</p>
          <a href="#produk" className="bg-white text-blue-900 px-10 py-4 rounded-full font-bold text-lg shadow-2xl">Lihat Inovasi</a>
        </motion.div>
      </section>

      {/* VISI & MISI */}
      <section id="visi" className="py-32 px-6 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex flex-col md:flex-row items-center gap-16 mb-40">
          <div className="md:w-1/2">
            <h2 className="text-5xl font-black text-blue-900 mb-6 italic">VISI KAMI</h2>
            <p className="text-xl text-slate-600 leading-relaxed">Menghapus beban administratif guru melalui teknologi cerdas, sehingga setiap pendidik bisa fokus mengukir masa depan bangsa.</p>
          </div>
          <div className="md:w-1/2 bg-blue-100 rounded-[3rem] p-4 rotate-3 shadow-2xl">
            <img src="https://images.unsplash.com/photo-1544717305-27a734ef1904?auto=format&fit=crop&w=800" className="rounded-[2.5rem] -rotate-3" alt="Guru" />
          </div>
        </motion.div>

        <motion.div id="misi" initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex flex-col md:flex-row-reverse items-center gap-16">
          <div className="md:w-1/2">
            <h2 className="text-5xl font-black text-blue-900 mb-6 italic">MISI KAMI</h2>
            <p className="text-xl text-slate-600 leading-relaxed">Menciptakan alat AI yang mempercepat pembuatan soal dan koreksi hingga 80%, memberikan efisiensi nyata di ruang kelas.</p>
          </div>
          <div className="md:w-1/2 bg-slate-200 rounded-[3rem] p-4 -rotate-3 shadow-2xl">
            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800" className="rounded-[2.5rem] rotate-3" alt="Siswa" />
          </div>
        </motion.div>
      </section>

      {/* MOTIVASI */}
      <section className="py-32 bg-blue-600 text-white text-center px-6">
        <motion.h2 whileInView={{ scale: [0.9, 1], opacity: [0, 1] }} className="text-3xl md:text-5xl font-black max-w-4xl mx-auto leading-tight italic">
          "TEKNOLOGI TIDAK AKAN MENGGANTIKAN GURU, TAPI GURU YANG MENGGUNAKAN TEKNOLOGI AKAN MENGINSPIRASI DUNIA."
        </motion.h2>
      </section>

      {/* PRODUK */}
      <section id="produk" className="py-32 px-6 max-w-7xl mx-auto bg-slate-50 rounded-[4rem] my-20">
        <div className="flex flex-col md:flex-row items-center gap-20 mb-40">
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} className="md:w-1/2">
            <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-blue-50">
              <span className="text-6xl mb-6 block">⚡</span>
              <h3 className="text-4xl font-black text-blue-900 mb-6 uppercase italic tracking-tighter">Soal AI</h3>
              <p className="text-slate-500 text-lg mb-10 leading-relaxed">Buat bank soal berkualitas tinggi (Pilihan Ganda & Esai HOTS) dari materi apa pun hanya dalam hitungan detik.</p>
              <PlayStoreButton link="https://play.google.com/store/apps/details?id=com.gurubantu.soalai" />
            </div>
          </motion.div>
          <div className="md:w-1/2">
            <img src="https://images.unsplash.com/photo-1610484826967-09c5720778c7?auto=format&fit=crop&w=800" className="rounded-[3rem] shadow-2xl border-8 border-white" alt="App" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row-reverse items-center gap-20">
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} className="md:w-1/2">
            <div className="bg-slate-900 text-white p-12 rounded-[3rem] shadow-2xl">
              <span className="text-6xl mb-6 block">🧠</span>
              <h3 className="text-4xl font-black text-blue-400 mb-6 uppercase italic tracking-tighter">Jawaban AI</h3>
              <p className="text-slate-400 text-lg mb-10 leading-relaxed">Asisten koreksi otomatis yang mampu memberikan feedback personal kepada setiap siswa secara instan.</p>
              <PlayStoreButton link="https://play.google.com/store/apps/details?id=com.gurubantu.jawabanai" />
            </div>
          </motion.div>
          <div className="md:w-1/2">
            <img src="https://images.unsplash.com/photo-1588702590266-b5b15c796f58?auto=format&fit=crop&w=800" className="rounded-[3rem] shadow-2xl border-8 border-slate-900" alt="App" />
          </div>
        </div>
      </section>

      {/* KONTAK */}
      <section id="kontak" class="py-32 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-5xl font-black text-slate-950 mb-12 uppercase italic tracking-tighter">Bersiap Untuk Inovasi?</h2>
        <div className="grid md:grid-cols-2 gap-6 text-left mb-10">
          <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100">
            <p className="text-blue-600 font-bold text-[10px] uppercase tracking-widest mb-2">WhatsApp</p>
            <p className="text-2xl font-black text-blue-900">+62 822 4040 0388</p>
          </div>
          <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100">
            <p className="text-blue-600 font-bold text-[10px] uppercase tracking-widest mb-2">Email</p>
            <p className="text-2xl font-black text-blue-900">GuruBantuGuru@gmail.com</p>
          </div>
        </div>
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 text-left">
          <h3 className="font-bold text-xl mb-6 italic uppercase">Kotak Saran</h3>
          <input type="text" placeholder="Nama" className="w-full border-b border-slate-200 py-4 mb-6 outline-none focus:border-blue-600 transition" />
          <textarea placeholder="Saran/Masukan" rows={3} className="w-full border-b border-slate-200 py-4 mb-8 outline-none focus:border-blue-600 transition"></textarea>
          <button className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-700 shadow-xl shadow-blue-200">KIRIM MASUKAN</button>
        </div>
      </section>

      <footer className="py-12 text-center text-[10px] font-bold tracking-[0.5em] text-slate-400 uppercase border-t">
        © 2026 GURUBANTUGURU — MEMBERDAYAKAN PENDIDIK
      </footer>
    </main>
  );
}

