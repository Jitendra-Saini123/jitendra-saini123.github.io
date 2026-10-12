import { cn } from "@/lib/cn";

export function TagList({ items, label, className, max }: { items: string[]; label: string; className?: string; max?: number }) {
  const visible = max ? items.slice(0, max) : items;
  const hidden = items.length - visible.length;
  return (
    <ul aria-label={label} className={cn("flex flex-wrap gap-1.5", className)}>
      {visible.map((item) => (
        <li
          key={item}
          className="rounded-md border border-line bg-white/[0.025] px-2 py-1 font-mono text-[0.7rem] leading-none tracking-wide text-muted"
        >
          {item}
        </li>
      ))}
      {hidden > 0 && (
        <li className="rounded-md px-1 py-1 font-mono text-[0.7rem] leading-none text-subtle">
          +{hidden}
          <span className="sr-only"> more</span>
        </li>
      )}
    </ul>
  );
}
