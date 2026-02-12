"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // --- 🛡️ SISTEM PERTAHANAN ---
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "F12" || 
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C")) ||
        (e.ctrlKey && e.key === "U")
      ) {
        e.preventDefault();
      }
    };
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // --- 🖼️ LOGIK SLIDER PRODUK ---
  const [soalIndex, setSoalIndex] = useState(0);
  const [jawabanIndex, setJawabanIndex] = useState(0);
  const totalSlides = 3;

  useEffect(() => {
    const timer = setInterval(() => {
      setSoalIndex((prev) => (prev + 1) % totalSlides);
      setJawabanIndex((prev) => (prev + 1) % totalSlides);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // --- 🎥 CANVAS VIDEO SCROLL LOGIC ---
  const totalFrames = 194;
  const { scrollYProgress } = useScroll({ 
    target: containerRef, 
    offset: ["start start", "end end"] 
  });

  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, totalFrames - 1]);
  const text1Opacity = useTransform(scrollYProgress, [0, 0.1, 0.2], [1, 1, 0]);
  const text2Opacity = useTransform(scrollYProgress, [0.35, 0.5, 0.6], [0, 1, 0]);
  const text3Opacity = useTransform(scrollYProgress, [0.75, 0.85, 0.95], [0, 1, 0]);

  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;
    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      img.src = `/ezgif-frame-${i.toString().padStart(3, '0')}.jpg`;
      img.onload = () => {
        loadedCount++;
        if (loadedCount >= 10) setIsLoaded(true); // Mulai munculkan konten setelah 10 frame terload
      };
      loadedImages[i - 1] = img;
    }
    setImages(loadedImages);
  }, []);

  const draw = (img: HTMLImageElement, context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
    const x = (canvas.width / 2) - (img.width / 2) * scale;
    const y = (canvas.height / 2) - (img.height / 2) * scale;
    context.drawImage(img, x, y, img.width * scale, img.height * scale);
  };

  useEffect(() => {
    if (!canvasRef.current || images.length === 0) return;
    const context = canvasRef.current.getContext("2d", { alpha: false });
    if (!context) return;
    const unsubscribe = frameIndex.on("change", (latest) => {
      const img = images[Math.floor(latest)];
      if (img && img.complete) requestAnimationFrame(() => draw(img, context, canvasRef.current!));
    });
    if (images[0]) draw(images[0], context, canvasRef.current);
    return () => unsubscribe();
  }, [images, frameIndex]);

  const whiteBoxStyle = "bg-white/40 backdrop-blur-[8px] px-6 py-3 lg:px-10 lg:py-5 inline-block border border-white/60 shadow-2xl";
  const canvasTitleStyle = "text-black font-black italic uppercase leading-none tracking-tighter";

  return (
    <main className="relative w-full bg-black overflow-x-hidden selection:bg-blue-500 selection:text-white">
      <style jsx global>{`
        html, body { background-color: black; margin: 0; padding: 0; overflow-x: hidden; scroll-behavior: smooth; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* HEADER & NAV */}
      <header className="fixed top-0 left-0 w-full z-[100] p-6 lg:p-10 flex justify-between items-center pointer-events-none">
        <div className="pointer-events-auto bg-black/40 backdrop-blur-md px-5 py-2 rounded-2xl border border-white/10">
          <h2 className="text-white font-black italic tracking-tighter text-xl lg:text-2xl uppercase">GURUBANTUGURU</h2>
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="pointer-events-auto w-12 h-12 lg:w-16 lg:h-16 bg-white rounded-full flex flex-col items-center justify-center gap-2 shadow-2xl relative z-[110] hover:scale-105 transition-transform">
          <motion.span animate={isMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }} className="w-6 lg:w-8 h-1 bg-black block" />
          <motion.span animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }} className="w-6 lg:w-8 h-1 bg-black block" />
          <motion.span animate={isMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }} className="w-6 lg:w-8 h-1 bg-black block" />
        </button>
      </header>

      {/* MENU OVERLAY */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] bg-white flex flex-col items-center justify-center gap-8">
            {['Home', 'Our Story', 'Produk', 'Testimoni', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} onClick={() => setIsMenuOpen(false)} className="text-4xl lg:text-7xl font-black italic uppercase text-black hover:text-blue-600 transition-all tracking-tighter">{item}</a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO CANVAS SECTION */}
      <div ref={containerRef} className="relative h-[600vh] w-full">
        <div className="fixed top-0 left-0 w-full h-screen z-0 overflow-hidden bg-black">
          <canvas ref={canvasRef} className="w-full h-full object-cover opacity-80" />
          
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
            
            {/* TEXT GROUP 1 */}
            <motion.div style={{ opacity: text1Opacity }} className="absolute flex flex-col items-center gap-6">
              <div className={whiteBoxStyle}>
                <h1 className={`${canvasTitleStyle} text-4xl md:text-7xl lg:text-[8rem]`}>GURUBANTUGURU</h1>
              </div>
              
              <div className="bg-blue-600 px-6 py-2 lg:px-10 lg:py-4 shadow-xl transform -rotate-1 flex flex-col items-center gap-4">
                 <p className="text-white font-black tracking-[0.3em] uppercase text-xs md:text-lg lg:text-xl">Asisten AI Untuk Guru Indonesia</p>
                 
                 {/* 🟢 POIN: SPINNER LOADING HANYA MUNCUL SAAT BELUM LOADED */}
                 {!isLoaded && (
                   <div className="flex flex-col items-center gap-2">
                     <motion.div 
                        animate={{ rotate: 360 }} 
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                     />
                     <span className="text-[10px] text-white/70 font-bold tracking-widest animate-pulse">LOADING DATA...</span>
                   </div>
                 )}
              </div>
            </motion.div>

            {/* TEXT GROUP 2 */}
            <motion.div style={{ opacity: text2Opacity }} className="absolute w-full px-6 flex flex-col items-center gap-5">
              <div className={whiteBoxStyle}><h2 className={`${canvasTitleStyle} text-2xl md:text-6xl lg:text-[6rem]`}>Merubah Kebiasaan</h2></div>
              <div className={whiteBoxStyle}><h2 className={`${canvasTitleStyle} text-2xl md:text-6xl lg:text-[6rem]`}>Yang Lama</h2></div>
            </motion.div>

            {/* TEXT GROUP 3 */}
            <motion.div style={{ opacity: text3Opacity }} className="absolute w-full px-6 flex flex-col items-center gap-5">
              <div className={whiteBoxStyle}><h2 className={`${canvasTitleStyle} text-2xl md:text-6xl lg:text-[6rem]`}>Menjadi Lebih Modern</h2></div>
              <div className={whiteBoxStyle}><h2 className={`${canvasTitleStyle} text-2xl md:text-6xl lg:text-[6rem]`}>Dan Efisien</h2></div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* --- SECTION BAWAH TETAP SAMA --- */}
      <div className="relative z-20 w-full bg-white">
        
        {/* OUR STORY */}
        <section id="our-story" className="w-full px-8 py-32 lg:py-56 text-center max-w-7xl mx-auto">
            <h2 className="text-5xl lg:text-8xl font-black italic uppercase mb-16 tracking-tighter">Our Story</h2>
            <div className="space-y-10">
              <p className="text-xl lg:text-3xl font-black text-blue-900 italic uppercase">"Mimpi sederhana membantu guru."</p>
              <p className="text-lg lg:text-2xl leading-relaxed text-gray-700 max-w-5xl mx-auto font-light">Kami menyaksikan lelahnya mata para guru di balik tumpukan kertas. Kami berangkat untuk meruntuhkan sekat rumit itu dan menggantinya dengan keajaiban teknologi yang memanusiakan.</p>
            </div>
        </section>

        {/* VISI MISI */}
        <section id="visi-misi" className="w-full px-8 py-24 bg-gray-50">
          <div className="max-w-[1300px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20">
            <div className="p-10 lg:p-16 bg-white border-l-[15px] border-blue-600 rounded-2xl shadow-xl">
              <h3 className="text-4xl lg:text-6xl font-black italic uppercase mb-6">Visi</h3>
              <p className="text-lg lg:text-2xl italic text-gray-600 font-light">Menjadi episentrum transformasi digital pendidikan di Indonesia yang mengedepankan empati teknologi.</p>
            </div>
            <div className="p-10 lg:p-16 bg-white border-l-[15px] border-blue-600 rounded-2xl shadow-xl">
              <h3 className="text-4xl lg:text-6xl font-black italic uppercase mb-6">Misi</h3>
              <p className="text-lg lg:text-2xl italic text-gray-600 font-light">Membangun teknologi inklusif untuk menyederhanakan proses mengajar secara revolusioner.</p>
            </div>
          </div>
        </section>

        {/* PRODUK */}
        <section id="produk" className="w-full px-8 py-32 bg-[#eef6ff]">
          <div className="max-w-[1500px] mx-auto">
            <h2 className="text-6xl lg:text-9xl font-black italic uppercase mb-24 text-center tracking-tighter">Produk Kami</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
              <div className="bg-white rounded-[3.5rem] p-10 lg:p-14 shadow-2xl border border-blue-100">
                <h3 className="text-5xl lg:text-7xl font-black italic uppercase mb-5 tracking-tighter">SOAL <span className="text-blue-600">AI</span></h3>
                <p className="text-gray-600 text-lg lg:text-2xl mb-10 italic font-light">Asisten cerdas untuk membuat soal ujian berkualitas secara instan bagi SD, SMP, hingga SMA.</p>
                <div className="relative w-full h-[400px] lg:h-[600px] overflow-hidden rounded-[2.5rem] bg-gray-100 mb-10 shadow-inner">
                  <motion.div animate={{ x: `-${soalIndex * 100}%` }} transition={{ duration: 0.8 }} className="flex w-full h-full">
                    <img src="/soal-ai-1.jpg" className="w-full h-full object-cover flex-shrink-0" alt="Soal AI 1" />
                    <img src="/soal-ai-2.jpg" className="w-full h-full object-cover flex-shrink-0" alt="Soal AI 2" />
                    <img src="/soal-ai-3.jpg" className="w-full h-full object-cover flex-shrink-0" alt="Soal AI 3" />
                  </motion.div>
                </div>
                <a href="#"><img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" className="h-16 lg:h-20" /></a>
              </div>
              <div className="bg-[#0f172a] rounded-[3.5rem] p-10 lg:p-14 shadow-2xl text-white">
                <h3 className="text-5xl lg:text-7xl font-black italic uppercase mb-5 tracking-tighter">JAWABAN <span className="text-blue-400">AI</span></h3>
                <p className="text-blue-100/70 text-lg lg:text-2xl mb-10 italic font-light">Koreksi ujian otomatis secepat kilat. Membantu guru menghemat ribuan jam kerja.</p>
                <div className="relative w-full h-[400px] lg:h-[600px] overflow-hidden rounded-[2.5rem] bg-black/40 mb-10 shadow-inner">
                  <motion.div animate={{ x: `-${jawabanIndex * 100}%` }} transition={{ duration: 0.8 }} className="flex w-full h-full">
                    <img src="/jawaban-ai-1.jpg" className="w-full h-full object-cover flex-shrink-0" alt="Jawaban AI 1" />
                    <img src="/jawaban-ai-2.jpg" className="w-full h-full object-cover flex-shrink-0" alt="Jawaban AI 2" />
                    <img src="/jawaban-ai-3.jpg" className="w-full h-full object-cover flex-shrink-0" alt="Jawaban AI 3" />
                  </motion.div>
                </div>
                <a href="#"><img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" className="h-16 lg:h-20 bg-white/10 p-1 rounded-lg" /></a>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONI */}
        <section id="testimoni" className="w-full px-8 py-32 bg-white">
            <h2 className="text-6xl lg:text-9xl font-black italic uppercase mb-24 text-center tracking-tighter">Testimoni</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-[1400px] mx-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-50 p-10 lg:p-12 rounded-[3rem] shadow-lg border hover:border-blue-500 transition-all">
                  <p className="text-xl lg:text-2xl italic text-gray-700 mb-10">"Sangat membantu efisiensi waktu saya dalam mengajar setiap harinya."</p>
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 bg-blue-100 rounded-full flex items-center justify-center text-3xl font-bold text-blue-600">G</div>
                    <div><h4 className="font-bold text-xl lg:text-2xl">Guru Indonesia {i}</h4><p className="text-lg opacity-50">Pengajar Aktif</p></div>
                  </div>
                </div>
              ))}
            </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="w-full px-8 py-32 bg-white border-t">
          <div className="max-w-[1200px] mx-auto text-center">
            <h2 className="text-5xl lg:text-8xl font-black italic uppercase mb-20 tracking-tighter">Contact Us</h2>
            <div className="flex flex-col md:flex-row justify-center gap-16 lg:gap-24">
              <div className="flex flex-col gap-8">
                <h4 className="text-sm lg:text-lg font-black text-blue-600 tracking-[0.4em] uppercase">Social Media</h4>
                <div className="flex gap-6 lg:gap-8 justify-center">
                  {['/logo-fb.png', '/logo-ig.png', '/logo-threads.png'].map(src => (
                    <img key={src} src={src} className="w-16 h-16 lg:w-24 lg:h-24 object-contain hover:scale-110 transition-transform cursor-pointer shadow-xl rounded-3xl p-4 lg:p-5 bg-white border" />
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-8">
                <h4 className="text-sm lg:text-lg font-black text-blue-600 tracking-[0.4em] uppercase">Direct Message</h4>
                <div className="flex gap-6 lg:gap-8 justify-center">
                  {['/logo-wa.png', '/logo-email.png'].map(src => (
                    <img key={src} src={src} className="w-16 h-16 lg:w-24 lg:h-24 object-contain hover:scale-110 transition-transform cursor-pointer shadow-xl rounded-3xl p-4 lg:p-5 bg-white border" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="py-20 text-center opacity-30 font-black text-sm lg:text-lg tracking-[0.8em] text-blue-900 uppercase">
          © 2026 GURU BANTU GURU • Secured
        </footer>
      </div>
    </main>
  );
}
