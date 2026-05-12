import { NextResponse } from "next/server";
import { getLessons } from "@/lib/study-store";

export async function GET() {
  try {
    const lessons = await getLessons();
    return NextResponse.json({ lessons });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch lessons.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
