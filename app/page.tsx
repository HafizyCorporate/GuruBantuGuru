"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // --- LOGIK AI CHAT ---
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', text: 'Halo Bapak/Ibu Guru! 👋 Ada yang bisa saya bantu terkait Soal AI atau Jawaban AI?' }
  ]);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput("");
    setTimeout(() => {
      setChatMessages(prev => [...prev, { role: 'ai', text: "Terima kasih! Pesan Anda telah kami terima. Admin akan segera membalas atau Anda bisa klik ikon WA di bagian Contact." }]);
    }, 1000);
  };

  // --- SLIDER PRODUK (MENGGUNAKAN FILE ANDA) ---
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

  // --- CANVAS ANIMATION ---
  const totalFrames = 194;
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, totalFrames - 1]);
  
  const text1Opacity = useTransform(scrollYProgress, [0, 0.1, 0.15], [1, 1, 0]);
  const text2Opacity = useTransform(scrollYProgress, [0.3, 0.4, 0.5], [0, 1, 0]);
  const text3Opacity = useTransform(scrollYProgress, [0.7, 0.8, 0.9], [0, 1, 0]);

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

  const whiteBoxStyle = "bg-white/40 backdrop-blur-[4px] px-6 py-2 lg:px-12 lg:py-6 inline-block border border-white/60 shadow-lg";
  const canvasTitleStyle = "text-black font-black italic uppercase leading-none tracking-tighter";

  return (
    <main className="relative w-full bg-black overflow-x-hidden">
      <style jsx global>{`
        html, body { background-color: black; margin: 0; padding: 0; overflow-x: hidden; scroll-behavior: smooth; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* NAV */}
      <header className="fixed top-0 left-0 w-full z-[90] p-6 lg:p-10 flex justify-between items-center pointer-events-none">
        <div className="pointer-events-auto bg-black/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
          <h2 className="text-white font-black italic tracking-tighter text-xl lg:text-3xl uppercase">GURUBANTUGURU</h2>
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="pointer-events-auto w-12 h-12 lg:w-16 lg:h-16 bg-white rounded-full flex flex-col items-center justify-center gap-1.5 shadow-2xl z-[100]">
          <motion.span animate={isMenuOpen ? { rotate: 45, y: 6.5 } : { rotate: 0, y: 0 }} className="w-6 lg:w-8 h-0.5 bg-black block" />
          <motion.span animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }} className="w-6 lg:w-8 h-0.5 bg-black block" />
          <motion.span animate={isMenuOpen ? { rotate: -45, y: -6.5 } : { rotate: 0, y: 0 }} className="w-6 lg:w-8 h-0.5 bg-black block" />
        </button>
      </header>

      {/* CANVAS HERO */}
      <div ref={containerRef} className="relative h-[600vh] w-full">
        <div className="fixed top-0 left-0 w-full h-screen z-0 overflow-hidden bg-black">
          <canvas ref={canvasRef} className="w-full h-full object-cover" />
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
            <motion.div style={{ opacity: text1Opacity }} className="absolute flex flex-col items-center">
              <div className={whiteBoxStyle}><h1 className={`${canvasTitleStyle} text-5xl md:text-8xl lg:text-[11rem]`}>GURUBANTUGURU</h1></div>
            </motion.div>
            <motion.div style={{ opacity: text2Opacity }} className="absolute w-full px-6 flex flex-col items-center gap-4">
              <div className={whiteBoxStyle}><h2 className={`${canvasTitleStyle} text-3xl md:text-7xl lg:text-9xl`}>Merubah Kebiasaan</h2></div>
            </motion.div>
            <motion.div style={{ opacity: text3Opacity }} className="absolute w-full px-6 flex flex-col items-center gap-4">
              <div className={whiteBoxStyle}><h2 className={`${canvasTitleStyle} text-3xl md:text-7xl lg:text-9xl`}>Menjadi Efisien</h2></div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="relative z-20 w-full bg-white">
        
        {/* OUR STORY */}
        <section id="our-story" className="w-full px-6 py-32 lg:py-52 text-center max-w-7xl mx-auto">
            <h2 className="text-5xl md:text-7xl lg:text-9xl font-black italic tracking-tighter text-black uppercase mb-16">Our Story</h2>
            <div className="space-y-10 text-black px-4 text-xl lg:text-4xl leading-relaxed font-light italic">
              <p className="font-semibold text-blue-900/80">"Berawal dari mimpi sederhana di tengah keterbatasan teknologi..."</p>
              <p className="not-italic text-gray-700 lg:max-w-5xl lg:mx-auto">Kami menyaksikan lelahnya mata para guru di balik tumpukan kertas. Kami berangkat untuk meruntuhkan sekat rumit itu dan menggantinya dengan keajaiban teknologi yang memanusiakan.</p>
            </div>
        </section>

        {/* VISI & MISI */}
        <section id="visi-misi" className="w-full px-6 py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20">
            <div className="p-10 bg-white border-l-[12px] border-blue-600 rounded-2xl shadow-xl">
              <h3 className="text-4xl lg:text-6xl font-black italic uppercase mb-6 tracking-tighter text-black">Visi</h3>
              <p className="text-lg lg:text-2xl text-gray-700 leading-relaxed italic">Menjadi episentrum transformasi digital pendidikan di Indonesia yang mengedepankan empati teknologi bagi seluruh pendidik.</p>
            </div>
            <div className="p-10 bg-white border-l-[12px] border-blue-600 rounded-2xl shadow-xl">
              <h3 className="text-4xl lg:text-6xl font-black italic uppercase mb-6 tracking-tighter text-black">Misi</h3>
              <p className="text-lg lg:text-2xl text-gray-700 leading-relaxed italic">Membangun teknologi inklusif untuk menyederhanakan proses mengajar secara revolusioner dan mendemokrasikan akses AI.</p>
            </div>
          </div>
        </section>

        {/* PRODUK KAMI (DENGAN SLIDER GAMBAR ASLI) */}
        <section id="produk" className="w-full px-6 py-32 lg:py-52 bg-[#eef6ff]">
          <div className="max-w-7xl lg:max-w-[1400px] mx-auto">
            <h2 className="text-5xl md:text-7xl lg:text-9xl font-black italic tracking-tighter text-black uppercase mb-20 lg:mb-32 text-center">Produk Kami</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                
                {/* SOAL AI */}
                <div className="bg-white rounded-[3rem] p-10 lg:p-16 shadow-2xl border border-blue-100 flex flex-col">
                   <h3 className="text-5xl lg:text-7xl font-black italic uppercase mb-4 text-black tracking-tighter">SOAL <span className="text-blue-600">AI</span></h3>
                   <p className="text-gray-600 lg:text-2xl font-medium mb-10 leading-relaxed italic">AI yang menjadi asisten para guru untuk membuat soal secara instan! Khusus diatur untuk jenjang SD, SMP, dan SMA.</p>
                   <div className="relative w-full h-[450px] lg:h-[650px] overflow-hidden rounded-[2rem] bg-gray-50 mb-10 shadow-inner">
                      <motion.div animate={{ x: `-${soalIndex * 100}%` }} transition={{ duration: 0.8 }} className="flex w-full h-full">
                        <img src="/soal-ai-1.jpg" className="w-full h-full object-cover flex-shrink-0" />
                        <img src="/soal-ai-2.jpg" className="w-full h-full object-cover flex-shrink-0" />
                        <img src="/soal-ai-3.jpg" className="w-full h-full object-cover flex-shrink-0" />
                      </motion.div>
                   </div>
                   <a href="https://play.google.com/store/apps/details?id=com.soal.ai" target="_blank" className="w-fit hover:scale-105 transition-transform">
                     <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-14 lg:h-20" />
                   </a>
                </div>

                {/* JAWABAN AI */}
                <div className="bg-[#0f172a] rounded-[3rem] p-10 lg:p-16 shadow-2xl text-white flex flex-col">
                   <h3 className="text-5xl lg:text-7xl font-black italic uppercase mb-4 tracking-tighter">JAWABAN <span className="text-blue-400">AI</span></h3>
                   <p className="text-blue-100/70 lg:text-2xl font-medium mb-10 leading-relaxed italic">Lelah memeriksa tumpukan kertas ujian setiap malam? JAWABAN AI dirancang khusus untuk membantu koreksi otomatis secara akurat.</p>
                   <div className="relative w-full h-[450px] lg:h-[650px] overflow-hidden rounded-[2rem] bg-black/20 mb-10 shadow-inner">
                      <motion.div animate={{ x: `-${jawabanIndex * 100}%` }} transition={{ duration: 0.8 }} className="flex w-full h-full">
                        <img src="/jawaban-ai-1.jpg" className="w-full h-full object-cover flex-shrink-0" />
                        <img src="/jawaban-ai-2.jpg" className="w-full h-full object-cover flex-shrink-0" />
                        <img src="/jawaban-ai-3.jpg" className="w-full h-full object-cover flex-shrink-0" />
                      </motion.div>
                   </div>
                   <a href="https://play.google.com/store/apps/details?id=com.jawaban.ai" target="_blank" className="w-fit bg-white/10 p-1 rounded-xl hover:scale-105 transition-transform">
                     <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-14 lg:h-20" />
                   </a>
                </div>
            </div>
          </div>
        </section>

        {/* TESTIMONI */}
        <section id="testimoni" className="w-full px-6 py-32 lg:py-52 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-5xl md:text-7xl lg:text-9xl font-black italic tracking-tighter text-black uppercase mb-20 text-center">Testimoni</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-10 bg-gray-50 rounded-[2.5rem] border-2 border-transparent hover:border-blue-500 transition-all">
                  <p className="text-xl lg:text-2xl italic text-gray-600 mb-10">"Sangat membantu efisiensi waktu saya dalam mengajar setiap harinya. Guru jadi lebih kreatif!"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center font-bold">G</div>
                    <div><h4 className="font-bold lg:text-xl">Guru {i}</h4><p className="text-sm opacity-50">Pengajar Aktif</p></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT US (LOGO LENGKAP) */}
        <section id="contact" className="w-full px-6 py-24 lg:py-44 bg-white border-t border-gray-100">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl lg:text-8xl font-black italic tracking-tighter text-black uppercase mb-20">Contact Us</h2>
            <div className="flex flex-col md:flex-row justify-center items-center gap-12 lg:gap-40">
              <div className="flex flex-col items-center gap-6">
                <h4 className="text-xs font-black tracking-[0.4em] text-blue-600 uppercase">Social Media</h4>
                <div className="flex gap-6">
                  {['/logo-fb.png', '/logo-ig.png', '/logo-threads.png'].map((src, idx) => (
                    <a key={idx} href="#" className="w-16 h-16 lg:w-20 lg:h-20 bg-gray-50 rounded-2xl flex items-center justify-center border hover:scale-110 transition-transform">
                      <img src={src} className="w-8 h-8 lg:w-10 lg:h-10 object-contain" />
                    </a>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-center gap-6">
                <h4 className="text-xs font-black tracking-[0.4em] text-blue-600 uppercase">Direct Message</h4>
                <div className="flex gap-6">
                  {['/logo-wa.png', '/logo-email.png'].map((src, idx) => (
                    <a key={idx} href="#" className="w-16 h-16 lg:w-20 lg:h-20 bg-gray-50 rounded-2xl flex items-center justify-center border hover:scale-110 transition-transform">
                      <img src={src} className="w-8 h-8 lg:w-10 lg:h-10 object-contain" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="py-20 text-center opacity-40 font-black uppercase tracking-[0.5em] text-[10px] lg:text-sm text-blue-900">
          © 2026 GURU BANTU GURU
        </footer>
      </div>

      {/* FLOATING CHAT AI */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
              className="mb-4 w-[320px] lg:w-[450px] bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden flex flex-col">
              <div className="bg-blue-600 p-6 text-white font-bold flex items-center gap-3">🤖 <span>AI GuruBantuGuru</span></div>
              <div className="p-6 h-[300px] overflow-y-auto bg-gray-50 flex flex-col gap-4 scrollbar-hide">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`${msg.role === 'ai' ? 'bg-blue-100 self-start text-blue-900' : 'bg-blue-600 self-end text-white'} p-4 rounded-2xl text-sm max-w-[85%] shadow-sm`}>{msg.text}</div>
                ))}
              </div>
              <div className="p-4 bg-white flex gap-2">
                <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} className="flex-1 bg-gray-100 rounded-full px-4 py-2 outline-none text-black" placeholder="Tanya sesuatu..." />
                <button onClick={handleSendMessage} className="bg-blue-600 text-white p-2 rounded-full w-10 h-10 flex items-center justify-center">➤</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <button onClick={() => setIsChatOpen(!isChatOpen)} className="w-16 h-16 lg:w-20 lg:h-20 bg-blue-600 rounded-full shadow-2xl flex items-center justify-center text-white text-2xl font-bold transition-transform hover:scale-110">
          {isChatOpen ? '✕' : '💬'}
        </button>
      </div>
    </main>
  );
}
