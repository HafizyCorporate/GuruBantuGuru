"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

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
    let count = 0;

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      img.src = `/ezgif-frame-${i.toString().padStart(3, '0')}.jpg`;
      img.onload = () => {
        count++;
        if (count === totalFrames) {
          setImages(loadedImages);
          setIsLoaded(true);
        }
      };
      loadedImages[i - 1] = img;
    }
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
      if (img) requestAnimationFrame(() => draw(img, context, canvasRef.current!));
    });
    return () => unsubscribe();
  }, [images, frameIndex]);

  const whiteBoxStyle = "bg-white/40 backdrop-blur-[4px] px-6 py-2 inline-block border border-white/60 shadow-lg";
  const canvasTitleStyle = "text-black font-black italic uppercase leading-none tracking-tighter";

  return (
    <main className="relative w-full bg-black overflow-x-hidden">
      <style jsx global>{`
        html, body { background-color: black; margin: 0; padding: 0; overflow-x: hidden; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* SECTION 1: CANVAS */}
      <div ref={containerRef} className="relative h-[600vh] w-full">
        <div className="fixed top-0 left-0 w-full h-screen z-0 overflow-hidden">
          <canvas ref={canvasRef} className="w-full h-full object-cover" />
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
            <motion.div style={{ opacity: text1Opacity }} className="absolute flex flex-col items-center w-full">
              <div className={whiteBoxStyle}>
                <h1 className={`${canvasTitleStyle} text-[2.6rem] md:text-8xl`}>GURUBANTUGURU</h1>
              </div>
              <div className="mt-4 bg-black/90 px-4 py-1">
                <p className="font-bold tracking-[0.3em] uppercase text-[9px] md:text-xs text-white">
                    Asisten AI Untuk Para Guru Indonesia
                </p>
              </div>
            </motion.div>

            <motion.div style={{ opacity: text2Opacity }} className="absolute w-full px-6 flex flex-col items-center gap-3">
              <div className={whiteBoxStyle}>
                <h2 className={`${canvasTitleStyle} text-3xl md:text-7xl`}>Merubah Kebiasaan</h2>
              </div>
              <div className={whiteBoxStyle}>
                <h2 className={`${canvasTitleStyle} text-3xl md:text-7xl`}>Yang Lama</h2>
              </div>
            </motion.div>

            <motion.div style={{ opacity: text3Opacity }} className="absolute w-full px-6 flex flex-col items-center gap-3">
              <div className={whiteBoxStyle}>
                <h2 className={`${canvasTitleStyle} text-3xl md:text-7xl`}>Menjadi Lebih Modern</h2>
              </div>
              <div className={whiteBoxStyle}>
                <h2 className={`${canvasTitleStyle} text-3xl md:text-7xl`}>Dan Efisien</h2>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="relative z-20 w-full bg-white">
        {/* OUR STORY */}
        <section className="w-full flex flex-col items-center justify-center px-6 pt-32 pb-12 bg-gradient-to-b from-white to-blue-50/30">
          <div className="max-w-4xl w-full text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-5xl md:text-7xl font-black italic tracking-tighter text-black uppercase mb-16"
            >
              Our Story
            </motion.h2>
            <div className="space-y-10 text-black px-4 text-lg md:text-xl leading-relaxed font-light">
              <p className="text-xl md:text-3xl font-semibold italic text-blue-900/80">"Berawal dari mimpi sederhana di tengah keterbatasan teknologi..."</p>
              <p>Kami menyaksikan lelahnya mata para guru di balik tumpukan kertas. Kami berangkat untuk meruntuhkan sekat rumit itu dan menggantinya dengan keajaiban teknologi yang memanusiakan.</p>
            </div>
          </div>
        </section>

        {/* VISI & MISI */}
        <section className="w-full px-6 pt-12 pb-32 bg-gradient-to-b from-blue-50/30 to-white overflow-hidden">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="p-8 md:p-12 border-l-4 border-blue-400 bg-blue-50/20 shadow-sm"
            >
              <h3 className="text-4xl md:text-5xl font-black italic tracking-tighter text-black uppercase mb-8">Visi</h3>
              <p className="text-lg md:text-xl leading-relaxed text-gray-800 font-light">
                Menjadi episentrum transformasi digital pendidikan di Indonesia yang tidak hanya mengandalkan kecerdasan buatan, namun mengedepankan empati teknologi. Kami bervisi menciptakan ekosistem di mana setiap guru memiliki asisten pintar.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="p-8 md:p-12 border-l-4 border-blue-400 bg-blue-50/20 shadow-sm"
            >
              <h3 className="text-4xl md:text-5xl font-black italic tracking-tighter text-black uppercase mb-8">Misi</h3>
              <p className="text-lg md:text-xl leading-relaxed text-gray-800 font-light">
                Membangun teknologi yang inklusif untuk menyederhanakan proses belajar mengajar secara revolusioner. Kami berkomitmen untuk mendemokrasikan akses AI bagi pendidik, serta memastikan tidak ada guru yang berjalan sendirian.
              </p>
            </motion.div>
          </div>
        </section>

        {/* PRODUK KAMI */}
        <section className="w-full px-6 py-32 bg-[#eef6ff] overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-black italic tracking-tighter text-black uppercase mb-20 text-center"
            >
              Produk Kami
            </motion.h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* SOAL AI */}
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-white rounded-3xl overflow-hidden shadow-xl border border-blue-100"
              >
                <div className="p-8">
                   <h3 className="text-4xl font-black italic uppercase mb-4 text-black italic">SOAL <span className="text-blue-600">AI</span></h3>
                   <p className="text-gray-700 font-medium mb-6 leading-relaxed">
                     AI yang menjadi asisten para guru untuk membuat soal secara instan! Khusus diatur untuk jenjang **SD, SMP, dan SMA**. Jangan biarkan waktu Anda habis hanya untuk mengetik soal. Dengan SOAL AI, Anda bisa menciptakan bank soal berkualitas, variatif, dan sesuai kurikulum hanya dalam hitungan detik. Biarkan teknologi bekerja, sementara Anda fokus menginspirasi siswa!
                   </p>
                   {/* SLIDER FOTO SOAL AI */}
                   <div className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-hide">
                      <div className="min-w-[90%] md:min-w-[70%] h-64 bg-gray-100 rounded-xl snap-center overflow-hidden border">
                        <img src="/soal-ai-1.jpg" alt="Soal AI 1" className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-[90%] md:min-w-[70%] h-64 bg-gray-100 rounded-xl snap-center overflow-hidden border">
                        <img src="/soal-ai-2.jpg" alt="Soal AI 2" className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-[90%] md:min-w-[70%] h-64 bg-gray-100 rounded-xl snap-center overflow-hidden border">
                        <img src="/soal-ai-3.jpg" alt="Soal AI 3" className="w-full h-full object-cover" />
                      </div>
                   </div>
                </div>
              </motion.div>

              {/* JAWABAN AI */}
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-[#0f172a] rounded-3xl overflow-hidden shadow-xl text-white"
              >
                <div className="p-8">
                   <h3 className="text-4xl font-black italic uppercase mb-4 text-white">JAWABAN <span className="text-blue-400">AI</span></h3>
                   <p className="text-blue-50 font-medium mb-6 leading-relaxed">
                     Lelah memeriksa tumpukan kertas ujian setiap malam? **JAWABAN AI** dirancang khusus untuk menjadi asisten pribadi Anda dalam memeriksa soal murid secara otomatis dan akurat. AI kami tidak hanya memberi skor, tapi memberikan analisis mendalam tentang pemahaman siswa. Kurangi beban kerja Anda secara drastis dan kembalikan waktu berharga Anda bersama keluarga. Efisiensi bukan lagi mimpi!
                   </p>
                   {/* SLIDER FOTO JAWABAN AI */}
                   <div className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-hide">
                      <div className="min-w-[90%] md:min-w-[70%] h-64 bg-gray-800 rounded-xl snap-center overflow-hidden border border-white/10">
                        <img src="/jawaban-ai-1.jpg" alt="Jawaban AI 1" className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-[90%] md:min-w-[70%] h-64 bg-gray-800 rounded-xl snap-center overflow-hidden border border-white/10">
                        <img src="/jawaban-ai-2.jpg" alt="Jawaban AI 2" className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-[90%] md:min-w-[70%] h-64 bg-gray-800 rounded-xl snap-center overflow-hidden border border-white/10">
                        <img src="/jawaban-ai-3.jpg" alt="Jawaban AI 3" className="w-full h-full object-cover" />
                      </div>
                   </div>
                </div>
              </motion.div>
            </div>

            {/* TESTIMONI SECTION */}
            <div className="mt-32">
               <motion.h2 
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 className="text-4xl md:text-5xl font-black italic tracking-tighter text-black uppercase mb-12 text-center"
               >
                 Testimoni Pengguna
               </motion.h2>
               
               <div className="flex gap-6 overflow-x-auto pb-8 snap-x scrollbar-hide px-4">
                 {/* Testi 1 */}
                 <div className="min-w-[300px] md:min-w-[400px] bg-white p-8 rounded-2xl shadow-xl border border-blue-50 snap-center">
                   <div className="flex text-yellow-400 mb-4 text-xl">★★★★★</div>
                   <p className="text-gray-700 italic mb-6 leading-relaxed font-medium">"Luar biasa! Dulu bikin soal butuh waktu berjam-jam, sekarang hitungan detik langsung jadi. Sangat membantu tugas administrasi saya di sekolah."</p>
                   <div>
                     <p className="font-black text-black uppercase italic tracking-tighter">Ibu Siti Zulaikha</p>
                     <p className="text-[10px] text-blue-600 font-bold tracking-[0.2em] uppercase">Guru Matematika SMP</p>
                   </div>
                 </div>

                 {/* Testi 2 */}
                 <div className="min-w-[300px] md:min-w-[400px] bg-white p-8 rounded-2xl shadow-xl border border-blue-50 snap-center">
                   <div className="flex text-yellow-400 mb-4 text-xl">★★★★★</div>
                   <p className="text-gray-700 italic mb-6 leading-relaxed font-medium">"Koreksi jawaban jadi jauh lebih cepat dengan Jawaban AI. Akurasinya mantap dan saya bisa memberikan feedback personal ke siswa lebih cepat."</p>
                   <div>
                     <p className="font-black text-black uppercase italic tracking-tighter">Bapak Andi Pratama</p>
                     <p className="text-[10px] text-blue-600 font-bold tracking-[0.2em] uppercase">Guru Bahasa Indonesia SMA</p>
                   </div>
                 </div>

                 {/* Testi 3 */}
                 <div className="min-w-[300px] md:min-w-[400px] bg-white p-8 rounded-2xl shadow-xl border border-blue-50 snap-center">
                   <div className="flex text-yellow-400 mb-4 text-xl">★★★★★</div>
                   <p className="text-gray-700 italic mb-6 leading-relaxed font-medium">"GURUBANTUGURU benar-benar modern. Fitur-fiturnya to-the-point dan mudah digunakan bahkan untuk guru yang tidak terlalu paham IT."</p>
                   <div>
                     <p className="font-black text-black uppercase italic tracking-tighter">Ibu Maya Lestari</p>
                     <p className="text-[10px] text-blue-600 font-bold tracking-[0.2em] uppercase">Guru IPA SD</p>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </section>

        <footer className="py-12 text-center bg-white border-t border-blue-50">
          <p className="opacity-40 text-[10px] font-black uppercase tracking-[0.5em] text-blue-900">© 2026 GURU BANTU GURU</p>
        </footer>
      </div>
    </main>
  );
}
