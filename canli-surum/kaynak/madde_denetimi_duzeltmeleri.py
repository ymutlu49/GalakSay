#!/usr/bin/env python3
"""Canlı derlemede görüntü düzeyindeki madde denetiminin düzeltmeleri — 27 Eylül 2026.

Denetim yöntemi ve bulgular: docs/MADDE_GORUNTU_DENETIMI.md. Önce giris_merkezi.py ve
cocuk_baglama.py uygulanmış olmalıdır. Her değişiklik birebir metin eşleşmesiyle, tam bir kez yapılır.
"""
import glob, sys
ROOT = sys.argv[1] if len(sys.argv) > 1 else 'canli-surum/site'
gp = glob.glob(f'{ROOT}/oyna/assets/GalakSay-*.js')[0]
G = open(gp, encoding='utf-8').read()
R = []

# (1) Seslendirme isteğe bağlı olduğu için "Soruyu dinle" (🗣️) düğmesi her çocukta görünür
#     (önceden yalnız karakter seslendirmesi ya da küçük yaş kipinde vardı). KU etiketi eklendi.
R.append(('(ya||Me)&&e.jsx("button",{"aria-label":t==="en"?"Listen to the question":"Soruyu dinle",onClick:()=>{var z;const B=dt($);',
          'e.jsx("button",{"aria-label":t==="en"?"Listen to the question":t==="ku"?"Guhdarî pirsê bike":"Soruyu dinle",onClick:()=>{var z;const B=dt($);'))

# (2) Göreve duyarlı ipucu: yanılgı ipucu tek tablodan gelip göreve bakmıyordu (ör. "sağdan kaçıncı"
#     sorusunda "daha AZ mı, daha ÇOK mu?"; cetvel/saat/kesir sorusunda "her taşa bir sayı"). Önce
#     window.__gsTip(yanılgı, soru türü) sorulur (oyna/galaksay-ek.js); yoksa oyunun metni kalır.
R.append(('if(!N&&be&&_l[be]){const fe=_l[be];',
          'if(!N&&be&&_l[be]){const fe=(typeof window<"u"&&window.__gsTip&&window.__gsTip(be,C,a))||_l[be];'))
R.append(('R._remed=C.id;const j=_l[C.id],',
          'R._remed=C.id;const j=(typeof window<"u"&&window.__gsTip&&window.__gsTip(C.id,R.type,R))||_l[C.id],'))

# (3) Hata sonrası maskot öyküsü göreve uygun seçilir (window.__gsStory; yoksa eski rastgele seçim).
R.append(('Wt(yn.getRandom(yn.mistakeStories),5500,!0)',
          'Wt(typeof window<"u"&&window.__gsStory?window.__gsStory($,yn.mistakeStories):yn.getRandom(yn.mistakeStories),5500,!0)'))

# (4) Sanbil görevlerinde (Işık Hızı, Beşli/Onlu/Çift Onlu Radar, Uzay Hafızası, Hafıza Şimşeği) bir fazla/eksik
#     yanıtta "her taşı tek tek say" yerine yapıya bakmayı söyleyen ipucu (window.__gsTip("offByOne", tür)).
R.append(('N={type:"offByOne",desc:g?"Te 1 zêde an kêm jimart',
          'N=(gsO=>gsO?{type:"offByOne",desc:g?gsO.ku:h?gsO.en:gsO.tr,icon:"⚡"}:null)(typeof window<"u"&&window.__gsTip&&window.__gsTip("offByOne",C,a))||{type:"offByOne",desc:g?"Te 1 zêde an kêm jimart'))
# (5) Ritmik sayma çeldiricileri: önceden hepsi ritim dışıydı (P±1, P±2), doğru yanıt adımın tek katıydı →
#     biçim ipucu. Artık: doğru yanıt + ritimde bir komşu (P±adım) + ritim dışı bir değer (P±1).
#     Doğru yanıtın ortada olma olasılığı 1/3.
R.append(('P=_[Z],ue=sa(P,[P+1,P-1,P+2,P-2].filter(de=>de>0&&de%m!==0),1,m*M+m,[Math.random()<.5?P+1:P-1].filter(de=>de>0&&de%m!==0));break}case"arrayDots"',
          'P=_[Z];{const gsU=P-m>0&&Math.random()<.5,gsOn=gsU?P-m:P+m,gsSame=Math.random()<2/3,gsOff=gsU===gsSame&&P-1>0?P-1:P+1;ue=Hn([P,gsOn,gsOff])}break}case"arrayDots"'))

