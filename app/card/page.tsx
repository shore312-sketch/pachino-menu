"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

export default function CardPage() {
  const flyerQrRef = useRef<HTMLCanvasElement>(null);
  const instaQrRef = useRef<HTMLCanvasElement>(null);
  const [flyerUrl, setFlyerUrl] = useState("");

  useEffect(() => {
    const url = `${window.location.origin}/flyer`;
    setFlyerUrl(url);

    if (flyerQrRef.current) {
      QRCode.toCanvas(flyerQrRef.current, url, {
        width: 160,
        margin: 1,
        color: { dark: "#1d3d1d", light: "#ffffff" },
      });
    }

    if (instaQrRef.current) {
      QRCode.toCanvas(instaQrRef.current, "https://www.instagram.com/paciiino1028/", {
        width: 160,
        margin: 1,
        color: { dark: "#1d3d1d", light: "#ffffff" },
      });
    }
  }, []);

  return (
    <div className="card-page">
      <div className="card-wrap">

        <header className="card-header">
          <p className="card-tagline">鹿児島市内・法人様向け</p>
          <h1 className="card-title">会議・研修の<br />お弁当承ります</h1>
          <p className="card-shop">ぱちーの</p>
        </header>

        <div className="card-points">
          <span>10個〜</span>
          <span className="card-dot">·</span>
          <span>鹿児島市内配達</span>
          <span className="card-dot">·</span>
          <span>1週間前までご予約</span>
        </div>

        <div className="card-qr-row">
          <div className="card-qr-block">
            <canvas ref={flyerQrRef} className="card-qr-canvas" />
            <p className="card-qr-label">メニュー・詳細</p>
            <p className="card-qr-url">{flyerUrl}</p>
          </div>
          <div className="card-qr-block">
            <canvas ref={instaQrRef} className="card-qr-canvas" />
            <p className="card-qr-label">Instagram</p>
            <p className="card-qr-url">@paciiino1028</p>
          </div>
        </div>

        <footer className="card-footer">
          <span>📞 099-813-7774</span>
          <span className="card-footer-sep">　</span>
          <span>鹿児島市玉里山地3丁目12−7</span>
        </footer>

      </div>

      <p className="card-print-hint">印刷後、点線に沿って切り取ってください（葉書サイズ）</p>
      <button className="card-print-btn" onClick={() => window.print()}>
        印刷する
      </button>
    </div>
  );
}
