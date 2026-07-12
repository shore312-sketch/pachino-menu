"use client";

import { CSSProperties, useEffect, useRef, useState } from "react";

type MenuItem = {
  set_label: string;
  dishes: string;
  price: string;
  note: string;
  limit_note: string;
};

type TakeoutItem = {
  name: string;
  price: string;
};

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

// 定食ごとのテーマ色（A=紺、B=金、C=緑…）
const SET_COLORS = ["#24466e", "#9c7c22", "#4d6b3c", "#8a3b45", "#4a4a72"];

function todayLabel() {
  const now = new Date();
  return {
    md: `${now.getMonth() + 1}月${now.getDate()}日`,
    wd: `（${WEEKDAYS[now.getDay()]}曜日）`,
  };
}

// "2000" → "2,000"（数字以外が混ざっていたらそのまま表示）
function formatPrice(price: string) {
  const digits = price.replace(/[,，\s]/g, "");
  return /^\d+$/.test(digits) ? Number(digits).toLocaleString("ja-JP") : price;
}

// 丸バッジ内で「限定」の後で改行して収まりよく見せる
function LimitBadgeText({ text }: { text: string }) {
  const m = text.match(/^限定(.+)$/);
  if (!m) return <>{text}</>;
  return (
    <>
      限定
      <br />
      {m[1]}
    </>
  );
}

export default function MenuDisplay() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [takeout, setTakeout] = useState<TakeoutItem[]>([]);
  const [takeoutNote, setTakeoutNote] = useState("");
  const [date, setDate] = useState({ md: "", wd: "" });

  const sheetRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  // 内容量（定食の数・料理の行数）に応じて全体を自動縮小し、
  // 何品でも必ず1枚に収める（営業時間まで見切れない）
  useEffect(() => {
    const fit = () => {
      const sheet = sheetRef.current;
      const frame = frameRef.current;
      if (!sheet || !frame) return;
      frame.style.transform = "translate(-50%, -50%) scale(1)";
      const sh = sheet.clientHeight;
      const fh = frame.offsetHeight;
      const scale = fh > sh ? sh / fh : 1;
      frame.style.transform = `translate(-50%, -50%) scale(${scale})`;
    };

    fit();
    // フォント読込・画像等の反映後にもう一度合わせる
    const t = setTimeout(fit, 300);
    const ro = new ResizeObserver(fit);
    if (sheetRef.current) ro.observe(sheetRef.current);
    window.addEventListener("resize", fit);
    return () => {
      clearTimeout(t);
      ro.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, [menu, takeout, takeoutNote, date]);

  async function fetchMenu() {
    try {
      const [menuRes, takeoutRes] = await Promise.all([
        fetch("/api/menu", { cache: "no-store" }),
        fetch("/api/takeout", { cache: "no-store" }),
      ]);
      if (menuRes.ok) setMenu(await menuRes.json());
      if (takeoutRes.ok) {
        const data: { items: TakeoutItem[]; note: string } = await takeoutRes.json();
        setTakeout(data.items ?? []);
        setTakeoutNote(data.note ?? "");
      }
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

      <div className="sheet" ref={sheetRef}>
        <div className="h-frame" ref={frameRef}>
          <header className="h-head">
            <p className="h-brand">
              ぱちーの<span className="h-brand-sub">〜地の食と水〜</span>
            </p>
            <div className="h-titlerow">
              <h1 className="h-title">本日の昼御膳</h1>
              <p className="h-date">
                <span className="h-date-md">{date.md}</span>
                <span className="h-date-wd">{date.wd}</span>
              </p>
            </div>
          </header>

          <div className="h-cards">
            {menu.map((item, i) => (
              <section
                className="hcard"
                key={item.set_label}
                style={{ "--set-color": SET_COLORS[i % SET_COLORS.length] } as CSSProperties}
              >
                <div className="hcard-head">
                  <span className="hcard-letter">{item.set_label}</span>
                  <span className="hcard-teishoku">定食</span>
                  {item.note && <span className="hcard-sub">{item.note}</span>}
                </div>
                {item.limit_note && (
                  <p className="hcard-limit">
                    <LimitBadgeText text={item.limit_note} />
                  </p>
                )}
                <div className="hcard-body">
                  <ul className="hcard-dishes">
                    {item.dishes
                      .split(/\r?\n/)
                      .filter((line) => line.trim() !== "")
                      .map((dish, j) => (
                        <li key={j}>{dish}</li>
                      ))}
                  </ul>
                  <p className="hcard-price">
                    <span className="hcard-price-num">{formatPrice(item.price)}</span>円
                  </p>
                </div>
              </section>
            ))}

            {takeout.length > 0 && (
              <section className="hcard tk-card">
                <div className="hcard-head">
                  <span className="tk-heading">テイクアウト</span>
                  {takeoutNote && <span className="tk-note">{takeoutNote}</span>}
                </div>
                <ul className="tk-grid">
                  {takeout.map((t, j) => (
                    <li className="tk-item" key={j}>
                      <span className="tk-name">{t.name}</span>
                      <span className="tk-leader" aria-hidden="true" />
                      {t.price && (
                        <span className="tk-price">{formatPrice(t.price)}円</span>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {menu.length === 0 && takeout.length === 0 && (
              <p className="h-empty">準備中です</p>
            )}
          </div>

          <footer className="h-foot">
            <span className="h-foot-lunch">ランチ</span>
            <span className="h-foot-time">11:30〜14:00</span>
            <span className="h-foot-lo">（L.o 13:10）</span>
          </footer>
        </div>
      </div>
    </div>
  );
}
