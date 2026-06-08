import { Hono } from "hono";
import type { AuthVariables } from "../middleware/auth.js";
import { query } from "../lib/db.js";

type Env = { Variables: AuthVariables };

export const entitlementsRoutes = new Hono<Env>();

entitlementsRoutes.get("/", async (c) => {
  const userId = c.get("userId");
  const { rows } = await query(
    `select * from entitlements where user_id = $1`,
    [userId],
  );
  return c.json(rows);
});
