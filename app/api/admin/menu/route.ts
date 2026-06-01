import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextRequest, NextResponse } from "next/server";

type MenuItem = {
  set_label: string;
  dishes: string;
  price: string;
  note: string;
};

export async function POST(request: NextRequest) {
  const { env } = await getCloudflareContext({ async: true });
  const body: MenuItem[] = await request.json();

  // 全件入れ替え（削除されたセットも消える）
  await env.DB.prepare("DELETE FROM lunch_menu").run();

  for (let i = 0; i < body.length; i++) {
    const item = body[i];
    await env.DB.prepare(
      `INSERT INTO lunch_menu (set_label, dishes, price, note, display_order)
       VALUES (?, ?, ?, ?, ?)`
    )
      .bind(item.set_label, item.dishes, item.price, item.note, i + 1)
      .run();
  }

  return NextResponse.json({ ok: true });
}
