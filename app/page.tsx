"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // --- LOGIK FRONTEND API AI ---
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', text: 'Halo Bapak/Ibu Guru! 👋 Saya AI Assistant. Ada yang bisa saya bantu terkait Soal AI atau Jawaban AI?' }
  ]);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput("");
    setIsTyping(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      setChatMessages(prev => [...prev, { role: 'ai', text: data.text }]);
    } catch (e) {
      setChatMessages(prev => [...prev, { role: 'ai', text: "Maaf, koneksi terputus. Silakan hubungi WA admin kami." }]);
    } finally {
      setIsTyping(false);
    }
  };

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

  const totalFrames = 194;
  const minFramesToStart = 5; 
  
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
        if (loadedCount === minFramesToStart) setIsLoaded(true);
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
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .loader-mini { border: 2px solid rgba(255, 255, 255, 0.2); border-left-color: #ffffff; border-radius: 50%; width: 20px; height: 20px; animation: spin 0.8s linear infinite; }
      `}</style>

      {/* HEADER NAV */}
      <header className="fixed top-0 left-0 w-full z-[90] p-6 lg:p-10 flex justify-between items-center pointer-events-none">
        <div className="pointer-events-auto">
          <h2 className="text-white font-black italic tracking-tighter text-xl md:text-2xl lg:text-4xl uppercase bg-black/20 backdrop-blur-md px-4 py-1 lg:px-6 lg:py-2 rounded-lg border border-white/10">
            GURUBANTUGURU
          </h2>
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="pointer-events-auto w-12 h-12 lg:w-16 lg:h-16 bg-white rounded-full flex flex-col items-center justify-center gap-1.5 shadow-2xl z-[100]">
          <motion.span animate={isMenuOpen ? { rotate: 45, y: 6.5 } : { rotate: 0, y: 0 }} className="w-6 lg:w-8 h-0.5 bg-black block" />
          <motion.span animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }} className="w-6 lg:w-8 h-0.5 bg-black block" />
          <motion.span animate={isMenuOpen ? { rotate: -45, y: -6.5 } : { rotate: 0, y: 0 }} className="w-6 lg:w-8 h-0.5 bg-black block" />
        </button>
      </header>

      {/* MENU OVERLAY */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ opacity: 0, x: "100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: "100%" }} transition={{ type: "spring", damping: 25 }} className="fixed inset-0 z-[85] bg-white flex flex-col items-center justify-center gap-8 lg:gap-12">
            {['Home', 'Our Story', 'Produk', 'Testimoni', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} onClick={() => setIsMenuOpen(false)} className="text-4xl md:text-6xl lg:text-8xl font-black italic uppercase text-black hover:text-blue-600 transition-colors">
                {item}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={containerRef} className="relative h-[600vh] w-full">
        <div className="fixed top-0 left-0 w-full h-screen z-0 overflow-hidden bg-black">
          <canvas ref={canvasRef} className="w-full h-full object-cover" />
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
            <motion.div style={{ opacity: text1Opacity }} className="absolute flex flex-col items-center w-full">
              <div className={whiteBoxStyle}><h1 className={`${canvasTitleStyle} text-[2.6rem] md:text-8xl lg:text-[11rem]`}>GURUBANTUGURU</h1></div>
              <div className="mt-4 lg:mt-8 bg-black/90 px-4 py-1 lg:px-8 lg:py-2 flex items-center gap-3">
                <p className="font-bold tracking-[0.3em] uppercase text-[9px] md:text-xs lg:text-xl text-white">Asisten AI Untuk Para Guru Indonesia</p>
                {!isLoaded && <div className="loader-mini"></div>}
              </div>
            </motion.div>
            <motion.div style={{ opacity: text2Opacity }} className="absolute w-full px-6 flex flex-col items-center gap-3 lg:gap-8">
              <div className={whiteBoxStyle}><h2 className={`${canvasTitleStyle} text-3xl md:text-7xl lg:text-9xl`}>Merubah Kebiasaan</h2></div>
              <div className={whiteBoxStyle}><h2 className={`${canvasTitleStyle} text-3xl md:text-7xl lg:text-9xl`}>Yang Lama</h2></div>
            </motion.div>
            <motion.div style={{ opacity: text3Opacity }} className="absolute w-full px-6 flex flex-col items-center gap-3 lg:gap-8">
              <div className={whiteBoxStyle}><h2 className={`${canvasTitleStyle} text-3xl md:text-7xl lg:text-9xl`}>Menjadi Lebih Modern</h2></div>
              <div className={whiteBoxStyle}><h2 className={`${canvasTitleStyle} text-3xl md:text-7xl lg:text-9xl`}>Dan Efisien</h2></div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="relative z-20 w-full bg-white">
        <section id="our-story" className="w-full px-6 pt-32 pb-12 lg:pt-52 lg:pb-32 text-center max-w-7xl mx-auto">
            <h2 className="text-5xl md:text-7xl lg:text-9xl font-black italic tracking-tighter text-black uppercase mb-16 lg:mb-24">Our Story</h2>
            <div className="space-y-10 lg:space-y-20 text-black px-4 text-lg md:text-xl lg:text-3xl leading-relaxed font-light italic">
              <p className="text-xl md:text-3xl lg:text-5xl font-semibold text-blue-900/80">"Berawal dari mimpi sederhana di tengah keterbatasan teknologi..."</p>
              <p className="not-italic text-gray-700 lg:max-w-4xl lg:mx-auto">Kami menyaksikan lelahnya mata para guru di balik tumpukan kertas. Kami berangkat untuk meruntuhkan sekat rumit itu dan menggantinya dengan keajaiban teknologi yang memanusiakan.</p>
            </div>
        </section>

        <section id="produk" className="w-full px-6 py-32 lg:py-52 bg-[#eef6ff]">
          <div className="max-w-7xl lg:max-w-[1400px] mx-auto">
            <h2 className="text-5xl md:text-7xl lg:text-9xl font-black italic tracking-tighter text-black uppercase mb-20 lg:mb-32 text-center">Produk Kami</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                
                {/* SOAL AI DENGAN DESKRIPSI LENGKAP */}
                <div className="bg-white rounded-[2.5rem] lg:rounded-[4rem] p-10 lg:p-16 shadow-2xl border border-blue-100 overflow-hidden flex flex-col">
                   <h3 className="text-5xl lg:text-7xl font-black italic uppercase mb-4 lg:mb-8 text-black tracking-tighter">SOAL <span className="text-blue-600">AI</span></h3>
                   <p className="text-gray-600 lg:text-2xl font-medium mb-8 lg:mb-12 leading-relaxed italic text-lg">AI yang menjadi asisten para guru untuk membuat soal secara instan! Khusus diatur untuk jenjang SD, SMP, dan SMA.</p>
                   <div className="relative w-full h-[450px] lg:h-[650px] overflow-hidden rounded-2xl lg:rounded-[3rem] shadow-inner bg-gray-50 mb-8 lg:mb-12">
                      <motion.div animate={{ x: `-${soalIndex * 100}%` }} transition={{ duration: 0.8, ease: "easeInOut" }} className="flex w-full h-full">
                        <img src="/soal-ai-1.jpg" className="w-full h-full object-cover flex-shrink-0" />
                        <img src="/soal-ai-2.jpg" className="w-full h-full object-cover flex-shrink-0" />
                        <img src="/soal-ai-3.jpg" className="w-full h-full object-cover flex-shrink-0" />
                      </motion.div>
                   </div>
                   <a href="https://play.google.com/store/apps/details?id=com.soal.ai" target="_blank" rel="noopener noreferrer" className="w-fit"><img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-14 lg:h-20" /></a>
                </div>

                {/* JAWABAN AI DENGAN DESKRIPSI LENGKAP */}
                <div className="bg-[#0f172a] rounded-[2.5rem] lg:rounded-[4rem] p-10 lg:p-16 shadow-2xl text-white overflow-hidden flex flex-col">
                   <h3 className="text-5xl lg:text-7xl font-black italic uppercase mb-4 lg:mb-8 tracking-tighter">JAWABAN <span className="text-blue-400">AI</span></h3>
                   <p className="text-blue-100/70 lg:text-2xl font-medium mb-8 lg:mb-12 leading-relaxed italic text-lg">Lelah memeriksa tumpukan kertas ujian setiap malam? JAWABAN AI dirancang khusus untuk membantu koreksi otomatis secara akurat.</p>
                   <div className="relative w-full h-[450px] lg:h-[650px] overflow-hidden rounded-2xl lg:rounded-[3rem] shadow-inner bg-black/20 mb-8 lg:mb-12">
                      <motion.div animate={{ x: `-${jawabanIndex * 100}%` }} transition={{ duration: 0.8, ease: "easeInOut" }} className="flex w-full h-full">
                        <img src="/jawaban-ai-1.jpg" className="w-full h-full object-cover flex-shrink-0" />
                        <img src="/jawaban-ai-2.jpg" className="w-full h-full object-cover flex-shrink-0" />
                        <img src="/jawaban-ai-3.jpg" className="w-full h-full object-cover flex-shrink-0" />
                      </motion.div>
                   </div>
                   <a href="https://play.google.com/store/apps/details?id=com.jawaban.ai" target="_blank" rel="noopener noreferrer" className="w-fit bg-white/10 p-1 rounded-xl"><img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-14 lg:h-20" /></a>
                </div>

            </div>
          </div>
        </section>

        {/* TESTIMONI */}
        <section id="testimoni" className="w-full px-6 py-32 lg:py-52 bg-white text-center">
            <h2 className="text-5xl md:text-7xl lg:text-9xl font-black italic tracking-tighter text-black uppercase mb-20 lg:mb-32">Testimoni</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16 max-w-7xl mx-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-50 p-10 lg:p-16 rounded-[2rem] lg:rounded-[3rem] border border-gray-100 shadow-sm">
                  <p className="text-lg lg:text-2xl italic text-gray-700 mb-8">"Sangat membantu efisiensi waktu saya dalam mengajar setiap harinya."</p>
                  <h4 className="font-bold lg:text-xl text-blue-600">Guru Indonesia {i}</h4>
                </div>
              ))}
            </div>
        </section>

        {/* CONTACT US */}
        <section id="contact" className="w-full px-6 py-24 lg:py-44 bg-white border-t border-gray-100">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl lg:text-8xl font-black italic tracking-tighter text-black uppercase mb-12 lg:mb-20">Contact Us</h2>
            <div className="flex flex-col md:flex-row justify-center items-center gap-12 lg:gap-40">
              <div className="flex flex-col items-center gap-6 lg:gap-10">
                <h4 className="text-[10px] lg:text-sm font-black tracking-[0.4em] text-blue-600 uppercase">Social Media</h4>
                <div className="flex gap-6 lg:gap-10">
                  <a href="#" className="w-12 h-12 lg:w-20 lg:h-20 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 hover:scale-110 transition-transform"><img src="/logo-fb.png" className="w-6 h-6 lg:w-10 lg:h-10" /></a>
                  <a href="#" className="w-12 h-12 lg:w-20 lg:h-20 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 hover:scale-110 transition-transform"><img src="/logo-ig.png" className="w-6 h-6 lg:w-10 lg:h-10" /></a>
                  <a href="#" className="w-12 h-12 lg:w-20 lg:h-20 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 hover:scale-110 transition-transform"><img src="/logo-threads.png" className="w-6 h-6 lg:w-10 lg:h-10" /></a>
                </div>
              </div>
              <div className="flex flex-col items-center gap-6 lg:gap-10">
                <h4 className="text-[10px] lg:text-sm font-black tracking-[0.4em] text-blue-600 uppercase">Direct Message</h4>
                <div className="flex gap-6 lg:gap-10">
                  <a href="#" className="w-12 h-12 lg:w-20 lg:h-20 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 hover:scale-110 transition-transform"><img src="/logo-wa.png" className="w-6 h-6 lg:w-10 lg:h-10" /></a>
                  <a href="#" className="w-12 h-12 lg:w-20 lg:h-20 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 hover:scale-110 transition-transform"><img src="/logo-email.png" className="w-6 h-6 lg:w-10 lg:h-10" /></a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="py-12 lg:py-24 text-center border-t border-blue-50">
          <p className="opacity-40 text-[10px] lg:text-sm font-black uppercase tracking-[0.5em] text-blue-900">© 2026 GURU BANTU GURU</p>
        </footer>
      </div>

      {/* CHAT AI */}
      <div className="fixed bottom-6 right-6 lg:bottom-12 lg:right-12 z-[100] flex flex-col items-end">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div initial={{ opacity: 0, scale: 0.8, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="mb-4 w-[320px] lg:w-[500px] bg-white rounded-2xl lg:rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden flex flex-col">
              <div className="bg-blue-600 p-4 lg:p-7 text-white flex items-center gap-3"><div className="w-10 h-10 lg:w-16 lg:h-16 bg-white/20 rounded-full flex items-center justify-center font-bold text-xl lg:text-3xl">🤖</div><h4 className="font-bold lg:text-xl">AI GuruBantuGuru</h4></div>
              <div className="p-4 lg:p-7 h-[300px] lg:h-[450px] overflow-y-auto bg-gray-50 flex flex-col gap-3 scrollbar-hide">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`${msg.role === 'ai' ? 'bg-blue-100 text-blue-900 rounded-tl-none self-start' : 'bg-blue-600 text-white rounded-tr-none self-end'} text-xs lg:text-base p-3 lg:p-5 rounded-2xl max-w-[80%] shadow-sm`}>{msg.text}</div>
                ))}
              </div>
              <div className="p-3 lg:p-6 bg-white border-t flex gap-2">
                <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Ketik..." className="flex-1 bg-gray-100 rounded-full px-4 lg:py-4 outline-none text-black" />
                <button onClick={handleSendMessage} className="bg-blue-600 text-white p-2 lg:p-4 rounded-full"><svg viewBox="0 0 24 24" className="w-4 h-4 lg:w-7 lg:h-7 fill-current"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg></button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <button onClick={() => setIsChatOpen(!isChatOpen)} className="w-16 h-16 lg:w-24 lg:h-24 bg-blue-600 rounded-full shadow-2xl flex items-center justify-center">
          {isChatOpen ? <span className="text-white text-2xl lg:text-4xl font-light">✕</span> : <svg className="w-8 h-8 lg:w-12 lg:h-12 text-white fill-current" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/></svg>}
        </button>
      </div>
    </main>
  );
}

