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
  60:"altmış",70:"yetmiş",80:"seksen",90:"doksan",100:"yüz",
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
export const trK = name => { const l=name[name.length-1].toLowerCase(),v=_trLastV(name),h=_trH4(v); return name+"'"+ (_trIsV(l)?'n':'') + h+'nk'+h+'nd'+_trH2(v)+'n'; };
// de/da bağlacı uyumu: Elif'in de, Kaan'ın da, Yusuf'un da, Duru'nun da
export const trDA = name => _trH2(_trLastV(name)) === 'e' ? 'de' : 'da';
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
