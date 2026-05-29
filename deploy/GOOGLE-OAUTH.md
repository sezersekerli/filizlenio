# Google OAuth (Supabase Cloud)

Web uygulaması şu an **e-posta / şifre** ile giriş kullanıyor. Google’ı açmak için aşağıdaki adımları uygulayıp `NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=true` yapın ve `pnpm build:web` + servisi yeniden başlatın.

## 1. Supabase Dashboard

**Authentication → Providers → Google** → Enable  
Client ID ve Secret: Google Cloud Console’dan.

**Authentication → URL Configuration → Redirect URLs:**

```
https://app.filizlen.io/auth/callback
http://localhost:3001/auth/callback
```

## 2. Google Cloud Console

https://console.cloud.google.com/apis/credentials

OAuth client → **Web application**

**Authorized redirect URIs:**

```
https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
```

(`YOUR_PROJECT_REF` = Supabase proje URL’nizdeki alt alan adı)

## 3. Uygulama

`apps/web-app/.env.local`:

```env
NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=true
```

Sonra `pnpm build:web` ve `systemctl restart filizlen-web-app`.
