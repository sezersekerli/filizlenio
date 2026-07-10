import { ButtonLink } from "@/components/ui/Button";
import { MapPin, Plus } from "lucide-react";

export function NoParcelsPrompt({ message }: { message?: string }) {
  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 space-y-4 text-center">
      <MapPin className="h-8 w-8 text-primary mx-auto" />
      <div className="space-y-1">
        <p className="font-semibold">Henüz parsel yok</p>
        <p className="text-sm text-muted">
          {message ?? "Devam etmek için TKGM ile bir parsel kaydedin."}
        </p>
      </div>
      <ButtonLink href="/parcels/new" size="lg" className="w-full sm:w-auto">
        <Plus className="h-4 w-4" />
        Parsel ekle
      </ButtonLink>
    </div>
  );
}
