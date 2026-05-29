# Filizlen — filizlen.io Monorepo

Tarım 5.0 platformu: marketing sitesi, ürün web uygulaması, mobil (Expo) ve API servisi.

## Yapı

```
filizlenio/
├── apps/
│   ├── marketing/     # filizlen.io (port 3000 / prod 3010)
│   ├── web-app/       # app.filizlen.io (port 3001 / prod 3011)
│   └── mobile/        # Expo Android (io.filizlen.app)
├── packages/
│   ├── shared/        # Zod şemaları, sabitler, tipler
│   └── api-client/    # Typed HTTP client
├── services/
│   └── api/           # Hono API (port 3012)
├── supabase/
│   ├── migrations/    # PostGIS + RLS
│   └── config.toml
└── deploy/nginx/      # Örnek nginx yapılandırmaları
```

## Gereksinimler

- Node.js 20+
- [pnpm](https://pnpm.io/) 9+
- Supabase projesi (Auth + PostgreSQL)
- Google Cloud OAuth (web + Android)

## Kurulum

```bash
pnpm install
pnpm --filter @filizlen/shared build
pnpm --filter @filizlen/api-client build
```

Ortam dosyalarını kopyalayın:

```bash
cp .env.example .env
cp apps/web-app/.env.example apps/web-app/.env.local
cp services/api/.env.example services/api/.env
```

### Supabase

1. [supabase.com](https://supabase.com) üzerinde proje oluşturun
2. SQL migration çalıştırın: `supabase/migrations/20250528000000_init.sql`
3. Dashboard → Authentication → Google provider (Client ID/Secret)
4. Redirect URLs: `http://localhost:3001/auth/callback`, `https://app.filizlen.io/auth/callback`, `filizlen://auth/callback`

### Google OAuth

- **Web:** redirect `https://<project>.supabase.co/auth/v1/callback`
- **Android:** package `io.filizlen.app`, SHA-1 (debug + release) → Supabase + Google Console

**Production (`app.filizlen.io`)** — sunucuda mutlaka:

```bash
nano /home/sezer/projects/filizlenio/apps/web-app/.env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://XXXXXXXX.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_API_URL=https://app.filizlen.io/api
# NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=true  # sonraki faz — deploy/GOOGLE-OAUTH.md
```

```bash
cd /home/sezer/projects/filizlenio
npm exec pnpm@9.15.0 run build:web
sudo systemctl restart filizlen-web-app filizlen-api
```

Aynı değerleri `services/api/.env` içine de ekleyin. Adım adım: **[deploy/SUPABASE-CLOUD.md](deploy/SUPABASE-CLOUD.md)**

Auth ve veritabanı **Supabase Cloud** (ücretsiz plan) üzerinde; sunucuda Docker Supabase yok.

## Geliştirme

```bash
# Tüm servisler (paralel)
pnpm dev

# Tek tek
pnpm dev:marketing   # http://localhost:3000
pnpm dev:web         # http://localhost:3001
pnpm dev:api         # http://localhost:3012
```

Mobil:

```bash
cd apps/mobile && pnpm dev
```

## Build

```bash
pnpm build:marketing
pnpm build:web
pnpm build:api
```

## Production deploy

| Servis | Domain | Port (local upstream) |
|--------|--------|------------------------|
| Marketing | filizlen.io | 3010 |
| Web app | app.filizlen.io | 3011 |
| API | api.filizlen.io | 3012 |

Örnek nginx: `deploy/nginx/*.conf`

### Marketing güncelleme (mevcut sunucu)

```bash
cd /home/sezer/projects/filizlenio
git pull
pnpm install
pnpm build:marketing
sudo systemctl restart filizlenio   # WorkingDirectory: apps/marketing
```

Systemd `WorkingDirectory` ve `ExecStart` yolunu `apps/marketing` olacak şekilde güncelleyin:

```ini
WorkingDirectory=/home/sezer/projects/filizlenio/apps/marketing
ExecStart=/usr/bin/pnpm start:prod
```

### Web app (app.filizlen.io)

DNS: `app` A kaydı sunucu IP’sine (ör. `172.205.218.232`).

```bash
cd /home/sezer/projects/filizlenio
git pull
npm exec pnpm -- install
npm exec pnpm -- build:web
# İlk kurulum: TLS + nginx + systemd
./deploy/setup-https-app.sh
```

Güncelleme (kod değişikliği):

```bash
cd /home/sezer/projects/filizlenio
git pull
npm exec pnpm -- install
npm exec pnpm -- build:web
sudo systemctl restart filizlen-web-app
```

Doğrulama:

```bash
curl -sI https://app.filizlen.io
ss -tlnp | grep 3011
sudo systemctl status filizlen-web-app
```

Systemd birimi: `deploy/filizlen-web-app.service` → `WorkingDirectory=apps/web-app`, port **3011** (`npm run start:prod`).

Nginx: `deploy/nginx-app.filizlen.io.conf` → `/etc/nginx/sites-available/app.filizlen.io`.

Servisleri yeniden başlatma:

```bash
sudo systemctl restart filizlen-web-app   # ürün uygulaması
sudo systemctl restart filizlenio           # marketing (filizlen.io)
sudo nginx -t && sudo systemctl reload nginx
```

Certbot başarısız olursa: `app.filizlen.io` A kaydının bu sunucunun **genel** IP’sine işaret ettiğini ve 80/tcp’nin açık olduğunu kontrol edin; ardından:

```bash
sudo certbot certonly --webroot -w /var/www/certbot -d app.filizlen.io
sudo cp deploy/nginx-app.filizlen.io.conf /etc/nginx/sites-available/app.filizlen.io
sudo nginx -t && sudo systemctl reload nginx
```

### API (api.filizlen.io)

```bash
npm exec pnpm -- build:api
# systemd veya pm2 ile 3012 portunda çalıştırın
```

DNS: `api` A kaydı sunucu IP’sine.

## API özeti

| Method | Path | Açıklama |
|--------|------|----------|
| GET | `/health` | Sağlık |
| GET | `/tkgm/ilceler/:ilId` | İlçe listesi |
| GET | `/tkgm/mahalleler/:ilceId` | Mahalle listesi |
| GET | `/tkgm/parsel/:mahalleId/:ada/:parsel` | GeoJSON |
| GET | `/parcels` | JWT — parsel listesi |
| POST | `/parcels` | JWT — parsel oluştur (max 5 free) |
| GET | `/parcels/:id` | JWT — detay |
| DELETE | `/parcels/:id` | JWT — sil |
| GET/POST | `/parcels/:id/events` | JWT — olaylar |

## Marka

- Primary: `#22c55e`
- Koyu tema: `apps/*/src/app/globals.css` veya `packages/shared` `BRAND` sabitleri

## İletişim

`apps/marketing/src/lib/content.ts` → `site.email`
