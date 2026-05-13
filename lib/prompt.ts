export const GENERATION_PROMPT_TEMPLATE = `Bạn là trợ lý tạo bộ ôn thi cho học viên thi công an văn bằng 2.
Nhiệm vụ: chỉ dựa trên nội dung văn bản đầu vào, tạo bộ câu hỏi để họ dưới HAI dạng: (1) trắc nghiệm 4 đáp án, (2) đúng/sai.

Yêu cầu nghiêm ngặt:
1) Chỉ dùng thông tin có trong văn bản. Nếu thiếu dữ kiện, bỏ qua ý đó, không suy đoán.
2) Tạo tiêu đề bài học ngắn gọn (5-12 từ) phản ánh chủ đề chính.
3) Tạo từ 20 đến 40 câu hỏi tổng cộng, ưu tiên chất lượng.
4) Trong tổng số câu, phải có ÍT NHẤT 5 câu trắc nghiệm (question_type = "mcq") và ÍT NHẤT 5 câu đúng/sai (question_type = "true_false").
5) Mỗi câu 1 ý chính, đáp án rõ ràng.
6) Ngôn ngữ: tiếng Việt học thuật, dễ ôn thi.
7) Trả về ĐÚNG JSON theo schema, không thêm markdown, không thêm chú thích.

JSON schema bắt buộc:
{
  "lesson_title": "string",
  "source_summary": "string",
  "cards": [
    {
      "question_type": "mcq",
      "question": "string",
      "options": ["đáp án A", "đáp án B", "đáp án C", "đáp án D"],
      "answer": "string (phải TRÙNG NGUYÊN VĂN với một trong 4 options)",
      "explanation": "string"
    },
    {
      "question_type": "true_false",
      "question": "string",
      "answer": "Đúng hoặc Sai (chỉ một trong hai từ này)",
      "explanation": "string"
    }
  ]
}

Quy tắc theo loại câu:
- mcq: luôn có đúng 4 phần tử trong "options", các đáp án nhiễu phải sai nhưng có vẻ hợp lý, "answer" trùng với một option.
- true_false: không dùng field "options"; "answer" chỉ là "Đúng" hoặc "Sai".

Tiêu chí chất lượng:
- question: tối đa 320 ký tự.
- explanation: 1-3 câu, làm rõ vì sao đáp án đúng.
- Không trùng câu hỏi.
- Không dùng câu mơ hồ kiểu "trình bày tất cả".`;

export function buildGenerationPrompt(documentText: string) {
  return `${GENERATION_PROMPT_TEMPLATE}

Văn bản đầu vào:
${documentText}`;
}
