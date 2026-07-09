CREATE TABLE IF NOT EXISTS lunch_menu (
  id INTEGER PRIMARY KEY,
  set_label TEXT NOT NULL UNIQUE,
  dishes TEXT NOT NULL DEFAULT '',
  price TEXT NOT NULL DEFAULT '',
  note TEXT DEFAULT '',
  display_order INTEGER DEFAULT 0
);

INSERT OR IGNORE INTO lunch_menu (set_label, dishes, price, note, display_order) VALUES
  ('A', 'お刺身盛り合わせ
銀鮭の西京風味噌焼き
赤魚となすの和風あんかけ', '1,800', '1番人気', 1),
  ('B', '若鶏ももの塩からあげ
白身魚フライ 定食', '1,650', '', 2),
  ('C', 'お刺身盛り合わせ（限定）
エビ天大葉巻き ごしきの塩で
若鶏ももの塩つくねバーグ', '2,000', '限定23食', 3);

CREATE TABLE IF NOT EXISTS takeout_menu (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  price TEXT NOT NULL DEFAULT '',
  display_order INTEGER NOT NULL DEFAULT 0
);
