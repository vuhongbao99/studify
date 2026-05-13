"use client";

import { useCallback, useMemo, useState } from "react";
import { StudyFlipCard, useSpaceToFlip } from "@/components/study-flip-card";
import { normalizeComparable } from "@/lib/quiz-shared";
import { shuffleCards } from "@/lib/shuffle";
import type { Card } from "@/types/study";

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

function ShuffleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="opacity-80" aria-hidden>
      <path
        d="M18 4h-3a4 4 0 0 0-3.5 6M6 20h3a4 4 0 0 0 3.5-6M6 4l-2 4h4M18 20l2-4h-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
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

  const toggleFlipOpen = useCallback(() => {
    setShowFlipAnswer((value) => !value);
  }, []);

  useSpaceToFlip(toggleFlipOpen, Boolean(card?.question_type === "open"));

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
      <p className="rounded-[var(--radius-card)] border border-dashed border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-10 text-center text-slate-500">
        Chưa có câu hỏi nào.
      </p>
    );
  }

  const isQuiz = isQuizCard(card);
  const showResult = isQuiz && selected !== null;
  const wasCorrect = Boolean(showResult && selected && isAnswerCorrect(card, selected));

  const typeBadge =
    card.question_type === "mcq"
      ? "Trắc nghiệm"
      : card.question_type === "true_false"
        ? "Đúng / Sai"
        : "Thẻ";

  return (
    <section className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50 md:text-2xl">
              {title}
            </h2>
            {quizCardsTotal > 0 ? (
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Đếm đúng / sai cho các câu trắc nghiệm và đúng—sai trong phiên này.
              </p>
            ) : null}
          </div>
          <label className="flex cursor-pointer items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm dark:bg-[var(--color-surface-elevated)] dark:text-slate-200">
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
            <ShuffleIcon />
            <span>Trộn</span>
          </label>
        </div>

        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200/90 dark:bg-slate-700/80">
          <div
            className="h-full rounded-full bg-[var(--color-primary)] transition-[width] duration-300 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[var(--color-surface-muted)] px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              {typeBadge}
            </span>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Câu {index + 1} trong {activeCards.length}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex min-h-11 min-w-[5.75rem] items-center justify-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 text-sm font-bold text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/50 dark:text-rose-200">
              <span aria-hidden>✗</span>
              {wrongCount}
            </span>
            <span className="inline-flex min-h-11 min-w-[5.75rem] items-center justify-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 text-sm font-bold text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/50 dark:text-emerald-200">
              <span aria-hidden>✓</span>
              {correctCount}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-xl shadow-slate-900/[0.06] dark:bg-[var(--color-surface-elevated)] md:p-8">
        {card.question_type === "open" ? (
          <StudyFlipCard
            question={card.question}
            answer={card.answer}
            explanation={card.explanation}
            flipped={showFlipAnswer}
            onFlip={toggleFlipOpen}
          />
        ) : (
          <>
            <p className="text-lg font-semibold leading-relaxed text-slate-900 dark:text-slate-50 md:text-xl">
              {card.question}
            </p>

            {card.question_type === "mcq" && card.options && card.options.length === 4 ? (
              <div className="mt-6 space-y-3" role="group" aria-label="Lựa chọn trắc nghiệm">
                {card.options.map((option, optionIndex) => {
                  const letter = String.fromCharCode(65 + optionIndex);
                  const isChosen =
                    selected !== null && normalizeComparable(selected) === normalizeComparable(option);
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
                      aria-pressed={isChosen}
                      className={[
                        "flex w-full items-start gap-4 rounded-2xl border px-4 py-4 text-left text-sm leading-relaxed transition",
                        highlightCorrect
                          ? "border-emerald-500 bg-emerald-50 text-emerald-950 dark:border-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-50"
                          : highlightWrong
                            ? "border-rose-400 bg-rose-50 text-rose-950 dark:border-rose-500 dark:bg-rose-950/40 dark:text-rose-50"
                            : "border-[var(--color-border)] bg-[var(--color-surface-muted)] text-slate-800 hover:border-[var(--color-primary)]/50 dark:bg-slate-800/70 dark:text-slate-100",
                      ].join(" ")}
                    >
                      <span className="mt-0.5 inline-flex size-9 flex-none items-center justify-center rounded-lg bg-[var(--color-surface)] text-sm font-bold text-[var(--color-primary)] ring-1 ring-[var(--color-border)] dark:bg-slate-900">
                        {letter}
                      </span>
                      <span className="pt-0.5">{option}</span>
                    </button>
                  );
                })}
              </div>
            ) : null}

            {card.question_type === "true_false" ? (
              <div className="mt-6 grid grid-cols-2 gap-3" role="group" aria-label="Đúng hoặc Sai">
                {TF_LABELS.map((label) => {
                  const isChosen =
                    selected !== null && normalizeComparable(selected) === normalizeComparable(label);
                  const isCorrectOpt = normalizeComparable(label) === normalizeComparable(card.answer);
                  const highlightCorrect = showResult && isCorrectOpt;
                  const highlightWrong = showResult && isChosen && !isCorrectOpt;
                  return (
                    <button
                      key={label}
                      type="button"
                      disabled={showResult}
                      onClick={() => onPickQuiz(label)}
                      aria-pressed={isChosen}
                      className={[
                        "rounded-2xl border px-4 py-4 text-center text-base font-bold transition",
                        highlightCorrect
                          ? "border-emerald-500 bg-emerald-50 text-emerald-950 dark:border-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-50"
                          : highlightWrong
                            ? "border-rose-400 bg-rose-50 text-rose-950 dark:border-rose-500 dark:bg-rose-950/40 dark:text-rose-50"
                            : "border-[var(--color-border)] bg-[var(--color-surface-muted)] text-slate-800 hover:border-[var(--color-primary)]/50 dark:bg-slate-800/70 dark:text-slate-100",
                      ].join(" ")}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            ) : null}

            {card.question_type === "mcq" && (!card.options || card.options.length !== 4) ? (
              <p className="mt-4 text-sm text-amber-700 dark:text-amber-200">
                Thiếu dữ liệu đáp án trắc nghiệm. Hãy chạy migration hoặc tạo lại bài học.
              </p>
            ) : null}
          </>
        )}

        {isQuiz && showResult ? (
          <div
            className={[
              "mt-6 rounded-2xl border p-4 md:p-5",
              wasCorrect
                ? "border-emerald-200 bg-emerald-50/80 dark:border-emerald-800 dark:bg-emerald-950/35"
                : "border-amber-200 bg-amber-50/80 dark:border-amber-900 dark:bg-amber-950/35",
            ].join(" ")}
            role="status"
          >
            <p
              className={`text-sm font-bold ${wasCorrect ? "text-emerald-800 dark:text-emerald-200" : "text-amber-900 dark:text-amber-100"}`}
            >
              {wasCorrect ? "Chính xác!" : "Chưa đúng — đáp án đúng đã được làm nổi bật."}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">{card.explanation}</p>
          </div>
        ) : null}
      </div>

      <div className="flex items-center justify-center gap-4 sm:gap-8">
        <button
          type="button"
          onClick={previous}
          disabled={index <= 0}
          className="flex size-14 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-primary)] shadow-md transition enabled:hover:border-[var(--color-primary)] enabled:hover:bg-[var(--color-surface-muted)] disabled:cursor-not-allowed disabled:opacity-40 dark:bg-[var(--color-surface-elevated)]"
          aria-label="Câu trước"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M15 6l-6 6 6 6"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <span className="min-w-[5.5rem] text-center text-lg font-bold tabular-nums text-slate-800 dark:text-slate-100">
          {index + 1} / {activeCards.length}
        </span>

        <button
          type="button"
          onClick={next}
          disabled={index >= activeCards.length - 1}
          className="flex size-14 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-primary)] shadow-md transition enabled:hover:border-[var(--color-primary)] enabled:hover:bg-[var(--color-surface-muted)] disabled:cursor-not-allowed disabled:opacity-40 dark:bg-[var(--color-surface-elevated)]"
          aria-label="Câu tiếp theo"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M9 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </section>
  );
}
