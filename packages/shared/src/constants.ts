export const BRAND = {
  primary: "#22c55e",
  primaryDark: "#14532d",
  accent: "#38bdf8",
  background: "#0a120e",
  backgroundElevated: "#0f1a14",
} as const;

export const PLAN_LIMITS = {
  free: {
    maxParcels: 5,
    satelliteSearchDays: 10,
    satelliteMaxScenes: 3,
    satellitePreviewPx: 1536,
  },
  sense: {
    satelliteSearchDays: 120,
    satelliteMaxScenes: 10,
    satellitePreviewPx: 6144,
  },
} as const;

export const SATELLITE_PROFILES = {
  free: {
    quality: "preview" as const,
    sourceLabel: "Sentinel-2 önizleme (ücretsiz)",
    providerId: "sentinel-2-preview",
    maxCloudCover: 40,
    stacPoolMultiplier: 1,
    layers: ["rgb"] as const,
    computeAnalysis: false,
  },
  premium: {
    quality: "analysis" as const,
    sourceLabel: "Sentinel-2 analiz uydu (Premium)",
    providerId: "sentinel-2-analysis",
    maxCloudCover: 12,
    stacPoolMultiplier: 4,
    layers: ["rgb", "ndvi", "ndre"] as const,
    computeAnalysis: true,
  },
} as const;

export const SATELLITE_NDVI = {
  stressThreshold: 0.3,
  labels: {
    critical: "Kritik stres — acil saha kontrolü",
    low: "Düşük vigor — sulama/gübre değerlendirin",
    moderate: "Orta vigor — trendi izleyin",
    good: "İyi bitki örtüsü",
    dense: "Yoğun bitki örtüsü",
  },
} as const;

export const PARCEL_EVENT_TYPES = [
  "note",
  "irrigation_manual",
  "planting",
  "harvest",
  "fertilization",
  "spray",
  "expense_note",
  "inspection",
] as const;

export const FARM_TASK_TYPES = [
  "irrigation",
  "fertilization",
  "spray",
  "inspection",
  "expense",
  "other",
] as const;

export const EXPENSE_CATEGORIES = [
  "fuel",
  "fertilizer",
  "pesticide",
  "labor",
  "seed",
  "irrigation",
  "transport",
  "other",
] as const;

export const TASK_PRIORITIES = ["low", "normal", "high"] as const;

export const TASK_STATUSES = ["pending", "completed", "cancelled"] as const;

export const NOTIFICATION_STATUSES = ["draft", "scheduled", "sent", "failed"] as const;

export const EXPENSE_CATEGORY_LABELS: Record<(typeof EXPENSE_CATEGORIES)[number], string> = {
  fuel: "Mazot",
  fertilizer: "Gübre",
  pesticide: "İlaç",
  labor: "İşçilik",
  seed: "Tohum",
  irrigation: "Sulama",
  transport: "Nakliye",
  other: "Diğer",
};

export const FARM_TASK_TYPE_LABELS: Record<(typeof FARM_TASK_TYPES)[number], string> = {
  irrigation: "Sulama",
  fertilization: "Gübreleme",
  spray: "İlaçlama",
  inspection: "Kontrol",
  expense: "Masraf",
  other: "Diğer",
};

export const PARCEL_EVENT_TYPE_LABELS: Record<(typeof PARCEL_EVENT_TYPES)[number], string> = {
  note: "Not",
  irrigation_manual: "Sulama",
  planting: "Ekim",
  harvest: "Hasat",
  fertilization: "Gübreleme",
  spray: "İlaçlama",
  expense_note: "Masraf notu",
  inspection: "Kontrol",
};

export const PLAN_LABELS: Record<string, string> = {
  free: "Tarla Defteri",
  sense: "Uydu Katmanı",
  cloud: "Spektral Analiz",
  control: "Saha Otomasyonu",
};

export const FREE_TIER = {
  id: "free",
  name: "Tarla Defteri",
  tag: "Ücretsiz başlangıç",
  description:
    "TKGM parsel kaydı, sezon takibi, görevler ve masraflar — panel içi tarla yönetimi.",
  highlights: [
    "TKGM ada/parsel & harita",
    "Sezon, görev ve masraf modülleri",
    "Güncel uydu haritası",
    "5 parsel limiti",
  ],
} as const;

export const ENTITLEMENT_FEATURES = [
  "sense_live",
  "cloud_recommendations",
  "control_commands",
  "field_notifications",
] as const;

export const ENTITLEMENT_FEATURE_LABELS: Record<
  (typeof ENTITLEMENT_FEATURES)[number],
  string
> = {
  sense_live: "Uydu görüntüsü",
  cloud_recommendations: "Spektral analiz",
  control_commands: "Sulama & vana komutları",
  field_notifications: "WhatsApp & SMS bildirimleri",
};

export const PRODUCT_PACKAGES = [
  {
    id: "sense",
    name: "Uydu Katmanı",
    tag: "Güncel uydu haritası",
    feature: "sense_live" as const,
    description: "Tarlanızı Google Haritalar gibi güncel uydu görüntüsüyle görün.",
    highlights: [
      "Güncel uydu altlık + ada/parsel sınırı",
      "120 günlük Sentinel arşivi",
      "NDVI / NDRE hesaplama (arka planda)",
    ],
    roadmap: "Sentinel-2 STAC",
  },
  {
    id: "cloud",
    name: "Spektral Analiz",
    tag: "Grafik & uyarı",
    feature: "cloud_recommendations" as const,
    description: "NDVI trend grafiği ve stres uyarıları — hesap arka planda.",
    highlights: [
      "Haftalık / aylık NDVI grafiği",
      "Stres ve düşüş uyarıları",
      "Ekim tarihinden itibaren zaman serisi",
    ],
    roadmap: "Spektral pipeline",
  },
  {
    id: "control",
    name: "Saha Otomasyonu",
    tag: "Bildirim & komut",
    feature: "control_commands" as const,
    description: "WhatsApp/SMS ve saha görevleri.",
    highlights: [
      "WhatsApp ve SMS bildirimi",
      "Stres → otomatik görev",
      "Sulama komut kuyruğu",
    ],
    roadmap: "Otomasyon kuralları",
  },
] as const;

export const PACKAGE_STACK = [
  { id: "free", label: FREE_TIER.name, step: "TKGM, sezon, masraf" },
  { id: "sense", label: "Uydu Katmanı", step: "Güncel harita" },
  { id: "cloud", label: "Spektral Analiz", step: "NDVI grafik" },
  { id: "control", label: "Saha Otomasyonu", step: "WhatsApp, SMS" },
] as const;

export const TKGM_DISCLAIMER =
  "Bilgilendirme amaçlıdır; resmi işlem için TKGM'ye başvurun.";

export const DEFAULT_TKGM_API_BASE =
  "https://cbsapi.tkgm.gov.tr/megsiswebapi.v3.1/api";
