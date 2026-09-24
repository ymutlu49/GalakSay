// ═══ ÜÇLÜ KOD MODELİ (Dehaene, 1992) ══════════════════════════════════════
// Sayılar üç kodda temsil edilir: çokluk (analog büyüklük), rakam (Arap), sözcük (sözel)
// Okuma yazma bilmeyen çocuklar için sözel kod = işitsel (TTS)
export const NUM_WORDS = {
  0:"sıfır",1:"bir",2:"iki",3:"üç",4:"dört",5:"beş",6:"altı",7:"yedi",8:"sekiz",9:"dokuz",
  10:"on",11:"on bir",12:"on iki",13:"on üç",14:"on dört",15:"on beş",16:"on altı",17:"on yedi",
  18:"on sekiz",19:"on dokuz",20:"yirmi",21:"yirmi bir",22:"yirmi iki",23:"yirmi üç",24:"yirmi dört",
  25:"yirmi beş",26:"yirmi altı",27:"yirmi yedi",28:"yirmi sekiz",29:"yirmi dokuz",30:"otuz",
  31:"otuz bir",32:"otuz iki",33:"otuz üç",34:"otuz dört",35:"otuz beş",36:"otuz altı",37:"otuz yedi",
  38:"otuz sekiz",39:"otuz dokuz",40:"kırk",41:"kırk bir",42:"kırk iki",43:"kırk üç",44:"kırk dört",
  45:"kırk beş",46:"kırk altı",47:"kırk yedi",48:"kırk sekiz",49:"kırk dokuz",50:"elli",
  51:"elli bir",52:"elli iki",53:"elli üç",54:"elli dört",55:"elli beş",56:"elli altı",57:"elli yedi",
  58:"elli sekiz",59:"elli dokuz",60:"altmış",61:"altmış bir",62:"altmış iki",63:"altmış üç",
  64:"altmış dört",65:"altmış beş",66:"altmış altı",67:"altmış yedi",68:"altmış sekiz",69:"altmış dokuz",
  70:"yetmiş",71:"yetmiş bir",72:"yetmiş iki",73:"yetmiş üç",74:"yetmiş dört",75:"yetmiş beş",
  76:"yetmiş altı",77:"yetmiş yedi",78:"yetmiş sekiz",79:"yetmiş dokuz",80:"seksen",
  81:"seksen bir",82:"seksen iki",83:"seksen üç",84:"seksen dört",85:"seksen beş",86:"seksen altı",
  87:"seksen yedi",88:"seksen sekiz",89:"seksen dokuz",90:"doksan",91:"doksan bir",92:"doksan iki",
  93:"doksan üç",94:"doksan dört",95:"doksan beş",96:"doksan altı",97:"doksan yedi",98:"doksan sekiz",
  99:"doksan dokuz",100:"yüz",
};

export const numWord = (n) => NUM_WORDS[n] || `${NUM_WORDS[Math.floor(n/10)*10]||""} ${NUM_WORDS[n%10]||""}`.trim() || String(n);

// ═══ TÜRKÇE MORFOLOJİ YARDIMCILARI ════════════════════════════════════════
// Ünlü uyumu ve isim çekimleri
const _trV = 'aeıioöuüAEIİOÖUÜ';
const _trIsV = ch => _trV.includes(ch);
const _trLastV = w => { for(let i=w.length-1;i>=0;i--) if(_trIsV(w[i])) return w[i].toLowerCase(); return 'a'; };
const _trH4 = v => 'ei'.includes(v)?'i':'aı'.includes(v)?'ı':'ou'.includes(v)?'u':'ü';
const _trH2 = v => 'eiöü'.includes(v)?'e':'a';

// Tamlayan (genitif): Elif'in, Ali'nin, Yusuf'un, Ada'nın, Kaan'ın, Duru'nun
export const trG = name => { const l=name[name.length-1].toLowerCase(),v=_trLastV(name); return name+"'"+ (_trIsV(l)?'n':'') + _trH4(v)+'n'; };
// Yönelme (datif): Elif'e, Ali'ye, Yusuf'a, Ada'ya
export const trD = name => { const l=name[name.length-1].toLowerCase(),v=_trLastV(name); return name+"'"+ (_trIsV(l)?'y':'') + _trH2(v); };
// Karşılaştırma: Elif'inkinden, Ali'ninkinden, Yusuf'unkinden
// -ki aitlik eki ünlü uyumuna GİRMEZ; ardından -nden sabit: Yusuf'unkinden, Ada'nınkinden, Elif'inkinden
export const trK = name => { const l=name[name.length-1].toLowerCase(),v=_trLastV(name),h=_trH4(v); return name+"'"+ (_trIsV(l)?'n':'') + h+'nkinden'; };
// de/da bağlacı uyumu: Elif'in de, Kaan'ın da, Yusuf'un da, Duru'nun da
export const trDA = name => _trH2(_trLastV(name)) === 'e' ? 'de' : 'da';

