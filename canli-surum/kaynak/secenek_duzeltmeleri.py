#!/usr/bin/env python3
"""Canlı derlemede seçenek (çeldirici) düzeltmeleri — 27 Eylül 2026.

Madde denetimi (docs/MADDE_DENETIMI.md): 14.600 üretilmiş maddede doğru yanıt, üst seviyelerde
%80-100 oranında seçeneklerin ortasındaki sayıydı ("ortadakini seç" ipucu); çıkarma ve farkta ise
%90-100 en küçük seçenekti. Neden: merkezi seçenek üreticisi (kaynakta gen3, pakette `sa`) aday
listesinden ilk ikisini sırayla alıyor; görevler listeye hep önce doğru+1, sonra doğru−1 veriyor.

Düzeltme: (1) `sa` doğru yanıtın 3 seçenek içindeki sırasını (en küçük/orta/en büyük) eşit
olasılıkla seçer; görevin verdiği kavram yanılgısı adayları önceliklidir, eksik yön bitişik
değerlerle (±1, ±2 ...) doldurulur. Alt seviyelerdeki "uzak çeldirici" dalı değişmez.
(2) Nokta tahmininde çeldirici yönü rastgele. (3) Sayı doğrusu tahmininde çeldirici aralığı ≥2 (0-10) / ≥3 (0-20).
(4) Onluk geçidinde ±10 çeldiricilerinin yönü rastgele. (5) Uzunluk tahmininde yön rastgele.
(6) Alt seviyelerdeki uzak çeldirici dalı da sıra-dengeli; uzak çeldiriciler korunur.
(7) 2. seviye çıkarmada sıfır kuralı maddelerinin payı %50 → %25.
"""
import glob, sys

ROOT = sys.argv[1] if len(sys.argv) > 1 else 'canli-surum/site/oyna/assets'
path = glob.glob(f'{ROOT}/GalakSay-*.js')[0]
s = open(path, encoding='utf-8').read()
R = []

# (1) sa: sırayla alma yerine sıra-dengeli seçim
old_branch = 'else n.forEach(O=>{O>=s&&O<=l&&!u.includes(O)&&u.length<3&&u.push(O)});let k=0;for(;u.length<3&&k<80;)'
new_branch = ('else{const ok=v=>Number.isFinite(v)&&v>=s&&v<=l&&v!==r&&!u.includes(v),'
              'pool=[...new Set(n.filter(ok))],mix=a=>a.map(v=>[Math.random(),v]).sort((p,q)=>p[0]-q[0]).map(p=>p[1]),'
              'ranks=mix([0,1,2]);let done=!1;'
              'for(const Rk of ranks){if(u.length>=3){done=!0;break}'
              'const bl=Rk-u.filter(v=>v<r).length,ab=(2-Rk)-u.filter(v=>v>r).length;'
              'if(bl<0||ab<0||bl+ab!==3-u.length)continue;'
              'const take=(arr,dir,k)=>{const out=[];for(const v of arr)out.length<k&&out.push(v);'
              'for(let d=1;out.length<k&&d<25;d++){const v=r+dir*d;ok(v)&&!out.includes(v)&&out.push(v)}return out},'
              'lo=take(mix(pool.filter(v=>v<r)),-1,bl),hi=take(mix(pool.filter(v=>v>r)),1,ab);'
              'if(lo.length===bl&&hi.length===ab){u.push(...lo,...hi);done=!0;break}}'
              'done||n.forEach(O=>{O>=s&&O<=l&&!u.includes(O)&&u.length<3&&u.push(O)})}'
              'let k=0;for(;u.length<3&&k<80;)')
R.append((old_branch, new_branch))

# (2) Nokta tahmini (estimateCount): önce üst sonra alt → yön rastgele (üst-üst / alt-alt / iki yan)
R.append(('let de=[b],Se=Z;for(;de.length<3&&Se<m+10;){for(const Be of[b+Se,b-Se])',
          'let de=[b],Se=Z,ecD=Math.random();for(;de.length<3&&Se<m+10;){for(const Be of(ecD<1/3?[b+Se,b+2*Se]:ecD<2/3?[b-Se,b-2*Se]:[b-Se,b+Se]))'))
