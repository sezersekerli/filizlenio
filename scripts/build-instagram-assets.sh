#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
exec "$ROOT/.venv-instagram/bin/python" "$ROOT/scripts/build_instagram.py" "$@"
