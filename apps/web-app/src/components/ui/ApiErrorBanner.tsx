export function ApiErrorBanner({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="glass-card rounded-2xl p-4 sm:p-5 text-sm border border-amber-500/30"
    >
      <p className="text-amber-300 font-medium">Bir sorun oluştu</p>
      <p className="text-muted mt-1 text-xs">{message}</p>
    </div>
  );
}
