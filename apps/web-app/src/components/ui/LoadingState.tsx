export function LoadingState({ label = "Yükleniyor…" }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="glass-card rounded-2xl p-8 sm:p-10 text-center text-muted text-sm"
    >
      <div
        className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent mb-3"
        aria-hidden
      />
      <p>{label}</p>
    </div>
  );
}
