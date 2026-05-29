import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

export function Button({
  href,
  children,
  variant = "primary",
  className,
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300";
  const variants = {
    primary:
      "bg-primary text-[#14532D] shadow-[0_0_24px_rgba(34,197,94,0.3)] hover:brightness-110",
    secondary:
      "border border-primary/40 bg-transparent text-foreground hover:border-primary hover:bg-primary/10",
    ghost: "text-muted hover:text-foreground",
  };

  return (
    <Link href={href} className={cn(base, variants[variant], className)}>
      {children}
    </Link>
  );
}
