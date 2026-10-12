import { useId } from "react";
import { cn } from "@/lib/cn";

/**
 * The Jitendra Builds mark: a hexagonal frame holding three stacked slabs —
 * the same "building in layers" idea as the 3D tower in the hero.
 */
export function BrandMark({ className, size = 30 }: { className?: string; size?: number }) {
  const gradientId = `jb-mark-${useId().replace(/:/g, "")}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      focusable={false}
      className={cn("shrink-0", className)}
    >
      <defs>
        <linearGradient id={gradientId} x1="4" y1="2" x2="28" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9EEAFF" />
          <stop offset="0.55" stopColor="#45D9FF" />
          <stop offset="1" stopColor="#8B70FF" />
        </linearGradient>
      </defs>
      <path d="M16 1.8 28.3 8.9v14.2L16 30.2 3.7 23.1V8.9L16 1.8Z" stroke={`url(#${gradientId})`} strokeWidth="1.6" />
      <path d="M9.2 11.6h13.6" stroke="#F5F7FF" strokeWidth="2.2" strokeLinecap="round" opacity="0.55" />
      <path d="M8.2 16h15.6" stroke={`url(#${gradientId})`} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M9.2 20.4h13.6" stroke="#F5F7FF" strokeWidth="2.2" strokeLinecap="round" opacity="0.9" />
    </svg>
  );
}
