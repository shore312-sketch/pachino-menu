"use client";

import { useEffect, useState } from "react";

type MenuItem = {
  set_label: string;
  dishes: string;
  price: string;
  note: string;
};

export default function BentoPage() {
  const [menu, setMenu] = useState<MenuItem[]>([]);

  useEffect(() => {
    fetch("/api/menu", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : []))
      .then(setMenu)
      .catch(() => {});
  }, []);

  return (
    <div className="bento-wrap">
      <div className="bento-inner">

        <header className="bento-header">
          <p className="bento-shop-name">ぱちーの</p>
          <h1 className="bento-title">
            法人・企業様向け<br />お弁当のご案内
          </h1>
        </header>

        <section className="bento-section">
          <h2 className="bento-section-title">本日のお弁当メニュー</h2>
          <div className="bento-menu-list">
            {menu.map((item) => (
              <div key={item.set_label} className="bento-menu-item">
                <div className="bento-menu-top">
                  <span className="bento-menu-label">{item.set_label}定食</span>
                  {item.note && (
                    <span className="bento-menu-badge">{item.note}</span>
                  )}
                  <span className="bento-menu-price">¥{item.price}</span>
                </div>
                <p className="bento-menu-dishes">{item.dishes}</p>
              </div>
            ))}
            {menu.length === 0 && (
              <p className="bento-menu-empty">メニューを準備中です</p>
            )}
          </div>
        </section>

        <section className="bento-section">
          <h2 className="bento-section-title">ご注文・配達について</h2>
          <dl className="bento-terms">
            <div className="bento-term-row">
              <dt>最少注文数</dt>
              <dd>10個から承ります</dd>
            </div>
            <div className="bento-term-row">
              <dt>配達エリア</dt>
              <dd>鹿児島市内（エリア外はご相談ください）</dd>
            </div>
            <div className="bento-term-row">
              <dt>ご予約</dt>
              <dd>1週間前までにご連絡ください</dd>
            </div>
          </dl>
        </section>

        <section className="bento-section bento-cta-section">
          <h2 className="bento-section-title">ご相談・お問い合わせ</h2>
          <p className="bento-cta-body">
            個数・日程・メニューのご要望など、<br />
            お気軽にご相談ください。
          </p>
          <div className="bento-cta-box">
            <p className="bento-cta-note">
              まずはお電話・ご来店にてお声がけください
            </p>
          </div>
        </section>

        <footer className="bento-footer">
          <p>ぱちーの</p>
        </footer>

      </div>
    </div>
  );
}
