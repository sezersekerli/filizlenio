import { ParcelMap } from "@/components/map/ParcelMapDynamic";
import { TkgmParcelInfo } from "@/components/parcels/TkgmParcelInfo";
import { loadParcelBasics } from "@/lib/parcel-page";
import { TKGM_DISCLAIMER } from "@filizlen/shared";
import type { TkgmParselProperties } from "@filizlen/shared";

export default async function ParcelMapPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { parcel, geom } = await loadParcelBasics(id);

  return (
    <div className="space-y-6">
      <TkgmParcelInfo
        properties={parcel.properties as TkgmParselProperties | null}
        areaM2={parcel.area_m2 ? Number(parcel.area_m2) : null}
        nitelik={parcel.nitelik}
      />
      <p className="text-xs text-muted">{TKGM_DISCLAIMER}</p>
      <div className="map-frame rounded-2xl overflow-hidden">
        <ParcelMap
          geometry={geom}
          ada={parcel.ada}
          parselNo={parcel.parsel_no}
          className="h-[min(58dvh,480px)] min-h-[260px] md:h-[480px] w-full"
        />
      </div>
    </div>
  );
}
