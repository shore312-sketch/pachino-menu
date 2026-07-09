"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type MenuItem = {
  dishes: string;
  price: string;
  note: string;
};

const LABELS = ["A", "B", "C", "D", "E"];
const DRAFT_KEY = "pachino-menu-draft";

const emptyItem = (): MenuItem => ({ dishes: "", price: "", note: "" });

export default function AdminPage() {
  const router = useRouter();
  const [menu, setMenu] = useState<MenuItem[]>([emptyItem()]);
  const [status, setStatus] = useState<{ msg: string; error: boolean } | null>(null);
  const [saving, setSaving] = useState(false);
  const loaded = useRef(false);

  // 起動時：まず端末の下書きを復元、なければDBから取得
  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        // localStorageはSSRで読めないため、復元はマウント後の非同期タイミングで行う
        Promise.resolve().then(() => {
          setMenu(parsed);
          loaded.current = true;
        });
        return;
      } catch {
        localStorage.removeItem(DRAFT_KEY);
      }
    }
    fetch("/api/menu")
      .then((r) => r.json())
      .then((data: Array<MenuItem & { set_label: string }>) => {
        setMenu(data.length > 0
          ? data.map(({ dishes, price, note }) => ({ dishes, price, note }))
          : [emptyItem()]
        );
      })
      .catch(() => setMenu([emptyItem()]))
      .finally(() => { loaded.current = true; });
  }, []);

  // 入力のたびに下書きを端末に保存
  useEffect(() => {
    if (!loaded.current || menu.length === 0) return;
    localStorage.setItem(DRAFT_KEY, JSON.stringify(menu));
  }, [menu]);

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

  async function handleSave() {
    setSaving(true);
    setStatus(null);
    try {
      const body = menu.map((item, i) => ({ set_label: LABELS[i], ...item }));
      const res = await fetch("/api/admin/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      localStorage.removeItem(DRAFT_KEY); // 保存成功したら下書き削除
      setStatus({ msg: "保存しました！お客さん画面に切り替えます...", error: false });
      setTimeout(() => router.push("/"), 1500);
    } catch {
      setStatus({ msg: "エラーが発生しました。もう一度お試しください。", error: true });
      setSaving(false);
    }
  }

  return (
    <div className="admin-wrap">
      <h1 className="admin-title">本日のランチ 編集</h1>

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
              <label className="field-label">バッジ（省略可）</label>
              <input
                className="field-input"
                type="text"
                value={item.note}
                onChange={(e) => updateField(index, "note", e.target.value)}
                placeholder="例: 1番人気　限定10食"
              />
            </div>
          </div>
        ))}

        {menu.length < LABELS.length && (
          <button className="add-btn" onClick={addSet}>
            ＋ 定食を追加
          </button>
        )}

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
