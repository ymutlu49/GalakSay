#!/usr/bin/env python3
"""Canlı derlemede giriş merkezi ve sürdürme (çocuk merkezi) düzenlemeleri — 27 Eylül 2026.

Önce yorunge_duzeltmeleri.py, secenek_duzeltmeleri.py ve iyilestirmeler.py uygulanmış olmalıdır.
Giriş merkezinin kendisi okunur kaynaktadır: kaynak/WelcomeScreen.captain.js.

(1) Yetişkin girişindeki "Öğrenci Girişi" düğmesi eski öğrenci seçicisi yerine giriş merkezine döner
    (tek merkez). Eski seçici yalnız şifreli profiller için kullanılmaya devam eder.
(2) Çocuk merkezi (sürdürme ekranı):
    - En üste karşılama kartı: "Tekrar hoş geldin, Ada!", yıldız ve bugünkü görev durumu, ne yapacağını
      söyleyen tek cümle ve sesli dinleme düğmesi.
    - Sıra: karşılama → bugünün görevi → büyük düğme → (varsa) Yıldız Haritası Kontrolü ve Tekrar Durağı.
      Önceden 12 dakikalık ölçüm kartı en üstteydi.
    - Başlıkta, yetişkin oturumu yokken çocuğun adının altında yazan "Öğretmen" yerine "Kaptan";
      "Çocuk" düğmesi "Değiştir" olur. Yetişkinin başlattığı oturumda "Yetişkin" yazar.
(3) Yetişkin rolüne göre dil: TeacherLogin ve ChildSelect parçaları çeviri işlevini
    window.__gsRoleText (oyna/galaksay-ek.js) üzerinden geçirir. Ebeveyn "Çocuklarım", "Ebeveyn şifresi"
    görür; "Cihaz Hesabı" yerine "şifre" denir (çevrimiçi hesap yoktur).
(4) Güvenlik: yetişkin paneli ekranda açıkken 10 dakika dokunulmazsa kilitlenir ve giriş merkezine
    dönülür (oturumdaki çocuk oyununu etkilemez). Merkez bir kez bilgi notu gösterir.
"""
import glob, sys

ROOT = sys.argv[1] if len(sys.argv) > 1 else 'canli-surum/site'
gp = glob.glob(f'{ROOT}/oyna/assets/GalakSay-*.js')[0]
ip = glob.glob(f'{ROOT}/oyna/assets/index-*.js')[0]
G = open(gp, encoding='utf-8').read()
I = open(ip, encoding='utf-8').read()
RG, RI = [], []

# (1) Tek merkez
RI.append(('onBack:()=>F("welcome"),onStudent:()=>F("student"),numapUser', 'onBack:()=>F("welcome"),onStudent:()=>F("welcome"),numapUser'))

# (2a) Karşılama kartı
HELLO = ('(()=>{const gsDone=!!(Nt&&Nt.done1&&(!Nt.m2||Nt.done2)),gsTot=Nt?(Nt.m2?2:1):0,gsDn=Nt?(Nt.done1?1:0)+(Nt.m2&&Nt.done2?1:0):0,'
         'gsOld=(Ae.totalGames||0)>0,gsNm=ye||"",'
         'gsT1=t==="ku"?(gsOld?`👋 Dîsa bi xêr hatî, ${gsNm}!`:`👋 Bi xêr hatî, ${gsNm}!`):t==="en"?(gsOld?`👋 Welcome back, ${gsNm}!`:`👋 Welcome, ${gsNm}!`):(gsOld?`👋 Tekrar hoş geldin, ${gsNm}!`:`👋 Hoş geldin, ${gsNm}!`),'
         'gsT2=`⭐ ${Ae.starFragments||0} `+(t==="ku"?"stêrk":t==="en"?"stars":"yıldız")+(Nt?` · 📅 `+(t==="ku"?"Îro":t==="en"?"Today":"Bugün")+` ${gsDn}/${gsTot}`:""),'
         'gsT3=gsDone?(t==="ku"?"Erka îro temam e! Heke dixwazî, gerstêrkan bi azadî keşf bike.":t==="en"?"Today\'s mission is done! Explore the planets freely if you like.":"Bugünkü görevin tamam! İstersen gezegenleri serbestçe keşfet.")'
         ':(t==="ku"?"Pêl bişkoja mor bike, erka te ya îro dest pê dike.":t==="en"?"Tap the purple button to start today\'s mission.":"Mor düğmeye dokun, bugünkü görevin başlasın.");'
         'return e.jsxs("div",{"data-testid":"hub-hello",role:"status",style:{margin:"4px 10px 0",padding:"12px 14px",borderRadius:16,display:"flex",alignItems:"center",gap:12,'
         'background:i.isDay?"rgba(255,255,255,.94)":"linear-gradient(135deg,rgba(124,58,237,.16),rgba(15,20,45,.55))",border:"1px solid rgba(124,58,237,.22)",boxShadow:i.isDay?"0 4px 14px rgba(30,27,75,.08)":"none"},'
         'children:[e.jsxs("div",{style:{flex:1,minWidth:0},children:[e.jsx("div",{style:{fontSize:17,fontWeight:900,color:i.isDay?"#1E1B4B":"#fff"},children:gsT1}),'
         'e.jsx("div",{style:{fontSize:12.5,fontWeight:800,color:i.isDay?"#6D28D9":"#c4b5fd",marginTop:2},children:gsT2}),'
         'e.jsx("div",{style:{fontSize:13,fontWeight:700,color:i.textSub,marginTop:4,lineHeight:1.4},children:gsT3})]}),'
         'e.jsx("button",{type:"button","aria-label":t==="ku"?"Guhdarî bike":t==="en"?"Listen":"Sesli dinle",onClick:()=>{try{le.speak(`${gsT1} ${gsT3}`,t==="en"?"en-US":"tr-TR",.9)}catch{}},'
         'style:{width:44,height:44,borderRadius:999,border:"none",background:"rgba(124,58,237,.12)",cursor:"pointer",fontSize:18,flexShrink:0},children:"🔊"})]})})(),')
