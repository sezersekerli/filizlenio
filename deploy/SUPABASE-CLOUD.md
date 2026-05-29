# Supabase Cloud (ücretsiz SaaS) kurulumu

Sunucudaki Docker Supabase kaldırıldı. Auth ve veritabanı artık **Supabase Cloud** üzerinden.

## 1. Proje oluştur

1. https://supabase.com/dashboard → **New project**
2. Region: Frankfurt (eu-central) veya size yakın
3. Database password kaydedin

## 2. SQL migration

Dashboard → **SQL Editor** → New query → yapıştırın:

`supabase/migrations/20250528000000_init.sql`

→ **Run**

## 3. API anahtarları

**Project Settings → API**

- Project URL → `https://xxxxx.supabase.co`
- `anon` `public` key
- `service_role` key (gizli tutun)
- JWT Secret → Settings → API → JWT Settings

## 4. Sunucuda env dosyaları

```bash
nano /home/sezer/projects/filizlenio/apps/web-app/.env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://XXXXX.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
NEXT_PUBLIC_API_URL=https://app.filizlen.io/api
# Google OAuth sonraki faz — deploy/GOOGLE-OAUTH.md
# NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=true
```

```bash
nano /home/sezer/projects/filizlenio/services/api/.env
```

```env
SUPABASE_URL=https://XXXXX.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
SUPABASE_JWT_SECRET=your-jwt-secret-from-dashboard
PORT=3012
HOST=127.0.0.1
TKGM_API_BASE=https://cbsapi.tkgm.gov.tr/megsiswebapi.v3.1
```

## 5. E-posta girişi (Supabase Dashboard)

**Authentication → Providers → Email** → Enable

**Confirm email → KAPALI** (MVP için önerilir; açıksa kullanıcı kayıt sonrası e-posta onayı bekler):

Authentication → **Sign In / Providers** → Email → **Confirm email** → off

**Authentication → URL Configuration → Redirect URLs** (magic link için):

```
https://app.filizlen.io/auth/callback
http://localhost:3001/auth/callback
```

## 6. Google OAuth (sonraki faz)

Şimdilik web girişi e-posta / şifre ile. Google’a geçmek için: **[deploy/GOOGLE-OAUTH.md](GOOGLE-OAUTH.md)**

## 7. Deploy

```bash
cd /home/sezer/projects/filizlenio
sudo cp deploy/nginx-app.filizlen.io.conf /etc/nginx/sites-available/app.filizlen.io
sudo nginx -t && sudo systemctl reload nginx
npm exec pnpm@9.15.0 run build:web
sudo systemctl restart filizlen-web-app filizlen-api
```

## Notlar

- Ücretsiz plan: 500 MB DB, 50k MAU, 7 gün inaktivitede pause
- Eski Docker’daki kullanıcılar (demo@filizlen.io vb.) Cloud’da yok — yeniden kayıt gerekir
- `supabase/` klasörü migration için kalır; sunucuda `supabase start` çalıştırmayın
