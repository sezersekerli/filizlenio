/** Parsel hub segment tanımları — ikonlar UI katmanında eşlenir */
export const PARCEL_HUB_SEGMENTS = [
  { segment: "harita", label: "Harita", desc: "Uydu ve parsel sınırı", iconKey: "map" as const },
  { segment: "sezon", label: "Sezon", desc: "Ürün ve ekim tarihi", iconKey: "sprout" as const },
  {
    segment: "masraflar",
    label: "Masraflar",
    desc: "Gübre, mazot, ilaç",
    iconKey: "banknote" as const,
  },
  { segment: "olaylar", label: "Olaylar", desc: "Sulama, hasat, not", iconKey: "clipboard" as const },
  { segment: "grafik", label: "Grafik", desc: "NDVI ve uyarılar", iconKey: "chart" as const },
] as const;

export type ParcelHubIconKey = (typeof PARCEL_HUB_SEGMENTS)[number]["iconKey"];

export function parcelHubHref(parcelId: string, segment: string): string {
  return `/parcels/${parcelId}/${segment}`;
}
