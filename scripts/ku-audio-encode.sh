#!/usr/bin/env bash
# Kürtçe (Kurmancî) TTS kliplerini dağıtım biçimine çevirir: WAV (32-bit float, 16 kHz) → AAC m4a 48 kbps mono.
# 343 klip 31 MB → 4 MB. scripts/ku-tts ile yeni WAV üretildikten sonra çalıştırın; WAV'lar depoya girmez.
# Kullanım: bash scripts/ku-audio-encode.sh [public/audio/ku]
set -euo pipefail
DIR="${1:-public/audio/ku}"
command -v ffmpeg >/dev/null || { echo "ffmpeg gerekli (https://ffmpeg.org)"; exit 1; }
n=0
for f in "$DIR"/num/*.wav "$DIR"/phrase/*.wav "$DIR"/word/*.wav; do
  [ -e "$f" ] || continue
  ffmpeg -v error -y -i "$f" -ac 1 -ar 16000 -c:a aac -b:a 48k -movflags +faststart "${f%.wav}.m4a"
  rm -f "$f"; n=$((n+1))
done
echo "$n klip m4a'ya çevrildi → $DIR (index.json 'format':'m4a' olmalı)"
