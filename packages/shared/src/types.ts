import type { PARCEL_EVENT_TYPES, ENTITLEMENT_FEATURES } from "./constants.js";

export type Plan = "free" | "sense" | "cloud" | "control";

export type ParcelEventType = (typeof PARCEL_EVENT_TYPES)[number];

export type EntitlementFeature = (typeof ENTITLEMENT_FEATURES)[number];

export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  plan: Plan;
  created_at?: string;
  updated_at?: string;
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
