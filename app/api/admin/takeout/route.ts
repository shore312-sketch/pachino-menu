import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextRequest, NextResponse } from "next/server";

type TakeoutItem = {
  name: string;
  price: string;
};

export async function POST(request: NextRequest) {
  const { env } = await getCloudflareContext({ async: true });
  const body: TakeoutItem[] = await request.json();

  // 空行（品名なし）は保存しない
  const items = body.filter((item) => item.name.trim() !== "");

  // 全件入れ替え
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

  return NextResponse.json({ ok: true });
}
