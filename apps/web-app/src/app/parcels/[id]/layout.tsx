import { ParcelDetailHeader } from "@/components/parcels/ParcelDetailHeader";
import { ParcelHubNav } from "@/components/parcels/ParcelHubNav";
import { loadParcelBasics } from "@/lib/parcel-page";

export default async function ParcelDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { parcel, title } = await loadParcelBasics(id);

  return (
    <div className="space-y-4 md:space-y-6">
      <ParcelDetailHeader
        parcelId={id}
        title={title}
        nitelik={parcel.nitelik}
        areaM2={parcel.area_m2 ? Number(parcel.area_m2) : null}
        ada={parcel.ada}
        parselNo={parcel.parsel_no}
        properties={parcel.properties}
      />
      <ParcelHubNav parcelId={id} />
      {children}
    </div>
  );
}
