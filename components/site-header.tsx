import Link from "next/link";

const navLink =
  "text-sm font-semibold text-slate-600 transition hover:text-[var(--color-primary)] dark:text-slate-300";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-surface-elevated)]/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight text-slate-900 dark:text-white">
          <span
            aria-hidden
            className="inline-flex size-8 items-center justify-center rounded-lg bg-[var(--color-primary)] text-sm font-extrabold text-white shadow-sm"
          >
            S
          </span>
          <span className="hidden sm:inline">Studify</span>
        </Link>

        <nav className="flex flex-1 items-center justify-end gap-4 sm:gap-6 md:justify-center md:gap-10" aria-label="Chính">
          <Link href="/" className={navLink}>
            Trang chủ
          </Link>
          <Link href="/lessons" className={navLink}>
            Thư viện
          </Link>
        </nav>

        <Link
          href="/"
          className="shrink-0 rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
        >
          Tạo bài
        </Link>
      </div>
    </header>
  );
}
