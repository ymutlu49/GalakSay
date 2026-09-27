#!/usr/bin/env python3
"""Canlı derlemede: yetişkin panelinden eklenen çocuğu da ekleyen yetişkine bağla — 27 Eylül 2026.

Giriş merkezindeki kaptan sihirbazı yeni kaptanı yetişkine bağlar (kayıtta `hesap` alanı;
kaynak/WelcomeScreen.captain.js). Yetişkin panelindeki "Yeni Çocuk / Yeni Öğrenci" formu da aynı
bağı yazsın diye, oluşturulan kayıt hemen ardından güncellenir. Bağ bilgisi giriş merkezinin
window.__gsBindInfo işlevinden gelir (e-posta hesabı ya da cihaz yetişkin şifresi).
Önce giris_merkezi.py uygulanmış olmalıdır.
"""
import glob, sys
ROOT = sys.argv[1] if len(sys.argv) > 1 else 'canli-surum/site'
cp = glob.glob(f'{ROOT}/oyna/assets/ChildSelect-*.js')[0]
s = open(cp, encoding='utf-8').read()
old = 'const z=c?ht(t.ns,l):da({...l,ownerId:i});'
new = ('const z=c?ht(t.ns,l):(gsN=>gsN&&gsN.ns?ht(gsN.ns,{hesap:typeof window<"u"&&window.__gsBindInfo?window.__gsBindInfo():{tur:"cihaz",at:new Date().toISOString()}})||gsN:gsN)(da({...l,ownerId:i}));')
if s.count(old) != 1:
    sys.exit(f'EŞLEŞME {s.count(old)}: dosya değiştirilmedi')
open(cp, 'w', encoding='utf-8').write(s.replace(old, new, 1))
print('çocuk bağlama uygulandı →', cp)
