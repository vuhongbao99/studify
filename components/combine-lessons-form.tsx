"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Lesson } from "@/types/study";

export function CombineLessonsForm({ lessons }: { lessons: Lesson[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  const canStart = useMemo(() => selected.length > 0, [selected]);

  return (
    <section className="space-y-3 rounded-2xl border bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Học gộp nhiều bài</h2>
      <div className="max-h-72 space-y-2 overflow-auto">
        {lessons.map((lesson) => (
          <label key={lesson.id} className="flex items-start gap-2 rounded-lg border p-2 text-sm">
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
        className="w-full rounded-lg bg-sky-600 px-4 py-2 font-semibold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-sky-300"
      >
        Học {selected.length} bài đã chọn
      </button>
    </section>
  );
}
