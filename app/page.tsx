"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // --- SLIDER PRODUK ---
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

  // --- CANVAS LOGIC ---
  const totalFrames = 194;
  const { scrollYProgress } = useScroll({ 
    target: containerRef, 
    offset: ["start start", "end end"] 
  });

  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, totalFrames - 1]);
  
  // Kontrol Opacity Teks Canvas
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
        if (loadedCount === 5) setIsLoaded(true);
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

  // Style untuk Box Putih Transparan (Desktop Optimized)
  const whiteBoxStyle = "bg-white/40 backdrop-blur-[6px] px-8 py-4 lg:px-16 lg:py-8 inline-block border border-white/60 shadow-2xl";
  const canvasTitleStyle = "text-black font-black italic uppercase leading-none tracking-tighter";

  return (
    <main className="relative w-full bg-black overflow-x-hidden">
      <style jsx global>{`
        html, body { background-color: black; margin: 0; padding: 0; overflow-x: hidden; scroll-behavior: smooth; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* HEADER & MENU */}
      <header className="fixed top-0 left-0 w-full z-[100] p-6 lg:p-12 flex justify-between items-center pointer-events-none">
        <div className="pointer-events-auto bg-black/40 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 shadow-xl">
          <h2 className="text-white font-black italic tracking-tighter text-2xl lg:text-4xl uppercase">GURUBANTUGURU</h2>
        </div>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          className="pointer-events-auto w-14 h-14 lg:w-20 lg:h-20 bg-white rounded-full flex flex-col items-center justify-center gap-2 shadow-2xl relative z-[110] hover:scale-110 transition-transform"
        >
          <motion.span animate={isMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }} className="w-7 lg:w-10 h-1 bg-black block" />
          <motion.span animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }} className="w-7 lg:w-10 h-1 bg-black block" />
          <motion.span animate={isMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }} className="w-7 lg:w-10 h-1 bg-black block" />
        </button>
      </header>

      {/* MENU OVERLAY */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: "100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: "100%" }} 
            className="fixed inset-0 z-[90] bg-white flex flex-col items-center justify-center gap-12"
          >
            {['Home', 'Our Story', 'Produk', 'Testimoni', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} onClick={() => setIsMenuOpen(false)} 
                 className="text-5xl lg:text-8xl font-black italic uppercase text-black hover:text-blue-600 transition-all">
                {item}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* CANVAS SECTION (HERO) */}
      <div ref={containerRef} className="relative h-[600vh] w-full">
        <div className="fixed top-0 left-0 w-full h-screen z-0 overflow-hidden bg-black">
          <canvas ref={canvasRef} className="w-full h-full object-cover" />
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
            
            {/* Teks 1: Utama + Tagline */}
            <motion.div style={{ opacity: text1Opacity }} className="absolute flex flex-col items-center gap-6">
              <div className={whiteBoxStyle}>
                <h1 className={`${canvasTitleStyle} text-5xl md:text-8xl lg:text-[12rem]`}>GURUBANTUGURU</h1>
              </div>
              <div className="bg-black/80 px-6 py-2 lg:px-10 lg:py-4 backdrop-blur-md border border-white/20">
                 <p className="text-white font-bold tracking-[0.4em] uppercase text-xs md:text-xl lg:text-3xl">Asisten AI Untuk Guru Indonesia</p>
              </div>
            </motion.div>

            {/* Teks 2 */}
            <motion.div style={{ opacity: text2Opacity }} className="absolute w-full px-6 flex flex-col items-center gap-6">
              <div className={whiteBoxStyle}><h2 className={`${canvasTitleStyle} text-3xl md:text-7xl lg:text-9xl`}>Merubah Kebiasaan</h2></div>
              <div className={whiteBoxStyle}><h2 className={`${canvasTitleStyle} text-3xl md:text-7xl lg:text-9xl`}>Yang Lama</h2></div>
            </motion.div>

            {/* Teks 3 */}
            <motion.div style={{ opacity: text3Opacity }} className="absolute w-full px-6 flex flex-col items-center gap-6">
              <div className={whiteBoxStyle}><h2 className={`${canvasTitleStyle} text-3xl md:text-7xl lg:text-9xl`}>Menjadi Lebih Modern</h2></div>
              <div className={whiteBoxStyle}><h2 className={`${canvasTitleStyle} text-3xl md:text-7xl lg:text-9xl`}>Dan Efisien</h2></div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* CONTENT WHITE SECTION (DESKTOP OPTIMIZED) */}
      <div className="relative z-20 w-full bg-white shadow-[0_-50px_100px_rgba(0,0,0,0.5)]">
        
        {/* OUR STORY */}
        <section id="our-story" className="w-full px-8 py-40 lg:py-64 text-center max-w-7xl mx-auto">
            <h2 className="text-6xl lg:text-[10rem] font-black italic uppercase mb-20 tracking-tighter">Our Story</h2>
            <div className="space-y-12">
              <p className="text-2xl lg:text-5xl font-bold text-blue-900 italic">"Mimpi sederhana untuk masa depan pendidikan."</p>
              <p className="text-xl lg:text-3xl leading-relaxed text-gray-700 max-w-5xl mx-auto">Kami menyaksikan lelahnya mata para guru di balik tumpukan kertas. Kami hadir untuk meruntuhkan sekat rumit itu dan menggantinya dengan teknologi AI yang memanusiakan tugas pendidik.</p>
            </div>
        </section>

        {/* VISI MISI */}
        <section id="visi-misi" className="w-full px-8 py-32 bg-gray-50">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
            <div className="p-12 lg:p-20 bg-white border-l-[15px] border-blue-600 rounded-3xl shadow-2xl">
              <h3 className="text-5xl lg:text-7xl font-black italic uppercase mb-8">Visi</h3>
              <p className="text-xl lg:text-3xl italic text-gray-600">Menjadi pusat transformasi digital pendidikan yang mengedepankan empati teknologi bagi guru.</p>
            </div>
            <div className="p-12 lg:p-20 bg-white border-l-[15px] border-blue-600 rounded-3xl shadow-2xl">
              <h3 className="text-5xl lg:text-7xl font-black italic uppercase mb-8">Misi</h3>
              <p className="text-xl lg:text-3xl italic text-gray-600">Membangun AI inklusif untuk menyederhanakan proses mengajar secara revolusioner di Indonesia.</p>
            </div>
          </div>
        </section>

        {/* PRODUK (FULL DESKTOP VIEW) */}
        <section id="produk" className="w-full px-8 py-40 bg-[#eef6ff]">
          <div className="max-w-[1500px] mx-auto">
            <h2 className="text-6xl lg:text-[10rem] font-black italic uppercase mb-32 text-center tracking-tighter">Produk Kami</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
              {/* SOAL AI */}
              <div className="bg-white rounded-[4rem] p-12 lg:p-20 shadow-2xl border border-blue-100">
                <h3 className="text-6xl lg:text-8xl font-black italic uppercase mb-6 text-black">SOAL <span className="text-blue-600">AI</span></h3>
                <p className="text-gray-600 text-xl lg:text-3xl mb-12 italic">Buat soal ujian otomatis sesuai kurikulum SD, SMP, & SMA hanya dalam hitungan detik.</p>
                <div className="relative w-full h-[500px] lg:h-[700px] overflow-hidden rounded-[3rem] bg-gray-100 mb-12 shadow-inner">
                  <motion.div animate={{ x: `-${soalIndex * 100}%` }} transition={{ duration: 0.8 }} className="flex w-full h-full">
                    <img src="/soal-ai-1.jpg" className="w-full h-full object-cover flex-shrink-0" />
                    <img src="/soal-ai-2.jpg" className="w-full h-full object-cover flex-shrink-0" />
                    <img src="/soal-ai-3.jpg" className="w-full h-full object-cover flex-shrink-0" />
                  </motion.div>
                </div>
                <button className="bg-black hover:bg-blue-600 text-white text-xl font-bold py-6 px-12 rounded-full transition-all">GET IT ON PLAYSTORE</button>
              </div>

              {/* JAWABAN AI */}
              <div className="bg-[#0f172a] rounded-[4rem] p-12 lg:p-20 shadow-2xl text-white">
                <h3 className="text-6xl lg:text-8xl font-black italic uppercase mb-6">JAWABAN <span className="text-blue-400">AI</span></h3>
                <p className="text-blue-100/70 text-xl lg:text-3xl mb-12 italic">Teknologi koreksi ujian otomatis untuk efisiensi waktu mengajar yang maksimal.</p>
                <div className="relative w-full h-[500px] lg:h-[700px] overflow-hidden rounded-[3rem] bg-black/40 mb-12 shadow-inner">
                  <motion.div animate={{ x: `-${jawabanIndex * 100}%` }} transition={{ duration: 0.8 }} className="flex w-full h-full">
                    <img src="/jawaban-ai-1.jpg" className="w-full h-full object-cover flex-shrink-0" />
                    <img src="/jawaban-ai-2.jpg" className="w-full h-full object-cover flex-shrink-0" />
                    <img src="/jawaban-ai-3.jpg" className="w-full h-full object-cover flex-shrink-0" />
                  </motion.div>
                </div>
                <button className="bg-blue-600 hover:bg-white hover:text-black text-white text-xl font-bold py-6 px-12 rounded-full transition-all">GET IT ON PLAYSTORE</button>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONI */}
        <section id="testimoni" className="w-full px-8 py-40 bg-white">
            <h2 className="text-6xl lg:text-[10rem] font-black italic uppercase mb-32 text-center tracking-tighter">Testimoni</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-[1400px] mx-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-50 p-16 rounded-[3rem] border-2 border-transparent hover:border-blue-500 transition-all shadow-sm">
                  <p className="text-2xl italic text-gray-700 mb-12">"Sangat membantu efisiensi waktu saya dalam mengajar setiap harinya. Luar biasa!"</p>
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-3xl font-bold">G</div>
                    <div><h4 className="font-bold text-2xl">Guru Indonesia {i}</h4><p className="text-lg opacity-50">Pengajar Aktif</p></div>
                  </div>
                </div>
              ))}
            </div>
        </section>

        {/* CONTACT US */}
        <section id="contact" className="w-full px-8 py-32 bg-white border-t border-gray-100">
          <div className="max-w-[1200px] mx-auto text-center">
            <h2 className="text-6xl lg:text-[8rem] font-black italic uppercase mb-24">Contact Us</h2>
            <div className="flex flex-col md:flex-row justify-center gap-32">
              <div className="flex flex-col gap-10">
                <h4 className="text-xl font-black text-blue-600 tracking-[0.5em] uppercase">Social Media</h4>
                <div className="flex gap-8 justify-center">
                  {['/logo-fb.png', '/logo-ig.png', '/logo-threads.png'].map(src => (
                    <img key={src} src={src} className="w-24 h-24 object-contain hover:scale-125 transition-transform cursor-pointer shadow-lg rounded-2xl p-4 bg-white" />
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-10">
                <h4 className="text-xl font-black text-blue-600 tracking-[0.5em] uppercase">Direct Message</h4>
                <div className="flex gap-8 justify-center">
                  {['/logo-wa.png', '/logo-email.png'].map(src => (
                    <img key={src} src={src} className="w-24 h-24 object-contain hover:scale-125 transition-transform cursor-pointer shadow-lg rounded-2xl p-4 bg-white" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="py-24 text-center opacity-40 font-black text-lg tracking-[0.8em] text-blue-900">
          © 2026 GURU BANTU GURU
        </footer>
      </div>
    </main>
  );
}

