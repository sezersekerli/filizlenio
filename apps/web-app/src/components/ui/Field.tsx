import { cn } from "@/lib/utils";

const controlClass =
  "w-full rounded-xl bg-white/5 border border-[var(--card-border)] px-3 py-2.5 text-sm min-h-[44px]";

export function Field({
  label,
  htmlFor,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block text-sm", className)}>
      <span className="text-muted mb-1 block">{label}</span>
      {children}
    </label>
  );
}

export function TextInput({
  id,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input id={id} className={cn(controlClass, className)} {...props} />;
}

export function SelectInput({
  id,
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select id={id} className={cn(controlClass, className)} {...props}>
      {children}
    </select>
  );
}

export function TextAreaInput({
  id,
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      id={id}
      className={cn(controlClass, "resize-none min-h-[88px]", className)}
      {...props}
    />
  );
}
