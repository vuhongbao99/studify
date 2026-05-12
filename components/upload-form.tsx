"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function UploadForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

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
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border bg-white p-5 shadow-sm">
      <label className="block text-sm font-medium text-slate-700" htmlFor="file-input">
        Upload tài liệu Word (.docx)
      </label>
      <input
        id="file-input"
        type="file"
        name="file"
        accept=".docx"
        className="w-full rounded-lg border p-2 text-sm"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-sky-600 px-4 py-2 font-semibold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-sky-300"
      >
        {isLoading ? "Đang tạo bài học bằng AI..." : "Tạo bài học"}
      </button>
      {message ? <p className="text-sm text-slate-600">{message}</p> : null}
    </form>
  );
}
