export const BRAND = {
  primary: "#22c55e",
  primaryDark: "#14532d",
  accent: "#38bdf8",
  background: "#0a120e",
  backgroundElevated: "#0f1a14",
} as const;

export const PLAN_LIMITS = {
  free: { maxParcels: 5 },
} as const;

export const PARCEL_EVENT_TYPES = [
  "note",
  "irrigation_manual",
  "planting",
  "harvest",
] as const;

export const ENTITLEMENT_FEATURES = [
  "sense_live",
  "cloud_recommendations",
  "control_commands",
] as const;

export const PRODUCT_PACKAGES = [
  {
    id: "sense",
    name: "Sense",
    feature: "sense_live" as const,
    description: "Canlı sensör verisi ve anlık izleme",
  },
  {
    id: "cloud",
    name: "Cloud",
    feature: "cloud_recommendations" as const,
    description: "AI destekli sulama ve gübre önerileri",
  },
  {
    id: "control",
    name: "Control",
    feature: "control_commands" as const,
    description: "Uzaktan sulama ve ekipman kontrolü",
  },
] as const;

export const TKGM_DISCLAIMER =
  "Bilgilendirme amaçlıdır; resmi işlem için TKGM'ye başvurun.";

export const DEFAULT_TKGM_API_BASE =
  "https://cbsapi.tkgm.gov.tr/megsiswebapi.v3.1";
