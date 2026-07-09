import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextResponse } from "next/server";

export async function GET() {
  const { env } = await getCloudflareContext({ async: true });
  const result = await env.DB.prepare(
    "SELECT name, price FROM takeout_menu ORDER BY display_order ASC"
  ).all();
  return NextResponse.json(result.results);
}
