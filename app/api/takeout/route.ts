import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextResponse } from "next/server";

export async function GET() {
  const { env } = await getCloudflareContext({ async: true });
  const items = await env.DB.prepare(
    "SELECT name, price FROM takeout_menu ORDER BY display_order ASC"
  ).all();
  const noteRow = await env.DB.prepare(
    "SELECT value FROM settings WHERE key = 'takeout_note'"
  ).first<{ value: string }>();
  return NextResponse.json({
    items: items.results,
    note: noteRow?.value ?? "",
  });
}
