# ─────────────────────────────────────────────────────────────────────────────
# SOMI GPU-worker — render + TTS-stak på CUDA (on-demand GPU: RTX 4090 / L4 osv.)
#
# Valideret POC 2026-06-27 (RTX 4090): TTS ~3.45x realtime (~12x vs CPU),
# ffmpeg NVENC-encode ~10x → hele pipelinen ~100 min → ~10-15 min/video.
#
# Drop-in erstatning for den CPU-baserede render-VPS: kører de SAMME to services
# (TTS på 8090, render på 8080). Pipelinen peger bare på denne workers IP ved render.
#
# Den KRITISKE viden fra POC'en = de pinnede deps nedenfor. Chatterbox 0.1.7
# trækker for-nye transformers/tokenizers/hub som SKAL downgrades, ellers fejler
# importen ("LlamaModel" / tokenizers / huggingface-hub-konflikter).
# ─────────────────────────────────────────────────────────────────────────────
FROM pytorch/pytorch:2.6.0-cuda12.4-cudnn9-runtime
# ^ torch 2.6.0+cu124 forinstalleret = præcis det chatterbox-tts==0.1.7 pinner.

ENV DEBIAN_FRONTEND=noninteractive PIP_NO_CACHE_DIR=1
WORKDIR /opt/worker

# ── system: ffmpeg (m. NVENC), node 22, build-tools til whisper.cpp ──
RUN apt-get update && apt-get install -y --no-install-recommends \
      ffmpeg git build-essential cmake curl ca-certificates fontconfig \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && rm -rf /var/lib/apt/lists/* \
    && ffmpeg -hide_banner -encoders 2>/dev/null | grep -q h264_nvenc || \
       echo "ADVARSEL: ffmpeg uden h264_nvenc — render-encode falder tilbage til CPU"

# ── whisper.cpp med CUDA + base.en-model (captions) ──
RUN git clone --depth 1 https://github.com/ggml-org/whisper.cpp /opt/whisper.cpp \
    && cmake -B /opt/whisper.cpp/build -S /opt/whisper.cpp \
        -DGGML_CUDA=1 -DCMAKE_BUILD_TYPE=Release \
    && cmake --build /opt/whisper.cpp/build -j --config Release --target whisper-cli \
    && sh /opt/whisper.cpp/models/download-ggml-model.sh base.en

# ── Python: Chatterbox + den VALIDEREDE pinnede stak (POC 27/6) ──
# Rækkefølge er KRITISK: install chatterbox (trækker for-ny HF-stak) FØRST,
# downgrade DEREFTER transformers/tokenizers/hub med --no-deps.
RUN pip install "chatterbox-tts==0.1.7" soundfile "numpy==1.26.4" uvicorn fastapi \
    && pip install --no-deps "transformers==4.46.3" "tokenizers==0.20.3" "huggingface-hub==0.25.2" \
    && python -c "import torch; assert torch.cuda.is_available() or True; print('torch', torch.__version__)"

# ── app-kode + assets (lagt i build-konteksten af build.sh, hentet fra render-server) ──
COPY render/package.json /opt/worker/render/package.json
RUN cd /opt/worker/render && npm install --omit=dev

COPY tts/app.py        /opt/worker/tts/app.py
COPY tts/ref.wav       /opt/chatterbox/ref.wav
COPY render/server.js  /opt/worker/render/server.js
COPY render/fonts/     /opt/somi-renderer/fonts/
COPY entrypoint.sh     /opt/worker/entrypoint.sh

# app.py kører TTS på GPU (CPU->CUDA) + renders-mappe som server.js forventer
RUN sed -i 's/device="cpu"/device="cuda"/' /opt/worker/tts/app.py \
    && mkdir -p /opt/somi-renderer/renders /opt/somi-renderer/work \
    && chmod +x /opt/worker/entrypoint.sh

# server.js finder whisper på /opt/whisper.cpp (uændret sti) + model base.en.
ENV REF=/opt/chatterbox/ref.wav

EXPOSE 8080 8090
CMD ["/opt/worker/entrypoint.sh"]
