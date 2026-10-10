#!/usr/bin/env python3
"""Canlı derlemede Google Play (TWA) hazırlığı — 10 Ekim 2026.

giris_erisim.py'den sonra uygulanır. Gerekçeler: docs/play-store/README.md (§2 Aile politikası).
Uygulama kipinde (galaksay-ek.js §11, window.__gsUygulama) çocuğun ulaşabildiği oyun ekranlarından
site dışına giden bağlantılar kaldırılır. Her değişiklik birebir metin eşleşmesiyle yapılır; beklenen
eşleşme sayısı tutmazsa hiçbir dosya değişmez.
"""
import glob, sys
ROOT = sys.argv[1] if len(sys.argv) > 1 else 'canli-surum/site'
A = f'{ROOT}/oyna/assets/'
FILES = {'G': glob.glob(A + 'GalakSay-*.js')[0]}
R = []
def sub(old, new, n=1, f='G'): R.append((f, old, new, n))

# ── 1. Sınıf seçme ekranındaki NuMap düğmesi (getnumap.com'u yeni pencerede açar) ──────────────────
# Çocuğun ulaşabildiği bir ekranda. Uygulama kipinde gösterilmez; web'de olduğu gibi kalır.
sub('children:[e.jsxs("button",{onClick:()=>window.open("https://getnumap.com/","_blank","noopener")',
    'children:[window.__gsUygulama&&window.__gsUygulama()?null:e.jsxs("button",{onClick:()=>window.open("https://getnumap.com/","_blank","noopener")')

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
