function normalizeTkgmApiBase(base: string) {
  const trimmed = base.replace(/\/$/, "");
  if (trimmed.endsWith("/api")) return trimmed;
  return `${trimmed}/api`;
}

export function getEnv() {
  const databaseUrl = process.env.DATABASE_URL ?? "";
  const jwtSecret = process.env.JWT_SECRET ?? "";
  const tkgmApiBase = normalizeTkgmApiBase(
    process.env.TKGM_API_BASE ??
      "https://cbsapi.tkgm.gov.tr/megsiswebapi.v3.1/api",
  );
  const cookieSecure = process.env.COOKIE_SECURE !== "false";
  const webOrigin = process.env.WEB_ORIGIN ?? "https://app.filizlen.io";
  const whatsappAccessToken = process.env.WHATSAPP_ACCESS_TOKEN ?? "";
  const whatsappPhoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID ?? "";
  const whatsappApiVersion = process.env.WHATSAPP_API_VERSION ?? "v21.0";
  const whatsappNotifyAllUsers = process.env.WHATSAPP_NOTIFY_ALL_USERS !== "false";
  const notificationCronSecret = process.env.NOTIFICATION_CRON_SECRET ?? "";

  return {
    databaseUrl,
    jwtSecret,
    tkgmApiBase,
    cookieSecure,
    webOrigin,
    whatsappAccessToken,
    whatsappPhoneNumberId,
    whatsappApiVersion,
    whatsappNotifyAllUsers,
    notificationCronSecret,
    isConfigured: Boolean(databaseUrl && jwtSecret),
  };
}
