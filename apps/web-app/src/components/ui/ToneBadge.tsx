import { cn } from "@/lib/utils";

export function ToneBadge({
  children,
  tone = "primary",
}: {
  children: React.ReactNode;
  tone?: "primary" | "accent" | "warning";
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold",
        tone === "primary" && "border-primary/30 bg-primary/10 text-primary",
        tone === "accent" && "border-accent/30 bg-accent/10 text-accent",
        tone === "warning" && "border-amber-400/30 bg-amber-400/10 text-amber-300",
      )}
    >
      {children}
    </span>
  );
}
