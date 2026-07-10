import type { EntitlementFeature } from "@filizlen/shared";
import { query } from "./db.js";

export async function userHasActiveFeature(
  userId: string,
  feature: EntitlementFeature,
): Promise<boolean> {
    const { rows } = await query(`select 1 as ok from entitlements
     where user_id = $1 and feature = $2 and active = true
       and (expires_at is null or expires_at > now())
     limit 1`, [userId, feature]);
    return rows.length > 0;
}
