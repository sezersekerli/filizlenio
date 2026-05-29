import { SignJWT, jwtVerify } from "jose";
import { getEnv } from "../../env.js";

const ISSUER = "filizlen-api";
const ACCESS_TTL = "15m";

export type AccessTokenPayload = {
  sub: string;
  email: string;
};

function secretKey() {
  const { jwtSecret } = getEnv();
  if (!jwtSecret) throw new Error("JWT_SECRET is not set");
  return new TextEncoder().encode(jwtSecret);
}

export async function signAccessToken(payload: AccessTokenPayload): Promise<string> {
  return new SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuer(ISSUER)
    .setIssuedAt()
    .setExpirationTime(ACCESS_TTL)
    .sign(secretKey());
}

export async function verifyAccessToken(token: string): Promise<AccessTokenPayload> {
  const { payload } = await jwtVerify(token, secretKey(), {
    issuer: ISSUER,
    algorithms: ["HS256"],
  });
  const sub = payload.sub;
  if (!sub) throw new Error("Invalid token");
  return {
    sub,
    email: (payload.email as string) ?? "",
  };
}

export const ACCESS_COOKIE = "filizlen_access";
export const REFRESH_COOKIE = "filizlen_refresh";
export const ACCESS_MAX_AGE = 60 * 15;
export const REFRESH_MAX_AGE = 60 * 60 * 24 * 30;
