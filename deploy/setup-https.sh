#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="/home/sezer/projects/filizlenio"
NGINX_AVAILABLE="/etc/nginx/sites-available/filizlen.io"
NGINX_ENABLED="/etc/nginx/sites-enabled/filizlen.io"
CERT_PATH="/etc/letsencrypt/live/filizlen.io/fullchain.pem"

echo "==> Building Next.js..."
cd "$PROJECT_DIR"
export PATH="/usr/bin:$PATH"
npm exec pnpm@9.15.0 install
npm exec pnpm@9.15.0 run build:marketing

echo "==> Installing systemd service..."
sudo cp "$PROJECT_DIR/deploy/filizlenio.service" /etc/systemd/system/filizlenio.service
sudo sed -i 's|npm run start:prod|npm run start:marketing|' /etc/systemd/system/filizlenio.service || true
sudo systemctl daemon-reload
sudo systemctl enable filizlenio
sudo systemctl restart filizlenio

echo "==> SSL params snippet..."
sudo mkdir -p /etc/nginx/snippets
if [ ! -f /etc/nginx/snippets/ssl-params.conf ]; then
  sudo tee /etc/nginx/snippets/ssl-params.conf > /dev/null <<'SSL'
ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers off;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;
SSL
fi

echo "==> Nginx HTTP-only (for certbot)..."
sudo tee "$NGINX_AVAILABLE" > /dev/null <<'HTTP'
server {
    listen 80;
    listen [::]:80;
    server_name filizlen.io www.filizlen.io;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        proxy_pass http://127.0.0.1:3010;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
HTTP

sudo mkdir -p /var/www/certbot
sudo ln -sf "$NGINX_AVAILABLE" "$NGINX_ENABLED"
sudo nginx -t
sudo systemctl reload nginx

if [ ! -f "$CERT_PATH" ]; then
  echo "==> Obtaining Let's Encrypt certificate..."
  sudo certbot certonly --webroot -w /var/www/certbot \
    -d filizlen.io -d www.filizlen.io \
    --non-interactive --agree-tos --register-unsafely-without-email \
    || sudo certbot certonly --webroot -w /var/www/certbot \
    -d filizlen.io -d www.filizlen.io \
    --non-interactive --agree-tos -m info@filizlen.io
fi

echo "==> Installing full HTTPS nginx config..."
sudo cp "$PROJECT_DIR/deploy/nginx-filizlen.io.conf" "$NGINX_AVAILABLE"
sudo nginx -t
sudo systemctl reload nginx

echo "==> Done. Test: curl -sI https://filizlen.io"
