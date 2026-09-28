#!/usr/bin/env python3
"""Canlı derlemede lisans kapısı ve NuMap bütünleşmesi — 28 Eylül 2026.

giris_guvenligi.py'den sonra uygulanır. Sunucu tarafı: canli-surum/functions/ (Pages Functions).
Gerekçeler: docs/NUMAP_BAGLANTISI.md §4–§5.
Her değişiklik birebir metin eşleşmesiyle yapılır; beklenen eşleşme sayısı tutmazsa hiçbir dosya değişmez.
"""
import glob, sys
ROOT = sys.argv[1] if len(sys.argv) > 1 else 'canli-surum/site'
A = f'{ROOT}/oyna/assets/'
FILES = {
    'I': glob.glob(A + 'index-*.js')[0],
    'C': glob.glob(A + 'ChildSelect-*.js')[0],
    'S': glob.glob(A + 'syncEngine-*.js')[0],
    'K': glob.glob(A + 'categories-*.js')[0],
}
R = []
def sub(old, new, n=1, f='S'): R.append((f, old, new, n))

# ── 1. Aile cihazından ilerleme (b seçeneği) ──────────────────────────────────────────────────────
# NuMap belirteci yoksa ve bu cihaz aile bağlantısıyla lisanslandıysa (galaksay_aile = 1), ilerleme
# /api/lisans/ilerleme'ye gider; GalakSay sunucusu HttpOnly çerezdeki davetle NuMap'e iletir.
# Paylaşım yine rızaya bağlıdır (dataSync; aile sayfasında ebeveyn seçer).
sub('import{b as L,d as k,f as A,i as D}from"./database-DbskHfL1.js";',
    'import{b as L,d as k,f as A,i as D}from"./database-DbskHfL1.js";'
    'function gsAile(){try{return localStorage.getItem("galaksay_aile")==="1"}catch{return!1}}'
    'async function gsAilePost(x){const r=await fetch("/api/lisans/ilerleme",{method:"POST",credentials:"same-origin",headers:{"content-type":"application/json"},body:JSON.stringify(x)});'
    'if(!r.ok)throw new Error("aile ilerlemesi "+r.status);const j=await r.json().catch(()=>({}));return j.accepted??null}')
sub('!e||!y()||!f())return t("ATLANDI', '!e||!y()||!(f()||gsAile()))return t("ATLANDI')
sub('await C({sessions:gsM(g),', 'await (f()?C:gsAilePost)({sessions:gsM(g),')
sub('async function b(){if(!(!y()||!f())', 'async function b(){if(!(!y()||!(f()||gsAile()))')

# ── 2. NuMap'ten öğrenciyle açılış (?ogrenci=<anahtar>) ───────────────────────────────────────────
# galaksay-ek.js anahtarı sessionStorage'a (gs_ogrenci) alır; NuMap listesi yüklenince o öğrenci
# kendiliğinden seçilir ve oyun onunla açılır.
sub('Ze=d.useCallback(s=>{if(o==="local"){i==null||i(s);return}const L=s.session,P=mt(L);i==null||i({ns:P,name:s.name,grade:s.grade,ageMonths:s.ageMonths,numapProfile:ut(L,P),childMeta:Ft(L)})},[i,o]),ra=',
    'Ze=d.useCallback(s=>{if(o==="local"){i==null||i(s);return}const L=s.session,P=mt(L);i==null||i({ns:P,name:s.name,grade:s.grade,ageMonths:s.ageMonths,numapProfile:ut(L,P),childMeta:Ft(L)})},[i,o]),'
    'gsOg=d.useEffect(()=>{if(o==="local"||!f||!f.length)return;let k=null;try{k=sessionStorage.getItem("gs_ogrenci")}catch{}if(!k)return;'
    'const it=f.find(x=>x&&x.studentKey===k&&x.session);if(it){try{sessionStorage.removeItem("gs_ogrenci")}catch{}Ze(it)}},[f,o,Ze]),ra=', f='C')

# ── 3. NuMap çıkışı lisans çerezini de siler (yalnız NuMap kaynaklıysa; aile daveti korunur) ────────
sub('async function wc(){try{await Wn("POST","/auth/logout")}catch{}Oc(),Mc();',
    'async function wc(){try{await Wn("POST","/auth/logout")}catch{}Oc(),Mc();'
    'try{fetch("/api/lisans/cikis",{method:"POST",credentials:"same-origin",headers:{"content-type":"application/json"},body:\'{"tur":"numap"}\'}).catch(()=>{})}catch{}', f='I')

# ── 3b. Giriş sayfasından ya da NuMap'ten yeni gelen öğretmen doğrudan öğretmen merkezine ─────────
# galaksay-ek.js devri alınca gs_devir_taze işaretini koyar; oturum doğrulanınca öğretmen oturumu
# açılır (SSO'daki gibi). İşaret yoksa (kayıtlı oturumla geri dönüş) davranış değişmez.
sub('return kp().then(Y=>{_&&(P(Y),g("authed"))})',
    'return kp().then(Y=>{let gsT=!1;try{gsT=sessionStorage.getItem("gs_devir_taze")==="1";sessionStorage.removeItem("gs_devir_taze")}catch{}_&&(P(Y),g("authed"),gsT&&U({kind:"numap",user:Y}))})', f='I')

# ── 4. Karşılaştırma maddelerinde algısal ipucu işareti ───────────────────────────────────────────
# Uyumsuz (boyut yanılsamalı) madde incongruent = 1, diğer karşılaştırma maddeleri 0. NuMap öğrenci
# sayfası iki doğruluğu ayrı gösterir.
sub('questionContent:s?{type:s.type,num1:s.num1,num2:s.num2}:{}',
    'questionContent:s?{type:s.type,num1:s.num1,num2:s.num2,...(s.type==="comparison"?{incongruent:s.sizeIllusion?1:0}:{})}:{}', f='K')

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
