#!/usr/bin/env python3
"""Canlı derlemede giriş güvenliği düzeltmeleri — 28 Eylül 2026.

numap_baglantisi.py'den sonra uygulanır. Gerekçeler: docs/NUMAP_BAGLANTISI.md (§4 Giriş güvenliği).
Her değişiklik birebir metin eşleşmesiyle yapılır; beklenen eşleşme sayısı tutmazsa hiçbir dosya değişmez.
"""
import glob, sys
ROOT = sys.argv[1] if len(sys.argv) > 1 else 'canli-surum/site'
A = f'{ROOT}/oyna/assets/'
FILES = {'I': glob.glob(A + 'index-*.js')[0], 'C': glob.glob(A + 'ChildSelect-*.js')[0]}
R = []
def sub(old, new, n=1, f='C'): R.append((f, old, new, n))

# ── 1. Tüm veriyi silme ve yedekten geri yükleme yalnız cihaz yöneticisine ─────────────────────────
# NuMap oturumuyla açılan merkezde "Tüm veriyi sil" görünüyordu. Silme cihaz şifresini de kaldırdığı
# için ardından herkes yeni yönetici şifresi koyabiliyordu. Artık yalnız yönetici oturumunda görünür.
sub('canEraseAll:!b||F,isDeviceAdmin:F', 'canEraseAll:F,isDeviceAdmin:F')

# ── 2. Dışa aktarma yalnız cihaz yöneticisine; hesap belirteçleri dosyaya girmez ───────────────────
# Dosya cihazdaki bütün öğretmenlerin çocuk verisini içerir. galaksay_hesap (e-posta hesabı oturum
# belirteçleri) gizli anahtarlar listesine eklendi: dışa aktarılmaz, geri yüklemede üzerine yazılmaz.
sub('e.jsx(fe,{label:a("Verileri dışa aktar (JSON)","Daneyan derxe (JSON)","Export data (JSON)"),onClick:O}),r&&',
    'r&&e.jsx(fe,{label:a("Verileri dışa aktar (JSON)","Daneyan derxe (JSON)","Export data (JSON)"),onClick:O}),r&&')
sub('"galaksay_auth_fail_v1"]),ft=', '"galaksay_auth_fail_v1","galaksay_hesap"]),ft=')

# ── 3. NuMap çıkışında öğrenci önbelleği de silinir (ad, doğum tarihi, okul, yanıtlar) ─────────────
sub('async function wc(){try{await Wn("POST","/auth/logout")}catch{}Oc(),Mc()}',
    'async function wc(){try{await Wn("POST","/auth/logout")}catch{}Oc(),Mc();try{Object.keys(localStorage).filter(k=>/^numap_children_cache_/.test(k)).forEach(k=>localStorage.removeItem(k))}catch{}}', f='I')

# ── 4. Boşta kilit: cihaz şifresi yoksa NuMap oturumu da kapanır ────────────────────────────────────
# Cihaz şifresi yokken kilitten dönüş yalnız 2 sn basılı tutmayla açılıyordu (çocuk kilidi). Gözetimsiz
# bırakılan cihazda NuMap öğrenci listesi böylece açık kalmaz; öğretmen yeniden girer.
sub('gsLock=()=>{try{sessionStorage.setItem("gs_locked","1")}catch{}U(null),F("welcome")}',
    'gsLock=()=>{try{sessionStorage.setItem("gs_locked","1")}catch{}if(Kl()&&!Dp()){wc().catch(()=>{});N(null),P(null),g("unauthed")}U(null),F("welcome")}', f='I')

# ── 5. Yönetici şifresi eski biçimdeyse ilk doğru girişte PBKDF2'ye yükseltilir ─────────────────────
sub('async function Ap(u){try{const c=localStorage.getItem(fu);return c?/^(pbkdf2|sha256|plain):/.test(c)?Yl(String(u),c):String(u)===c:!1}catch{return!1}}',
    'async function Ap(u){try{const c=localStorage.getItem(fu);if(!c)return!1;const ok=/^(pbkdf2|sha256|plain):/.test(c)?await Yl(String(u),c):String(u)===c;'
    'if(ok&&!c.startsWith("pbkdf2:")&&Ql())try{const h=await Nr(String(u));h.startsWith("pbkdf2:")&&localStorage.setItem(fu,h)}catch{}return ok}catch{return!1}}', f='I')

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
