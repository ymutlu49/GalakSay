"""
GalakSay Sentetik Ajan Simülasyonu (Synthetic Learner Simulation)
==================================================================
Yöntem: In-silico pre-pilot study
Temel: Item Response Theory (Rasch ailesi) + Ebbinghaus öğrenme eğrisi
Amaç: Tasarım kararlarının iç tutarlılığını test etmek; gerçek pilot için
beklenen veri yapılarını öngörmek.

ÖNEMLİ: Bu simülasyon gerçek çocuk verisinin yerini tutmaz. Yalnızca
oyunun zorluk basamaklarını kalibre etmek ve tasarım hipotezlerini
sınamak için kullanılır.
"""

import json
import math
import random
import numpy as np
import pandas as pd
from pathlib import Path

random.seed(42)
np.random.seed(42)

OUT = Path("/sessions/exciting-quirky-darwin/mnt/outputs")

# ═══════════════════════════════════════════════════════════════════════
# 1. SENTETİK ÖĞRENEN PROFİLLERİ
# ═══════════════════════════════════════════════════════════════════════
# Profil boyutları:
#  - yaş: 4-7
#  - sayi_hissi: gizli yetenek (theta), N(0,1) skala — düşük/orta/yüksek
#  - diskalkuli_riski: var/yok (var → theta -1.2, +daha yavaş öğrenme oranı)
#  - calisma_bellegi: 0.3-1.0 (ipucu kullanımı ve hata toleransını etkiler)
#  - motivasyon: 0.5-1.0 (tamamlama eğilimini etkiler)

PROFILES = []
profile_id = 0
for yas in [4, 5, 6, 7]:
    for sayi_hissi_kategori in ["dusuk", "tipik", "ileri"]:
        for diskalkuli_riski in [False, True]:
            n_per_cell = 1 if (yas == 4 or yas == 7) else 2  # daha çok 5-6 yaş
            for _ in range(n_per_cell):
                profile_id += 1
                # Gizli yetenek (theta)
                if sayi_hissi_kategori == "dusuk":
                    base_theta = np.random.normal(-0.8, 0.3)
                elif sayi_hissi_kategori == "ileri":
                    base_theta = np.random.normal(0.9, 0.3)
                else:
                    base_theta = np.random.normal(0.0, 0.3)

                # Yaş etkisi (normatif gelişim)
                age_boost = (yas - 5) * 0.4
                theta = base_theta + age_boost

                # Diskalkuli riski theta'yı düşürür
                if diskalkuli_riski:
                    theta -= 1.2
                    learning_rate = np.random.uniform(0.04, 0.10)
                else:
                    learning_rate = np.random.uniform(0.10, 0.20)

                wm = np.random.uniform(0.4, 0.95)
                if diskalkuli_riski:
                    wm = max(0.3, wm - 0.2)

                motivation = np.random.uniform(0.6, 1.0)

                PROFILES.append({
                    "id": f"P{profile_id:02d}",
                    "yas": yas,
                    "sayi_hissi": sayi_hissi_kategori,
                    "diskalkuli_riski": diskalkuli_riski,
                    "theta": round(theta, 2),
                    "calisma_bellegi": round(wm, 2),
                    "motivasyon": round(motivation, 2),
                    "ogrenme_orani": round(learning_rate, 3),
                })

print(f"Sentetik profil sayısı: {len(PROFILES)}")

