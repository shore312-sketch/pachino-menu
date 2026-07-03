"use client";

import { Fragment, useEffect, useState } from "react";

type MenuItem = {
  set_label: string;
  dishes: string;
  price: string;
  note: string;
};

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

function todayLabel() {
  const now = new Date();
  return `${now.getMonth() + 1}月${now.getDate()}日（${WEEKDAYS[now.getDay()]}曜日）`;
}

export default function MenuDisplay() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [date, setDate] = useState("");

  async function fetchMenu() {
    try {
      const res = await fetch("/api/menu", { cache: "no-store" });
      if (res.ok) setMenu(await res.json());
    } catch {
      // ネットワークエラー時はそのまま表示維持
    }
    // 日付はサーバーとタイムゾーンがずれるため、クライアント側で取得後に反映する
    setDate(todayLabel());
  }

  useEffect(() => {
    Promise.resolve().then(fetchMenu);
    // 1分ごとに最新メニューを取得（日付もあわせて更新）
    const id = setInterval(fetchMenu, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="paper-wrap">
      <button
        className="print-btn"
        onClick={() => window.print()}
        aria-label="この御品書きをA4で印刷"
      >
        印刷
      </button>

      <div className="sheet">
        <div className="washi-frame">
          <header className="w-head">
            <p className="w-eyebrow">和食 ぱちーの</p>
            <h1 className="w-title">本日の御品書き</h1>
            <p className="w-date">{date}</p>
          </header>

          <div className="w-body">
            {menu.map((item, i) => (
              <Fragment key={item.set_label}>
                {i > 0 && <div className="v-rule" aria-hidden="true" />}
                <div className="v-set">
                  <div className="v-sethead">
                    <p className="v-label">{item.set_label}定食</p>
                    {item.note && <p className="v-badge">{item.note}</p>}
                  </div>
                  <div className="v-dishes">
                    {item.dishes
                      .split(/\r?\n/)
                      .filter((line) => line.trim() !== "")
                      .map((dish, j) => (
                        <p key={j}>{dish}</p>
                      ))}
                  </div>
                  <p className="v-price">{item.price}円</p>
                </div>
              </Fragment>
            ))}

            {menu.length === 0 && <p className="w-empty">準備中です</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
