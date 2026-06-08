export function LoadingState({ label = "Yükleniyor…" }: { label?: string }) {
  return (
    <div className="glass-card glow-border rounded-2xl p-10 text-center text-muted text-sm">
      <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent mb-3" />
      <p>{label}</p>
    </div>
  );
}