# (6) Korunum görevinde doğru yanıt övgüsü her zaman "sayı korunuyor" diyordu; gruplar gerçekten farklıyken
#     yanlış bilgi veriyordu. Övgü nötr yapıldı (TR, KU, EN).
R.append(('conservation:["Dizilişe aldanmadın — sayı korunuyor! 🔍","Sayı korunumu ustası! 🧠"]',
          'conservation:["Dizilişe aldanmadın — sayıya baktın! 🔍","Gözün aldanmadı — iyi karşılaştırdın! 🧠"]'))
R.append(('conservation:["Tu bi rêzkirinê nehatî xapandin — hejmar diparêze! 🔍","Hosteyê parastina hejmarê! 🧠"]',
          'conservation:["Tu bi rêzkirinê nehatî xapandin — te li hejmarê nêrî! 🔍","Çavê te nehat xapandin — te baş berhev kir! 🧠"]'))
R.append(('conservation:["The layout didn\'t fool you — the number is conserved! 🔍","Conservation master! 🧠"]',
          'conservation:["The layout didn\'t fool you — you looked at the number! 🔍","Your eyes weren\'t fooled — great comparing! 🧠"]'))
# (7) Saymadan tanıma görevlerinde parmak kalıbı kökü "Parmakları say" diyordu → "Parmaklara bak" (TR, KU, EN).
R.append(('Y==="finger"?"Parmakları say — kaç parmak kalkık?"', 'Y==="finger"?"Parmaklara bak — kaç parmak kalkık?"'))
R.append(('Y==="finger"?"Tiliyan bijmêre — çend tilî rabûne?"', 'Y==="finger"?"Li tiliyan binêre — çend tilî rabûne?"'))
R.append(('Y==="finger"?"Count the fingers — how many are up?"', 'Y==="finger"?"Look at the fingers — how many are up?"'))
R.append(('finger:"Parmakları say — kaç tane kalkık?"', 'finger:"Parmaklara bak — kaç tane kalkık?"'))
R.append(('finger:"Tiliyan bijmêre — çend hatine rakirin?"', 'finger:"Li tiliyan binêre — çend hatine rakirin?"'))
R.append(('finger:"Count the fingers — how many are up?",dice', 'finger:"Look at the fingers — how many are up?",dice'))
# (8) Saat (dijital → analog): ekrandaki kök sesli metinle aynı ve doğal Türkçe olsun.
R.append(('"Bu saati hangi saat gösteriyor?"', '"Hangi saat aynı zamanı gösteriyor?"'))

# (9) Paketin dil ayarı dışarıya da bildirilir (window.__gsLang); oyna/galaksay-ek.js Kurmancî düzeltmeleri buna bakar.
R.append(('function $h(r){st=r==="ku",Sa=r==="en"}', 'function $h(r){st=r==="ku",Sa=r==="en",typeof window<"u"&&(window.__gsLang=r)}'))
# (10) Maskot balonu: Kurmancî oyunda Türkçe kalan destek/mola cümleleri window.__gsKuFix ile Kurmancîleşir.
R.append(('const Wt=E.useCallback((a,y=4e3,d=!1)=>{var g,h;', 'const Wt=E.useCallback((a,y=4e3,d=!1)=>{var g,h;a=typeof window<"u"&&window.__gsKuFix?window.__gsKuFix(a):a;'))
# (11) "Hangi Şema?" Türkçe adları sabit eklerle kullanılıyordu (ad + "'nın", ad + "'ya") → "Ali'nın", "Kerem'ya".
#      Adlar bu eklerle uyumlu olanlarla değiştirildi (Ada, Arda, Ela, Tolga).
R.append(('["Ada","Ali","Ela","Kerem"]', '["Ada","Arda","Ela","Tolga"]'))
# (12) "Hangi Şema?" geri bildirimi ve ipucu "verdi"yi hem birleştir hem ayır için örnek veriyordu (çelişki).
R.append(("wrongInsight:\"'Daha verdi' → birleştir; 'gitti/verdi' → ayır; 'kaç fazla' → karşılaştır.\"",
          "wrongInsight:\"Bir şey ekleniyorsa birleştir; gidiyor ya da eksiliyorsa ayır; 'kaç fazla' soruluyorsa karşılaştır.\""))
