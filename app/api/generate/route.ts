import { NextResponse } from "next/server";
import { generateLessonFromText } from "@/lib/gemini";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { text?: string };
    if (!body.text || body.text.trim().length < 100) {
      return NextResponse.json({ error: "Input text is too short." }, { status: 400 });
    }
    const generated = await generateLessonFromText(body.text);
    return NextResponse.json({ generated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected generation error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
