import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Guru Bantu Guru | AI Solusi Pendidikan",
  description: "Membantu efisiensi administrasi guru Indonesia dengan AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={`${outfit.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