R.append(("\"'Daha verdi' birleştir; 'gitti' ayır; 'kaç fazla' karşılaştır!\"",
          "\"Ekleniyor mu? Birleştir. Eksiliyor mu? Ayır. 'Kaç fazla' mı? Karşılaştır!\""))
# (13) Grafik okuma ipucu "kaç tane" sorusunda da "'kaç fazla' için yan yana koy" diyordu → koşullu anlatım.
R.append(("\"'Kaç fazla' için ikisini yan yana koy, artanı say!\"]", "\"Soru 'kaç fazla' diyorsa iki satırı yan yana koy, artanı say!\"]"))

# (14) Saat okuma (dijital → analog): düzeltme satırı seçeneğin sıra numarasını saat diye söylüyordu
#      ("Saat 2 gösteriyor (bir yirmi beş)"). Artık sorudaki saat yazılır; Kurmancî satır Kurmancîdir.
R.append(('te=t==="en"?`The clock shows ${ge}`:`Saat ${ge} gösteriyor (${li(c.h,c.m,t)})`',
          'te=t==="en"?`The clock shows ${c.h}:${String(c.m).padStart(2,"0")}`:t==="ku"?`Saet ${c.h}:${String(c.m).padStart(2,"0")} nîşan dide (${li(c.h,c.m,t)})`:`Saat ${c.h}:${String(c.m).padStart(2,"0")} gösteriyor (${li(c.h,c.m,t)})`'))
# (15) Beşli Radar ve Uzay Hafızası'nda düzeltme ipucu "her taşı tek tek say" diyordu; görevin amacı saymadan tanımak.
R.append(('f="Her taşı tek tek say, hiçbirini atlama 👆";else if(c.type==="rodBack")',
          'f=c.type==="fivesFrame"?"Beşlik çerçeveye bak: dolu kutuları bir bakışta gör, boşları 5\'ten çıkar! ✋":c.type==="chipGuess"?"Gördüğün grupları hatırla: 5 ve kaç? ⚡":"Her taşı tek tek say, hiçbirini atlama 👆";else if(c.type==="rodBack")'))

# (16) Açılım görevinde ipucu 1-2. sınıfa henüz öğretilmemiş çarpmaya dayanıyordu ("10 ile çarp").
R.append(('f="Onluk kapsüllerini say ve 10 ile çarp — bu onluk değeridir! 🔭"', 'f="Onluk kapsüllerini onar onar say: 10, 20, 30… — onlukların değeri budur! 🔭"'))

# (17) Çıkarma (Enerji Ayır), "toplamadan düşün" ve "10 üzerinden çıkar" stratejileri: çıkan sayının çubuğu boş (gri,
#      boncuksuz) çiziliyordu. Sayılar 10'u geçince sözlü satır da gizlendiği için çıkan sayı (ör. 17 − 9'da 9)
#      ekranın hiçbir yerinde görünmüyordu; madde yalnız dinleyerek çözülebiliyordu. Çıkan sayının çubuğu artık dolu.
R.append(('scaffold:!I&&["bridgeTen","thinkAdd"].includes(a.strategy)', 'scaffold:!1'))

# (18) Çubuklu işlem gösterimi (toplama, çıkarma vb.): 3. seviyeden sonra ve sayılar 10'u geçince denklemin yazılı
#      satırı ("on yedi eksi sekiz = ?") gizleniyordu; işlenenler yalnız minik boncuklu çubuklarla görünüyordu.
#      Seslendirme isteğe bağlı olduğundan satır artık her seviyede gösterilir (küçük yaş kipi hariç).
R.append(('$e=!Me&&(H<=2||Math.max(L||0,K||0,ne||0)<=10)', '$e=!Me'))

