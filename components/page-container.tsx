import type { ReactNode } from "react";

type PageContainerProps = {
  children: ReactNode;
  /** Narrow column for flashcard / study focus (Quizlet-like) */
  variant?: "wide" | "study";
  className?: string;
};

export function PageContainer({ children, variant = "wide", className = "" }: PageContainerProps) {
  const max = variant === "study" ? "max-w-3xl" : "max-w-6xl";
  return (
    <div
      className={`mx-auto w-full px-4 py-6 md:px-8 md:py-10 ${max} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
