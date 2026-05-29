import { createHash, randomBytes } from "node:crypto";
import { query } from "../db.js";

export function generateRefreshToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function storeRefreshToken(userId: string, token: string, days = 30) {
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  await query(
    `insert into refresh_tokens (user_id, token_hash, expires_at) values ($1, $2, $3)`,
    [userId, tokenHash, expiresAt.toISOString()],
  );
}

export async function findUserByRefreshToken(token: string) {
  const tokenHash = hashToken(token);
  const { rows } = await query<{ user_id: string; email: string }>(
    `select rt.user_id, u.email
     from refresh_tokens rt
     join users u on u.id = rt.user_id
     where rt.token_hash = $1 and rt.expires_at > now()
     limit 1`,
    [tokenHash],
  );
  return rows[0] ?? null;
}

export async function revokeRefreshToken(token: string) {
  await query(`delete from refresh_tokens where token_hash = $1`, [
    hashToken(token),
  ]);
}

export async function revokeAllRefreshTokens(userId: string) {
  await query(`delete from refresh_tokens where user_id = $1`, [userId]);
}
