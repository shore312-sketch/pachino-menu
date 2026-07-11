import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextResponse } from "next/server";

export async function GET() {
  const { env } = await getCloudflareContext({ async: true });
  const result = await env.DB.prepare(
    "SELECT set_label, dishes, price, note, limit_note FROM lunch_menu ORDER BY display_order ASC"
  ).all();
  return NextResponse.json(result.results);
}
