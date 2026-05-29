#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="/home/sezer/projects/filizlenio"
NGINX_AVAILABLE="/etc/nginx/sites-available/app.filizlen.io"
NGINX_ENABLED="/etc/nginx/sites-enabled/app.filizlen.io"
CERT_PATH="/etc/letsencrypt/live/app.filizlen.io/fullchain.pem"

echo "==> Installing systemd unit for web app..."
sudo cp "$PROJECT_DIR/deploy/filizlen-web-app.service" /etc/systemd/system/filizlen-web-app.service
sudo systemctl daemon-reload
sudo systemctl enable filizlen-web-app
sudo systemctl restart filizlen-web-app

echo "==> Nginx HTTP-only (for certbot)..."
sudo tee "$NGINX_AVAILABLE" > /dev/null <<'NGINX'
server {
    listen 80;
    listen [::]:80;
    server_name app.filizlen.io;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 404;
    }
}
NGINX

sudo ln -sf "$NGINX_AVAILABLE" "$NGINX_ENABLED"
sudo mkdir -p /var/www/certbot
sudo nginx -t
sudo systemctl reload nginx

if [ ! -f "$CERT_PATH" ]; then
  echo "==> Obtaining TLS certificate..."
  sudo certbot certonly --webroot -w /var/www/certbot \
    -d app.filizlen.io \
    --non-interactive --agree-tos -m info@filizlen.io \
    || sudo certbot certonly --webroot -w /var/www/certbot \
    -d app.filizlen.io \
    --non-interactive --agree-tos -m info@filizlen.io --register-unsafely-without-email
fi

echo "==> Installing full HTTPS nginx config..."
sudo cp "$PROJECT_DIR/deploy/nginx-app.filizlen.io.conf" "$NGINX_AVAILABLE"
sudo nginx -t
sudo systemctl reload nginx

echo "==> Done. Test: curl -sI https://app.filizlen.io"
