import Link from "next/link";

export type BreadcrumbItem = { label: string; href?: string };

export function BreadcrumbNav({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="text-sm text-slate-500 dark:text-slate-400" aria-label="Điều hướng">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-2">
            {index > 0 ? <span aria-hidden className="text-slate-300 dark:text-slate-600">/</span> : null}
            {item.href ? (
              <Link
                href={item.href}
                className="font-semibold text-[var(--color-primary)] transition hover:underline"
              >
                {item.label}
              </Link>
            ) : (
              <span className="max-w-[min(100%,28rem)] truncate font-semibold text-slate-800 dark:text-slate-100">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
