import type { Metadata } from "next";
import { Klee_One, Shippori_Mincho } from "next/font/google";
import "./globals.css";

const kleeOne = Klee_One({
  weight: ["400", "600"],
  subsets: ["latin"],
  variable: "--font-klee",
  display: "swap",
});

const shipporiMincho = Shippori_Mincho({
  weight: ["500", "700"],
  subsets: ["latin"],
  variable: "--font-mincho-var",
  display: "swap",
});

export const metadata: Metadata = {
  title: "本日のランチ | ぱちーの",
  description: "本日のランチメニュー",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${kleeOne.variable} ${shipporiMincho.variable}`}>
      <body>{children}</body>
    </html>
  );
}