R.append(('Se++}ue=Hn(de.slice(0,3));break}case"numberLineEstimate"',
          'Se++}for(let k2=1;de.length<3&&k2<40;k2++){for(const v of[b+k2*Z,b-k2*Z])v>=1&&!de.includes(v)&&de.length<3&&de.push(v)}ue=Hn(de.slice(0,3));break}case"numberLineEstimate"'))

# (3) Sayı doğrusu tahmini: ±1 yerine ≥2 (0-10) / ≥3 (0-20) aralık
R.append(('const W=j>=20?[b+2,b-2,b+3,b-3]:[b+1,b-1,b+2];ue=sa(b,W.filter(_=>_>=1&&_<=j-1&&_!==b),1,j-1)',
          'const W=j>=20?[b+3,b-3,b+5,b-5,b+4,b-4]:j>=10?[b+2,b-2,b+3,b-3]:[b+2,b-2,b+1,b-1];ue=sa(b,W.filter(_=>_>=1&&_<=j-1&&_!==b),1,j-1)'))

# (4) Onluk geçidi: ±10 onluk hatası çeldiricileri korunur, yön rastgele (üst-üst / alt-alt / iki yan)
R.append(('Be=[de,...Se.slice(0,2)];',
          'dcD=Math.random(),dcP=dcD<1/3?Se.filter(x=>x>de):dcD<2/3?Se.filter(x=>x<de):Se,Be=[de,...(dcP.length>=2?dcP:Se).slice(0,2)];'))
# (5) Uzunluk tahmini (üst seviye): önce +2 sonra −2 → yön rastgele
R.append(('const W=[b];for(const Z of[b+2,b-2,b+3,b-3,b+4,b-4])',
          'const W=[b],lgD=Math.random();for(const Z of(lgD<1/3?[b+2,b+4,b+3,b-2]:lgD<2/3?[b-2,b-4,b-3,b+2]:[b-2,b+2,b+3,b-3]))'))

# (6) Alt seviyelerdeki "uzak çeldirici" dalı: yakın aday ve uzak (±3-5) çeldirici aynı sıra dengesine uyar
#     (tek yanda çeldirici varsa üçüncüsü 2/3 olasılıkla aynı yana; böylece doğru yanıt ~1/3 ortada)
R.append(('if(Math.random()<x&&l-s>=4){const O=n.filter($=>$>=s&&$<=l&&$!==r&&!u.includes($));O.length>0&&u.length<3&&u.push(O[Math.floor(Math.random()*O.length)]);let w=0;for(;u.length<3&&w<40;){const $=(Math.random()<.5?-1:1)*(3+Math.floor(Math.random()*3)),ee=r+$;',
          'if(Math.random()<x&&l-s>=4){const sideOf=()=>{const lo=u.some(v=>v<r),hi=u.some(v=>v>r);return lo&&!hi?(Math.random()<1/3?1:-1):hi&&!lo?(Math.random()<1/3?-1:1):0};if(u.length<3){const sd=sideOf(),O0=n.filter($=>$>=s&&$<=l&&$!==r&&!u.includes($)),O=sd?O0.filter(v=>sd>0?v>r:v<r):O0;O.length>0&&u.push(O[Math.floor(Math.random()*O.length)])}let w=0;for(;u.length<3&&w<40;){const $=(sideOf()||(Math.random()<.5?-1:1))*(3+Math.floor(Math.random()*3)),ee=r+$;'))

# (7) Madde dengesi: 2. seviyede çıkarma maddelerinin yarısı sıfır kuralıydı (n−n, n−0); ağırlık 1/4'e iner (3. seviyeyle aynı)
R.append(('const j=Math.min(ce,20),m=["basic"];R>=2&&R<=3&&m.push("zeroSelf")',
          'const j=Math.min(ce,20),m=R===2?["basic","basic","basic"]:["basic"];R>=2&&R<=3&&m.push("zeroSelf")'))

errors = 0
for old, new in R:
    n = s.count(old)
    if n != 1:
        print(f'EŞLEŞME {n} (1 beklenirdi): {old[:100]}'); errors += 1; continue
    s = s.replace(old, new, 1)
if errors:
    sys.exit(f'{errors} düzeltme uygulanamadı; dosya değiştirilmedi.')
open(path, 'w', encoding='utf-8').write(s)
print(f'{len(R)} düzeltme uygulandı → {path}')