# (19) Nokta dizisi: satır ve sütun sayısı eşitken ipucu "ikişer ya da ikişer ritmik say" diyordu.
R.append(('— ${La(c.cols)} ya da ${La(c.rows)} ritmik say! 📐`', '— ${c.rows===c.cols?La(c.cols):La(c.cols)+" ya da "+La(c.rows)} ritmik say! 📐`'))
# (20) Şekil Dedektifi: "kaç kenarı var?" sorusunda da geri bildirim yalnız köşeyi anlatıyordu.
R.append(('wrongInsight:"Köşe = iki kenarın buluştuğu nokta; her köşeyi bir kez say."',
          'wrongInsight:"Köşe = iki kenarın buluştuğu nokta; kenar = iki köşe arasındaki düz çizgi. Sorulanı tek tek say, her birini bir kez."'))
# (21) Şekil grafiği "kaç fazla" sorusu: renk adına sabit "-den" eki ekleniyordu ("kırmızıden"); cümle küçük harfle
#      başlıyordu ve sesli metinle ekrandaki kök farklıydı. Ek gerektirmeyen tek biçim: "Grafikte mavi taşlar, yeşil
#      taşlardan kaç fazla?" (ekran ve ses aynı).
R.append(('e.jsxs(e.Fragment,{children:[e.jsx(z,{children:a.cols[a.ci]}),", ",e.jsx(z,{children:a.cols[a.cj]}),"den kaç fazla?"]})',
          'e.jsxs(e.Fragment,{children:["Grafikte ",e.jsx(z,{children:a.cols[a.ci]})," taşlar, ",e.jsx(z,{children:a.cols[a.cj]})," taşlardan kaç fazla?"]})'))
R.append(('`${(et=T.cols)==null?void 0:et[T.ci]}, ${(wr=T.cols)==null?void 0:wr[T.cj]}den kaç fazla?`',
          '`Grafikte ${(et=T.cols)==null?void 0:et[T.ci]} taşlar, ${(wr=T.cols)==null?void 0:wr[T.cj]} taşlardan kaç fazla?`'))

# (22) Şekil Dedektifi alt yazısı "kaç kenarı var?" sorusunda da "köşe sayısı değişmez" diyordu (TR, KU, EN).
R.append(('children:t==="ku"?"Şêwe zivirî be jî goşe naguherin":t==="en"?"Turning the shape does not change its corners":"Şekil dönse de köşe sayısı değişmez"',
          'children:a.ask==="side"?t==="ku"?"Şêwe zivirî be jî kêlek naguherin":t==="en"?"Turning the shape does not change its sides":"Şekil dönse de kenar sayısı değişmez":t==="ku"?"Şêwe zivirî be jî goşe naguherin":t==="en"?"Turning the shape does not change its corners":"Şekil dönse de köşe sayısı değişmez"'))

# (23) Galaktik Desen: ekrandaki kök "Sıradaki ne olmalı?" / "Deseni devam ettir!" iken sesli metin "eksik parçayı bul"
#      diyordu (eksik parça yok, sıradaki isteniyor). Ses ekranla aynı işi söyler (iki seslendirme tablosu).
R.append(('iki katı kaçtır?`,patternAB:"Tekrar eden desendeki eksik parçayı bul!"', 'iki katı kaçtır?`,patternAB:"Tekrar eden desene bak. Sıradaki ne olmalı?"'))
R.append(('yapar?`,patternAB:"Tekrar eden desendeki eksik parçayı bul!"', 'yapar?`,patternAB:"Tekrar eden desene bak. Sıradaki ne olmalı?"'))

