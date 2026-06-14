#!/usr/bin/env python3
"""
Galaksay — Kürtçe (Kurmancî, Latin) TTS klip üretici.

facebook/mms-tts-kmr-script_latin (VITS) modeliyle manifest.json'daki her metin için
bir .wav klibi üretir ve public/audio/ku/ altına yazar. Uygulama bu klipleri
tarayıcı TTS yerine çalar (kuAudio.js); klip yoksa tarayıcı TTS'e düşer.

Kurulum:
    pip install torch transformers scipy

Çalıştırma (proje kökünden veya bu klasörden):
    python scripts/ku-tts/generate.py

Çıktı:
    public/audio/ku/<id>.wav   (örn. public/audio/ku/num/3.wav)
    public/audio/ku/index.json (mevcut klip listesi — kuAudio.js bunu okur)

Not: İlk çalıştırmada model (~150 MB) HuggingFace'ten indirilir; internet gerekir.
İsteğe bağlı küçültme (mp3): üretimden sonra ffmpeg ile dönüştürebilirsiniz.
"""
import json
import sys
from pathlib import Path

# Windows konsolu (cp1254) ✓/✗ + Kürtçe ê/û karakterlerini yazamaz → UTF-8'e zorla
try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent
OUT = ROOT / "public" / "audio" / "ku"
MANIFEST = HERE / "manifest.json"


def main():
    if not MANIFEST.exists():
        sys.exit("manifest.json yok — önce: node scripts/ku-tts/build-manifest.mjs")

    try:
        import torch
        from transformers import VitsModel, AutoTokenizer
        import scipy.io.wavfile
    except ImportError as e:
        sys.exit(f"Eksik paket: {e}\nKurulum: pip install torch transformers scipy")

    data = json.loads(MANIFEST.read_text(encoding="utf-8"))
    model_id = data.get("model", "facebook/mms-tts-kmr-script_latin")
    clips = data["clips"]

    print(f"Model yükleniyor: {model_id} ...")
    model = VitsModel.from_pretrained(model_id)
    tokenizer = AutoTokenizer.from_pretrained(model_id)
    model.eval()
    sr = int(model.config.sampling_rate)

    OUT.mkdir(parents=True, exist_ok=True)
    generated, failed = [], []
    total = len(clips)
    for i, (cid, text) in enumerate(clips.items(), 1):
        path = OUT / (cid + ".wav")
        path.parent.mkdir(parents=True, exist_ok=True)
        try:
            inputs = tokenizer(text, return_tensors="pt")
            with torch.no_grad():
                wav = model(**inputs).waveform[0].cpu().numpy()
            scipy.io.wavfile.write(str(path), rate=sr, data=wav)
            generated.append(cid)
            print(f"  [{i}/{total}] ✓ {cid}  «{text}»")
        except Exception as ex:  # noqa: BLE001
            failed.append(cid)
            print(f"  [{i}/{total}] ✗ {cid}  «{text}»  — {ex}")

    (OUT / "index.json").write_text(
        json.dumps({"sampleRate": sr, "ids": generated}, ensure_ascii=False),
        encoding="utf-8",
    )
    print(f"\nBitti: {len(generated)}/{total} klip → {OUT}")
    if failed:
        print(f"Başarısız: {failed}")
    print("index.json yazıldı. Uygulamayı yeniden başlat — kuAudio klipleri çalacak.")


if __name__ == "__main__":
    main()