# ═══════════════════════════════════════════════════════════════════════
# 2. ÖĞRENME YÖRÜNGESİ BASAMAKLARI (GalakSay LT)
# ═══════════════════════════════════════════════════════════════════════
# Clements & Sarama yörüngeleri — basamak başına zorluk parametresi (b)
# Düşük b → kolay; yüksek b → zor
TRAJECTORY = [
    # Sayma yörüngesi
    {"id": "T01", "ad": "Birebir Eşleme",       "yorunge": "Sayma",          "lt_level": 4,  "b": -1.6, "yas_aralik": "3-4"},
    {"id": "T02", "ad": "5'e Kadar Sayma",      "yorunge": "Sayma",          "lt_level": 5,  "b": -1.2, "yas_aralik": "4"},
    {"id": "T03", "ad": "10'a Kadar Sayma",     "yorunge": "Sayma",          "lt_level": 6,  "b": -0.8, "yas_aralik": "4-5"},
    {"id": "T04", "ad": "Kardinal İlke",        "yorunge": "Sayma",          "lt_level": 7,  "b": -0.5, "yas_aralik": "5"},
    {"id": "T05", "ad": "Geri Sayma (10→1)",    "yorunge": "Sayma",          "lt_level": 9,  "b": 0.0,  "yas_aralik": "5-6"},
    # Sanbil yörüngesi
    {"id": "T06", "ad": "Algısal Sanbil (1-4)", "yorunge": "Sanbil",         "lt_level": 5,  "b": -0.9, "yas_aralik": "4-5"},
    {"id": "T07", "ad": "5'lik Çerçeve",        "yorunge": "Sanbil",         "lt_level": 6,  "b": -0.4, "yas_aralik": "4-5"},
    {"id": "T08", "ad": "Kavramsal Sanbil (10)","yorunge": "Sanbil",         "lt_level": 8,  "b": 0.2,  "yas_aralik": "5-6"},
    # Karşılaştırma
    {"id": "T09", "ad": "Az-Çok-Eşit",          "yorunge": "Karşılaştırma",  "lt_level": 7,  "b": -0.6, "yas_aralik": "4-5"},
    {"id": "T10", "ad": "Sıralama (1-10)",      "yorunge": "Karşılaştırma",  "lt_level": 12, "b": 0.5,  "yas_aralik": "5-6"},
    {"id": "T11", "ad": "Sayı Doğrusu Konum",   "yorunge": "Karşılaştırma",  "lt_level": 15, "b": 1.2,  "yas_aralik": "6-7"},
    # Sayı bileşimi
    {"id": "T12", "ad": "5'in Parça-Bütünü",    "yorunge": "Sayı Bileşimi",  "lt_level": 4,  "b": -0.7, "yas_aralik": "4-5"},
    {"id": "T13", "ad": "10'un Arkadaşları",    "yorunge": "Sayı Bileşimi",  "lt_level": 6,  "b": 0.3,  "yas_aralik": "5-6"},
    {"id": "T14", "ad": "Numbers-in-Numbers",   "yorunge": "Sayı Bileşimi",  "lt_level": 9,  "b": 0.9,  "yas_aralik": "6-7"},
    # Toplama-çıkarma
    {"id": "T15", "ad": "Somut Toplama (≤5)",   "yorunge": "Toplama-Çıkarma","lt_level": 4,  "b": -0.5, "yas_aralik": "4-5"},
    {"id": "T16", "ad": "Üzerine Sayarak Topl.", "yorunge": "Toplama-Çıkarma","lt_level": 7,  "b": 0.4,  "yas_aralik": "5-6"},
    {"id": "T17", "ad": "10'a Tamamla",         "yorunge": "Toplama-Çıkarma","lt_level": 10, "b": 1.1,  "yas_aralik": "6-7"},
    # Basamak değeri
    {"id": "T18", "ad": "Onluk Birimleme",      "yorunge": "Basamak Değeri", "lt_level": 16, "b": 1.5,  "yas_aralik": "6-7"},
]

print(f"Yörünge basamak sayısı: {len(TRAJECTORY)}")

# ═══════════════════════════════════════════════════════════════════════
# 3. SİMÜLASYON — Her ajan her basamaktan geçer
# ═══════════════════════════════════════════════════════════════════════
# 1-PL Rasch modeli: P(doğru | theta, b) = 1 / (1 + exp(-(theta - b)))
# Ek değişkenler:
#  - ipucu kullanımı: theta'ya göre olasılıksal
#  - hatadan sonra theta'da +learning_rate (öğrenme)
#  - ustalaşma eşiği: %75 doğru ardışık 3 deneme

MASTERY_THRESHOLD = 0.75
MAX_ATTEMPTS_PER_LEVEL = 12
HINT_PENALTY = 0.2  # ipucu alındığında 'doğru' yine sayılır ama mastery'ye katkısı azalır


def simulate_attempt(theta, b, wm, motivation):
    """Tek bir deneme — sonuç: doğru/yanlış, ipucu sayısı, süre"""
    # İpucu olasılığı: theta < b ise yüksek, calisma_bellegi düşükse yüksek
    diff = theta - b
    hint_prob = max(0.0, min(0.85, 0.5 - diff * 0.25 + (1 - wm) * 0.3))
    hints_used = 0
    while np.random.random() < hint_prob and hints_used < 3:
        hints_used += 1
        hint_prob *= 0.5

    # Doğru cevap olasılığı (Rasch + ipucu desteği)
    p_correct = 1 / (1 + math.exp(-(theta - b + hints_used * 0.4)))
    correct = np.random.random() < p_correct

    # Süre (saniye): zorluk farkı + WM + ipucu sayısına göre
    base_time = 8 + max(0, (b - theta) * 4)
    wm_factor = 1.0 + (1 - wm) * 0.6
    hint_time = hints_used * 4
    time_sec = max(3, np.random.normal(base_time * wm_factor + hint_time, 2.0))

    return {
        "correct": int(correct),
        "hints": hints_used,
        "time_sec": round(time_sec, 1),
        "p_correct": round(p_correct, 3),
    }