# (24) Kurmancî ve İngilizce görev metinlerinde 7 görevin yanlış yanıt açıklaması (wrongInsight) yoktu; bu dillerde
#      Türkçesi gösteriliyordu (Cetvel Oku, Uzunluk Dedektifi, Hangi Şema?, Takvim Yolcusu, Kesir Parçası,
#      Şekil Dedektifi, Şekil Grafiği).
WI = [
    ('completion:"Tu bûyî hosteyê pîvanê!"}', "Çubik li kîjan hejmarê dest pê dike, li kîjanê diqede? Navberên di navbera wan de bijmêre."),
    ('completion:"You are a ruler master!"}', "Where does the bar start and where does it end? Count the spaces in between."),
    ('completion:"Tu bûyî dedektîfê dirêjahiyê!"}', "Çubik ji heman cihî dest pê dikin? Yekîne bi heman dirêjahiyê ne?"),
    ('completion:"You are a length detective!"}', "Do the bars start at the same place? Are the units the same size?"),
    ('completion:"Tu bûyî detektîfê şemayan!"}', "Heke tiştek lê zêde dibe, bike yek; heke diçe an kêm dibe, veqetîne; heke 'çend zêdetir' tê pirsîn, berhev bike."),
    ('completion:"You are a schema detective!"}', "If something is added, join; if something goes away, separate; if it asks 'how many more', compare."),
    ('completion:"Tu bûyî rêwiyê salnameyê!"}', "'Piştî' ber bi pêş, 'berî' ber bi paş diçe; piştî Yekşemê Duşem tê."),
    ('completion:"You are a calendar traveler!"}', "'After' goes forward, 'before' goes back; Monday comes after Sunday."),
    ('completion:"Tu bûyî vedîtkarê kesran!"}', "Hejmara hemû parçeyan li jêr, parçeyên rengkirî li jor."),
    ('completion:"You are a fraction explorer!"}', "All the equal parts go on the bottom, the shaded parts on top."),
    ('completion:"Tu bûyî detektîfê şêweyan!"}', "Goşe = cihê ku du kêlek digihîjin hev; kêlek = xeta rast a di navbera du goşeyan de. Ya ku tê pirsîn yek bi yek bijmêre, her yekê carekê."),
    ('completion:"You are a shape detective!"}', "A corner is where two sides meet; a side is the straight line between two corners. Count what is asked, each one once."),
    ('completion:"Tu bûyî xwendevanê grafîkan!"}', "Rêza rengê ku tê pirsîn bibîne; ji bo 'çend zêdetir' yên mayî bijmêre."),
    ('completion:"You are a graph reader!"}', "Find the row of the colour asked; for 'how many more', count the extras."),
]
for anchor, text in WI:
    R.append((anchor, anchor[:-1] + ',wrongInsight:"' + text + '"}'))
# (25) Kurmancî düzeltme satırında Türkçe kalan kalıplar ("Doğru bersiv:", "Eksik sayı:", korunum, ritmik sayma,
#      sayı komşuları, eşit karşılaştırma) Kurmancîleştirilir.
R.append(('st&&te&&(te=te.replace(/Doğru kapsül:/g,"Kapsula rast:")',
          'st&&te&&(te=te.replace(/Doğru cevap:/g,"Bersiva rast:").replace(/Eksik sayı:/g,"Hejmara winda:")'
          '.replace(/İkisi de (\\d+) — yerleri değişse de sayı eşit!/g,"Herdu jî $1 in — cih guherî, lê hejmar wekhev e!")'
          '.replace(/Farklı: (\\d+) ve (\\d+)/g,"Cuda: $1 û $2")'
          ".replace(/(\\d+)'(?:şer|er|şar|ar) GERİYE sayarak: cevap/g,\"Bi $1an ber bi paş: bersiv\")"
          ".replace(/(\\d+)'(?:şer|er|şar|ar) ritmik sayarak: cevap/g,\"Bi $1an bi rîtim: bersiv\")"
          ".replace(/(\\d+)'(?:den|dan|ten|tan) sonra (\\d+) gelir/g,\"Piştî $1, $2 tê\")"
          ".replace(/(\\d+)'(?:den|dan|ten|tan) önce (\\d+) gelir/g,\"Berî $1, $2 tê\")"
          '.replace(/(\\d+) ile (\\d+) arasında (\\d+) var/g,"Di navbera $1 û $2 de $3 heye")'
          '.replace(/→ Eşit/g,"→ Wekhev")'
          ".replace(/(\\d+)'(?:in|ın|un|ün|nin|nın|nun|nün) (\\d+) katı = (\\d+)/g,\"$2 carî $1 = $3\")"
          ".replace(/(\\d+), (\\d+)'(?:in|ın|un|ün|nin|nın|nun|nün) (\\d+) katıdır/g,\"$1, $3 carî $2 ye\")"
          '.replace(/ — en küçük tekrar eden birim/g," — yekeya herî biçûk a ku dubare dibe")'
          '.replace(/Sayı kodu:/g,"Koda hejmarê:")'
          '.replace(/(\\d+) lira üstü/g,"$1 lîre pereyê vegerê")'
          '.replace(/(\\d+) lira/g,"$1 lîre")'
          '.replace(/(\\d+) kuruş/g,"$1 qurûş")'
          '.replace(/ yüzlük/g," sedek")'
          '.replace(/Doğru kapsül:/g,"Kapsula rast:")'))
