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
│   └── api/           # Hono API + Postgres auth (port 3012)
└── deploy/            # nginx, systemd, docker-compose
```

## Gereksinimler

- Node.js 20+
- [pnpm](https://pnpm.io/) 9+
- PostgreSQL + PostGIS (Docker ile veya kendi sunucunuz)

## Kurulum

```bash
pnpm install
pnpm --filter @filizlen/shared build
pnpm --filter @filizlen/api-client build
```

Ortam dosyalarını kopyalayın:

```bash
cp apps/web-app/.env.example apps/web-app/.env.local
cp services/api/.env.example services/api/.env
cp apps/mobile/.env.example apps/mobile/.env
```

Veritabanı ve migration: **[deploy/POSTGRES.md](deploy/POSTGRES.md)**

**Production (`app.filizlen.io`)** — sunucuda:

```env
# apps/web-app/.env.local
NEXT_PUBLIC_API_URL=https://app.filizlen.io/api
AUTH_JWT_SECRET=<API JWT_SECRET ile aynı>
```

```env
# services/api/.env
DATABASE_URL=postgresql://filizlen:...@127.0.0.1:5434/filizlen
JWT_SECRET=<openssl rand -hex 32>
PORT=3012
WEB_ORIGIN=https://app.filizlen.io
COOKIE_SECURE=true
```

Auth ve veritabanı **kendi API + Postgres** üzerinde. Supabase yok.

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
| API | app.filizlen.io/api | 3012 |

Örnek nginx: `deploy/nginx/*.conf`

### Servisleri yeniden başlatma

```bash
sudo systemctl restart filizlen-web-app filizlen-api filizlenio
sudo nginx -t && sudo systemctl reload nginx
```

## API özeti

| Method | Path | Açıklama |
|--------|------|----------|
| GET | `/health` | Sağlık |
| POST | `/auth/register` | Kayıt |
| POST | `/auth/login` | Giriş |
| POST | `/auth/logout` | Çıkış |
| GET | `/auth/me` | Oturum |
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
