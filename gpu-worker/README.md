# SOMI GPU-worker

On-demand GPU-version af render+TTS-stakken. Drop-in erstatning for den CPU-baserede
render-VPS (one.com) — kører de samme to services, bare ~10x hurtigere.

## Hvorfor (valideret POC 2026-06-27, RTX 4090)

| Del | CPU (one.com 8 vCPU) | **GPU (RTX 4090, målt)** | Speedup |
|---|---|---|---|
| TTS (Chatterbox) | ~50 min | **~4 min** (3,45x realtime, opvarmet) | ~12x |
| Render/encode (ffmpeg NVENC) | flere× | **5,7s / 60s 1080p (~10x)** | ~10x |
| **Samlet pr. video** | **~100 min** | **~10-15 min** | **~7-10x** |

**Kost:** ~$0.40/t ÷ ~0.25 t/video = **~$0.10/video** → ~$3/md ved 1 video/dag,
~$60-100/md ved 30/dag. Kun on-demand (spin op pr. job). POC'en kostede ~$0.40.

## Den kritiske viden: pinnede deps
Chatterbox 0.1.7 pinner en ældre HF-stak der kolliderer med moderne base-images.
Den validerede kombination (ellers fejler importen):
```
torch==2.6.0+cu124   transformers==4.46.3   tokenizers==0.20.3
huggingface-hub==0.25.2   chatterbox-tts==0.1.7   numpy==1.26.4   (uden torchvision-mismatch)
```
Rækkefølge: install chatterbox FØRST, downgrade HF-stakken DEREFTER med `--no-deps`.
Alt er kodet i `Dockerfile`.

## Byg
```bash
cd gpu-worker
./build.sh          # henter app.py/server.js/ref.wav/fonts fra render-serveren + docker build
```
Kræver: Docker + `ssh somi-render`-adgang (kilde til app-kode/stemme).

## Deploy (on-demand)
```bash
docker run --gpus all -p 8080:8080 -p 8090:8090 \
  -e API_KEY=<samme-nøgle-som-render-VPS> \
  -e BASE_URL=http://<worker-public-ip>:8080 \
  somi-gpu-worker:latest
```
Anbefalet udbyder: **RunPod** (RTX 4090, on-demand/serverless, per-sekund-billing).
EU-alternativ til kunde-data: **Scaleway L4** (Paris). Begge kan køre dette image.

## Wire til pipelinen
n8n MASTER bruger to render-kald: **"Send til TTS"** (→ `:8090/tts`) og
**"Send til render"** (→ `:8080/render`). Skift host fra `81.88.25.119` til
GPU-workerens IP når den kører. Resten af pipelinen er uændret.

Strategi: behold one.com-boksen som altid-tændt koordinator (n8n/web/Supabase);
spin GPU-workeren op kun mens der renderes.

## ⚠️ Før produktion
- **Build + smoke-test imaget på en GPU-host** (én testvideo end-to-end) før kundebrug —
  Dockerfilen er bygget på validerede pins + den faktiske stak, men hele image-bygget
  (whisper.cpp CUDA-compile, npm install, ffmpeg-nvenc) er ikke kørt samlet endnu.
- Verificér `ffmpeg -encoders | grep nvenc` i imaget (apt-ffmpeg har det normalt).
- Voice-track: forkortelses-fixet + pacing (TEMPO 0.85) er allerede i `app.py` på
  render-serveren → følger med via `build.sh`.

POC-tal + beslutning: se memory `ai-businesses-labs` / `growth-system-program`.