# (26) Düzeltme satırındaki "noktalar ↔ rakam ↔ sözcük" gösterimi sayının adını her dilde Türkçe yazıyordu
#      (Kurmancî oyunda "yirmi", "kırk"). Ad artık oyunun diline göre yazılır.
R.append(('k=Math.min(r,x?10:15),S=ct(r);', 'k=Math.min(r,x?10:15),S=Le(r,typeof window<"u"&&window.__gsLang||"tr");'))

# (27) Yörünge Komşuları "arasında" sorusunun alt yazısı Kurmancî oyunda Türkçeydi ("Sırayla say").
R.append(('a.subType==="between"?t==="en"?"Count in order":"Sırayla say":""', 'a.subType==="between"?t==="en"?"Count in order":t==="ku"?"Bi rêzê bijmêre":"Sırayla say":""'))

# (28) Büyüyen Desen yönergesinde "büyüyor! — boşluğu tamamla!" çift noktalama giderildi.
#      Kurmancî oyunda alt yazıları yalnız Türkçe/İngilizce olan ekranlar: Yıldız Taşı Birleştir / Ayır yönergesi,
#      Büyüyen Desen yönergesi, Filo Grupla yönergesi, Uzay Terazisi kefe adları (SOL/SAĞ).
R.append((':a.toAdd===0?`${a.start} + 0 = ? — sayı değişir mi sence?`:a.countOn?`💡 ${va(a.start)} başla, ${a.toAdd} tane daha say!`:`Birleştir: ${a.start} + ${a.toAdd} = ? — Boş yuvalara tıkla`',
          ':t==="ku"?a.toAdd===0?`${a.start} + 0 = ? — tu dibêjî hejmar diguhere?`:a.countOn?`💡 Ji ${a.start} dest pê bike, ${a.toAdd} heb din bijmêre!`:`Bike yek: ${a.start} + ${a.toAdd} = ? — Li hêlînên vala bitikîne`'
          ':a.toAdd===0?`${a.start} + 0 = ? — sayı değişir mi sence?`:a.countOn?`💡 ${va(a.start)} başla, ${a.toAdd} tane daha say!`:`Birleştir: ${a.start} + ${a.toAdd} = ? — Boş yuvalara tıkla`'))
R.append((':a.toRemove===0?`${a.start} − 0 = ? — sayı değişir mi sence?`:a.toRemove===a.start?"Hepsi giderse geriye kaç kalır?"',
          ':t==="ku"?a.toRemove===0?`${a.start} − 0 = ? — tu dibêjî hejmar diguhere?`:a.toRemove===a.start?"Heke hemû biçin, çend dimînin?":`Veqetîne: ${a.start} − ${a.toRemove} = ? — Li kevirên stêrkan bitikîne û derxe, paşê yên mayî bijmêre!`'
          ':a.toRemove===0?`${a.start} − 0 = ? — sayı değişir mi sence?`:a.toRemove===a.start?"Hepsi giderse geriye kaç kalır?"'))
