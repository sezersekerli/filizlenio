import { getApiBaseUrl, type AuthUser } from "./constants";

type AuthResponse = {
  user: AuthUser;
  accessToken?: string;
};

async function parseError(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { error?: string };
    return typeof body.error === "string" ? body.error : "İstek başarısız";
  } catch {
    return "İstek başarısız";
  }
}

export async function registerUser(input: {
  email: string;
  password: string;
  displayName?: string;
}): Promise<AuthUser> {
  const res = await fetch(`${getApiBaseUrl()}/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await parseError(res));
  const data = (await res.json()) as AuthResponse;
  return data.user;
}

export async function loginUser(input: {
  email: string;
  password: string;
}): Promise<AuthUser> {
  const res = await fetch(`${getApiBaseUrl()}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await parseError(res));
  const data = (await res.json()) as AuthResponse;
  return data.user;
}

export async function logoutUser(): Promise<void> {
  await fetch(`${getApiBaseUrl()}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}

export async function fetchCurrentUser(): Promise<AuthUser | null> {
  const res = await fetch(`${getApiBaseUrl()}/auth/me`, {
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json() as Promise<AuthUser>;
}
