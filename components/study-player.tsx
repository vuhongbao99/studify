"use client";

import { useEffect, useMemo, useState } from "react";
import type { Card } from "@/types/study";
import { normalizeComparable } from "@/lib/quiz-shared";
import { shuffleCards } from "@/lib/shuffle";

const TF_LABELS = ["Đúng", "Sai"] as const;

interface StudyPlayerProps {
  cards: Card[];
  title: string;
}

function isQuizCard(card: Card) {
  return card.question_type === "mcq" || card.question_type === "true_false";
}

function isAnswerCorrect(card: Card, picked: string) {
  return normalizeComparable(picked) === normalizeComparable(card.answer);
}

export function StudyPlayer({ cards, title }: StudyPlayerProps) {
  const [index, setIndex] = useState(0);
  const [showFlipAnswer, setShowFlipAnswer] = useState(false);
  const [shuffleEnabled, setShuffleEnabled] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  const activeCards = useMemo(
    () => (shuffleEnabled ? shuffleCards(cards, 2026) : cards),
    [cards, shuffleEnabled],
  );
  const card = activeCards[index];
  const progressPct =
    activeCards.length === 0 ? 0 : Math.round(((index + 1) / activeCards.length) * 100);
  const quizCardsTotal = useMemo(
    () => activeCards.filter((item) => isQuizCard(item)).length,
    [activeCards],
  );

  useEffect(() => {
    setShowFlipAnswer(false);
    setSelected(null);
  }, [index, card?.id]);

  function next() {
    setShowFlipAnswer(false);
    setSelected(null);
    setIndex((current) => Math.min(current + 1, Math.max(activeCards.length - 1, 0)));
  }

  function previous() {
    setShowFlipAnswer(false);
    setSelected(null);
    setIndex((current) => Math.max(current - 1, 0));
  }

  function onPickQuiz(answer: string) {
    if (!card || !isQuizCard(card) || selected !== null) return;
    setSelected(answer);
    if (isAnswerCorrect(card, answer)) {
      setCorrectCount((value) => value + 1);
    } else {
      setWrongCount((value) => value + 1);
    }
  }

  if (!card) {
    return (
      <p className="rounded-2xl border border-slate-700/60 bg-slate-900/40 px-4 py-6 text-slate-300">
        Chưa có câu hỏi nào.
      </p>
    );
  }

  const isQuiz = isQuizCard(card);
  const showResult = isQuiz && selected !== null;
  const wasCorrect = Boolean(showResult && selected && isAnswerCorrect(card, selected));

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white md:text-2xl">
            {title}
          </h2>
          {quizCardsTotal > 0 ? (
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Điểm trên các câu trắc nghiệm & đúng/sai trong phiên này.
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex cursor-pointer items-center gap-2 rounded-full border border-indigo-200/80 bg-white/80 px-3 py-2 text-sm font-medium text-indigo-800 shadow-sm backdrop-blur dark:border-indigo-800/60 dark:bg-slate-900/80 dark:text-indigo-100">
            <input
              type="checkbox"
              checked={shuffleEnabled}
              onChange={(event) => {
                setShuffleEnabled(event.target.checked);
                setShowFlipAnswer(false);
                setSelected(null);
                setCorrectCount(0);
                setWrongCount(0);
                setIndex(0);
              }}
              className="size-4 rounded border-slate-300"
            />
            Trộn câu hỏi
          </label>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-sky-500 to-cyan-400 transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Câu {index + 1}/{activeCards.length}
            {card.question_type === "mcq"
              ? " · Trắc nghiệm"
              : card.question_type === "true_false"
                ? " · Đúng / Sai"
                : " · Thẻ mở"}
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex min-h-10 min-w-[5.5rem] items-center justify-center gap-2 rounded-full border border-rose-400/40 bg-rose-500/15 px-4 py-2 text-sm font-semibold text-rose-800 shadow-sm ring-1 ring-rose-500/25 dark:text-rose-100">
              <span aria-hidden>✗</span>
              <span>{wrongCount}</span>
              <span className="sr-only">Sai</span>
            </span>
            <span className="inline-flex min-h-10 min-w-[5.5rem] items-center justify-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-900 shadow-sm ring-1 ring-emerald-500/30 dark:text-emerald-100">
              <span aria-hidden>✓</span>
              <span>{correctCount}</span>
              <span className="sr-only">Đúng</span>
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200/80 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-5 text-slate-100 shadow-2xl shadow-indigo-950/25 ring-1 ring-white/10 md:p-8">
        <p className="text-sm font-medium text-slate-400">
          {index + 1}.{" "}
          <span className="text-slate-100">
            {card.question_type === "mcq"
              ? "Trắc nghiệm"
              : card.question_type === "true_false"
                ? "Đúng / Sai"
                : "Thẻ ôn"}
          </span>
        </p>
        <p className="mt-3 text-lg font-semibold leading-relaxed text-white md:text-xl">{card.question}</p>

        {card.question_type === "open" ? (
          <div className="mt-6 space-y-4">
            {showFlipAnswer ? (
              <div className="space-y-2 rounded-2xl border border-emerald-500/35 bg-emerald-500/10 p-4">
                <p className="text-sm font-semibold uppercase tracking-wide text-emerald-200/90">Đáp án</p>
                <p className="text-lg font-semibold text-emerald-50">{card.answer}</p>
                <p className="text-sm leading-relaxed text-emerald-100/90">{card.explanation}</p>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowFlipAnswer(true)}
                className="rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-900/40 transition hover:brightness-110"
              >
                Xem đáp án
              </button>
            )}
          </div>
        ) : null}

        {card.question_type === "mcq" && card.options && card.options.length === 4 ? (
          <div className="mt-6 space-y-3">
            {card.options.map((option, optionIndex) => {
              const letter = String.fromCharCode(65 + optionIndex);
              const isChosen = selected !== null && normalizeComparable(selected) === normalizeComparable(option);
              const isCorrectOpt =
                normalizeComparable(option) === normalizeComparable(card.answer);
              const highlightCorrect = showResult && isCorrectOpt;
              const highlightWrong = showResult && isChosen && !isCorrectOpt;
              return (
                <button
                  key={`${letter}-${option}`}
                  type="button"
                  disabled={showResult}
                  onClick={() => onPickQuiz(option)}
                  className={[
                    "flex w-full items-start gap-3 rounded-2xl border px-4 py-3.5 text-left text-sm leading-relaxed transition",
                    highlightCorrect
                      ? "border-emerald-400 bg-emerald-500/20 text-emerald-50 ring-2 ring-emerald-400/60"
                      : highlightWrong
                        ? "border-rose-400 bg-rose-500/15 text-rose-50 ring-2 ring-rose-400/50"
                        : "border-slate-600/80 bg-slate-800/60 text-slate-100 hover:border-indigo-400/50 hover:bg-slate-800",
                  ].join(" ")}
                >
                  <span className="mt-0.5 inline-flex size-8 flex-none items-center justify-center rounded-lg bg-slate-950/50 text-xs font-bold text-indigo-200 ring-1 ring-white/10">
                    {letter}
                  </span>
                  <span className="pt-0.5">{option}</span>
                </button>
              );
            })}
          </div>
        ) : null}

        {card.question_type === "true_false" ? (
          <div className="mt-6 grid grid-cols-2 gap-3">
            {TF_LABELS.map((label) => {
              const isChosen = selected !== null && normalizeComparable(selected) === normalizeComparable(label);
              const isCorrectOpt = normalizeComparable(label) === normalizeComparable(card.answer);
              const highlightCorrect = showResult && isCorrectOpt;
              const highlightWrong = showResult && isChosen && !isCorrectOpt;
              return (
                <button
                  key={label}
                  type="button"
                  disabled={showResult}
                  onClick={() => onPickQuiz(label)}
                  className={[
                    "rounded-2xl border px-4 py-4 text-center text-base font-semibold transition",
                    highlightCorrect
                      ? "border-emerald-400 bg-emerald-500/20 text-emerald-50 ring-2 ring-emerald-400/60"
                      : highlightWrong
                        ? "border-rose-400 bg-rose-500/15 text-rose-50 ring-2 ring-rose-400/50"
                        : "border-slate-600/80 bg-slate-800/60 text-slate-100 hover:border-indigo-400/50 hover:bg-slate-800",
                  ].join(" ")}
                >
                  {label}
                </button>
              );
            })}
          </div>
        ) : null}

        {isQuiz && showResult ? (
          <div
            className={[
              "mt-6 rounded-2xl border p-4 md:p-5",
              wasCorrect
                ? "border-emerald-500/45 bg-emerald-500/10"
                : "border-amber-500/40 bg-amber-500/10",
            ].join(" ")}
            role="status"
          >
            <p className={`text-sm font-bold ${wasCorrect ? "text-emerald-200" : "text-amber-100"}`}>
              {wasCorrect ? "Chính xác!" : "Chưa đúng — đáp án đúng đã được làm nổi bật."}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-100/95">{card.explanation}</p>
          </div>
        ) : null}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={previous}
          className="flex-1 rounded-xl border border-slate-300 bg-white/90 px-4 py-3 font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:bg-slate-800"
        >
          Quay lại
        </button>
        <button
          type="button"
          onClick={next}
          className="flex-1 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 px-4 py-3 font-semibold text-white shadow-lg shadow-indigo-900/25 transition hover:brightness-110"
        >
          Tiếp theo
        </button>
      </div>
    </section>
  );
}
