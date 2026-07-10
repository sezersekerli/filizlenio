import { z } from "zod";
import { Hono } from "hono";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { getEnv } from "../env.js";
import { query } from "../lib/db.js";
import { hashPassword, verifyPassword } from "../lib/auth/password.js";
import {
  ACCESS_COOKIE,
  ACCESS_MAX_AGE,
  REFRESH_COOKIE,
  REFRESH_MAX_AGE,
  signAccessToken,
  verifyAccessToken,
} from "../lib/auth/jwt.js";
import {
  generateRefreshToken,
  revokeRefreshToken,
  storeRefreshToken,
  findUserByRefreshToken,
} from "../lib/auth/tokens.js";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  displayName: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function cookieOptions(maxAge: number) {
  const env = getEnv();
  return {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite: "Lax" as const,
    path: "/",
    maxAge,
  };
}

function setAuthCookies(
  c: Parameters<typeof setCookie>[0],
  accessToken: string,
  refreshToken: string,
) {
  setCookie(c, ACCESS_COOKIE, accessToken, cookieOptions(ACCESS_MAX_AGE));
  setCookie(c, REFRESH_COOKIE, refreshToken, cookieOptions(REFRESH_MAX_AGE));
}

function clearAuthCookies(c: Parameters<typeof deleteCookie>[0]) {
  deleteCookie(c, ACCESS_COOKIE, { path: "/" });
  deleteCookie(c, REFRESH_COOKIE, { path: "/" });
}

async function issueSession(
  c: Parameters<typeof setCookie>[0],
  userId: string,
  email: string,
) {
  const accessToken = await signAccessToken({ sub: userId, email });
  const refreshToken = generateRefreshToken();
  await storeRefreshToken(userId, refreshToken);
  setAuthCookies(c, accessToken, refreshToken);
  return accessToken;
}

export const authRoutes = new Hono();

authRoutes.post("/register", async (c) => {
  const body = await c.req.json();
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: parsed.error.flatten() }, 400);
  }

  const email = parsed.data.email.trim().toLowerCase();
  const passwordHash = await hashPassword(parsed.data.password);

  try {
    const { rows } = await query<{ id: string; email: string }>(
      `insert into users (email, password_hash)
       values ($1, $2)
       returning id, email`,
      [email, passwordHash],
    );
    const user = rows[0]!;
    const displayName = parsed.data.displayName?.trim() || email.split("@")[0];
    await query(
      `insert into profiles (id, display_name) values ($1, $2)`,
      [user.id, displayName],
    );

    const accessToken = await issueSession(c, user.id, user.email);
    const { rows: profileRows } = await query<{ display_name: string | null; plan: string }>(
      `select display_name, plan from profiles where id = $1`,
      [user.id],
    );

    return c.json(
      {
        user: {
          id: user.id,
          email: user.email,
          displayName: profileRows[0]?.display_name,
          plan: profileRows[0]?.plan ?? "free",
        },
        accessToken,
      },
      201,
    );
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && err.code === "23505") {
      return c.json({ error: "Bu e-posta zaten kayıtlı." }, 409);
    }
    throw err;
  }
});

authRoutes.post("/login", async (c) => {
  const body = await c.req.json();
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: parsed.error.flatten() }, 400);
  }

  const email = parsed.data.email.trim().toLowerCase();
  const { rows } = await query<{ id: string; email: string; password_hash: string }>(
    `select id, email, password_hash from users where email = $1`,
    [email],
  );
  const user = rows[0];
  if (!user) {
    return c.json({ error: "E-posta veya şifre hatalı." }, 401);
  }

  const ok = await verifyPassword(parsed.data.password, user.password_hash);
  if (!ok) {
    return c.json({ error: "E-posta veya şifre hatalı." }, 401);
  }

  const accessToken = await issueSession(c, user.id, user.email);
  const { rows: profileRows } = await query<{ display_name: string | null; plan: string }>(
    `select display_name, plan from profiles where id = $1`,
    [user.id],
  );

  return c.json({
    user: {
      id: user.id,
      email: user.email,
      displayName: profileRows[0]?.display_name,
      plan: profileRows[0]?.plan ?? "free",
    },
    accessToken,
  });
});

authRoutes.post("/refresh", async (c) => {
  const refreshToken = getCookie(c, REFRESH_COOKIE);
  if (!refreshToken) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const row = await findUserByRefreshToken(refreshToken);
  if (!row) {
    clearAuthCookies(c);
    return c.json({ error: "Unauthorized" }, 401);
  }

  await revokeRefreshToken(refreshToken);
  const accessToken = await issueSession(c, row.user_id, row.email);
  return c.json({ accessToken });
});

authRoutes.post("/logout", async (c) => {
  const refreshToken = getCookie(c, REFRESH_COOKIE);
  if (refreshToken) {
    await revokeRefreshToken(refreshToken);
  }
  clearAuthCookies(c);
  return c.body(null, 204);
});

authRoutes.get("/me", async (c) => {
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
    const { rows } = await query<{
      email: string;
      display_name: string | null;
      plan: string;
      whatsapp_phone: string | null;
      whatsapp_notifications_enabled: boolean;
    }>(
      `select u.email, p.display_name, p.plan,
              p.whatsapp_phone, p.whatsapp_notifications_enabled
       from users u
       join profiles p on p.id = u.id
       where u.id = $1`,
      [payload.sub],
    );
    const user = rows[0];
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    return c.json({
      id: payload.sub,
      email: user.email,
      displayName: user.display_name,
      plan: user.plan,
      whatsappPhone: user.whatsapp_phone,
      whatsappNotificationsEnabled: user.whatsapp_notifications_enabled,
    });
  } catch {
    return c.json({ error: "Unauthorized" }, 401);
  }
});
