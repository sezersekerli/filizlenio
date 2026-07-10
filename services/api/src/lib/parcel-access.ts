import { PLAN_LIMITS } from "@filizlen/shared";
import { query } from "./db.js";

export async function assertParcelOwner(
  userId: string,
  parcelId: string,
): Promise<boolean> {
  const { rows } = await query<{ id: string }>(
    `select id from parcels where id = $1 and user_id = $2`,
    [parcelId, userId],
  );
  return Boolean(rows[0]);
}

export async function getUserParcelLimit(userId: string): Promise<number> {
  const { rows } = await query<{ plan: string }>(
    `select plan from profiles where id = $1`,
    [userId],
  );
  const plan = rows[0]?.plan ?? "free";
  if (plan === "free") return PLAN_LIMITS.free.maxParcels;
  // Ücretli planlarda şimdilik sınırsız (veya yüksek limit)
  return 999;
}
