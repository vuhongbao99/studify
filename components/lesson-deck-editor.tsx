"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import type { Card, QuestionType } from "@/types/study";

type Props = {
  lessonId: string;
  lessonTitle: string;
  initialCards: Card[];
};

function typeLabel(q: QuestionType) {
  if (q === "open") return "Flashcards";
  if (q === "mcq") return "Trắc nghiệm";
  return "Đúng / Sai";
}

function mcqCorrectIndex(card: Card): number {
  if (!card.options || card.options.length !== 4) return 0;
  const ans = card.answer.trim();
  const idx = card.options.findIndex((o) => o.trim() === ans);
  return idx >= 0 ? idx : 0;
}

function editorRowKey(card: Card) {
  const opt = card.options?.join("\uffff") ?? "";
  return `${card.id}:${card.question_type}:${card.question.length}:${card.answer.length}:${card.explanation.length}:${opt.length}:${opt.slice(0, 120)}`;
}

function CardEditorRow({
  lessonId,
  card,
}: {
  lessonId: string;
  card: Card;
}) {
  const router = useRouter();
  const [questionType, setQuestionType] = useState<QuestionType>(card.question_type);
  const [question, setQuestion] = useState(card.question);
  const [answerOpenOrTf, setAnswerOpenOrTf] = useState(card.answer);
  const [opts, setOpt] = useState<string[]>(() =>
    card.question_type === "mcq" && card.options?.length === 4
      ? [...card.options]
      : ["", "", "", ""],
  );
  const [mcqCorrectIx, setMcqCorrectIx] = useState(mcqCorrectIndex(card));
  const [explanation, setExplanation] = useState(card.explanation);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const rebuildMcqAnswer = useCallback(
    () => opts[mcqCorrectIx]?.trim() ?? "",
    [opts, mcqCorrectIx],
  );

  const buildPayload = useCallback(() => {
    const expl = explanation.trim();
    const q = question.trim();
    if (questionType === "mcq") {
      const optList = opts.map((o) => o.trim());
      return {
        question_type: "mcq" as const,
        question: q,
        answer: rebuildMcqAnswer(),
        explanation: expl,
        options: optList,
      };
    }
    if (questionType === "true_false") {
      return {
        question_type: "true_false" as const,
        question: q,
        answer: answerOpenOrTf.trim(),
        explanation: expl,
        options: null as null | undefined,
      };
    }
    return {
      question_type: "open" as const,
      question: q,
      answer: answerOpenOrTf.trim(),
      explanation: expl,
      options: undefined as undefined,
    };
  }, [answerOpenOrTf, explanation, opts, question, questionType, rebuildMcqAnswer]);

  async function save() {
    setBusy(true);
    setMsg(null);
    try {
      const payload = buildPayload();
      const res = await fetch(`/api/lessons/${lessonId}/cards/${card.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data.error ?? "Lưu thất bại.");
        return;
      }
      router.refresh();
      setMsg("Đã lưu.");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!window.confirm("Xóa câu hỏi này?")) return;
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/lessons/${lessonId}/cards/${card.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data.error ?? "Không xóa được.");
        return;
      }
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  function onTypeChange(next: QuestionType) {
    setQuestionType(next);
    if (next === "mcq") {
      if (opts.every((x) => !x.trim())) {
        setOpt(["", "", "", ""]);
      }
      setMcqCorrectIx(0);
    }
    if (next === "true_false" && answerOpenOrTf !== "Đúng" && answerOpenOrTf !== "Sai") {
      setAnswerOpenOrTf("Đúng");
    }
  }

  const inputCls =
    "mt-1 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2 text-sm dark:bg-slate-800";

  return (
    <article className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm dark:bg-[var(--color-surface-elevated)]">
      <div className="flex flex-wrap items-start justify-between gap-2 pb-3">
        <span className="rounded-full bg-[var(--color-surface-muted)] px-3 py-1 text-xs font-bold text-slate-500 dark:bg-slate-800">
          {typeLabel(questionType)}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={save}
            className="rounded-full bg-[var(--color-primary)] px-4 py-1.5 text-xs font-semibold text-white hover:brightness-105 disabled:opacity-50"
          >
            Lưu
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={remove}
            className="rounded-full border border-rose-200 px-4 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50 dark:border-rose-800 dark:text-rose-200"
          >
            Xóa
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
          Loại
          <select
            className={`${inputCls} font-normal`}
            value={questionType}
            onChange={(e) => onTypeChange(e.target.value as QuestionType)}
          >
            <option value="open">Flashcards</option>
            <option value="mcq">Trắc nghiệm</option>
            <option value="true_false">Đúng / Sai</option>
          </select>
        </label>

        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
          Câu hỏi
          <textarea rows={3} className={`${inputCls} resize-y font-normal`} value={question} onChange={(e) => setQuestion(e.target.value)} />
        </label>

        {questionType === "mcq" ? (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">Bốn đáp án</p>
            {(["A", "B", "C", "D"] as const).map((L, idx) => (
              <label key={L} className="block text-xs text-slate-600 dark:text-slate-400">
                {L}
                <input
                  type="text"
                  className={inputCls}
                  value={opts[idx]}
                  onChange={(e) => setOpt((prev) => {
                    const n = [...prev];
                    n[idx] = e.target.value;
                    return n;
                  })}
                />
              </label>
            ))}
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
              Đáp án đúng
              <select className={`${inputCls} font-normal`} value={mcqCorrectIx} onChange={(e) => setMcqCorrectIx(Number(e.target.value))}>
                {[0, 1, 2, 3].map((ix) => (
                  <option key={ix} value={ix}>{`Đáp án ${"ABCD"[ix] ?? ""}${opts[ix]?.trim() ? ` — ${opts[ix]!.slice(0, 40)}…` : ""}`}</option>
                ))}
              </select>
            </label>
          </div>
        ) : questionType === "true_false" ? (
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
            Đáp án đúng
            <select
              className={`${inputCls} font-normal`}
              value={answerOpenOrTf}
              onChange={(e) => setAnswerOpenOrTf(e.target.value)}
            >
              <option value="Đúng">Đúng</option>
              <option value="Sai">Sai</option>
            </select>
          </label>
        ) : (
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
            Đáp án / mặt sau thẻ
            <textarea rows={2} className={`${inputCls} resize-y font-normal`} value={answerOpenOrTf} onChange={(e) => setAnswerOpenOrTf(e.target.value)} />
          </label>
        )}

        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
          Giải thích
          <textarea rows={2} className={`${inputCls} resize-y font-normal`} value={explanation} onChange={(e) => setExplanation(e.target.value)} />
        </label>

        {msg ? <p className="text-xs text-slate-500 dark:text-slate-400">{msg}</p> : null}
      </div>
    </article>
  );
}

export function LessonDeckEditor({ lessonId, lessonTitle, initialCards }: Props) {
  const router = useRouter();
  const [exportBusy, setExportBusy] = useState(false);
  const [addType, setAddType] = useState<QuestionType>("open");
  const [qNew, setQNew] = useState("");
  const [aNewTf, setANewTf] = useState("Đúng");
  const [aNewOpen, setANewOpen] = useState("");
  const [mcqOpts, setMcqOpts] = useState(["", "", "", ""]);
  const [mcqIx, setMcqIx] = useState(0);
  const [expNew, setExpNew] = useState("");
  const [addBusy, setAddBusy] = useState(false);
  const [addErr, setAddErr] = useState<string | null>(null);

  async function exportWord() {
    setExportBusy(true);
    try {
      const res = await fetch(`/api/lessons/${lessonId}/export`);
      if (!res.ok) {
        const txt = await res.text();
        let errMsg = "Xuất file thất bại.";
        try {
          const j = JSON.parse(txt) as { error?: string };
          errMsg = j.error ?? errMsg;
        } catch {
          if (txt) errMsg = txt;
        }
        window.alert(errMsg);
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      const safe = `${lessonTitle.replace(/[/\\?%*:|"<>]/g, "-").slice(0, 60) || "bai-hoc"}-cau-hoi.docx`;
      anchor.download = safe;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch {
      window.alert("Xuất file thất bại.");
    } finally {
      setExportBusy(false);
    }
  }

  async function addCard() {
    setAddBusy(true);
    setAddErr(null);
    try {
      let payload: Record<string, unknown>;
      if (addType === "mcq") {
        const options = mcqOpts.map((o) => o.trim());
        const answer = options[mcqIx] ?? "";
        payload = { question_type: "mcq", question: qNew.trim(), answer, explanation: expNew.trim(), options };
      } else if (addType === "true_false") {
        payload = {
          question_type: "true_false",
          question: qNew.trim(),
          answer: aNewTf.trim(),
          explanation: expNew.trim(),
          options: null,
        };
      } else {
        payload = {
          question_type: "open",
          question: qNew.trim(),
          answer: aNewOpen.trim(),
          explanation: expNew.trim(),
        };
      }
      const res = await fetch(`/api/lessons/${lessonId}/cards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setAddErr(data.error ?? "Không thêm được.");
        return;
      }
      setQNew("");
      setANewOpen("");
      setMcqOpts(["", "", "", ""]);
      setMcqIx(0);
      setExpNew("");
      router.refresh();
    } finally {
      setAddBusy(false);
    }
  }

  const inp = "mt-1 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2 text-sm dark:bg-slate-800";

  return (
    <section className="space-y-4 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-md dark:bg-[var(--color-surface-elevated)]">
      <div className="flex flex-col gap-3 border-b border-[var(--color-border)] pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">Soạn & xuất</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Chỉnh sửa câu hỏi, thêm Flashcards hoặc trắc nghiệm, tải bản Word (flashcards · TN · đúng-sai).
          </p>
        </div>
        <button
          type="button"
          disabled={exportBusy || initialCards.length === 0}
          onClick={exportWord}
          className="shrink-0 rounded-full border border-[var(--color-border)] bg-white px-5 py-2.5 text-sm font-bold text-slate-800 shadow-sm hover:border-[var(--color-primary)]/50 disabled:cursor-not-allowed disabled:opacity-45 dark:bg-slate-900 dark:text-slate-100"
        >
          {exportBusy ? "Đang tạo file…" : "Xuất Word (.docx)"}
        </button>
      </div>

      <div className="space-y-6">
        {initialCards.length === 0 ? (
          <p className="text-sm text-slate-500">Chưa có câu nào — thêm ở dưới.</p>
        ) : (
          initialCards.map((c) => <CardEditorRow key={editorRowKey(c)} lessonId={lessonId} card={c} />)
        )}
      </div>

      <div className="mt-8 space-y-3 border-t border-[var(--color-border)] pt-6">
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">Thêm câu mới</h3>
        <div className="grid gap-3 sm:grid-cols-[auto_1fr] sm:items-end">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            Loại
            <select className={`${inp} mt-1 block font-normal`} value={addType} onChange={(e) => setAddType(e.target.value as QuestionType)}>
              <option value="open">Flashcards</option>
              <option value="mcq">Trắc nghiệm</option>
              <option value="true_false">Đúng / Sai</option>
            </select>
          </label>
          <button
            type="button"
            disabled={addBusy || !qNew.trim()}
            onClick={addCard}
            className="rounded-full bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-45"
          >
            {addBusy ? "Đang thêm…" : "Thêm câu"}
          </button>
        </div>
        <textarea className={`${inp} resize-y font-normal`} rows={3} placeholder="Nội dung câu hỏi" value={qNew} onChange={(e) => setQNew(e.target.value)} />

        {addType === "mcq" ? (
          <div className="grid gap-2 sm:grid-cols-2">
            {(["A", "B", "C", "D"] as const).map((L, ix) => (
              <label key={L} className="block text-xs font-semibold text-slate-600">
                Đáp án {L}
                <input
                  type="text"
                  className={inp}
                  value={mcqOpts[ix]}
                  onChange={(e) =>
                    setMcqOpts((p) => {
                      const n = [...p];
                      n[ix] = e.target.value;
                      return n;
                    })
                  }
                />
              </label>
            ))}
            <label className="block text-xs font-semibold text-slate-600 sm:col-span-2">
              Đáp án đúng
              <select className={`${inp} font-normal`} value={mcqIx} onChange={(e) => setMcqIx(Number(e.target.value))}>
                {[0, 1, 2, 3].map((i) => (
                  <option key={i} value={i}>{`Đáp án ${"ABCD"[i] ?? ""}`}</option>
                ))}
              </select>
            </label>
          </div>
        ) : addType === "true_false" ? (
          <select className={`${inp} font-normal max-w-xs`} value={aNewTf} onChange={(e) => setANewTf(e.target.value)}>
            <option value="Đúng">Đúng</option>
            <option value="Sai">Sai</option>
          </select>
        ) : (
          <textarea className={`${inp} resize-y font-normal`} rows={2} placeholder="Đáp án (mặt sau thẻ)" value={aNewOpen} onChange={(e) => setANewOpen(e.target.value)} />
        )}
        <textarea className={`${inp} resize-y font-normal`} rows={2} placeholder="Giải thích (tùy chọn)" value={expNew} onChange={(e) => setExpNew(e.target.value)} />
        {addErr ? <p className="text-sm text-rose-600 dark:text-rose-300">{addErr}</p> : null}
      </div>
    </section>
  );
}