RG.append(('!(n!=null&&n.directPlay)&&(()=>{let d=[];try{d=JSON.parse(localStorage.getItem(`ds_sessiondays_',
           HELLO + '!(n!=null&&n.directPlay)&&(()=>{let d=[];try{d=JSON.parse(localStorage.getItem(`ds_sessiondays_'))

# (2b) Sıra: günlük plan ve büyük düğme önce; ölçüm ve tekrar kartları sonra
RG.append(('mp(),pp(),hp(),Ic(),(()=>{', 'mp(),Ic(),(()=>{'))
RG.append((']})})(),e.jsx("div",{role:"list"', ']})})(),pp(),hp(),e.jsx("div",{role:"list"'))

# (2c) Başlık etiketleri
RG.append(('(r==null?void 0:r.name)||(t==="en"?"Teacher":"Öğretmen")', '(r==null?void 0:r.name)||(n!=null&&n.directPlay?(t==="ku"?"Kaptan":t==="en"?"Captain":"Kaptan"):(t==="ku"?"Mezin":t==="en"?"Adult":"Yetişkin"))'))
RG.append(('children:t==="ku"?"Zarok":t==="en"?"Child":"Çocuk"})', 'children:t==="ku"?"Biguherîne":t==="en"?"Switch":"Değiştir"})'))

# (4) Hareketsizlikte yetişkin paneli kilidi
RI.append(('M.useEffect(()=>{const _=window;return _.__galaksayLogout=xe,_.__galaksaySwitchChild=ce,()=>{delete _.__galaksayLogout,delete _.__galaksaySwitchChild}},[xe,ce]);',
           'M.useEffect(()=>{const _=window;return _.__galaksayLogout=xe,_.__galaksaySwitchChild=ce,()=>{delete _.__galaksayLogout,delete _.__galaksaySwitchChild}},[xe,ce]);'
           'M.useEffect(()=>{if(!I||T)return;let gsTm;const gsMs=+(window.__gsIdleMs||6e5),gsLock=()=>{try{sessionStorage.setItem("gs_locked","1")}catch{}U(null),F("welcome")},'
           'gsReset=()=>{clearTimeout(gsTm),gsTm=setTimeout(gsLock,gsMs)},gsEv=["pointerdown","keydown","touchstart","wheel","scroll"];'
           'gsEv.forEach(e=>window.addEventListener(e,gsReset,{passive:!0,capture:!0})),gsReset();'
           'return()=>{clearTimeout(gsTm),gsEv.forEach(e=>window.removeEventListener(e,gsReset,{capture:!0}))}},[I,T]);'))

# (3) Rol dili: çeviri işlevini sarmala
tp = glob.glob(f'{ROOT}/oyna/assets/TeacherLogin-*.js')[0]
cp = glob.glob(f'{ROOT}/oyna/assets/ChildSelect-*.js')[0]
TL = open(tp, encoding='utf-8').read(); CS = open(cp, encoding='utf-8').read()
WRAP = 'const {v}=(tr,ku,en)=>{{const m=typeof window<"u"&&window.__gsRoleText&&window.__gsRoleText(tr);return m?{o}(m[0],m[1],m[2]):{o}(tr,ku,en)}};'
RT = [('import{r as a,u as te,R as ue,h as me,f as i,', 'import{r as a,u as te,R as ue,h as me,f as gsI0,')]
RC = [('import{r as d,x as Ot,j as e,l as ce,y as sa,_ as qe,f as a,', 'import{r as d,x as Ot,j as e,l as ce,y as sa,_ as qe,f as gsA0,')]

errors = 0
for name, src, R in (('TeacherLogin', TL, RT), ('ChildSelect', CS, RC)):
    for old, new in R:
        if src.count(old) != 1:
            print(f'EŞLEŞME {name}: {old[:80]}'); errors += 1
for name, src, R in (('GalakSay', G, RG), ('index', I, RI)):
    for old, new in R:
        n = src.count(old)
        if n != 1:
            print(f'EŞLEŞME {name} {n}: {old[:90]}'); errors += 1
if errors:
    sys.exit(f'{errors} değişiklik uygulanamadı; dosyalar değiştirilmedi.')
for old, new in RG: G = G.replace(old, new, 1)
for old, new in RI: I = I.replace(old, new, 1)
def wrap(src, old, new, var, orig):
    src = src.replace(old, new, 1)
    end = src.index('from"./index-pKper_0i.js";') + len('from"./index-pKper_0i.js";')
    return src[:end] + WRAP.format(v=var, o=orig) + src[end:]
TL = wrap(TL, RT[0][0], RT[0][1], 'i', 'gsI0')
CS = wrap(CS, RC[0][0], RC[0][1], 'a', 'gsA0')
open(gp, 'w', encoding='utf-8').write(G)
open(ip, 'w', encoding='utf-8').write(I)
open(tp, 'w', encoding='utf-8').write(TL)
open(cp, 'w', encoding='utf-8').write(CS)
print(f'{len(RG)} oyun + {len(RI)} kök + 2 çeviri sarmalayıcısı uygulandı')
