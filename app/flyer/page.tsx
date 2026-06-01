"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

type MenuItem = {
  set_label: string;
  dishes: string;
  price: string;
  note: string;
};

export default function FlyerPage() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [pageUrl, setPageUrl] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    fetch("/api/menu", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : []))
      .then(setMenu)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const url = window.location.href;
    setPageUrl(url);
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: 140,
        margin: 1,
        color: { dark: "#1d3d1d", light: "#ffffff" },
      });
    }
  }, []);

  return (
    <div className="flyer-wrap">
      <div className="flyer-inner">

        {/* ヘッダー */}
        <header className="flyer-hero">
          <p className="flyer-tagline">鹿児島市内・法人様向け</p>
          <h1 className="flyer-hero-title">会議・研修の<br />お弁当承ります</h1>
          <p className="flyer-shop-name">ぱちーの</p>
        </header>

        {/* 強み3点 */}
        <section className="flyer-points">
          <div className="flyer-point">
            <span className="flyer-point-num">01</span>
            <div>
              <strong>10個から対応</strong>
              <p>少人数の会議でもご利用いただけます</p>
            </div>
          </div>
          <div className="flyer-point">
            <span className="flyer-point-num">02</span>
            <div>
              <strong>鹿児島市内へ配達</strong>
              <p>エリア外はご相談ください</p>
            </div>
          </div>
          <div className="flyer-point">
            <span className="flyer-point-num">03</span>
            <div>
              <strong>1週間前までのご予約</strong>
              <p>日程・数量・メニューはご相談可</p>
            </div>
          </div>
        </section>

        {/* メニュー */}
        <section className="flyer-section">
          <h2 className="flyer-section-title">本日のお弁当メニュー</h2>
          <div className="flyer-menu-list">
            {menu.map((item) => (
              <div key={item.set_label} className="flyer-menu-item">
                <div className="flyer-menu-top">
                  <span className="flyer-menu-label">{item.set_label}定食</span>
                  {item.note && (
                    <span className="flyer-menu-badge">{item.note}</span>
                  )}
                  <span className="flyer-menu-price">¥{item.price}</span>
                </div>
                <p className="flyer-menu-dishes">{item.dishes}</p>
              </div>
            ))}
            {menu.length === 0 && (
              <p className="flyer-menu-empty">メニューを準備中です</p>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="flyer-cta">
          <p className="flyer-cta-lead">
            まずはお気軽にお電話ください
          </p>
          <a href="tel:0998137774" className="flyer-tel-btn">
            099-813-7774
          </a>
          <p className="flyer-cta-sub">
            受付時間：営業時間内<br />
            ご注文・日程のご相談はお気軽に
          </p>
        </section>

        {/* QRコード＋URL */}
        <section className="flyer-qr-section">
          <canvas ref={canvasRef} className="flyer-qr-canvas" />
          <div className="flyer-qr-info">
            <p className="flyer-qr-label">このページのURL</p>
            <p className="flyer-qr-url">{pageUrl}</p>
            <p className="flyer-qr-hint">QRコードを読み取るか、URLを入力するとご覧いただけます</p>
          </div>
        </section>

        <footer className="flyer-footer">
          <p>ぱちーの</p>
          <p>鹿児島市玉里山地3丁目12−7</p>
        </footer>

      </div>
    </div>
  );
}
