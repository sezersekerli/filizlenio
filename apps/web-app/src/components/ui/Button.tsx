import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
};

type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
};

const sizes = {
  sm: "px-4 py-2 text-xs rounded-xl",
  md: "px-5 py-2.5 text-sm rounded-xl",
  lg: "px-6 py-3 text-sm rounded-2xl",
};

const variants = {
  primary:
    "btn-glow bg-primary text-[#052e16] font-semibold shadow-[0_0_28px_rgba(34,197,94,0.35)] hover:brightness-110 active:scale-[0.98]",
  secondary:
    "border border-primary/35 bg-primary/5 text-foreground backdrop-blur-sm hover:border-primary/60 hover:bg-primary/10 active:scale-[0.98]",
  ghost: "text-muted hover:text-foreground hover:bg-white/5",
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 transition-all duration-300",
        sizes[size],
        variants[variant],
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  type = "button",
  disabled,
  onClick,
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-45 disabled:pointer-events-none",
        sizes[size],
        variants[variant],
        className,
      )}
    >
      {children}
    </button>
  );
}
