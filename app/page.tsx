"use client";

import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

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
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'high';
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

  return (
    <main className="relative bg-[#050505] text-white font-[family-name:var(--font-outfit)]">
      
      {/* LOADING SCREEN */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div exit={{ opacity: 0 }} className="fixed inset-0 z-[999] bg-white flex flex-col items-center justify-center">
            <motion.h2 animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-4xl font-black italic tracking-tighter text-blue-600">GURUBANTU</motion.h2>
            <div className="w-48 h-[2px] bg-gray-100 mt-4 rounded-full overflow-hidden">
              <motion.div className="h-full bg-blue-600" animate={{ width: `${progress}%` }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={isLoaded ? "block" : "hidden"}>
        
        {/* NAV */}
        <nav className="fixed top-0 w-full z-[100] px-8 py-10 flex justify-between items-center mix-blend-difference">
          <div className="text-2xl font-black italic tracking-tighter uppercase leading-none">
            <span className="text-blue-600 font-black">GURU</span>BANTU
          </div>
          <div className="h-10 w-10 flex flex-col justify-center items-end gap-1.5 cursor-pointer group">
            <span className="w-8 h-[3px] bg-white rounded-full group-hover:w-10 transition-all"></span>
            <span className="w-5 h-[3px] bg-white rounded-full group-hover:w-10 transition-all"></span>
          </div>
        </nav>

        {/* HERO CANVAS */}
        <section ref={containerRef} className="relative h-[1200vh]">
          <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-white">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" style={{ filter: 'contrast(1.05) brightness(1.05)' }} />
            
            <motion.div style={{ opacity: introOpacity, y: introY, ...glowStyle }} className="relative z-10 text-center px-6">
              <h1 className="text-7xl md:text-[140px] font-black uppercase tracking-[ -0.05em] italic leading-[0.85]">Guru Bantu<br /><span className="text-blue-600">Guru</span></h1>
              <p className="text-xl md:text-3xl font-bold mt-8 italic tracking-tighter uppercase">Revolusi Asisten Pengajar AI</p>
            </motion.div>

            <motion.div style={{ opacity: promo1Opacity, y: promo1Y, ...glowStyle }} className="absolute z-10 text-center px-6">
              <h2 className="text-6xl md:text-9xl font-black uppercase italic tracking-tighter leading-none">Buat Soal<br />Otomatis</h2>
              <p className="mt-8 text-xl md:text-2xl font-black uppercase tracking-[0.2em] bg-blue-600 text-white inline-block px-4 py-1">Efficiency 10X</p>
            </motion.div>

            <motion.div style={{ opacity: promo2Opacity, y: promo2Y, ...glowStyle }} className="absolute z-10 text-center px-6">
              <h2 className="text-6xl md:text-9xl font-black uppercase italic tracking-tighter leading-none text-blue-600">Cerdas &<br /><span className="text-black">Personal</span></h2>
            </motion.div>
          </div>
        </section>

        {/* ================= CONTENT START ================= */}
        
        {/* STORY SECTION - DARK MODE LOOK */}
        <section className="relative z-20 bg-white text-black py-40 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-16 items-start">
              <div className="md:w-1/3 sticky top-32">
                <span className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-4 block underline decoration-4 underline-offset-8">The Origin</span>
                <h3 className="text-6xl font-black italic uppercase leading-none tracking-tighter">OUR <br /> STORY</h3>
              </div>
              <div className="md:w-2/3 space-y-12">
                <p className="text-4xl md:text-5xl font-bold leading-[1.1] tracking-tighter italic">
                  Lahir dari ruang kelas yang <span className="text-gray-300 italic">berdebu</span> dan sistem yang <span className="text-blue-600 underline">gaptek</span>.
                </p>
                <div className="grid md:grid-cols-2 gap-8 text-xl text-gray-600 font-medium leading-relaxed italic">
                  <p>Kami melihat guru-guru hebat kehabisan nafas. Bukan karena mendidik, tapi karena tenggelam dalam administrasi purba. Koreksi manual hingga fajar menyingsing adalah luka yang ingin kami sembuhkan.</p>
                  <p>GuruBantu adalah bentuk perlawanan kami. Membawa AI bukan untuk mengganti guru, tapi untuk memerdekakan waktu mereka agar bisa kembali menjadi inspirasi bagi murid.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* VISI MISI - BENTO STYLE */}
        <section className="relative z-20 bg-[#f8faff] py-32 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-blue-600 p-12 rounded-[50px] text-white flex flex-col justify-end min-h-[450px] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 text-8xl font-black opacity-10 group-hover:scale-110 transition-transform tracking-tighter">VISI</div>
              <h4 className="text-2xl font-bold uppercase tracking-widest mb-4">Visionary Goal</h4>
              <p className="text-4xl md:text-6xl font-black italic leading-none tracking-tighter italic">
                MEMERDEKAKAN WAKTU GURU DENGAN TEKNOLOGI ASISTENSI 24/7.
              </p>
            </div>
            <div className="bg-black p-12 rounded-[50px] text-white flex flex-col justify-between group">
              <span className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center text-2xl">⚡</span>
              <div>
                <h4 className="text-xl font-bold uppercase mb-4 text-blue-600">Misi Kami</h4>
                <p className="text-2xl font-bold italic leading-tight text-gray-300">Hapus "Sakit Kepala" saat menyusun soal & koreksi. Biarkan guru kembali fokus menyentuh hati siswa.</p>
              </div>
            </div>
          </div>
        </section>

        {/* PRODUK - MODERN CARD */}
        <section className="relative z-20 bg-white py-40 px-6">
          <div className="max-w-6xl mx-auto text-center mb-32">
            <h3 className="text-7xl md:text-[100px] font-black italic uppercase tracking-tighter leading-none mb-6">THE TOOLS</h3>
            <p className="text-xl font-bold text-blue-600 tracking-widest uppercase">Pilih Senjata Inovasi Anda</p>
          </div>

          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
            {/* PRODUCT 1 */}
            <motion.div whileHover={{ y: -20 }} className="relative group">
              <div className="bg-gray-100 aspect-[4/5] rounded-[60px] mb-10 overflow-hidden relative border-2 border-transparent group-hover:border-blue-600 transition-all flex items-center justify-center">
                 {/* FOTO PRODUK SOAL AI */}
                 <span className="text-gray-300 font-black italic uppercase text-2xl tracking-tighter">[ Upload Soal AI Image ]</span>
                 <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="px-4">
                <h4 className="text-5xl font-black italic uppercase mb-4 tracking-tighter">SOAL <span className="text-blue-600">AI</span></h4>
                <p className="text-xl text-gray-500 font-medium italic mb-8">Generator soal HOTS otomatis dari materi apapun dalam 5 detik.</p>
                <a href="#" className="inline-flex items-center gap-4 bg-black text-white px-10 py-5 rounded-full font-black uppercase italic tracking-tighter group-hover:bg-blue-600 transition-colors">
                  PLAY STORE <span className="text-2xl">→</span>
                </a>
              </div>
            </motion.div>

            {/* PRODUCT 2 */}
            <motion.div whileHover={{ y: -20 }} className="relative group md:mt-32">
              <div className="bg-gray-100 aspect-[4/5] rounded-[60px] mb-10 overflow-hidden relative border-2 border-transparent group-hover:border-blue-600 transition-all flex items-center justify-center">
                 {/* FOTO PRODUK JAWABAN AI */}
                 <span className="text-gray-300 font-black italic uppercase text-2xl tracking-tighter">[ Upload Jawaban AI Image ]</span>
                 <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="px-4">
                <h4 className="text-5xl font-black italic uppercase mb-4 tracking-tighter">JAWABAN <span className="text-blue-600">AI</span></h4>
                <p className="text-xl text-gray-500 font-medium italic mb-8">Scan lembar jawaban, berikan nilai instan tanpa satu pun kertas terlewat.</p>
                <a href="#" className="inline-flex items-center gap-4 bg-black text-white px-10 py-5 rounded-full font-black uppercase italic tracking-tighter group-hover:bg-blue-600 transition-colors">
                  PLAY STORE <span className="text-2xl">→</span>
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* KERJASAMA - MARQUEE LOOK */}
        <section className="relative z-20 bg-blue-600 py-32 overflow-hidden">
          <div className="flex whitespace-nowrap gap-16 animate-pulse opacity-50">
             {[1,2,3,4].map((i) => (
                <div key={i} className="flex gap-16 text-5xl font-black italic text-white uppercase tracking-tighter">
                  <span>KEMENDIKBUD</span> <span>PGRI</span> <span>GOOGLE FOR EDU</span> <span>UNESCO</span>
                </div>
             ))}
          </div>
        </section>

        {/* TESTIMONI - FLOATING BUBBLES */}
        <section className="relative z-20 bg-white py-40 px-6 overflow-hidden">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            {[
              { name: "Ibu Rahma", role: "Guru SMP", text: "GuruBantu bukan cuma aplikasi, ini adalah napas tambahan bagi saya." },
              { name: "Pak Junaidi", role: "Guru SD", text: "Koreksi soal sekelas kelar sambil minum kopi. Ajaib!" },
              { name: "Ibu Siska", role: "Guru SMA", text: "Gaptek bukan lagi alasan. UI-nya sangat memanjakan mata guru." }
            ].map((item, i) => (
              <motion.div key={i} whileInView={{ scale: [0.9, 1], opacity: [0, 1] }} className="p-12 bg-gray-50 rounded-[40px] hover:bg-black hover:text-white transition-all duration-500 group">
                <div className="text-blue-600 text-3xl mb-6 font-black group-hover:text-blue-400 italic">5.0 / 5.0</div>
                <p className="text-2xl font-bold italic mb-10 tracking-tight leading-tight">"{item.text}"</p>
                <div>
                  <h6 className="font-black uppercase tracking-tighter text-blue-600">{item.name}</h6>
                  <p className="text-xs font-bold opacity-50 uppercase tracking-widest">{item.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FOOTER & AI HELP - GLASSMORPHISM */}
        <footer className="relative z-20 bg-black text-white py-40 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-32 items-center">
              <div>
                <h3 className="text-8xl font-black italic uppercase leading-none mb-12 tracking-tighter">GET IN <br /><span className="text-blue-600">TOUCH.</span></h3>
                <div className="space-y-4 text-2xl font-bold italic">
                  <p className="hover:text-blue-600 cursor-pointer transition-colors">halo@gurubantu.ai</p>
                  <p className="hover:text-blue-600 cursor-pointer transition-colors">+62 812 3456 7890</p>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-xl p-12 rounded-[60px] border border-white/20 relative group">
                <div className="absolute -top-6 -left-6 bg-blue-600 h-20 w-20 rounded-full flex items-center justify-center text-3xl animate-bounce">🤖</div>
                <h4 className="text-4xl font-black italic uppercase mb-4 tracking-tighter">AI Support</h4>
                <p className="text-xl font-medium text-gray-400 italic mb-10">Punya kendala teknis? Biarkan rekan AI kami menyelesaikannya untuk Anda sekarang juga.</p>
                <button className="w-full bg-blue-600 text-white py-6 rounded-3xl font-black uppercase italic tracking-widest hover:bg-white hover:text-black transition-all">
                  TANYA GURUBANTU AI
                </button>
              </div>
            </div>
            
            <div className="mt-40 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 opacity-40 text-xs font-bold uppercase tracking-[0.4em]">
              <p>© 2026 GURUBANTU — FUTURE OF EDUCATION</p>
              <div className="flex gap-10">
                <span>Instagram</span> <span>Linkedin</span> <span>Twitter</span>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </main>
  );
}
