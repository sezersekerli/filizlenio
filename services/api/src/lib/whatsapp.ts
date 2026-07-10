import { getEnv } from "../env.js";

export function normalizeWhatsAppPhone(input: string): string {
  const digits = input.replace(/\D/g, "");
  if (digits.startsWith("90") && digits.length === 12) return digits;
  if (digits.length === 10 && digits.startsWith("5")) return `90${digits}`;
  if (digits.length === 11 && digits.startsWith("0")) return `90${digits.slice(1)}`;
  return digits;
}

export function isWhatsAppConfigured(): boolean {
  const { whatsappAccessToken, whatsappPhoneNumberId } = getEnv();
  return Boolean(whatsappAccessToken && whatsappPhoneNumberId);
}

export async function sendWhatsAppText(
  toPhoneE164: string,
  body: string,
): Promise<{ messageId: string }> {
  const { whatsappAccessToken, whatsappPhoneNumberId, whatsappApiVersion } = getEnv();

  if (!whatsappAccessToken || !whatsappPhoneNumberId) {
    throw new Error("WhatsApp API yapılandırılmamış");
  }

  const to = normalizeWhatsAppPhone(toPhoneE164);
  const url = `https://graph.facebook.com/${whatsappApiVersion}/${whatsappPhoneNumberId}/messages`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${whatsappAccessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: body.slice(0, 4096) },
    }),
  });

  const payload = (await res.json()) as {
    messages?: Array<{ id: string }>;
    error?: { message?: string };
  };

  if (!res.ok) {
    throw new Error(payload.error?.message ?? `WhatsApp HTTP ${res.status}`);
  }

  const messageId = payload.messages?.[0]?.id;
  if (!messageId) {
    throw new Error("WhatsApp yanıtı geçersiz");
  }

  return { messageId };
}
