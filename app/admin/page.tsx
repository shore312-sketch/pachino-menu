"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type MenuItem = {
  dishes: string;
  price: string;
  note: string;
  limit_note: string;
};

type TakeoutItem = {
  name: string;
  price: string;
};

const LABELS = ["A", "B", "C", "D", "E"];
const DRAFT_KEY = "pachino-menu-draft";
const TAKEOUT_DRAFT_KEY = "pachino-takeout-draft";
const TAKEOUT_NOTE_DRAFT_KEY = "pachino-takeout-note-draft";
const MAX_TAKEOUT = 8;

const emptyItem = (): MenuItem => ({ dishes: "", price: "", note: "", limit_note: "" });
const emptyTakeout = (): TakeoutItem => ({ name: "", price: "" });

export default function AdminPage() {
  const router = useRouter();
  const [menu, setMenu] = useState<MenuItem[]>([emptyItem()]);
  const [takeout, setTakeout] = useState<TakeoutItem[]>([emptyTakeout()]);
  const [takeoutNote, setTakeoutNote] = useState("ご予約承ります");
  const [status, setStatus] = useState<{ msg: string; error: boolean } | null>(null);
  const [saving, setSaving] = useState(false);
  const loaded = useRef(false);

  // 起動時：まず端末の下書きを復元、なければDBから取得
  useEffect(() => {
    const menuDraft = localStorage.getItem(DRAFT_KEY);
    const takeoutDraft = localStorage.getItem(TAKEOUT_DRAFT_KEY);
    const noteDraft = localStorage.getItem(TAKEOUT_NOTE_DRAFT_KEY);
    if (menuDraft || takeoutDraft || noteDraft !== null) {
      try {
        const parsedMenu = menuDraft ? JSON.parse(menuDraft) : null;
        const parsedTakeout = takeoutDraft ? JSON.parse(takeoutDraft) : null;
        // localStorageはSSRで読めないため、復元はマウント後の非同期タイミングで行う
        Promise.resolve().then(() => {
          if (parsedMenu) setMenu(parsedMenu);
          if (parsedTakeout) setTakeout(parsedTakeout);
          if (noteDraft !== null) setTakeoutNote(noteDraft);
          loaded.current = true;
        });
        return;
      } catch {
        localStorage.removeItem(DRAFT_KEY);
        localStorage.removeItem(TAKEOUT_DRAFT_KEY);
        localStorage.removeItem(TAKEOUT_NOTE_DRAFT_KEY);
      }
    }
    Promise.all([
      fetch("/api/menu").then((r) => r.json()),
      fetch("/api/takeout").then((r) => r.json()),
    ])
      .then(
        ([menuData, takeoutData]: [
          Array<MenuItem & { set_label: string }>,
          { items: TakeoutItem[]; note: string },
        ]) => {
          setMenu(
            menuData.length > 0
              ? menuData.map(({ dishes, price, note, limit_note }) => ({
                  dishes,
                  price,
                  note,
                  limit_note: limit_note ?? "",
                }))
              : [emptyItem()]
          );
          const items = takeoutData.items ?? [];
          setTakeout(items.length > 0 ? items : [emptyTakeout()]);
          setTakeoutNote(takeoutData.note ?? "");
        }
      )
      .catch(() => {
        setMenu([emptyItem()]);
        setTakeout([emptyTakeout()]);
      })
      .finally(() => {
        loaded.current = true;
      });
  }, []);

  // 入力のたびに下書きを端末に保存
  useEffect(() => {
    if (!loaded.current) return;
    localStorage.setItem(DRAFT_KEY, JSON.stringify(menu));
    localStorage.setItem(TAKEOUT_DRAFT_KEY, JSON.stringify(takeout));
    localStorage.setItem(TAKEOUT_NOTE_DRAFT_KEY, takeoutNote);
  }, [menu, takeout, takeoutNote]);

  function updateField(index: number, field: keyof MenuItem, value: string) {
    setMenu((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  }

  function addSet() {
    if (menu.length >= LABELS.length) return;
    setMenu((prev) => [...prev, emptyItem()]);
  }

  function removeSet(index: number) {
    setMenu((prev) => prev.filter((_, i) => i !== index));
  }

  function updateTakeout(index: number, field: keyof TakeoutItem, value: string) {
    setTakeout((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  }

  function addTakeout() {
    if (takeout.length >= MAX_TAKEOUT) return;
    setTakeout((prev) => [...prev, emptyTakeout()]);
  }

  function removeTakeout(index: number) {
    setTakeout((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave() {
    setSaving(true);
    setStatus(null);
    try {
      const menuBody = menu.map((item, i) => ({ set_label: LABELS[i], ...item }));
      const [menuRes, takeoutRes] = await Promise.all([
        fetch("/api/admin/menu", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(menuBody),
        }),
        fetch("/api/admin/takeout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: takeout, note: takeoutNote }),
        }),
      ]);
      if (!menuRes.ok || !takeoutRes.ok) throw new Error();
      localStorage.removeItem(DRAFT_KEY);
      localStorage.removeItem(TAKEOUT_DRAFT_KEY);
      localStorage.removeItem(TAKEOUT_NOTE_DRAFT_KEY);
      setStatus({ msg: "保存しました！お客さん画面に切り替えます...", error: false });
      setTimeout(() => router.push("/"), 1500);
    } catch {
      setStatus({ msg: "エラーが発生しました。もう一度お試しください。", error: true });
      setSaving(false);
    }
  }

  return (
    <div className="admin-wrap">
      <h1 className="admin-title">本日の昼御膳 編集</h1>

      <div className="admin-form">
        {menu.map((item, index) => (
          <div key={index} className="set-card">
            <div className="set-card-header">
              <p className="set-card-title">{LABELS[index]}定食</p>
              {menu.length > 1 && (
                <button
                  className="remove-btn"
                  onClick={() => removeSet(index)}
                  aria-label={`${LABELS[index]}定食を削除`}
                >
                  削除
                </button>
              )}
            </div>

            <div className="field-group">
              <label className="field-label">料理名（1行に1品ずつ）</label>
              <textarea
                className="field-textarea"
                value={item.dishes}
                onChange={(e) => updateField(index, "dishes", e.target.value)}
                placeholder={"例:\nお刺身盛り合わせ\n銀鮭の西京風味噌焼き"}
              />
              <p className="field-hint">Enterキーで改行して複数の料理を書けます</p>
            </div>

            <div className="field-group">
              <label className="field-label">価格</label>
              <input
                className="field-input"
                type="text"
                inputMode="numeric"
                value={item.price}
                onChange={(e) => updateField(index, "price", e.target.value)}
                placeholder="例: 1,800"
              />
            </div>

            <div className="field-group">
              <label className="field-label">肩書き（省略可・定食名の横に表示）</label>
              <input
                className="field-input"
                type="text"
                value={item.note}
                onChange={(e) => updateField(index, "note", e.target.value)}
                placeholder="例: ぱちーの定番　店主おすすめ"
              />
            </div>

            <div className="field-group">
              <label className="field-label">限定バッジ（省略可・右上の丸に表示）</label>
              <input
                className="field-input"
                type="text"
                value={item.limit_note}
                onChange={(e) => updateField(index, "limit_note", e.target.value)}
                placeholder="例: 限定3食!"
              />
            </div>
          </div>
        ))}

        {menu.length < LABELS.length && (
          <button className="add-btn" onClick={addSet}>
            ＋ 定食を追加
          </button>
        )}

        {/* テイクアウト部門 */}
        <div className="set-card takeout-card">
          <div className="set-card-header">
            <p className="set-card-title takeout-title">テイクアウト</p>
          </div>
          <p className="field-hint takeout-hint">
            お弁当など、テイクアウトの品を入力してください。空欄の行は保存されません。
          </p>

          {takeout.map((item, index) => (
            <div key={index} className="takeout-row">
              <input
                className="field-input takeout-name"
                type="text"
                value={item.name}
                onChange={(e) => updateTakeout(index, "name", e.target.value)}
                placeholder="品名（例: 唐揚げ弁当）"
              />
              <input
                className="field-input takeout-price"
                type="text"
                inputMode="numeric"
                value={item.price}
                onChange={(e) => updateTakeout(index, "price", e.target.value)}
                placeholder="価格"
              />
              {takeout.length > 1 && (
                <button
                  className="remove-btn takeout-remove"
                  onClick={() => removeTakeout(index)}
                  aria-label={`${index + 1}行目を削除`}
                >
                  削除
                </button>
              )}
            </div>
          ))}

          {takeout.length < MAX_TAKEOUT && (
            <button className="add-btn takeout-add" onClick={addTakeout}>
              ＋ 品を追加
            </button>
          )}

          <div className="field-group takeout-note-group">
            <label className="field-label">
              リストの下のひとこと（省略可）
            </label>
            <input
              className="field-input"
              type="text"
              value={takeoutNote}
              onChange={(e) => setTakeoutNote(e.target.value)}
              placeholder="例: ご予約承ります"
            />
            <p className="field-hint">
              「ご予約承ります」「前日までにご予約ください」など。空欄にすると表示されません。
            </p>
          </div>
        </div>

        <button className="save-btn" onClick={handleSave} disabled={saving}>
          {saving ? "保存中..." : "保存する"}
        </button>

        {status && (
          <p className={`save-status${status.error ? " error" : ""}`}>
            {status.msg}
          </p>
        )}
      </div>
    </div>
  );
}
