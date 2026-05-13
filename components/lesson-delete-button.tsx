"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface LessonDeleteButtonProps {
  lessonId: string;
  lessonTitle: string;
  redirectTo?: string;
  variant?: "list" | "detail";
}

export function LessonDeleteButton({
  lessonId,
  lessonTitle,
  redirectTo = "/lessons",
  variant = "list",
}: LessonDeleteButtonProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onDelete() {
    const ok = window.confirm(`Xóa khóa học "${lessonTitle}"? Thao tác không thể hoàn tác.`);
    if (!ok) return;
    setBusy(true);
    try {
      const response = await fetch(`/api/lessons/${lessonId}`, { method: "DELETE" });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        window.alert(payload?.error ?? "Không xóa được khóa học.");
        return;
      }
      router.push(redirectTo);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  const base =
    variant === "detail"
      ? "rounded-full border border-rose-200 bg-rose-50 px-5 py-2 text-sm font-semibold text-rose-800 shadow-sm transition hover:bg-rose-100 disabled:opacity-55 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-100 dark:hover:bg-rose-950/70"
      : "relative z-10 rounded-full border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 shadow-sm transition hover:bg-rose-50 disabled:opacity-55 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-100 dark:hover:bg-rose-950/60";

  return (
    <button type="button" className={base} disabled={busy} onClick={onDelete}>
      {busy ? "Đang xóa…" : "Xóa"}
    </button>
  );
}
