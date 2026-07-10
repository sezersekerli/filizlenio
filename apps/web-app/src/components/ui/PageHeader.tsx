import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("flex flex-col gap-3 sm:gap-4", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          {eyebrow && (
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-accent mb-1.5 sm:mb-2">
              {eyebrow}
            </p>
          )}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gradient break-words">
            {title}
          </h1>
          {description && (
            <p className="text-muted mt-1.5 sm:mt-2 text-sm md:text-base max-w-xl leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {action && (
          <div className="shrink-0 w-full sm:w-auto [&_a]:w-full sm:[&_a]:w-auto [&_button]:w-full sm:[&_button]:w-auto">
            {action}
          </div>
        )}
      </div>
    </header>
  );
}
