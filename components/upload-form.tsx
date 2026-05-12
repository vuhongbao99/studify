"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function UploadForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const input = form.elements.namedItem("file") as HTMLInputElement | null;
    const file = input?.files?.[0];
    if (!file) {
      setMessage("Vui lòng chọn file .docx.");
      return;
    }

    setIsLoading(true);
    setMessage(null);

    const body = new FormData();
    body.append("file", file);

    const response = await fetch("/api/upload", { method: "POST", body });
    const data = await response.json();
    setIsLoading(false);

    if (!response.ok) {
      setMessage(data.error ?? "Upload thất bại.");
      return;
    }

    setMessage("Tạo bài học thành công.");
    router.push(`/lessons/${data.lesson.id}`);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-3xl border border-indigo-100 bg-white/95 p-5 shadow-sm backdrop-blur md:p-6"
    >
      <label className="block text-sm font-semibold text-slate-700" htmlFor="file-input">
        Tải tài liệu Word (.docx)
      </label>
      <label
        htmlFor="file-input"
        className="block cursor-pointer rounded-2xl border-2 border-dashed border-indigo-200 bg-gradient-to-br from-indigo-50 to-cyan-50 p-5 transition hover:border-indigo-400 hover:from-indigo-100 hover:to-cyan-100"
      >
        <div className="space-y-1">
          <p className="text-sm font-semibold text-indigo-700">Chọn hoặc kéo thả tệp vào đây</p>
          <p className="text-xs text-slate-500">Hỗ trợ định dạng .docx</p>
          <p className="pt-2 text-sm text-slate-700">
            {fileName ? `Đã chọn: ${fileName}` : "Chưa có tệp nào được chọn"}
          </p>
        </div>
      </label>
      <input
        id="file-input"
        type="file"
        name="file"
        accept=".docx"
        className="hidden"
        onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")}
      />
      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
      >
        {isLoading ? "AI đang tạo bài học..." : "Tạo bài học"}
      </button>
      {message ? <p className="text-sm text-slate-600">{message}</p> : null}
    </form>
  );
}