// Ayrılma hâli (ablatif, -DAn) SAYI eki — TDK: ünlü uyumu + ünsüz benzeşmesi.
// Sayının OKUNUŞUNA göre (rakam değil): bileşikte son kelimenin son ünlüsü + son sesi.
// 1'den, 2'den, 3'ten, 4'ten, 5'ten, 6'dan, 9'dan, 10'dan, 20'den, 40'tan, 100'den...
const _trVoiceless = 'çfhkpsşt'; // sert (sessiz) ünsüzler → d→t benzeşmesi
export const trAblSuf = n => {
  const parts = String(numWord(n)).trim().split(' ');
  const last = parts[parts.length - 1] || '';
  const lc = (last[last.length - 1] || '').toLowerCase();
  return (_trVoiceless.includes(lc) ? 't' : 'd') + _trH2(_trLastV(last)) + 'n';
};
export const trAbl = n => `${n}'${trAblSuf(n)}`; // "5" → "5'ten"

// Tamlayan hâli (genitif, -In) SAYI eki — ünlü uyumu (4'lü) + ünlüyle biten sayıda 'n' kaynaştırma.
// (Genitifte d↔t ünsüz benzeşmesi YOK.) 2'nin, 3'ün, 5'in, 6'nın, 10'un, 4'ün, 100'ün...
export const trGenSuf = n => {
  const parts = String(numWord(n)).trim().split(' ');
  const last = parts[parts.length - 1] || '';
  const lc = (last[last.length - 1] || '').toLowerCase();
  return (_trIsV(lc) ? 'n' : '') + _trH4(_trLastV(last)) + 'n';
};
export const trGen = n => `${n}'${trGenSuf(n)}`; // "2" → "2'nin", "5" → "5'in"

// Yönelme hâli (datif, -A) SAYI eki — ünlü uyumu (2'li a/e) + ünlüyle bitende 'y' kaynaştırma.
// 2'ye, 5'e, 6'ya, 10'a, 100'e, 9'a, 4'e...
export const trDatSuf = n => {
  const parts = String(numWord(n)).trim().split(' ');
  const last = parts[parts.length - 1] || '';
  const lc = (last[last.length - 1] || '').toLowerCase();
  return (_trIsV(lc) ? 'y' : '') + _trH2(_trLastV(last));
};
export const trDat = n => `${n}'${trDatSuf(n)}`; // "10" → "10'a", "5" → "5'e"

// Belirtme hâli (akuzatif, -I) SAYI eki — ünlü uyumu (4'lü) + ünlüyle bitende 'y' kaynaştırma.
// 2'yi, 5'i, 6'yı, 8'i, 9'u, 10'u, 100'ü...
export const trAccSuf = n => {
  const parts = String(numWord(n)).trim().split(' ');
  const last = parts[parts.length - 1] || '';
  const lc = (last[last.length - 1] || '').toLowerCase();
  return (_trIsV(lc) ? 'y' : '') + _trH4(_trLastV(last));
};
export const trAcc = n => `${n}'${trAccSuf(n)}`; // "8" → "8'i", "2" → "2'yi"
// Cümle başı büyük harf: "üç" → "Üç"
export const capFirst = s => s.charAt(0).toLocaleUpperCase('tr-TR') + s.slice(1);

// Üleştirme sayısı: üçer, dörder, beşer, ikişer...
export const _DIST = {'bir':'birer','iki':'ikişer','üç':'üçer','dört':'dörder','beş':'beşer','altı':'altışar','yedi':'yedişer','sekiz':'sekizer','dokuz':'dokuzar','on':'onar','yirmi':'yirmişer','otuz':'otuzar','kırk':'kırkar','elli':'ellişer','altmış':'altmışar','yetmiş':'yetmişer','seksen':'seksener','doksan':'doksanar','yüz':'yüzer'};
export const numDist = n => { const w=numWord(n); if(_DIST[w]) return _DIST[w]; const p=w.split(' '); const lw=p[p.length-1]; if(_DIST[lw]){p[p.length-1]=_DIST[lw]; return p.join(' ');} return w; };

// Türk çocuğuna yakın bağlamlar ve isimler
export const WP_NAMES = ["Elif","Ali","Zeynep","Ege","Defne","Yusuf","Ecrin","Mert","Azra","Kerem","Nehir","Ömer","Ada","Kaan","Nisa","Berk","Çınar","Duru","Poyraz","Asya","Rojin","Baran","Dilan","Meryem","Lara"];
export const WP_pick = arr => arr[Math.floor(Math.random() * arr.length)];
export const WP_name = () => WP_pick(WP_NAMES);
export const WP_pair = () => { const a = WP_name(); let b = WP_name(); while(b===a) b=WP_name(); return [a,b]; };

