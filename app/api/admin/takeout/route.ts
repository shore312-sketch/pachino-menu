import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextRequest, NextResponse } from "next/server";

type TakeoutItem = {
  name: string;
  price: string;
};

type TakeoutPayload = {
  items: TakeoutItem[];
  note: string;
};

export async function POST(request: NextRequest) {
  const { env } = await getCloudflareContext({ async: true });
  const body: TakeoutPayload = await request.json();

  // 空行（品名なし）は保存しない
  const items = (body.items ?? []).filter((item) => item.name.trim() !== "");

  // 品目を全件入れ替え
  await env.DB.prepare("DELETE FROM takeout_menu").run();
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    await env.DB.prepare(
      `INSERT INTO takeout_menu (name, price, display_order)
       VALUES (?, ?, ?)`
    )
      .bind(item.name, item.price, i + 1)
      .run();
  }

  // ひとこと（ご予約承ります 等）を保存
  await env.DB.prepare(
    `INSERT INTO settings (key, value) VALUES ('takeout_note', ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`
  )
    .bind(body.note ?? "")
    .run();

  return NextResponse.json({ ok: true });
}
