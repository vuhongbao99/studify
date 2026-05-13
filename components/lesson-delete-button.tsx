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
      ? "rounded-xl border border-rose-300/80 bg-white px-4 py-2 text-sm font-semibold text-rose-700 shadow-sm transition hover:bg-rose-50 disabled:opacity-60 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-100 dark:hover:bg-rose-950/70"
      : "rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 disabled:opacity-60 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-100 dark:hover:bg-rose-950/60";

  return (
    <button type="button" className={base} disabled={busy} onClick={onDelete}>
      {busy ? "Đang xóa…" : "Xóa"}
    </button>
  );
}