def simulate_level(profile, level):
    """Bir basamağı simüle et. Ustalaşana ya da maksimum denemeye ulaşana kadar."""
    theta = profile["theta"]
    b = level["b"]
    wm = profile["calisma_bellegi"]
    motivation = profile["motivasyon"]
    learning_rate = profile["ogrenme_orani"]

    attempts = []
    correct_in_window = []  # son 3 deneme
    mastered = False

    for attempt_num in range(1, MAX_ATTEMPTS_PER_LEVEL + 1):
        result = simulate_attempt(theta, b, wm, motivation)
        result["attempt"] = attempt_num
        result["theta_at_start"] = round(theta, 2)
        attempts.append(result)

        # Öğrenme: her deneme theta'yı biraz artırır (yanlışta daha çok, ipucu varsa biraz)
        if result["correct"] == 0:
            theta += learning_rate * 1.2
        else:
            theta += learning_rate * 0.4

        correct_in_window.append(result["correct"])
        if len(correct_in_window) > 3:
            correct_in_window.pop(0)

        # Ustalaşma kriteri: son 3 denemede en az 3/3 doğru ve hint <= 1
        if len(correct_in_window) >= 3:
            recent = attempts[-3:]
            recent_acc = sum(r["correct"] for r in recent) / 3
            recent_hints = sum(r["hints"] for r in recent)
            if recent_acc >= MASTERY_THRESHOLD and recent_hints <= 2:
                mastered = True
                break

        # Motivasyon koruması: çok yanlış üst üste = bırakma
        if attempt_num >= 5 and sum(r["correct"] for r in attempts) / attempt_num < 0.1:
            if np.random.random() > motivation:
                break

    total = len(attempts)
    correct_total = sum(a["correct"] for a in attempts)
    hints_total = sum(a["hints"] for a in attempts)
    time_total = sum(a["time_sec"] for a in attempts)

    return {
        "profile_id": profile["id"],
        "level_id": level["id"],
        "level_name": level["ad"],
        "yorunge": level["yorunge"],
        "lt_level": level["lt_level"],
        "b": level["b"],
        "theta_start": profile["theta"],
        "theta_end": round(theta, 2),
        "attempts": total,
        "correct": correct_total,
        "accuracy": round(correct_total / total, 3) if total else 0,
        "hints_total": hints_total,
        "hints_per_attempt": round(hints_total / total, 2) if total else 0,
        "time_total_sec": round(time_total, 1),
        "time_per_attempt": round(time_total / total, 1) if total else 0,
        "mastered": int(mastered),
        "attempts_to_mastery": total if mastered else None,
    }


# ═══════════════════════════════════════════════════════════════════════
# 4. TÜM AJANLAR × TÜM BASAMAKLAR
# ═══════════════════════════════════════════════════════════════════════
all_results = []
for profile in PROFILES:
    for level in TRAJECTORY:
        # Yaş ve LT aralığı uygunluk: ajan yaşı 4 ise sadece L4-7 basamakları
        if profile["yas"] == 4 and level["lt_level"] > 8: continue
        if profile["yas"] == 5 and level["lt_level"] > 12: continue
        if profile["yas"] == 6 and level["lt_level"] > 16: continue
        # 7 yaş tüm basamakları görür
        result = simulate_level(profile, level)
        # Profil meta bilgisi ekle
        result["yas"] = profile["yas"]
        result["sayi_hissi"] = profile["sayi_hissi"]
        result["diskalkuli_riski"] = profile["diskalkuli_riski"]
        all_results.append(result)

df = pd.DataFrame(all_results)
print(f"\nToplam simülasyon kaydı: {len(df)}")
print(f"Ustalaşma oranı (genel): {df['mastered'].mean():.2%}")
print(f"Diskalkuli risk grubu ustalaşma: {df[df['diskalkuli_riski']]['mastered'].mean():.2%}")
print(f"Tipik gelişim ustalaşma: {df[~df['diskalkuli_riski']]['mastered'].mean():.2%}")

# Kaydet
df.to_csv(OUT / "simulation_results.csv", index=False, encoding="utf-8")
df.to_json(OUT / "simulation_results.json", orient="records", force_ascii=False)
print(f"\nKayıt: simulation_results.csv ({df.shape})")

# Profil özeti
profile_df = pd.DataFrame(PROFILES)
profile_df.to_csv(OUT / "profiles.csv", index=False, encoding="utf-8")

# Yörünge özeti
trajectory_df = pd.DataFrame(TRAJECTORY)
trajectory_df.to_csv(OUT / "trajectory.csv", index=False, encoding="utf-8")

# ═══════════════════════════════════════════════════════════════════════
# 5. ÖZET İSTATİSTİKLER
# ═══════════════════════════════════════════════════════════════════════
print("\n=== BASAMAK BAŞINA ÖZET ===")
level_summary = df.groupby(["level_id", "level_name", "b"]).agg(
    n=("profile_id", "count"),
    accuracy=("accuracy", "mean"),
    mastery_rate=("mastered", "mean"),
    avg_attempts=("attempts", "mean"),
    avg_hints=("hints_per_attempt", "mean"),
    avg_time=("time_per_attempt", "mean"),
).round(2).reset_index()
print(level_summary.to_string())
level_summary.to_csv(OUT / "level_summary.csv", index=False, encoding="utf-8")

print("\n=== PROFİL TİPİNE GÖRE ÖZET ===")
profile_summary = df.groupby(["sayi_hissi", "diskalkuli_riski"]).agg(
    n_levels=("level_id", "count"),
    accuracy=("accuracy", "mean"),
    mastery_rate=("mastered", "mean"),
    avg_attempts=("attempts", "mean"),
    avg_hints=("hints_per_attempt", "mean"),
).round(3).reset_index()
print(profile_summary.to_string())
profile_summary.to_csv(OUT / "profile_summary.csv", index=False, encoding="utf-8")

print("\nSimülasyon tamamlandı.")
