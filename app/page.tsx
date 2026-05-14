"use client";

import { useEffect, useState } from "react";

type MenuItem = {
  set_label: string;
  dishes: string;
  price: string;
  note: string;
};

export default function MenuDisplay() {
  const [menu, setMenu] = useState<MenuItem[]>([]);

  async function fetchMenu() {
    try {
      const res = await fetch("/api/menu", { cache: "no-store" });
      if (res.ok) setMenu(await res.json());
    } catch {
      // ネットワークエラー時はそのまま表示維持
    }
  }

  useEffect(() => {
    fetchMenu();
    // 1分ごとに最新メニューを取得
    const id = setInterval(fetchMenu, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="board-wrap">
      <div className="board">
        <p className="board-header">本日のランチ</p>
        <hr className="divider" />

        <div className="menu-sections">
          {menu.map((item, i) => (
            <div key={item.set_label}>
              {i > 0 && <hr className="section-divider" />}
              <div className="menu-section">
                <div className="set-header">
                  <span className="set-label">{item.set_label}定食</span>
                  {item.note && (
                    <span className="set-badge">{item.note}</span>
                  )}
                </div>
                <p className="set-dishes">{item.dishes}</p>
                <div className="set-price-row">
                  <span className="set-price">¥{item.price}</span>
                </div>
              </div>
            </div>
          ))}

          {menu.length === 0 && (
            <p style={{ color: "rgba(245,240,228,0.5)", textAlign: "center", fontSize: "clamp(0.8rem,2vmin,1rem)" }}>
              準備中です
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
