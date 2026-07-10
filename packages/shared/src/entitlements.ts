import type { Entitlement, EntitlementFeature } from "./types.js";

type EntitlementCheck = Pick<Entitlement, "feature" | "active"> & {
  expires_at?: string | null;
};

/** Tek kaynak: client + server aynı kuralları kullanır */
export function isEntitlementActive(
  entitlement: EntitlementCheck,
  feature: EntitlementFeature,
  now = new Date(),
): boolean {
  if (!entitlement.active || entitlement.feature !== feature) return false;
  if (!entitlement.expires_at) return true;
  return new Date(entitlement.expires_at) > now;
}

export function hasActiveEntitlement(
  entitlements: EntitlementCheck[],
  feature: EntitlementFeature,
  now = new Date(),
): boolean {
  return entitlements.some((e) => isEntitlementActive(e, feature, now));
}

export function hasSenseLive(entitlements: EntitlementCheck[]): boolean {
  return hasActiveEntitlement(entitlements, "sense_live");
}

export function hasCloudRecommendations(entitlements: EntitlementCheck[]): boolean {
  return hasActiveEntitlement(entitlements, "cloud_recommendations");
}

export function canSendFieldNotifications(entitlements: EntitlementCheck[]): boolean {
  return hasActiveEntitlement(entitlements, "field_notifications");
}

export function hasControlCommands(entitlements: EntitlementCheck[]): boolean {
  return hasActiveEntitlement(entitlements, "control_commands");
}
