import { getRequestContext } from "@cloudflare/next-on-pages";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  const { env } = getRequestContext();
  const result = await env.DB.prepare(
    "SELECT set_label, dishes, price, note FROM lunch_menu ORDER BY display_order ASC"
  ).all();
  return NextResponse.json(result.results);
}
