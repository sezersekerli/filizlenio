import { ParcelMap } from "@/components/map/ParcelMapDynamic";
import { ParcelEvents } from "@/components/parcels/ParcelEvents";
import { UpsellCards } from "@/components/packages/UpsellCards";
import { ParcelDetailHeader } from "@/components/parcels/ParcelDetailHeader";
import { getServerApiClient } from "@/lib/api-server";
import { notFound } from "next/navigation";

function parseGeometry(geometry: unknown): GeoJSON.Polygon | null {
  if (!geometry) return null;
  if (typeof geometry === "string") {
    try {
      return JSON.parse(geometry) as GeoJSON.Polygon;
    } catch {
      return null;
    }
  }
  if (typeof geometry === "object" && (geometry as GeoJSON.Polygon).type === "Polygon") {
    return geometry as GeoJSON.Polygon;
  }
  return null;
}

export default async function ParcelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let parcel;

  try {
    parcel = await (await getServerApiClient()).getParcel(id);
  } catch {
    notFound();
  }

  const geom = parseGeometry(parcel.geometry);
  const title = parcel.label || `Ada ${parcel.ada} / ${parcel.parsel_no}`;

  return (
    <div className="space-y-10">
      <ParcelDetailHeader
        title={title}
        nitelik={parcel.nitelik}
        areaM2={parcel.area_m2}
        ada={parcel.ada}
        parselNo={parcel.parsel_no}
      />

      <div className="map-frame rounded-2xl overflow-hidden">
        <ParcelMap geometry={geom} className="h-80 md:h-[420px] w-full" />
      </div>

      <ParcelEvents parcelId={id} />

      <section className="space-y-5 pt-4 border-t border-[var(--card-border)]">
        <h2 className="text-xl font-semibold text-gradient">Premium özellikler</h2>
        <UpsellCards compact />
      </section>
    </div>
  );
}