R.append(('children:Y?t==="en"?`${oe} — fill in the blank!`:`${oe} — boşluğu tamamla!`:ne?t==="en"?"Are the differences the same, or changing? Look closely!":"Farklar sabit mi, yoksa değişiyor mu? Dikkatli bak!":t==="en"?"Look at the difference between the numbers — what is the rule?":"Sayılar arasındaki farka bak — kural ne?"',
          'children:Y?t==="en"?`${String(oe).replace(/!$/,"")} — fill in the blank!`:t==="ku"?`${String(oe).replace(/!$/,"")} — valahiyê tijî bike!`:`${String(oe).replace(/!$/,"")} — boşluğu tamamla!`:ne?t==="en"?"Are the differences the same, or changing? Look closely!":t==="ku"?"Cudahî wek hev in, an diguherin? Baş binêre!":"Farklar sabit mi, yoksa değişiyor mu? Dikkatli bak!":t==="en"?"Look at the difference between the numbers — what is the rule?":t==="ku"?"Li cudahiya navbera hejmaran binêre — rêgez çi ye?":"Sayılar arasındaki farka bak — kural ne?"'))
R.append(('children:a.askRemainder?t==="en"?"Fill the full groups first — count what doesn\'t fit!":"Önce tam grupları doldur — sığmayanları say!":t==="en"?`Take ${a.perGroup} away from ${a.total} — how many times?`:`${va(a.total)} ${La(a.perGroup)} çıkar — kaç kez?`',
          'children:a.askRemainder?t==="en"?"Fill the full groups first — count what doesn\'t fit!":t==="ku"?"Pêşî komên tijî temam bike — yên ku cih nagirin bijmêre!":"Önce tam grupları doldur — sığmayanları say!":t==="en"?`Take ${a.perGroup} away from ${a.total} — how many times?`:t==="ku"?`Ji ${a.total}an her carê ${a.perGroup} derxe — çend caran?`:`${va(a.total)} ${La(a.perGroup)} çıkar — kaç kez?`'))
R.append(('children:t==="en"?"LEFT":"SOL"', 'children:t==="ku"?"ÇEP":t==="en"?"LEFT":"SOL"'))
R.append(('marginBottom:4},children:t==="en"?"RIGHT":"SAĞ"', 'marginBottom:4},children:t==="ku"?"RAST":t==="en"?"RIGHT":"SAĞ"'))

# (29) Türkçe yazım: "dörtün 4 katı" → "dördün" (ünsüz yumuşaması), "Bir elinlerin" → "Bir elin",
#      "matematğin" → "matematiğin"; cümle başı küçük harf ("üçer tam grupları…", "beşer beşer saydın…").
R.append(('[ct(L),ls(L)," ",K," katı ",ct(V)," eder"]', '[(ct(L)+ls(L)).replace(/dörtün$/,"dördün")," ",K," katı ",ct(V)," eder"]'))
R.append(('"Bir elinlerin parmak sayısı 5 — doğal bir referans noktası!"', '"Bir elin parmak sayısı 5 — doğal bir referans noktası!"'))
R.append(('"Sayıların sırasını bilmek tüm matematğin temeli!"', '"Sayıların sırasını bilmek tüm matematiğin temeli!"'))
R.append(('f=`${La(c.perGroup)} tam grupları doldur:', 'f=`${(gsS=>gsS.charAt(0).toLocaleUpperCase("tr")+gsS.slice(1))(La(c.perGroup))} tam grupları doldur:'))
R.append(('ee(`${La(w.step)} ${La(w.step)} saydın — ritmik sayma çarpmanın temelidir!`', 'ee(`${(gsS=>gsS.charAt(0).toLocaleUpperCase("tr")+gsS.slice(1))(La(w.step))} ${La(w.step)} saydın — ritmik sayma çarpmanın temelidir!`'))

R.append(('return ee(`${La(w.step)} ${La(w.step)} GERİYE saydın', 'return ee(`${(gsS=>gsS.charAt(0).toLocaleUpperCase("tr")+gsS.slice(1))(La(w.step))} ${La(w.step)} GERİYE saydın'))

errors = 0
for old, new in R:
    n = G.count(old)
    if n != 1:
        print(f'EŞLEŞME {n}: {old[:90]}'); errors += 1
if errors:
    sys.exit(f'{errors} değişiklik uygulanamadı; dosya değiştirilmedi.')
for old, new in R:
    G = G.replace(old, new, 1)
open(gp, 'w', encoding='utf-8').write(G)
print(f'{len(R)} düzeltme uygulandı → {gp}')
