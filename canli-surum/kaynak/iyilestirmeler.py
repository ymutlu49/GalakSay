#!/usr/bin/env python3
"""Canlı derlemede kullanılabilirlik ve ölçme iyileştirmeleri — 27 Eylül 2026.

Önce yorunge_duzeltmeleri.py ve secenek_duzeltmeleri.py uygulanmış olmalıdır. Her değişiklik
birebir metin eşleşmesiyle tam bir kez yapılır; eşleşme yoksa betik dosyaya dokunmadan durur.

(1) İki seçenekli görevlerde (Karşılaştırma, Korunum, Doğru mu Yanlış mı?) Kaptan Sınavı 5 yerine
    8 sorudur; geçme ölçütü aynı kuralla (≥ %80) 7/8 olur. Tahminle geçme olasılığı %19 → %3,5.
(2) Bugünün Görevi'nin tekrar görevi her gün aynı "en zayıf" görev değil, en zayıf üç görev
    arasında gün gün döner (aralıklı ve karışık geri getirme).
(3) Çocuk merkezinde tek büyük düğme Bugünün Görevi'ni başlatır (1/2, 2/2); görevler bitince
    birikmiş hata tekrarı varsa Tekrar Durağı'nı açar. "Kaldığın yerden devam" ikincil düğmeye iner.
    Kurmancîde "Bidomîne" etiketi eklenir.
(4) oyna/index.html, okunur ek betiği (galaksay-ek.js: Kurmancî seslendirme) oyundan önce yükler.
"""
import glob, sys, os

ROOT = sys.argv[1] if len(sys.argv) > 1 else 'canli-surum/site'
path = glob.glob(f'{ROOT}/oyna/assets/GalakSay-*.js')[0]
s = open(path, encoding='utf-8').read()
R = []
BIN = '["comparison","conservation","trueFalse"].includes($)?8:5'

# (1) Sınav uzunluğu ve başlık metni
R.append(('kind:"exam",mode:$,level:H,rounds:5}', f'kind:"exam",mode:$,level:H,rounds:{BIN}}}'))
R.append(('t==="ku"?"Ezmûna Kaptan — 5 pirs, bê alîkarî":t==="en"?"Captain\'s Test — 5 questions, no hints":"Kaptan Sınavı — 5 soru, ipucusuz"',
          't==="ku"?`Ezmûna Kaptan — ${' + BIN + '} pirs, bê alîkarî`:t==="en"?`Captain\'s Test — ${' + BIN + '} questions, no hints`:`Kaptan Sınavı — ${' + BIN + '} soru, ipucusuz`'))

# (2) Tekrar görevinin günlük dönüşü
R.append(('let N=((fe=z[0])==null?void 0:fe.m)||null',
          'const gsK=Math.floor(Date.now()/864e5)%Math.max(1,Math.min(3,z.length));let N=((fe=z[gsK])==null?void 0:fe.m)||null'))

# (3) Tek dokunuşla günlük görev
old3 = ('C=()=>{ee(rr.mode),ie(rr.level),n!=null&&n.directPlay&&(Qs.current=!0),w("levelSelect")},B=()=>w(ka?"journey":"ageSelect");return d?')
new3 = ('C=()=>{ee(rr.mode),ie(rr.level),n!=null&&n.directPlay&&(Qs.current=!0),w("levelSelect")},B=()=>w(ka?"journey":"ageSelect"),'
        'gsDm=Nt&&!Nt.done1&&Nt.m1&&$a(Nt.m1)?[Nt.m1,1]:Nt&&Nt.m2&&!Nt.done2&&$a(Nt.m2)?[Nt.m2,2]:null,gsDn=Nt&&Nt.m2?2:1,'
        'gsRv=(()=>{if(gsDm)return 0;try{return hu((he==null?void 0:he.username)||"guest")}catch{return 0}})(),'
        'gsGo=()=>{if(gsDm){const m=gsDm[0];Ee("planetLand"),ee(m),ie(dr(m)),n!=null&&n.directPlay&&(Qs.current=!0),w("levelSelect")}else kp()},'
        'gsP=!!gsDm||gsRv>0,gsMd=gsDm?$a(gsDm[0]):null;'
        'return e.jsxs(e.Fragment,{children:[gsP&&e.jsx("button",{onClick:gsGo,style:g,"data-testid":"daily-go",className:"space-btn-hover",children:e.jsxs("span",{style:{position:"relative",zIndex:1},children:['
        'gsDm?(t==="ku"?"⭐ Erka Îro":t==="en"?"⭐ Today\'s Mission":"⭐ Bugünün Görevi")+` ${gsDm[1]}/${gsDn}: `+((gsMd==null?void 0:gsMd.i)||"")+" "+((gsMd==null?void 0:gsMd.n)||"")'
        ':(t==="ku"?"🔁 Rawestgeha Dubareyê":t==="en"?"🔁 Review Stop":"🔁 Tekrar Durağı")+` · ${gsRv}`]})}),d?')
R.append((old3, new3))
R.append(('e.jsx("button",{onClick:C,style:g,children:e.jsxs("span",{style:{position:"relative",zIndex:1},children:[t==="en"?"▶ Continue where you left off: ":"▶ Kaldığın yerden devam: "',
          'e.jsx("button",{onClick:C,style:gsP?h:g,children:e.jsxs("span",{style:{position:"relative",zIndex:1},children:[t==="en"?"▶ Continue where you left off: ":t==="ku"?"▶ Bidomîne: ":"▶ Kaldığın yerden devam: "'))
R.append(('})(),e.jsx("div",{role:"list"', ']})})(),e.jsx("div",{role:"list"'))

errors = 0
for old, new in R:
    n = s.count(old)
    if n != 1:
        print(f'EŞLEŞME {n} (1 beklenirdi): {old[:100]}'); errors += 1; continue
    s = s.replace(old, new, 1)

# (4) index.html: ek betik
hp = f'{ROOT}/oyna/index.html'
html = open(hp, encoding='utf-8').read()
tag = '<script src="/oyna/galaksay-ek.js?v=2"></script>'
anchor = '<script type="module" crossorigin src="/oyna/assets/index-pKper_0i.js">'
if 'galaksay-ek.js' not in html:
    if html.count(anchor) != 1:
        print('EŞLEŞME: index.html modül betiği'); errors += 1
    else:
        html = html.replace(anchor, tag + '\n    ' + anchor, 1)
if errors:
    sys.exit(f'{errors} değişiklik uygulanamadı; dosyalar değiştirilmedi.')
open(path, 'w', encoding='utf-8').write(s)
open(hp, 'w', encoding='utf-8').write(html)
print(f'{len(R)} paket değişikliği + index.html → {path}')
