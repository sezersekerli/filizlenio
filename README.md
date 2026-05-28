# Filizlen — filizlen.io

Tarım 5.0 marketing sitesi (Next.js, Framer Motion, Tailwind).

## Geliştirme

```bash
npm install
npm run dev
```

http://localhost:3000

## Production build

```bash
npm run build
npm start
```

## Production (bu sunucu — aktif)

Site **https://filizlen.io** üzerinde çalışıyor:

- **Next.js** → `127.0.0.1:3010` (`filizlenio` systemd servisi)
- **Nginx** → HTTPS (Let's Encrypt), HTTP→HTTPS, www→apex
- **SSL** otomatik yenileme (certbot)

### Güncelleme deploy

```bash
cd /home/sezer/projects/filizlenio
git pull
npm run build
sudo systemctl restart filizlenio
```

veya:

```bash
./deploy/setup-https.sh
```

### DNS (Hostinger)

| Tip | Ad | Değer |
|-----|-----|--------|
| A | `@` | `172.205.218.232` |
| A veya CNAME | `www` | `filizlen.io` veya aynı IP |

## Deploy (Vercel — alternatif)

Vercel kullanılacaksa DNS Vercel IP’lerine yönlendirilir; bu sunucudaki nginx devre dışı kalır.

## İletişim e-postası

`src/lib/content.ts` → `site.email`
