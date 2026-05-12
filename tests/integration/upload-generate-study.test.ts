import { describe, expect, it } from "vitest";
import { buildGenerationPrompt } from "@/lib/prompt";

describe("upload-generate-study flow contract", () => {
  it("contains document text placeholder in prompt template", () => {
    const prompt = buildGenerationPrompt("Noi dung bai hoc");
    expect(prompt).toContain("Văn bản đầu vào:");
    expect(prompt).toContain("Noi dung bai hoc");
  });

  it("requires strict JSON keys in prompt", () => {
    const prompt = buildGenerationPrompt("abc");
    expect(prompt).toContain("\"lesson_title\"");
    expect(prompt).toContain("\"source_summary\"");
    expect(prompt).toContain("\"cards\"");
  });
});
