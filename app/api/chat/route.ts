import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Railway akan otomatis mengisi nilai ini dari Dashboard Variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // Pastikan API Key terbaca
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ text: "Konfigurasi API Key belum terpasang di Railway." }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Kamu adalah Customer Service AI dari GuruBantuGuru. 
    Produk kami: 1. SOAL AI (buat soal instan), 2. JAWABAN AI (koreksi otomatis).
    Gaya bicara: Ramah, profesional, membantu, dan gunakan emoji.
    Jika ditanya harga, katakan cek di Playstore. 
    Pertanyaan User: ${message}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return NextResponse.json({ text: response.text() });
    
  } catch (error) {
    console.error("Chat Error:", error);
    return NextResponse.json({ text: "Maaf, sistem AI sedang sibuk. Coba lagi ya!" }, { status: 500 });
  }
}
