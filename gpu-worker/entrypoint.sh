#!/usr/bin/env bash
# Starter de samme to services som CPU-render-VPS'en, men på GPU:
#   - TTS (FastAPI/uvicorn, Chatterbox CUDA) på 8090
#   - Render (node + ffmpeg NVENC + whisper CUDA) på 8080
set -euo pipefail

export API_KEY="${API_KEY:?sæt API_KEY (samme nøgle som render-VPS'en)}"
export BASE_URL="${BASE_URL:-http://0.0.0.0:8080}"

echo "[gpu-worker] TTS:8090 + render:8080 | BASE_URL=$BASE_URL"
( cd /opt/worker/tts    && exec uvicorn app:app --host 0.0.0.0 --port 8090 ) &
( cd /opt/worker/render && PORT=8080 exec node server.js ) &

# Dør hvis én af dem dør (så orkestratoren kan genstarte containeren)
wait -n
