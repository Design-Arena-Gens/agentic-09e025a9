import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap"
});

export const metadata: Metadata = {
  title: "De Jongh’s Panelbeating Centre | Digital Assistant",
  description:
    "Talk to De Jongh’s Panelbeating Centre’s digital assistant for trusted advice, repair estimates, and updates on your vehicle."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-brand-50 text-brand-900 antialiased">
        {children}
      </body>
    </html>
  );
}
