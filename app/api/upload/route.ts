import { NextResponse } from "next/server";
import { extractTextFromDocxBuffer } from "@/lib/docx";
import { generateLessonFromText } from "@/lib/gemini";
import { createLessonFromGenerated } from "@/lib/study-store";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File is required." }, { status: 400 });
    }
    if (!file.name.toLowerCase().endsWith(".docx")) {
      return NextResponse.json({ error: "Only .docx files are supported." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const text = await extractTextFromDocxBuffer(Buffer.from(arrayBuffer));
    const generated = await generateLessonFromText(text);
    const lesson = await createLessonFromGenerated(file.name, generated);

    return NextResponse.json({ lesson });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected upload error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
