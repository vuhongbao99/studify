"use client";

import { useEffect, useRef, useState } from "react";

type StudyFlipCardProps = {
  question: string;
  answer: string;
  explanation: string;
  flipped: boolean;
  onFlip: () => void;
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

export function StudyFlipCard({ question, answer, explanation, flipped, onFlip }: StudyFlipCardProps) {
  const reducedMotion = usePrefersReducedMotion();

  if (reducedMotion) {
    return (
      <button
        type="button"
        onClick={onFlip}
        aria-expanded={flipped}
        aria-label={flipped ? "Đang xem đáp án, nhấn để xem câu hỏi" : "Đang xem câu hỏi, nhấn để lật"}
        className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-6 text-left shadow-inner transition hover:bg-[var(--color-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] md:p-8 min-h-[280px]"
      >
        {!flipped ? (
          <div className="flex h-full flex-col">
            <span className="text-xs font-bold uppercase tracking-wide text-slate-400">Câu hỏi</span>
            <p className="mt-4 text-xl font-semibold leading-relaxed text-slate-900 dark:text-slate-50 md:text-2xl">
              {question}
            </p>
            <p className="mt-auto pt-6 text-center text-sm font-medium text-[var(--color-primary)]">
              Nhấn để xem đáp án
            </p>
          </div>
        ) : (
          <div className="flex h-full flex-col space-y-4">
            <span className="text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
              Đáp án
            </span>
            <p className="text-xl font-semibold text-slate-900 dark:text-white md:text-2xl">{answer}</p>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{explanation}</p>
            <p className="mt-auto pt-4 text-center text-sm font-medium text-[var(--color-primary)]">
              Nhấn để quay lại câu hỏi
            </p>
          </div>
        )}
      </button>
    );
  }

  return (
    <div className="relative w-full [perspective:1200px]" role="presentation">
      <button
        type="button"
        onClick={onFlip}
        aria-expanded={flipped}
        aria-live="polite"
        aria-label={flipped ? "Mặt đáp án" : "Mặt câu hỏi"}
        className="relative flex min-h-[min(52vh,22rem)] w-full rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
      >
        <div
          className="relative min-h-[min(52vh,22rem)] w-full transition-transform duration-500 ease-out [transform-style:preserve-3d]"
          style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
        >
          <div
            className="absolute inset-0 flex flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-6 shadow-md [backface-visibility:hidden] md:p-8 dark:bg-slate-800/80"
            style={{ transform: "rotateY(0deg)" }}
          >
            <span className="text-xs font-bold uppercase tracking-wide text-slate-400">Câu hỏi</span>
            <p className="mt-4 flex-1 text-xl font-semibold leading-relaxed text-slate-900 dark:text-slate-50 md:text-2xl">
              {question}
            </p>
            <p className="mt-6 text-center text-sm font-medium text-slate-400">Nhấn hoặc Space để lật</p>
          </div>
          <div
            className="absolute inset-0 flex flex-col rounded-2xl border border-emerald-500/30 bg-emerald-50/95 p-6 shadow-md [backface-visibility:hidden] md:p-8 dark:border-emerald-500/25 dark:bg-emerald-950/50"
            style={{ transform: "rotateY(180deg)" }}
          >
            <span className="text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
              Đáp án
            </span>
            <p className="mt-4 text-xl font-semibold leading-snug text-slate-900 dark:text-white md:text-2xl">
              {answer}
            </p>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-700 dark:text-slate-200">{explanation}</p>
            <p className="mt-6 text-center text-sm font-medium text-emerald-700/80 dark:text-emerald-300/90">
              Nhấn để lật lại
            </p>
          </div>
        </div>
      </button>
    </div>
  );
}

/** Optional: wire Space to flip while this card is mounted (call from parent via ref callback) */
export function useSpaceToFlip(onFlip: () => void, enabled: boolean) {
  const flipRef = useRef(onFlip);

  useEffect(() => {
    flipRef.current = onFlip;
  }, [onFlip]);

  useEffect(() => {
    if (!enabled) return;
    function onKey(event: KeyboardEvent) {
      if (event.key !== " " && event.code !== "Space") return;
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      event.preventDefault();
      flipRef.current();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enabled]);
}
