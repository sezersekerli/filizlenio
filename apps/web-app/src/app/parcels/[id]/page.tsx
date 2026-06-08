import { ParcelMap } from "@/components/map/ParcelMapDynamic";
import { ParcelEvents } from "@/components/parcels/ParcelEvents";
import { ParcelDetailTabs } from "@/components/parcels/ParcelDetailTabs";
import { TkgmParcelInfo } from "@/components/parcels/TkgmParcelInfo";
import { UpsellCards } from "@/components/packages/UpsellCards";
import { ParcelDetailHeader } from "@/components/parcels/ParcelDetailHeader";
import { getServerApiClient } from "@/lib/api-server";
import { TKGM_DISCLAIMER } from "@filizlen/shared";
import type { TkgmParselProperties } from "@filizlen/shared";
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
  let entitlements: Awaited<
    ReturnType<Awaited<ReturnType<typeof getServerApiClient>>["listEntitlements"]>
  > = [];

  try {
    const api = await getServerApiClient();
    parcel = await api.getParcel(id);
    try {
      entitlements = await api.listEntitlements();
    } catch {
      entitlements = [];
    }
  } catch {
    notFound();
  }

  const geom = parseGeometry(parcel.geometry);
  const title = parcel.label || `Ada ${parcel.ada} / ${parcel.parsel_no}`;

  return (
    <div className="space-y-10">
      <ParcelDetailHeader
        parcelId={id}
        title={title}
        nitelik={parcel.nitelik}
        areaM2={parcel.area_m2 ? Number(parcel.area_m2) : null}
        ada={parcel.ada}
        parselNo={parcel.parsel_no}
        properties={parcel.properties}
      />

      <TkgmParcelInfo
        properties={parcel.properties as TkgmParselProperties | null}
        areaM2={parcel.area_m2 ? Number(parcel.area_m2) : null}
        nitelik={parcel.nitelik}
      />

      <p className="text-xs text-muted">{TKGM_DISCLAIMER}</p>

      <div className="map-frame rounded-2xl overflow-hidden">
        <ParcelMap geometry={geom} className="h-80 md:h-[420px] w-full" />
      </div>

      <ParcelDetailTabs parcelId={id} />

      <ParcelEvents parcelId={id} />

      <section className="space-y-5 pt-4 border-t border-[var(--card-border)]">
        <h2 className="text-xl font-semibold text-gradient">Premium özellikler</h2>
        <UpsellCards compact entitlements={entitlements} />
      </section>
    </div>
  );
}
