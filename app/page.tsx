"use client";

import { Fragment, useEffect, useState } from "react";
import { ENSO_PATH } from "./enso-path";

type MenuItem = {
  set_label: string;
  dishes: string;
  price: string;
  note: string;
};

type TakeoutItem = {
  name: string;
  price: string;
};

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

function todayLabel() {
  const now = new Date();
  return `${now.getMonth() + 1}月${now.getDate()}日（${WEEKDAYS[now.getDay()]}曜日）`;
}

export default function MenuDisplay() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [takeout, setTakeout] = useState<TakeoutItem[]>([]);
  const [date, setDate] = useState("");

  async function fetchMenu() {
    try {
      const [menuRes, takeoutRes] = await Promise.all([
        fetch("/api/menu", { cache: "no-store" }),
        fetch("/api/takeout", { cache: "no-store" }),
      ]);
      if (menuRes.ok) setMenu(await menuRes.json());
      if (takeoutRes.ok) setTakeout(await takeoutRes.json());
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
            <p className="w-eyebrow">ぱちーの 〜地の食と水〜</p>
            <h1 className="w-title">本日の昼御膳</h1>
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

          <div className="w-footer">
            <div className="w-hours">
              <div
                className="w-enso-wrap"
                aria-label="ランチ営業時間 11時30分から14時 ラストオーダー13時10分"
              >
                <svg
                  className="w-enso"
                  viewBox="0 0 120 120"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d={ENSO_PATH} fill="#c9302c" />
                </svg>
                <div className="w-hours-text">
                  <span className="w-hours-title">ランチ</span>
                  <span className="w-hours-time">11:30〜14:00</span>
                  <span className="w-hours-lo">(L.o13:10)</span>
                </div>
              </div>
            </div>

            {takeout.length > 0 && (
              <div className="tk-panel">
                <p className="tk-head">
                  <span className="tk-title">テイクアウト</span>
                  <span className="tk-sub">ご予約承ります</span>
                </p>
                <ul className="tk-list">
                  {takeout.map((t, j) => (
                    <li className="tk-item" key={j}>
                      <span className="tk-name">{t.name}</span>
                      <span className="tk-leader" aria-hidden="true" />
                      {t.price && <span className="tk-price">{t.price}円</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
