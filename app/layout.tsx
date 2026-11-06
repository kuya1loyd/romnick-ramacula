import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GLIMPSE OF ROMNICK | Academic Portfolio & Tasks",
  description:
    "Official portfolio and academic task gallery of Romnick P. Ramacula, Bachelor of Elementary Education (BEEd-2C). Features Technology for Teaching and Learning submissions and activity sheets.",
  keywords: [
    "Romnick P. Ramacula",
    "GLIMPSE OF ROMNICK",
    "BEEd-2C",
    "Technology for Teaching and Learning",
    "TTL Activity Sheet",
    "Kerstan Isaac Requiza",
    "Elementary Education",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col bg-white text-slate-900 font-sans">
        {children}
      </body>
    </html>
  );
}
