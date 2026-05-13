"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Lesson } from "@/types/study";

export function CombineLessonsForm({ lessons }: { lessons: Lesson[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  const canStart = useMemo(() => selected.length > 0, [selected]);

  return (
    <section className="space-y-4 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-md shadow-slate-900/[0.04] md:p-6 dark:bg-[var(--color-surface-elevated)]">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Học gộp nhiều bài</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Chọn ít nhất một bài để ôn trong một phiên.</p>
      </div>
      <div className="max-h-72 space-y-2 overflow-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-2 dark:bg-slate-800/60">
        {lessons.map((lesson) => (
          <label
            key={lesson.id}
            className="flex cursor-pointer items-start gap-3 rounded-lg border border-transparent bg-[var(--color-surface)] p-3 text-sm shadow-sm transition hover:border-[var(--color-primary)]/30 dark:bg-[var(--color-surface-elevated)]"
          >
            <input
              type="checkbox"
              className="mt-1 size-4 rounded border-slate-300"
              checked={selected.includes(lesson.id)}
              onChange={(event) => {
                if (event.target.checked) {
                  setSelected((prev) => [...prev, lesson.id]);
                } else {
                  setSelected((prev) => prev.filter((id) => id !== lesson.id));
                }
              }}
            />
            <span className="min-w-0">
              <span className="block font-semibold text-slate-900 dark:text-slate-100">{lesson.title}</span>
              <span className="block text-xs text-slate-500 dark:text-slate-400">
                {typeof lesson.card_count === "number" ? `${lesson.card_count} câu · ` : ""}
                {lesson.source_filename}
              </span>
            </span>
          </label>
        ))}
      </div>
      <button
        type="button"
        disabled={!canStart}
        onClick={() => router.push(`/study?lessonIds=${selected.join(",")}`)}
        className="w-full rounded-full bg-[var(--color-primary)] px-4 py-3 font-semibold text-white shadow-md transition hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-45"
      >
        Bắt đầu học gộp ({selected.length} bài)
      </button>
    </section>
  );
}
