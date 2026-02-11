"use client";

import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
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
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const frameIndex = useTransform(smoothProgress, [0, 1], [0, totalFrames - 1]);

  // Animasi Teks Hero
  const introOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const introY = useTransform(scrollYProgress, [0, 0.1], [0, -40]);
  const promo1Opacity = useTransform(scrollYProgress, [0.2, 0.35, 0.5, 0.65], [0, 1, 1, 0]);
  const promo1Y = useTransform(scrollYProgress, [0.2, 0.35, 0.65], [30, 0, -30]);
  const promo2Opacity = useTransform(scrollYProgress, [0.75, 0.85, 0.95, 1], [0, 1, 1, 0]);
  const promo2Y = useTransform(scrollYProgress, [0.75, 0.85, 1], [30, 0, -30]);

  const glowStyle = {
    color: "black",
    textShadow: "0 0 25px rgba(255,255,255,1), 0 0 12px rgba(255,255,255,0.8)",
  };

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
          setTimeout(() => { setImages(loadedImages); setIsLoaded(true); document.body.style.overflow = "auto"; }, 500);
        }
      };
      loadedImages[i - 1] = img;
    }
  }, []);

  useEffect(() => {
    if (!isLoaded || !canvasRef.current) return;
    const context = canvasRef.current.getContext("2d");
    const renderCanvas = (index: number) => {
      const img = images[Math.floor(index)];
      if (img && context && canvasRef.current) {
        const canvas = canvasRef.current;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        context.scale(dpr, dpr);
        const canvasRatio = window.innerWidth / window.innerHeight;
        const imgRatio = img.width / img.height;
        let dW, dH, dX, dY;
        if (imgRatio > canvasRatio) {
          dH = window.innerHeight; dW = window.innerHeight * imgRatio;
          dX = (window.innerWidth - dW) / 2; dY = 0;
        } else {
          dW = window.innerWidth; dH = window.innerWidth / imgRatio;
          dX = 0; dY = (window.innerHeight - dH) / 2;
        }
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, dX, dY, dW, dH);
      }
    };
    const unsubscribe = frameIndex.on("change", (latest) => { requestAnimationFrame(() => renderCanvas(latest)); });
    renderCanvas(0);
    return () => unsubscribe();
  }, [isLoaded, images, frameIndex]);

  const menuItems = ["Our Story", "Visi", "Misi", "Produk", "Contact"];

  return (
    <main className="relative bg-[#f8faff] text-[#001a41] font-[family-name:var(--font-outfit)]">
      
      {/* LOADING SCREEN */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div exit={{ opacity: 0 }} className="fixed inset-0 z-[999] bg-white flex flex-col items-center justify-center">
            <h2 className="text-4xl font-black italic tracking-tighter text-blue-600">GURU BANTU GURU</h2>
            <div className="w-48 h-[2px] bg-gray-100 mt-4 rounded-full overflow-hidden">
              <motion.div className="h-full bg-blue-600" animate={{ width: `${progress}%` }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FULLSCREEN HAMBURGER MENU */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[200] bg-blue-600 text-white flex flex-col items-center justify-center gap-8"
          >
            <button onClick={() => setIsMenuOpen(false)} className="absolute top-10 right-10 text-xl font-black uppercase italic">Close [X]</button>
            {menuItems.map((item, i) => (
              <motion.a 
                key={i} href={`#${item.toLowerCase().replace(" ", "")}`}
                onClick={() => setIsMenuOpen(false)}
                whileHover={{ scale: 1.1, skewX: -10 }}
                className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter"
              >
                {item}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className={isLoaded ? "block" : "hidden"}>
        
        {/* NAV */}
        <nav className="fixed top-0 w-full z-[100] px-8 py-10 flex justify-between items-center mix-blend-difference">
          <div className="text-2xl font-black italic tracking-tighter uppercase leading-none text-white">
            <span className="text-blue-600">GURU</span> BANTU <span className="text-blue-600">GURU</span>
          </div>
          <button onClick={() => setIsMenuOpen(true)} className="flex flex-col gap-1.5 items-end group">
            <span className="w-10 h-[3px] bg-white rounded-full"></span>
            <span className="w-6 h-[3px] bg-white rounded-full group-hover:w-10 transition-all"></span>
          </button>
        </nav>

        {/* HERO CANVAS */}
        <section ref={containerRef} className="relative h-[1200vh]">
          <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-white">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />
            
            <motion.div style={{ opacity: introOpacity, y: introY, ...glowStyle }} className="relative z-10 text-center px-6">
              <h1 className="text-7xl md:text-[120px] font-black uppercase tracking-tighter italic leading-[0.9]">GURU BANTU<br /><span className="text-blue-600">GURU</span></h1>
              <p className="text-xl md:text-2xl font-bold mt-8 italic uppercase tracking-widest">Asisten Masa Depan Pendidik</p>
            </motion.div>

            <motion.div style={{ opacity: promo1Opacity, y: promo1Y, ...glowStyle }} className="absolute z-10 text-center px-6">
              <h2 className="text-6xl md:text-9xl font-black uppercase italic tracking-tighter leading-none">Buat Soal<br />Otomatis</h2>
            </motion.div>

            <motion.div style={{ opacity: promo2Opacity, y: promo2Y, ...glowStyle }} className="absolute z-10 text-center px-6">
              <h2 className="text-6xl md:text-9xl font-black uppercase italic tracking-tighter leading-none text-blue-600">Cerdas &<br /><span className="text-black">Personal</span></h2>
            </motion.div>
          </div>
        </section>

        {/* ================= OUR STORY (STAY STILL TRANSITION) ================= */}
        <section id="ourstory" className="relative z-20 bg-white py-40 px-6 overflow-hidden">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-20">
            <div className="md:w-1/2 md:sticky md:top-40 h-fit">
              <span className="text-blue-600 font-black tracking-widest uppercase text-sm mb-4 block">The Origin</span>
              <h3 className="text-7xl md:text-[100px] font-black italic uppercase leading-none tracking-tighter text-[#001a41]">OUR<br />STORY</h3>
            </div>
            <div className="md:w-1/2 text-2xl md:text-3xl text-gray-500 font-medium leading-relaxed italic space-y-12">
              <p>Berawal dari sekolah yang <span className="text-blue-600 font-bold">gaptek</span>, di mana tumpukan kertas soal lebih tinggi dari semangat mengajar.</p>
              <p>Kami hadir bukan untuk menggantikan peran mulia guru, tapi untuk memerdekakan waktu yang tercuri oleh administrasi purba.</p>
              <p>Guru Bantu Guru lahir dari tangan-tangan yang percaya bahwa teknologi adalah pelayan terbaik bagi dedikasi seorang pendidik.</p>
            </div>
          </div>
        </section>

        {/* ================= VISI MISI (COLOR SYNC) ================= */}
        <section id="visi" className="relative z-20 bg-blue-600 py-32 px-6 text-white rounded-[60px] mx-4 mb-20 shadow-2xl">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h4 className="text-xl font-black uppercase tracking-[0.3em] mb-6 opacity-60">Visi Kami</h4>
              <p className="text-4xl md:text-6xl font-black italic tracking-tighter leading-none">MEMPERSINGKAT KERJA MANUAL GURU HINGGA 80%.</p>
            </div>
            <div id="misi">
              <h4 className="text-xl font-black uppercase tracking-[0.3em] mb-6 opacity-60">Misi Kami</h4>
              <p className="text-2xl font-bold italic text-blue-100">Menyediakan platform AI yang menghapus pusingnya bikin soal dan koreksi jawaban, agar waktu belajar murid lebih intim dan efisien.</p>
            </div>
          </div>
        </section>

        {/* ================= PRODUK (MODERN BENTO) ================= */}
        <section id="produk" className="relative z-20 bg-[#f8faff] py-40 px-6 text-[#001a41]">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter mb-24 text-center">TOOLS UNGGULAN</h3>
            <div className="grid md:grid-cols-2 gap-10">
              {/* Product Card */}
              <div className="bg-white p-10 rounded-[50px] shadow-xl hover:scale-[1.02] transition-transform">
                <div className="bg-gray-100 aspect-video rounded-[30px] mb-8 flex items-center justify-center text-gray-400 font-black uppercase italic">[ Foto Soal AI ]</div>
                <h4 className="text-4xl font-black italic uppercase mb-4">SOAL <span className="text-blue-600">AI</span></h4>
                <p className="text-gray-500 font-bold italic mb-8">Generator soal instan berbasis kurikulum nasional. HOTS atau LOTS, semua beres dalam sekejap.</p>
                <a href="#" className="bg-blue-600 text-white px-8 py-4 rounded-full font-black italic uppercase tracking-tighter inline-block">Google Play Store</a>
              </div>
              <div className="bg-white p-10 rounded-[50px] shadow-xl hover:scale-[1.02] transition-transform md:mt-20">
                <div className="bg-gray-100 aspect-video rounded-[30px] mb-8 flex items-center justify-center text-gray-400 font-black uppercase italic">[ Foto Jawaban AI ]</div>
                <h4 className="text-4xl font-black italic uppercase mb-4">JAWABAN <span className="text-blue-600">AI</span></h4>
                <p className="text-gray-500 font-bold italic mb-8">Koreksi lembar jawaban siswa hanya lewat jepretan kamera. Akurasi tinggi, waktu lebih hemat.</p>
                <a href="#" className="bg-blue-600 text-white px-8 py-4 rounded-full font-black italic uppercase tracking-tighter inline-block">Google Play Store</a>
              </div>
            </div>
          </div>
        </section>

        {/* ================= REVIEW (HIGH CONTRAST) ================= */}
        <section className="relative z-20 bg-[#001a41] py-40 px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            {[
              { name: "Ibu Rahma", role: "Guru SMP", text: "Hidup saya berubah sejak ada Guru Bantu Guru. Gak ada lagi lembur koreksi!" },
              { name: "Pak Junaidi", role: "Guru SD", text: "Aplikasi yang sangat intuitif. Memang dibuat untuk guru Indonesia." },
              { name: "Ibu Siska", role: "Guru SMA", text: "Fitur Soal AI-nya gila sih, akurat banget sama materi yang saya mau." }
            ].map((item, i) => (
              <div key={i} className="p-10 bg-[#002b6b] rounded-[40px] border border-blue-900 shadow-2xl">
                <div className="text-yellow-400 text-3xl mb-6">★★★★★</div>
                <p className="text-xl font-bold italic text-white leading-tight mb-8">"{item.text}"</p>
                <div className="font-black uppercase tracking-tighter text-blue-400">{item.name}</div>
                <div className="text-xs font-bold text-blue-200 opacity-50">{item.role}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= CONTACT & FOOTER ================= */}
        <footer id="contact" className="relative z-20 bg-white py-32 px-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-20">
            <div className="text-center md:text-left">
              <h3 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-[#001a41]">HUBUNGI<br /><span className="text-blue-600">KAMI</span></h3>
              <div className="mt-10 space-y-4 text-2xl font-black italic text-blue-600">
                <p>Email: support@gurubantu.ai</p>
                <p>WA: +62 812 3344 5566</p>
              </div>
            </div>
            <div className="w-full md:w-[400px] bg-[#f8faff] p-10 rounded-[40px] border-2 border-blue-100">
              <h4 className="text-2xl font-black italic uppercase mb-6">Tanya AI Assistant</h4>
              <p className="text-gray-500 font-bold italic mb-8 text-sm">Butuh bantuan teknis cepat? Ngobrol dengan asisten AI kami.</p>
              <button className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black italic uppercase tracking-widest hover:bg-black transition-colors">MULAI CHAT AI</button>
            </div>
          </div>
          <div className="text-center mt-32 text-[10px] font-black opacity-20 uppercase tracking-[0.5em]">
            © 2026 GURU BANTU GURU — KARYA ANAK BANGSA
          </div>
        </footer>

      </div>
    </main>
  );
}