// ═══ KÜRTÇE (KURMANCÎ) JIMARE — Hejmarên bi peyvan ═══════════════════════
// Referans: Ferhenga Matematikê, Prof. Dr. Yılmaz MUTLU
export const NUM_WORDS_KU = {
  0:"sifir",1:"yek",2:"du",3:"sê",4:"çar",5:"pênc",6:"şeş",7:"heft",8:"heşt",9:"neh",
  10:"deh",11:"yazde",12:"dazde",13:"sêzde",14:"çarde",15:"pazde",16:"şazde",17:"hivde",18:"hijde",19:"nozde",
  20:"bîst",21:"bîst û yek",22:"bîst û du",23:"bîst û sê",24:"bîst û çar",25:"bîst û pênc",
  26:"bîst û şeş",27:"bîst û heft",28:"bîst û heşt",29:"bîst û neh",
  30:"sî",31:"sî û yek",32:"sî û du",33:"sî û sê",34:"sî û çar",35:"sî û pênc",
  36:"sî û şeş",37:"sî û heft",38:"sî û heşt",39:"sî û neh",
  40:"çil",41:"çil û yek",42:"çil û du",43:"çil û sê",44:"çil û çar",45:"çil û pênc",
  46:"çil û şeş",47:"çil û heft",48:"çil û heşt",49:"çil û neh",
  50:"pêncî",51:"pêncî û yek",52:"pêncî û du",53:"pêncî û sê",54:"pêncî û çar",55:"pêncî û pênc",
  56:"pêncî û şeş",57:"pêncî û heft",58:"pêncî û heşt",59:"pêncî û neh",
  60:"şêst",61:"şêst û yek",62:"şêst û du",63:"şêst û sê",64:"şêst û çar",65:"şêst û pênc",
  66:"şêst û şeş",67:"şêst û heft",68:"şêst û heşt",69:"şêst û neh",
  70:"heftê",71:"heftê û yek",72:"heftê û du",73:"heftê û sê",74:"heftê û çar",75:"heftê û pênc",
  76:"heftê û şeş",77:"heftê û heft",78:"heftê û heşt",79:"heftê û neh",
  80:"heştê",81:"heştê û yek",82:"heştê û du",83:"heştê û sê",84:"heştê û çar",85:"heştê û pênc",
  86:"heştê û şeş",87:"heştê û heft",88:"heştê û heşt",89:"heştê û neh",
  90:"nod",91:"nod û yek",92:"nod û du",93:"nod û sê",94:"nod û çar",95:"nod û pênc",
  96:"nod û şeş",97:"nod û heft",98:"nod û heşt",99:"nod û neh",100:"sed",
};
export const numWordKu = (n) => NUM_WORDS_KU[n] || `${NUM_WORDS_KU[Math.floor(n/10)*10]||""} û ${NUM_WORDS_KU[n%10]||""}`.trim() || String(n);

// ═══ KÜRTÇE MORFOLOJİ YARDIMCILARI ═══════════════════════════════════════
// Ezafe: -a (dişil), -ê (eril/çoğul), -ên (çoğul belirli)
export const kuEzafe = (word, gender = "m") => gender === "f" ? word + "a" : word + "ê";
// Çoğul: -an (oblique çoğul)
export const kuPlural = (word) => word + "an";

// Kürtçe çocuk isimleri
export const WP_NAMES_KU = ["Azad","Jiyan","Berîvan","Rohat","Helîn","Dîlan","Baran","Rojîn","Rûbar","Şîlan","Cîhan","Avîn","Zerdeşt","Rûken","Hogir","Cîwan","Dîlşad","Ronahî","Zana","Bêrîtan","Hêvî","Sîdar","Lîlav","Rêzan","Meryem"];
export const WP_nameKu = () => WP_pick(WP_NAMES_KU);
export const WP_pairKu = () => { const a = WP_nameKu(); let b = WP_nameKu(); while(b===a) b=WP_nameKu(); return [a,b]; };

// ═══ DİL FARKINDALIKLI FONKSİYONLAR ═════════════════════════════════════
export const numWordLang = (n, lang = "tr") => lang === "ku" ? numWordKu(n) : numWord(n);
export const WP_nameLang = (lang = "tr") => lang === "ku" ? WP_nameKu() : WP_name();
export const WP_pairLang = (lang = "tr") => lang === "ku" ? WP_pairKu() : WP_pair();
