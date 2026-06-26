#!/usr/bin/env bash
# Henter app-kode + assets fra render-serveren (kilde til sandhed) ind i
# build-konteksten og bygger GPU-worker-imaget. Kør fra gpu-worker/.
set -euo pipefail
SSH="${SOMI_RENDER_SSH:-somi-render}"
cd "$(dirname "$0")"

echo "Henter fra render-serveren ($SSH)..."
mkdir -p tts render/fonts
scp "$SSH:/opt/somi-tts/app.py"            tts/app.py
scp "$SSH:/opt/chatterbox/ref.wav"         tts/ref.wav
scp "$SSH:/opt/somi-renderer/server.js"    render/server.js
scp "$SSH:/opt/somi-renderer/package.json" render/package.json
scp "$SSH":/opt/somi-renderer/fonts/*.ttf  render/fonts/

echo "Bygger somi-gpu-worker:latest ..."
docker build -t somi-gpu-worker:latest .

cat <<'NOTE'

✅ Build færdig. Kør på en GPU-host (RunPod/vast/Scaleway, RTX 4090 el. L4):
   docker run --gpus all -p 8080:8080 -p 8090:8090 \
     -e API_KEY=<samme-nøgle-som-render-VPS> \
     -e BASE_URL=http://<worker-public-ip>:8080 \
     somi-gpu-worker:latest

Peg derefter n8n-pipelinen (MASTER 'Send til TTS' + 'Send til render') på
<worker-ip> i stedet for 81.88.25.119 — drop-in, bare ~10x hurtigere.
NOTE
