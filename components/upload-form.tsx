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
      className="space-y-4 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-md shadow-slate-900/[0.04] md:p-6 dark:bg-[var(--color-surface-elevated)]"
    >
      <label className="block text-sm font-bold text-slate-800 dark:text-slate-100" htmlFor="file-input">
        Tải tài liệu Word (.docx)
      </label>
      <label
        htmlFor="file-input"
        className="block cursor-pointer rounded-2xl border-2 border-dashed border-[var(--color-primary)]/35 bg-[var(--color-surface-muted)] p-6 transition hover:border-[var(--color-primary)]/60 hover:bg-[var(--color-surface)] dark:border-[var(--color-primary)]/40 dark:hover:bg-slate-800/80"
      >
        <div className="space-y-1">
          <p className="text-sm font-semibold text-[var(--color-primary)]">Chọn hoặc kéo thả tệp vào đây</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Hỗ trợ định dạng .docx</p>
          <p className="pt-2 text-sm text-slate-700 dark:text-slate-200">
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
        className="w-full rounded-full bg-[var(--color-primary)] px-4 py-3.5 font-semibold text-white shadow-md transition hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-55"
      >
        {isLoading ? "AI đang tạo bài học..." : "Tạo bài học"}
      </button>
      {message ? <p className="text-sm text-slate-600 dark:text-slate-300">{message}</p> : null}
    </form>
  );
}
