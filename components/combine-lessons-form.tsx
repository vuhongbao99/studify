"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Lesson } from "@/types/study";

export function CombineLessonsForm({ lessons }: { lessons: Lesson[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  const canStart = useMemo(() => selected.length > 0, [selected]);

  return (
    <section className="space-y-3 rounded-3xl border border-indigo-100 bg-white/90 p-5 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Học gộp nhiều bài</h2>
      <div className="max-h-72 space-y-2 overflow-auto">
        {lessons.map((lesson) => (
          <label
            key={lesson.id}
            className="flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm"
          >
            <input
              type="checkbox"
              checked={selected.includes(lesson.id)}
              onChange={(event) => {
                if (event.target.checked) {
                  setSelected((prev) => [...prev, lesson.id]);
                } else {
                  setSelected((prev) => prev.filter((id) => id !== lesson.id));
                }
              }}
            />
            <span>
              <span className="block font-medium text-slate-900">{lesson.title}</span>
              <span className="text-slate-500">{lesson.source_filename}</span>
            </span>
          </label>
        ))}
      </div>
      <button
        type="button"
        disabled={!canStart}
        onClick={() => router.push(`/study?lessonIds=${selected.join(",")}`)}
        className="w-full rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
      >
        Học {selected.length} bài đã chọn
      </button>
    </section>
  );
}
