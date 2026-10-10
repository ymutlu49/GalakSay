#!/usr/bin/env python3
"""Canlı derlemede giriş ve oyuna erişim düzeltmeleri — 10 Ekim 2026.

lisans_kapisi.py'den sonra uygulanır. Gerekçeler: docs/GIRIS_VE_HESAP_MODELI.md (§8).
Giriş merkezinin kendisi okunur kaynaktadır (kaynak/WelcomeScreen.captain.js); rol metinleri
oyna/galaksay-ek.js tablosundadır. Bu betik yalnız paketteki sabit simgeyi rol duyarlı yapar.
Her değişiklik birebir metin eşleşmesiyle yapılır; beklenen eşleşme sayısı tutmazsa hiçbir dosya değişmez.
"""
import glob, sys
ROOT = sys.argv[1] if len(sys.argv) > 1 else 'canli-surum/site'
A = f'{ROOT}/oyna/assets/'
FILES = {'T': glob.glob(A + 'TeacherLogin-*.js')[0]}
R = []
def sub(old, new, n=1, f='T'): R.append((f, old, new, n))

# ── 1. Ebeveyn girişinde öğretmen simgesi ───────────────────────────────────────────────────────────
# "Ebeveyn" döşemesiyle açılan giriş ekranında başlığın üstünde 🧑‍🏫 duruyordu (başlık metni
# galaksay-ek.js rol tablosundan "Ebeveyn Girişi" olur). Simge de role uyar.
sub('e.jsx("div",{style:{fontSize:46,marginBottom:6},children:"🧑‍🏫"})',
    'e.jsx("div",{style:{fontSize:46,marginBottom:6},children:window.__gsRole&&window.__gsRole()==="ebeveyn"?"👪":"🧑‍🏫"})')

# ── Uygula ────────────────────────────────────────────────────────────────────────────────────────
src = {k: open(p, encoding='utf-8').read() for k, p in FILES.items()}
errors = 0
for f, old, new, n in R:
    c = src[f].count(old)
    if c != n:
        print(f'EŞLEŞME {c} (beklenen {n}) [{f}]: {old[:100]}'); errors += 1
if errors:
    sys.exit(f'{errors} değişiklik uygulanamadı; dosyalar değiştirilmedi.')
for f, old, new, n in R:
    src[f] = src[f].replace(old, new)
for k, p in FILES.items():
    open(p, 'w', encoding='utf-8').write(src[k])
print(f'{len(R)} değişiklik uygulandı.')
