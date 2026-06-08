# Filizlen — kendi PostgreSQL + backend auth

Auth ve veritabanı **kendi API + Postgres** üzerinde. Migration dosyası: `services/api/migrations/001_init.sql`

## 1. Postgres başlat

```bash
cd /home/sezer/projects/filizlenio
docker compose -f deploy/docker-compose.postgres.yml up -d
```

Port: **5434** (PostGIS 16)

## 2. Migration

```bash
cd services/api
set -a && source .env && set +a
pnpm migrate
```

## 3. Env dosyaları

**`services/api/.env`**

```env
DATABASE_URL=postgresql://filizlen:filizlen_dev_2026@127.0.0.1:5434/filizlen
JWT_SECRET=<openssl rand -hex 32>
PORT=3012
WEB_ORIGIN=https://app.filizlen.io
COOKIE_SECURE=true
```

**`apps/web-app/.env.local`**

```env
NEXT_PUBLIC_API_URL=https://app.filizlen.io/api
AUTH_JWT_SECRET=<API ile aynı JWT_SECRET>
```

## 4. Build & restart

```bash
cd /home/sezer/projects/filizlenio
pnpm build:api && pnpm build:web
sudo cp deploy/filizlen-api.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl restart filizlen-api filizlen-web-app
```

## Auth endpoint'leri

| Method | Path | Açıklama |
|--------|------|----------|
| POST | `/auth/register` | Kayıt |
| POST | `/auth/login` | Giriş (cookie + accessToken) |
| POST | `/auth/refresh` | Token yenile |
| POST | `/auth/logout` | Çıkış |
| GET | `/auth/me` | Oturum bilgisi |

Parolalar **bcrypt** ile hash'lenir. JWT HS256, issuer `filizlen-api`.
