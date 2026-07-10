import type {
  ENTITLEMENT_FEATURES,
  EXPENSE_CATEGORIES,
  FARM_TASK_TYPES,
  NOTIFICATION_STATUSES,
  PARCEL_EVENT_TYPES,
  TASK_PRIORITIES,
  TASK_STATUSES,
} from "./constants.js";

export type Plan = "free" | "sense" | "cloud" | "control";

export type ParcelEventType = (typeof PARCEL_EVENT_TYPES)[number];
export type FarmTaskType = (typeof FARM_TASK_TYPES)[number];
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];
export type TaskPriority = (typeof TASK_PRIORITIES)[number];
export type TaskStatus = (typeof TASK_STATUSES)[number];
export type NotificationStatus = (typeof NOTIFICATION_STATUSES)[number];

export type EntitlementFeature = (typeof ENTITLEMENT_FEATURES)[number];

export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  plan: Plan;
  whatsapp_phone?: string | null;
  whatsapp_notifications_enabled?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface NotificationSettings {
  whatsapp_phone: string | null;
  whatsapp_notifications_enabled: boolean;
  whatsapp_configured: boolean;
  can_send: boolean;
}

export interface Parcel {
  id: string;
  user_id: string;
  label: string | null;
  il_id: number;
  ilce_id: number;
  mahalle_id: number;
  ada: string;
  parsel_no: string;
  geometry: GeoJSON.Polygon | null;
  area_m2: number | null;
  nitelik: string | null;
  properties: Record<string, unknown> | null;
  created_at: string;
  updated_at?: string;
}

export interface ParcelEvent {
  id: string;
  parcel_id: string;
  user_id: string;
  type: ParcelEventType;
  occurred_at: string;
  body: string | null;
  created_at: string;
}

export interface Entitlement {
  id: string;
  user_id: string;
  feature: EntitlementFeature;
  active: boolean;
  expires_at: string | null;
  created_at: string;
}

export interface TkgmIlce {
  id: number;
  ad: string;
}

export interface TkgmMahalle {
  id: number;
  ad: string;
}

export interface ParcelSeason {
  id: string;
  parcel_id: string;
  user_id: string;
  crop: string;
  planted_at: string | null;
  stage: string;
  progress_pct: number;
  notes: string | null;
  created_at: string;
  updated_at?: string;
}

export interface FarmTask {
  id: string;
  parcel_id: string;
  user_id: string;
  title: string;
  task_type: FarmTaskType;
  due_at: string;
  status: TaskStatus;
  priority: TaskPriority;
  body: string | null;
  completed_at?: string | null;
  created_at: string;
  updated_at?: string;
  parcel_label?: string | null;
  parcel_ada?: string;
  parcel_parsel_no?: string;
}

export type FarmActivityKind = "task_completed" | "event" | "expense";

export interface FarmActivityItem {
  id: string;
  kind: FarmActivityKind;
  occurred_at: string;
  parcel_id: string;
  parcel_label?: string | null;
  parcel_ada?: string;
  parcel_parsel_no?: string;
  title: string;
  subtitle?: string | null;
  amount?: number | null;
  currency?: string | null;
  category?: string | null;
}

export interface Expense {
  id: string;
  parcel_id: string;
  user_id: string;
  category: ExpenseCategory;
  amount: number;
  currency: string;
  occurred_at: string;
  note: string | null;
  created_at: string;
}

export interface NotificationMessage {
  id: string;
  user_id: string;
  parcel_id: string | null;
  channel: string;
  label: string;
  body: string;
  status: NotificationStatus;
  scheduled_at: string | null;
  sent_at: string | null;
  provider_ref: string | null;
  error_message?: string | null;
  created_at: string;
}

export interface FarmSummary {
  parcelCount: number;
  parcelLimit: number;
  todayTaskCount: number;
  criticalTaskCount: number;
  overdueTaskCount: number;
  upcomingTaskCount: number;
  completedThisWeekCount: number;
  riskAlertCount: number;
  seasonExpenseTotal: number;
  currency: string;
}

export interface WeatherSnapshot {
  parcel_id: string;
  fetched_at: string;
  temperature_c: number | null;
  precipitation_mm: number | null;
  wind_speed_kmh: number | null;
  risks: string[];
  summary: string;
}

export interface ExpenseWithParcel extends Expense {
  parcel_label?: string | null;
  parcel_ada?: string;
  parcel_parsel_no?: string;
}

export interface ParcelEventWithParcel extends ParcelEvent {
  parcel_label?: string | null;
  parcel_ada?: string;
  parcel_parsel_no?: string;
}

export type SatelliteLayer = "rgb" | "ndvi" | "ndre";

export interface SatelliteIndexStats {
  mean: number;
  min: number;
  max: number;
  std: number;
  stress_pct: number;
  health: string;
}

export interface SatelliteSceneAnalysis {
  ndvi: SatelliteIndexStats;
  ndre: SatelliteIndexStats | null;
  computed_at: string;
  ndvi_delta: number | null;
}

export interface SatelliteScene {
  id: string;
  parcel_id: string;
  provider: string;
  scene_id: string;
  acquired_at: string;
  cloud_cover_pct: number | null;
  bbox: [number, number, number, number];
  display_bbox: [number, number, number, number];
  bounds: [[number, number], [number, number]];
  preview_url: string;
  preview_width: number;
  fetched_at: string;
  analysis: SatelliteSceneAnalysis | null;
}

export type SatelliteAccessTier = "free" | "premium";
export type SatelliteQuality = "preview" | "analysis";

export interface SatelliteSceneList {
  tier: SatelliteAccessTier;
  quality: SatelliteQuality;
  source_label: string;
  search_days: number;
  scenes: SatelliteScene[];
}

export interface SatelliteSyncResult extends SatelliteSceneList {
  synced: number;
}

export type SpectralTimelineBucket = "week" | "month";

export interface SpectralTimelinePoint {
  index: number;
  label: string;
  ndvi_mean: number | null;
  stress_pct: number | null;
  scene_count: number;
  latest_acquired_at: string | null;
}

export interface SpectralAlert {
  severity: "info" | "warning" | "critical";
  code: string;
  title: string;
  message: string;
  occurred_at: string;
}

export interface SpectralTimeline {
  parcel_id: string;
  planted_at: string;
  crop: string | null;
  bucket: SpectralTimelineBucket;
  points: SpectralTimelinePoint[];
  alerts: SpectralAlert[];
}
