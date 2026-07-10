import { ParcelHubCards } from "@/components/parcels/ParcelHubCards";
import { ParcelOverviewStrip } from "@/components/parcels/ParcelOverviewStrip";
import Link from "next/link";
import { ArrowRight, Map } from "lucide-react";
import { Suspense } from "react";

export default async function ParcelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-5 md:space-y-8">
      <Link
        href={`/parcels/${id}/harita`}
        className="glass-card rounded-2xl p-4 sm:p-6 flex items-center gap-4 hover:border-primary/30 active:scale-[0.99] transition-transform block min-h-[72px]"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Map className="h-6 w-6" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">Haritayı aç</p>
          <p className="text-xs text-muted mt-0.5">Uydu görüntüsü ve parsel sınırı</p>
        </div>
        <ArrowRight className="h-4 w-4 text-muted shrink-0" />
      </Link>

      <Suspense fallback={<p className="text-sm text-muted">Özet yükleniyor…</p>}>
        <ParcelOverviewStrip parcelId={id} />
      </Suspense>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Ne yapmak istiyorsunuz?</h2>
        <ParcelHubCards parcelId={id} />
      </section>
    </div>
  );
}
