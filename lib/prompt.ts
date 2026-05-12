export const GENERATION_PROMPT_TEMPLATE = `Bạn là trợ lý tạo bộ ôn thi cho học viên thi công an văn bằng 2.
Nhiệm vụ: chỉ dựa trên nội dung văn bản đầu vào, tạo bộ câu hỏi - trả lời để học theo kiểu Quizlet.

Yêu cầu nghiêm ngặt:
1) Chỉ dùng thông tin có trong văn bản. Nếu thiếu dữ kiện, bỏ qua ý đó, không suy đoán.
2) Tạo tiêu đề bài học ngắn gọn (5-12 từ) phản ánh chủ đề chính.
3) Tạo từ 20 đến 40 thẻ học (cards), ưu tiên chất lượng hơn số lượng.
4) Câu hỏi đa dạng mức độ: nhận biết, giải thích bản chất, so sánh, vận dụng ngắn.
5) Mỗi card phải rõ ràng, 1 ý chính, trả lời ngắn gọn dễ nhớ.
6) Ngôn ngữ: tiếng Việt học thuật, dễ ôn thi.
7) Trả về ĐÚNG JSON theo schema, không thêm markdown, không thêm chú thích.

JSON schema bắt buộc:
{
  "lesson_title": "string",
  "source_summary": "string",
  "cards": [
    {
      "question": "string",
      "answer": "string",
      "explanation": "string"
    }
  ]
}

Tiêu chí chất lượng:
- question: tối đa 220 ký tự.
- answer: tối đa 320 ký tự, đi thẳng trọng tâm.
- explanation: 1-3 câu, làm rõ vì sao đáp án đúng.
- Không trùng câu hỏi.
- Không dùng câu mơ hồ kiểu "trình bày tất cả".`;

export function buildGenerationPrompt(documentText: string) {
  return `${GENERATION_PROMPT_TEMPLATE}

Văn bản đầu vào:
${documentText}`;
}
