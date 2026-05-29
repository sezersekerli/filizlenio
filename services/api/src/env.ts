export function getEnv() {
  const databaseUrl = process.env.DATABASE_URL ?? "";
  const jwtSecret = process.env.JWT_SECRET ?? "";
  const tkgmApiBase =
    process.env.TKGM_API_BASE ??
    "https://cbsapi.tkgm.gov.tr/megsiswebapi.v3.1";
  const cookieSecure = process.env.COOKIE_SECURE !== "false";
  const webOrigin = process.env.WEB_ORIGIN ?? "https://app.filizlen.io";

  return {
    databaseUrl,
    jwtSecret,
    tkgmApiBase,
    cookieSecure,
    webOrigin,
    isConfigured: Boolean(databaseUrl && jwtSecret),
  };
}
