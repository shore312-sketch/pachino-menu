import type { Metadata } from "next";
import { Klee_One } from "next/font/google";
import "./globals.css";

const kleeOne = Klee_One({
  weight: ["400", "600"],
  subsets: ["latin"],
  variable: "--font-klee",
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
    <html lang="ja" className={kleeOne.variable}>
      <body>{children}</body>
    </html>
  );
}
