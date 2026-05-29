import { createMiddleware } from "hono/factory";
import { getCookie } from "hono/cookie";
import { verifyAccessToken, ACCESS_COOKIE } from "../lib/auth/jwt.js";

export type AuthVariables = {
  userId: string;
  email?: string;
};

export const authMiddleware = createMiddleware<{ Variables: AuthVariables }>(
  async (c, next) => {
    const authHeader = c.req.header("Authorization");
    const cookieToken = getCookie(c, ACCESS_COOKIE);
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : cookieToken;

    if (!token) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    try {
      const payload = await verifyAccessToken(token);
      c.set("userId", payload.sub);
      c.set("email", payload.email);
      await next();
    } catch {
      return c.json({ error: "Invalid token" }, 401);
    }
  },
);
