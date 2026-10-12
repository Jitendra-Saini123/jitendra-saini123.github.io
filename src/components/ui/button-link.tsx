import type { AnchorHTMLAttributes, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { externalLinkProps, isExternalUrl } from "@/lib/links";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-fg text-ink-950 shadow-[0_0_0_1px_rgb(255_255_255/0.2),0_10px_40px_-12px_rgb(69_217_255/0.55)] hover:bg-white hover:shadow-[0_0_0_1px_rgb(255_255_255/0.4),0_14px_50px_-10px_rgb(69_217_255/0.75)]",
  secondary:
    "border border-line-strong bg-white/[0.03] text-fg hover:border-cyan/60 hover:bg-cyan/[0.06]",
  ghost: "text-muted hover:text-fg",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-[0.95rem]",
};

export const buttonClasses = (variant: Variant = "primary", size: Size = "md", className?: string) =>
  cn(
    "group/btn relative inline-flex select-none items-center justify-center gap-2 rounded-full font-medium tracking-[-0.01em] transition-[background-color,border-color,box-shadow,color,transform] duration-300 ease-out active:scale-[0.98]",
    variants[variant],
    variant !== "ghost" && sizes[size],
    className,
  );

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  /** Shows the ↗ icon. Defaults to true for external links. */
  showExternalIcon?: boolean;
}

/** A link styled as a button. External links open safely in a new tab. */
export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  showExternalIcon,
  ...rest
}: ButtonLinkProps) {
  const external = isExternalUrl(href);
  const withIcon = showExternalIcon ?? external;
  return (
    <a href={href} className={buttonClasses(variant, size, className)} {...(external ? externalLinkProps : {})} {...rest}>
      {children}
      {withIcon && (
        <ArrowUpRight
          aria-hidden
          size={16}
          className="transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5"
        />
      )}
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
}
