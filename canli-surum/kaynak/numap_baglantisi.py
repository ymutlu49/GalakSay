#!/usr/bin/env python3
"""Canlı derlemede NuMap bağlantısı düzeltmeleri — 28 Eylül 2026.

icerik_iyilestirmeleri.py'den sonra uygulanır. Gerekçeler: docs/NUMAP_BAGLANTISI.md.
Her değişiklik birebir metin eşleşmesiyle yapılır; beklenen eşleşme sayısı tutmazsa hiçbir dosya değişmez.
"""
import glob, sys
ROOT = sys.argv[1] if len(sys.argv) > 1 else 'canli-surum/site'
A = f'{ROOT}/oyna/assets/'
FILES = {
    'G': glob.glob(A + 'GalakSay-*.js')[0],
    'I': glob.glob(A + 'index-*.js')[0],
    'S': glob.glob(A + 'syncEngine-*.js')[0],
}
R = []  # (dosya, eski, yeni, beklenen eşleşme sayısı)
def sub(old, new, n=1, f='G'): R.append((f, old, new, n))

# ── 1. Yanlış NuMap adresi ────────────────────────────────────────────────────────────────────────
# Oyun ana ekranındaki NuMap düğmesi numap.netlify.app'i açıyordu. Bu adres NuMap değil, ilgisiz bir
# üniversite ders planlayıcısı. Düğme artık getnumap.com'u açar; açılan sekme GalakSay'a erişemez.
sub('window.open("https://numap.netlify.app","_blank")', 'window.open("https://getnumap.com/","_blank","noopener")')
sub('children:"NuMAP"', 'children:"NuMap"')

# ── 2. GalakSay lisansı (NuMap yetkisi) ───────────────────────────────────────────────────────────
# NuMap giriş, oturum doğrulama ve SSO yanıtlarında plan ve entitlements alanlarını gönderir; GalakSay
# bunları atıyordu. Artık saklanır ve yetki listesi "galaksay" içermiyorsa giriş reddedilir (403).
# Yetki listesi tanımsız (null) hesaplar NuMap'te "her şey açık" sayılır; burada da öyle.
GSLIS = (
    'function gsT(r,n,u){let l="tr";try{l=localStorage.getItem("ds_lang")||"tr"}catch{}return l==="ku"?n:l==="en"?u:r}'
    'function gsLis(r){const x=r&&Array.isArray(r.entitlements)?r.entitlements:null;'
    'if(x&&!x.includes("galaksay"))throw new Bc(gsT("Bu NuMap hesabında GalakSay lisansı yok. Lisans için kurumunuzun NuMap yöneticisine başvurun.",'
    '"Di vê hesabê NuMap de lîsansa GalakSay tune. Ji bo lîsansê serî li rêveberê NuMap yê saziya xwe bidin.",'
    '"This NuMap account has no GalakSay licence. Ask your institution\'s NuMap administrator for a licence."),403);'
    'return{plan:r&&r.plan!=null?r.plan:null,entitlements:x}}'
)
sub('async function dm(u,c){const a=await Wn("POST","/auth/login",{email:u,password:c});Ic(a.token);const g={...a.user,assessmentRemaining:a.assessmentRemaining??null};',
    GSLIS + 'async function dm(u,c){const a=await Wn("POST","/auth/login",{email:u,password:c});const gsE=gsLis(a);Ic(a.token);const g={...a.user,assessmentRemaining:a.assessmentRemaining??null,...gsE};', f='I')
sub('async function wp(u){const c=await Wn("POST","/auth/sso/exchange",{ticket:String(u||"").trim()});Ic(c.token);const a={...c.user,assessmentRemaining:c.assessmentRemaining??null};',
    'async function wp(u){const c=await Wn("POST","/auth/sso/exchange",{ticket:String(u||"").trim()});const gsE=gsLis(c);Ic(c.token);const a={...c.user,assessmentRemaining:c.assessmentRemaining??null,...gsE};', f='I')
# Oturum doğrulamada yetki kaldırılmışsa 403 → mevcut akış belirteci ve kullanıcıyı siler.
sub('async function kp(){const u=await Wn("GET","/auth/me"),c={...u.user,assessmentRemaining:u.assessmentRemaining??null};',
    'async function kp(){const u=await Wn("GET","/auth/me"),gsE=gsLis(u),c={...u.user,assessmentRemaining:u.assessmentRemaining??null,...gsE};', f='I')

# ── 3. NuMap'ten gelişte başarısız giriş sessiz kalmasın ─────────────────────────────────────────
# Süresi dolmuş bilet ya da lisanssız hesap: ileti oyna/galaksay-ek.js tarafından açılışta gösterilir.
sub('.catch(()=>{Y&&g(Kl()?"loading":"unauthed")})',
    '.catch(gsR=>{try{sessionStorage.setItem("gs_numap_msg",gsR&&gsR.status===403?gsR.message:gsT("NuMap bağlantısı doğrulanamadı ya da süresi doldu. GalakSay\'ı NuMap\'ten yeniden açın.",'
    '"Girêdana NuMap nehat piştrastkirin an dema wê derbas bû. GalakSay ji NuMap dîsa vekin.","The NuMap link could not be verified or has expired. Open GalakSay from NuMap again."));'
    'window.dispatchEvent(new Event("gs-numap-msg"))}catch{}Y&&g(Kl()?"loading":"unauthed")})', f='I')

# ── 4. NuMap taramasına bağlı yerel çocuğun ilerlemesi doğru öğrenciye gitsin ───────────────────────
# Sunucu öğrenciyi childId "numap_<16 hex>" biçiminden tanır. Bağlı yerel çocuk (ns = local_N) verisini
# kendi ns'iyle gönderiyordu; NuMap bu satırları hiçbir öğrenciye bağlayamıyordu. Cihazdaki kayıtlar
# local_N altında kalır; yalnız gönderilen kopyada childId öğrenci anahtarına çevrilir.
sub('const t=(n,s)=>{try{console.log("[GalakSay sync]",n,s===void 0?"":s)}catch{}};',
    'const t=()=>{};const gsC=(()=>{try{const r=(JSON.parse(localStorage.getItem("galaksay_local_children"))||[]).find(x=>x&&x.ns===e&&x.source!=="numap"&&/^[a-f0-9]{16}$/.test(x.numapStudentKey||""));return r?"numap_"+r.numapStudentKey:e}catch{return e}})(),gsM=a=>a.map(o=>({...o,childId:gsC}));', f='S')
sub('await C({sessions:g,events:u,ltTransitions:d,dailySummaries:m})',
    'await C({sessions:gsM(g),events:gsM(u),ltTransitions:gsM(d),dailySummaries:gsM(m)})', f='S')

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
