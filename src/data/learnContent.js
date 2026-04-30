// ═══ ÖĞRENME-ÖĞRETME İÇERİĞİ ══════════════════════════════════════════════
// Her kategori için adım adım yapılandırılmış DokunSay enerji kapsülü/yıldız taşı temelli öğretim
// Pedagojik yaklaşım: CRA modeli — Somut→Temsili→Soyut geçiş
export const LEARN_CONTENT = {
  // ═══════════════════════════════════════════════════════════════════════════
  // KATEGORİ 1: SAYI TANIMA — Temel sayı kavramları, birebir eşleme, kardinalite
  // Pedagojik yaklaşım: Somuttan soyuta (CRA), günlük hayat bağlantısı
  // ═══════════════════════════════════════════════════════════════════════════
  level1: {
    title: "⚡ Sayma Şarjı",
    subtitle: "Yıldız taşlarını saymak için enerji yükle",
    icon: "⚡",
    color: "#16a34a",
    steps: [
      { title: "Enerji Kapsülü Nedir?", text: "DokunSay enerji kapsülü üzerinde renkli yıldız taşları var. Her yıldız taşı bir nesneyi gösterir. Yıldız taşlarına parmağınla dokun, say ve öğren! Her yıldız taşına tek tek dokunabilirsin.", tts: "Enerji kapsülünde renkli yıldız taşları var. Hadi dokunarak sayıları öğrenelim!", visual: "rod", rodCount: 5, note: "Dokunarak sayma, sayı kavramını elle tutulur hâle getirir." },
      { title: "Tek Tek Sayma", text: "Sayarken her yıldız taşına parmağınla dokun ve bir sayı söyle: bir, iki, üç, dört... Her yıldız taşına yalnızca bir kez dokun! Atlamadan ve tekrar etmeden say.", tts: "Dokun ve say: bir, iki, üç... Hiçbirini atlama!", visual: "counting", countTo: 5, note: "Her nesneye bir sayı düşer. Buna 'birebir eşleme' denir." },
      { title: "Sayılar Hep Aynı Sırada", text: "Sayılar her zaman aynı sırayla söylenir: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10. Bu sıra hiç değişmez! Elma da saysan yıldız taşı da saysan sıra hep aynıdır.", tts: "Bir, iki, üç, dört, beş... Sayılar hep aynı sırada! Bu sıra hiç değişmez.", visual: "counting", countTo: 10, note: "Sayılar her zaman aynı düzende söylenir. Bu kurala 'sabit sıra' denir." },
      { title: "Son Söylediğin Sayı = Toplam", text: "Yıldız taşlarına dokunarak 1, 2, 3, 4 dedin. En son söylediğin sayı '4' — bu toplam yıldız taşı sayısını gösterir! 'Kaç yıldız taşı var?' diye sorulunca '4' demek yeterli.", tts: "En son söylediğin sayı toplamı gösterir. Dört saydıysan toplam dört!", visual: "counting", countTo: 4, note: "En son söylenen sayı, gruptaki toplam nesne sayısını belirtir." },
      { title: "Nereden Başlarsan Başla", text: "Yıldız taşlarını soldan sağa say ya da sağdan sola say — sonuç hep aynı! Başlangıç yeri farklı olsa da toplam değişmez. Önemli olan her yıldız taşına bir kez dokunmak.", tts: "Soldan say ya da sağdan say — sonuç aynı! Toplam değişmez.", visual: "counting", countTo: 6, note: "Saymaya nereden başlarsan başla, toplam sayı hep aynı kalır." },
      { title: "İki Renk Kuralı", text: "DokunSay enerji kapsülünde ilk 5 yıldız taşı mavi, sonrakiler kırmızıdır. 5 mavi yıldız taşı gördüğünde saymadan hemen 'beş' de! Sonra kırmızıları say ve ekle. Örnek: 5 mavi + 2 kırmızı = 7.", tts: "İlk beş mavi, sonrakiler kırmızı! Beşi hemen tanı, kırmızıları ekle.", visual: "twoColor", examples: [3, 5, 7, 9], note: "5'i gözle hemen tanımak, toplama için çok güçlü bir kısayoldur." },
      { title: "Sayının Üç Gösterimi", text: "Her sayı üç farklı şekilde gösterilir: nesne olarak enerji kapsülünde, sembol olarak yazılı rakam ve sözcük olarak söylenen isim. 5 yıldız taşı (nesne), '5' (sembol) ve 'beş' (sözcük) — üçü de aynı sayıyı anlatır!", tts: "Her sayının üç gösterimi var: gör, oku ve söyle! Beş yıldız taşı gör, 5 rakamını oku, beş diye söyle!", visual: "tripleCodeLearn", examples: [{ n: 3, chips: 3, symbol: "3", word: "üç" }, { n: 5, chips: 5, symbol: "5", word: "beş" }, { n: 8, chips: 8, symbol: "8", word: "sekiz" }], note: "Nesne (miktar), Sembol (rakam) ve Sözcük (isim): Aynı sayının üç farklı gösterimi." },
      { title: "Bir Fazla, Bir Eksik", text: "5 yıldız taşlı enerji kapsülüne bak — her yıldız taşının üstünde sıra numarası var. 5'in bir öncesi 4, bir sonrası 6'dır. Yeşil yıldız taşları sırayı gösterir. Her sayının bir komşusu vardır!", tts: "Beşin bir öncesi dört, bir sonrası altı! Her sayının komşuları var.", visual: "successorPredecessor", rodCount: 5, note: "Bir yıldız taşı eklemek veya çıkarmak, toplama ve çıkarma öğrenmenin ilk adımıdır." },
      { title: "Sanbil: Saymadan Tanıma", text: "Zarın üstündeki noktaları saymadan kaç tane olduğunu bilirsin! Küçük sayıları bir bakışta tanımaya 'sanbil' denir. 1, 2, 3 ve 4 yıldız taşlı enerji kapsüllerini saymadan tanımayı dene!", tts: "Hızlıca bak ve kaç tane olduğunu söyle! Buna sanbil denir.", visual: "subitizing", examples: [2, 3, 4, 5], note: "Küçük miktarları saymadan bir bakışta tanı!" },
      { title: "Sayı Korunumu", text: "5 yıldız taşını yan yana diz, sonra aralıklı koy. Diziliş değişti ama sayı hâlâ 5! Nesnelerin dizilişi değişse bile sayısı değişmez. Sayı, şekle bağlı değildir.", tts: "Diziliş değişse de sayı aynı kalır! Nasıl dizersen diz, hâlâ beş.", visual: "conservation", count: 5, note: "Nesnelerin yeri veya şekli değişse bile toplam sayı aynı kalır." },
      { title: "🚀 Şarj Tamamlandı!", text: "Sayma enerjin tam şarj oldu! Tek tek saymayı, son sayının toplamı gösterdiğini ve iki renk kuralını yükledin. Gemi hazır, yıldız taşlarını toplamaya başla!", tts: "Aferin, enerji şarjı tamamlandı! Sayma gücün yüklendi, göreve hazırsın!", visual: "rod", rodCount: 10, note: "Her yüklenen enerji modülü, bir sonraki görevin temelidir." }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // KATEGORİ 2: SAYI İLİŞKİLERİ — Karşılaştırma, sıralama, sayı doğrusu
  // ═══════════════════════════════════════════════════════════════════════════
  level2: {
    title: "⚡ Denge Şarjı",
    subtitle: "Karşılaştırma enerjisini kalibre et",
    icon: "⚡",
    color: "#93c5fd",
    steps: [
      { title: "İki Grubu Karşılaştır", text: "İki grup yıldız taşını karşılaştırmak için onları alt alta koy. Her yıldız taşını birer birer eşle. Eşi kalmayan taraf daha çoktur!", tts: "İki grubu alt alta koy ve birer birer eşle. Eşi kalmayan taraf daha çok!", visual: "compare", pairs: [{ a: 3, b: 5, answer: "5, 3'ten daha çok — fark 2" }, { a: 4, b: 4, answer: "4 ile 4 eşit" }], note: "Enerji kapsüllerini alt alta koy — hangisi uzunsa o daha çok!" },
      { title: "Daha Az, Eşit, Daha Çok", text: "İki miktarı karşılaştırınca üç sonuç olabilir: daha az, eşit veya daha çok. 3 yıldız taşı ile 5 yıldız taşı: 3 daha az, 5 daha çok. 4 yıldız taşı ile 4 yıldız taşı: eşit!", tts: "Üç sonuç var: daha az, eşit, daha çok!", visual: "lessMoreEqual", examples: [{ a: 2, b: 5, result: "az" }, { a: 4, b: 4, result: "eşit" }, { a: 7, b: 3, result: "çok" }], note: "Daha az, eşit, daha çok — karşılaştırmanın üç sonucu." },
      { title: "Büyük Sayı, Uzun Enerji Kapsülü", text: "Bir sayı büyüdükçe enerji kapsülü de uzar. 3 yıldız taşlı enerji kapsülü kısa, 8 yıldız taşlı enerji kapsülü uzundur. Boylarını karşılaştırarak hangi sayının büyük olduğunu görebilirsin.", tts: "Büyük sayının enerji kapsülü daha uzun! Üç kısa, sekiz uzun.", visual: "compare", pairs: [{ a: 3, b: 8, answer: "8, 3'ten daha çok" }], note: "Uzun enerji kapsülü = büyük sayı." },
      { title: "Rakam ile Miktar Eşleme", text: "Bir rakam gördüğünde onun kaç nesneyi gösterdiğini bilmelisin. 5 yıldız taşını say, sonra '5' kartını bul ve eşle! Rakam ile miktar her zaman birlikte gider.", tts: "Yıldız taşlarını say ve doğru rakamı bul. Rakam ile miktar arkadaştır!", visual: "matching", examples: [{ num: 3, desc: "3 yıldız taşı → rakam 3" }, { num: 7, desc: "7 yıldız taşı → rakam 7" }], note: "Yıldız taşlarını say, doğru rakamı bul ve eşle!" },
      { title: "Küçükten Büyüğe Sıralama", text: "Sayıları sıralamak için en küçüğü bul ve başa koy. Sonra kalanlardan en küçüğü seç. 5, 2, 8, 1 → sıralayınca: 1, 2, 5, 8.", tts: "En küçüğü bul ve başa koy. Sonra en küçüğünü seç!", visual: "ordering", numbers: [5, 2, 8, 1], note: "En küçüğü bul, başa koy, kalanlardan devam et." },
      { title: "Büyükten Küçüğe Sıralama", text: "Tersini de yapabilirsin! En büyüğü başa koy, sonra kalanlardan en büyüğü seç. 3, 7, 1, 9 → büyükten küçüğe: 9, 7, 3, 1.", tts: "En büyüğü başa koy: dokuz, yedi, üç, bir!", visual: "ordering", numbers: [3, 7, 1, 9], note: "Hem küçükten büyüğe hem büyükten küçüğe sıralayabilmek önemlidir." },
      { title: "Bir Önce ve Bir Sonra", text: "Her sayının bir öncesi ve bir sonrası vardır. 5'ten önce 4, sonra 6 gelir. Bir sonraki sayı bir fazla, bir önceki sayı bir eksik demektir.", tts: "Her sayının iki komşusu var. Bir önceki bir eksik, bir sonraki bir fazla demek!", visual: "beforeAfter", examples: [{ num: 4, before: 3, after: 5 }, { num: 7, before: 6, after: 8 }], note: "Komşu sayıları bilmek, toplama ve çıkarmaya hazırlık sağlar." },
      { title: "Arada Hangi Sayı Var?", text: "3 ile 5 arasında hangi sayı var? 4! Her iki komşu sayı arasında tam bir sayı bulunur. 6 ile 8 arası? 7!", tts: "Üç ile beş arasında ne var? Dört! Altı ile sekiz arasında? Yedi!", visual: "beforeAfter", examples: [{ num: 4, before: 3, after: 5 }], note: "3 ile 5 arasında 4, 6 ile 8 arasında 7 var." },
      { title: "Sayı Doğrusu", text: "Sayıları bir çizgi üzerinde düşün: sola gittikçe küçülür, sağa gittikçe büyür. Bu çizgiye 'sayı doğrusu' denir. Yakın sayılar yan yana durur.", tts: "Kafanda bir sayı doğrusu hayal et. Sol küçük, sağ büyük!", visual: "numberLine", range: [0, 10], note: "Sol küçük, sağ büyük — sayılar enerji kapsülünün üzerinde sıralanır." },
      { title: "Geçişli Çıkarım", text: "5, 3'ten büyük. 3 de 1'den büyük. O zaman 5, 1'den de büyüktür! Bunu saymadan biliriz. İki karşılaştırmayı birleştirerek yeni bir sonuç çıkardık.", tts: "Beş üçten büyük, üç de birden büyük. O hâlde beş birden de büyük!", visual: "transitive", examples: [{ a: 5, b: 3, c: 1, desc: "5 büyük 3, 3 büyük 1 → demek ki 5 büyük 1" }], note: "A büyükse B'den, B de büyükse C'den — A da büyük olur C'den. Saymaya gerek yok!" },
      { title: "🚀 Şarj Tamamlandı!", text: "Denge sensörlerin kalibre edildi! Karşılaştırma, sıralama ve sayı doğrusu enerjisi yüklendi.", tts: "Aferin, denge şarjı tamam! Karşılaştırma gücün yüklendi, göreve hazırsın!", visual: "numberLine", range: [0, 10], note: "Karşılaştırma sensörleri, galaksideki tüm görevlerin temelidir." }
    ]
  },

  // KATEGORİ 3: SAYI YAPISI
  level3: {
    title: "⚡ Yapı Şarjı", subtitle: "Sayı bağlarının gücünü çöz", icon: "⚡", color: "#ea580c",
    steps: [
      { title: "Sayıları Parçalar Halinde Gör", text: "Sayıları tek tek saymak yerine küçük parçalar halinde görmek daha hızlıdır. 7'yi düşün: '5 ve 2 daha' olarak görmek, tek tek saymaktan çok daha kolay!", tts: "Yediyi beş ve iki olarak düşün.", visual: "fiveRef", examples: [{ n: 3, desc: "3 = tek grup" }, { n: 7, desc: "7 = 5 + 2" }, { n: 9, desc: "9 = 5 + 4" }], note: "Sayıları parçalar halinde görmek, tek tek sayma alışkanlığından çıkışın ilk adımıdır." },
      { title: "5 Önemli Bir Sayıdır", text: "5 çok önemli bir sayıdır çünkü bir elin parmak sayısıdır! Elini aç ve say: bir, iki, üç, dört, beş.", tts: "Beş, bir elin parmak sayısı! Elini aç ve say.", visual: "fiveRef", examples: [{ n: 2, desc: "5'ten 3 eksik" }, { n: 5, desc: "Tam 5 — bir el" }, { n: 8, desc: "5 ve 3 fazla" }], note: "5 ve 10 'kritik referans sayıları'dır." },
      { title: "5'e Kadar Sayı Bağları", text: "5'in parçalarını bilmek çok işe yarar: 1+4=5, 2+3=5, 0+5=5.", tts: "Beşin sayı bağları: bir artı dört, iki artı üç.", visual: "makeN", target: 5, examples: [2, 3, 4, 1], note: "Sayı bağları: Bir sayıyı oluşturan parça çiftlerini bilmek işlemleri hızlandırır." },
      { title: "5'lik Kart", text: "5'lik kart, 5 kutuluk bir çerçevedir. Yıldız taşlarını kutulara yerleştir ve boş kutuları say!", tts: "Beşlik karta yıldız taşlarını yerleştir. Kaç dolu, kaç boş?", visual: "fivesFrameLearn", examples: [2, 3, 5], note: "5'lik çerçeve, bakarak tanımayı güçlendirir." },
      { title: "10'luk Çerçeve", text: "10'luk çerçevede 2 sıra ve her sırada 5 kutu var. Üst sıra doluysa saymadan '5' de!", tts: "Onluk çerçevede üst sıra beş, alt sıra da beş. Hadi deneyelim!", visual: "tensFrameLearn", examples: [4, 7, 10], note: "10'luk çerçeve: Parçaları görerek büyük sayıları hızlıca tanımayı sağlar." },
      { title: "10'luk Çerçevede Boşluklar", text: "10'luk çerçevede 7 yıldız taşı varsa 3 kutu boş kalır. Boş kutular 10'a ne kadar eksik olduğunu gösterir.", tts: "Yedi yıldız taşı varsa üç boş kutu kalır. 10'a üç eksik!", visual: "tensFrameLearn", examples: [6, 8, 9], note: "Boş kutuları saymak, 10'a ne kadar eksik olduğunu gösterir." },
      { title: "Yıldız Taşı Dizmek", text: "Hedef sayıyı düşün, enerji kapsülüne yıldız taşlarını sürükleyerek yerleştir ve say.", tts: "Hedef sayıyı düşün, yıldız taşı koy ve say.", visual: "buildNumberLearn", examples: [{ n: 3, desc: "3 yıldız taşı" }, { n: 6, desc: "6 yıldız taşı" }], note: "Yıldız taşı dizerek sayı oluşturma, somuttan soyuta geçişin ilk adımıdır." },
      { title: "10'un Arkadaşları", text: "10 yapan sayı çiftlerini öğren! 1+9, 2+8, 3+7, 4+6, 5+5.", tts: "10'un arkadaşları: bir artı dokuz, iki artı sekiz, üç artı yedi... Hadi öğrenelim!", visual: "makeN", target: 10, examples: [6, 8, 3, 7], note: "10'un arkadaşlarını bilmek, zihinden toplama için çok önemlidir." },
      { title: "Parça-Bütün Düşüncesi", text: "Her sayı farklı parçalardan oluşabilir. 8 = 5+3 = 4+4 = 6+2 = 7+1.", tts: "Sekiz: beş artı üç de olur, dört artı dört de! Bir sayı birçok yolla parçalanır.", visual: "numberBonds", examples: [{ whole: 8, parts: [[5,3], [4,4], [6,2]] }], note: "Aynı sayıyı farklı şekillerde parçalamak, toplama ve çıkarmayı birbirine bağlar." },
      { title: "İki El = On", text: "İki elini aç: toplam 10 parmak! Sol elde 5, sağ elde 5.", tts: "İki elini aç: on parmak!", visual: "makeN", target: 10, examples: [7, 4, 9], note: "İki elin toplamı 10 eder." },
      { title: "🚀 Şarj Tamamlandı!", text: "Yapı modülün aktif! 5'lik ve 10'luk enerji referansları, sayı bağları ve parça-bütün gücü yüklendi.", tts: "Aferin, yapı şarjı tamamlandı! Sayı bağları gücün yüklendi.", visual: "makeN", target: 10, examples: [6, 8, 3], note: "5 ve 10 referans noktaları, tüm görevlerin enerji çekirdeğidir." }
    ]
  },

  // KATEGORİ 4: İŞLEMLER — TOPLAMA
  level5_addition: {
    title: "⚡ Toplama Yakıtı", subtitle: "Birleştirme enerjisi yükle", icon: "⚡", color: "#f59e0b",
    steps: [
      { title: "Toplama Nedir?", text: "Toplama, iki grubu bir araya getirmektir. 3 + 4 = 7.", tts: "Toplama, iki grubu birleştirmek demek. Üç artı dört eşittir yedi!", visual: "additionLearn", a: 3, b: 4, note: "İki grubu bir araya getirme." },
      { title: "Yıldız Taşı Ekleyerek Topla", text: "3 yıldız taşın var, 4 tane daha ekle. Hepsini baştan say: 7!", tts: "Üç yıldız taşın var. Dört tane daha ekle ve hepsini say: yedi!", visual: "countAllLearn", a: 3, b: 4, note: "Hepsini sırayla saymak, toplamayı öğrenmenin ilk yoludur." },
      { title: "Sıfır Ekleme", text: "Bir sayıya 0 eklersen sayı değişmez! 5 + 0 = 5.", tts: "Beş artı sıfır eşittir beş. Sıfır eklemek sayıyı değiştirmez!", visual: "additionLearn", a: 5, b: 0, note: "Sıfır eklemek sayıyı değiştirmez!" },
      { title: "Büyükten Başla", text: "3 + 5 için büyük sayıdan başla: 5'ten başla, 3 ileri say: 6, 7, 8.", tts: "Büyükten başla: beşten başla, üç ileri say: altı, yedi, sekiz!", visual: "countOnLearn", start: 5, add: 3, note: "Büyük sayıdan devam etmek, toplamada önemli bir kısayoldur." },
      { title: "Yer Değiştirme: 3+5 = 5+3", text: "Toplamada sayıların yerini değiştirsen de sonuç aynıdır! 3 + 5 de 5 + 3 de 8 eder.", tts: "Üç artı beş de beş artı üç de sekiz eder!", visual: "commutativityLearn", a: 3, b: 5, note: "3+5 ile 5+3 aynı sonucu verir." },
      { title: "Çiftler: 3+3, 4+4, 5+5...", text: "Aynı sayının iki katını bilmek çok kolay: 2+2=4, 3+3=6, 4+4=8, 5+5=10.", tts: "Çiftler çok kolay! İki artı iki dört, üç artı üç altı. Aynı sayıyı iki kez topla!", visual: "doublesLearn", examples: [{ a: 3, b: 3 }, { a: 4, b: 4 }, { a: 5, b: 5 }], note: "Aynı sayıyı iki kez toplamak çok kolay!" },
      { title: "Yakın Çiftler: 6+7, 5+6...", text: "6 + 7 zor mu? 6 + 6 = 12 biliyorsan bir fazlası 13!", tts: "Altı artı yedi mi? Altı artı altı on iki, bir fazlası on üç!", visual: "doublesLearn", examples: [{ a: 6, b: 7 }, { a: 5, b: 6 }], note: "Bildiğin bir çiftten yola çıkarak yeni işlem türetebilirsin." },
      { title: "10'a Tamamla, Sonra Ekle", text: "8 + 5 zor mu? Önce 10'a tamamla! 8 + 2 = 10. Sonra kalan 3'ü ekle: 10 + 3 = 13.", tts: "Sekiz artı beş. Önce sekize iki ekle, on oldu! Sonra üçü ekle, on üç!", visual: "bridgingLearn", a: 8, b: 5, note: "10'a tamamla ve kalanı ekle." },
      { title: "10'a Tamamla: Başka Örnekler", text: "9 + 4: 9 + 1 = 10, 10 + 3 = 13. 7 + 6: 7 + 3 = 10, 10 + 3 = 13.", tts: "Dokuz artı dört. Dokuza bir ekle, on oldu! Sonra üç ekle, on üç!", visual: "bridgingLearn", a: 9, b: 4, note: "10'a tamamlama, 10'un arkadaşlarını bilmeye dayanır." },
      { title: "Toplama ve Çıkarma Kardeştir", text: "3 + 5 = 8 biliyorsan, 8 − 5 = 3 ve 8 − 3 = 5 de bilirsin!", tts: "Üç artı beş sekiz. Sekiz eksi beş üç!", visual: "inverseLearn", a: 3, b: 5, whole: 8, note: "Toplama bilirsen çıkarmayı da bilirsin!" },
      { title: "🚀 Şarj Tamamlandı!", text: "Toplama yakıtın dolu! Birleştirme, sayı bağları ve 10'a tamamlama stratejilerini yükledin.", tts: "Aferin, toplama yakıtı yüklendi! Artık toplama görevi için hazırsın.", visual: "progressionLearn", note: "Kavramsal enerji olmadan ezberleme kırılgan kalır." }
    ]
  },

  // KATEGORİ 4b: ÇIKARMA
  level5_subtraction: {
    title: "⚡ Çıkarma Yakıtı", subtitle: "Ayırma enerjisi yükle", icon: "⚡", color: "#ef4444",
    steps: [
      { title: "Çıkarma Nedir? Ayırma", text: "7 yıldız taşından 3 tanesini ayır. Geriye 4 kalır! 7 − 3 = 4.", tts: "Yedi yıldız taşından üçünü ayır: dört kalır!", visual: "subtractionLearn", total: 7, remove: 3, note: "Ayırma, en temel çıkarma yöntemidir." },
      { title: "Fark Bulma", text: "7 yıldız taşı ile 4 yıldız taşını yan yana koy. 7'de 3 tane fazla var → fark 3.", tts: "Yedi ile dört arasındaki fark üç!", visual: "differenceLearn", a: 7, b: 4, note: "İki enerji kapsülünü karşılaştır, farkı gör!" },
      { title: "Eksik Parça", text: "? + 4 = 7 → eksik parça kaçtır? Cevap 3!", tts: "Soru işareti artı dört eşittir yedi. Eksik sayı üç!", visual: "inverseLearn", a: 3, b: 4, whole: 7, note: "Eksik parçayı bulmak da bir çıkarmadır!" },
      { title: "Sıfır Çıkarma", text: "5 − 0 = 5. 5 − 5 = 0.", tts: "Beş eksi sıfır eşittir beş. Beş eksi beş eşittir sıfır!", visual: "subtractionLearn", total: 5, remove: 0, note: "Sıfır çıkarınca sayı değişmez, kendini çıkarınca sıfır kalır." },
      { title: "Yıldız Taşı Çıkar ve Say", text: "Enerji kapsülünde 7 yıldız taşı var. 3 tanesine dokun ve çıkar. Kalanları say: 4!", tts: "Yedi yıldız taşından üçünü çıkar, kalanları say: dört!", visual: "separatingLearn", total: 7, remove: 3, note: "Enerji kapsülünden yıldız taşı çıkar ve kalanları say!" },
      { title: "Geriye Doğru Sayma", text: "8 − 3: Sekizden başla, üç geriye → 7, 6, 5. Cevap 5!", tts: "Sekizden üç geriye doğru say: yedi, altı, beş!", visual: "backCount", start: 8, steps: 3, note: "Geriye sayma, çıkarılan küçükse en verimli stratejidir." },
      { title: "İleriye Sayma", text: "8 − 5: Beşten başla, sekize kadar say → 6, 7, 8. Üç adım attın, fark 3!", tts: "Beşten sekize ileriye say: altı, yedi, sekiz. Üç adım!", visual: "countUpLearn", from: 5, to: 8, note: "Küçük sayıdan büyüğe say — adım sayısı farkı verir!" },
      { title: "Toplama-Çıkarma Ters İlişkisi", text: "3 + 5 = 8 biliyorsan: 8 − 5 = 3 ve 8 − 3 = 5 de bilirsin!", tts: "Üç artı beş sekiz. Sekiz eksi beş üç!", visual: "inverseLearn", a: 3, b: 5, whole: 8, note: "Toplama bilirsen çıkarmayı da bilirsin!" },
      { title: "Çiftlerden Çıkarma", text: "4 + 4 = 8 biliyorsan → 8 − 4 = 4!", tts: "Dört artı dört sekiz. Sekiz eksi dört dört!", visual: "doublesLearn", examples: [{ a: 4, b: 4 }], note: "4+4=8 biliyorsan 8-4=4 de bilirsin!" },
      { title: "10'a Geri Köprüleme", text: "15 − 8 zor mu? Önce 10'a in: 15 − 5 = 10, sonra 10 − 3 = 7.", tts: "On beş eksi sekiz mi? Önce 10'a in, sonra kalanı çıkar: yedi!", visual: "bridgeBackLearn", minuend: 15, subtrahend: 8, note: "Önce 10'a in, sonra kalanı çıkar!" },
      { title: "🚀 Şarj Tamamlandı!", text: "Çıkarma yakıtın dolu! Ayırma, fark bulma ve geriye sayma stratejilerini yükledin.", tts: "Aferin, çıkarma yakıtı yüklendi! Göreve hazırsın.", visual: "subProgressionLearn", note: "Çıkarma ve toplama birbirinin aynasıdır." }
    ]
  },

  // KATEGORİ 4c: ÇARPMA
  level5_multiplication: {
    title: "⚡ Çarpma Reaktörü", subtitle: "Gruplama gücünü etkinleştir", icon: "⚡", color: "#9333ea",
    steps: [
      { title: "Eşit Grup Nedir?", text: "Masada 3 tabak var ve her tabakta 4 çilek var. Bunlara 'eşit gruplar' denir.", tts: "Üç tabak, her tabakta dört çilek. İşte eşit gruplar!", visual: "multiplyLearn", groups: 3, perGroup: 4, note: "Eşit grup yapısını tanımak çarpımsal düşüncenin çekirdeğidir." },
      { title: "Eşit Grupları Toplama", text: "3 tabakta 4'er çilek: 4 + 4 + 4 = 12. Buna 'tekrarlı toplama' denir.", tts: "Dört artı dört artı dört eşittir on iki. Buna tekrarlı toplama denir!", visual: "multiplyLearn", groups: 3, perGroup: 4, note: "Tekrarlı toplama, çarpmaya giden sezgisel yoldur." },
      { title: "Çarpma İşareti: ×", text: "4 + 4 + 4 yazmak yerine kısa yoldan 3 × 4 yazabiliriz. Sonuç: 12.", tts: "Üç çarpı dört, on iki.", visual: "multiplyLearn", groups: 3, perGroup: 4, note: "Çarpma tekrarlı toplamadan daha geniş bir kavramdır." },
      { title: "Atlayarak Sayma ile Çarpma", text: "5'er say: 5, 10, 15, 20, 25. Beşinci sayı = 5 × 5 = 25!", tts: "Beşer say: beş, on, on beş, yirmi, yirmi beş!", visual: "skipCountLearn", step: 5, count: 5, note: "Her adımda bir grup daha ekliyorsun!" },
      { title: "İkinin Katları", text: "2 × 7 = 7 + 7 = 14. Çiftleri zaten biliyorsun!", tts: "İki çarpı yedi: yedi artı yedi on dört!", visual: "multiplyLearn", groups: 2, perGroup: 7, note: "×2 çiftlerle doğrudan bağlantılıdır." },
      { title: "Beşler ve Onlar", text: "5 ile çarpmak için 5'er say. 10 ile çarpmak için sonuna sıfır ekle!", tts: "Beşer beşer say! 10 ile çarpmak çok kolay: sonuna sıfır ekle.", visual: "skipCountLearn", step: 10, count: 5, note: "x2, x5, x10 temel çarpma gerçekleridir." },
      { title: "Dizi Modeli: Satır ve Sütun", text: "3 satır, 4 sütun. Her satırda 4 → 3 × 4 = 12.", tts: "Üç satır, dört sütun: on iki!", visual: "arrayLearn", rows: 3, cols: 4, note: "Satır ve sütun düzeni çarpmanın yapısını gösterir." },
      { title: "Sıra Değiştirme", text: "3 × 4 = 4 × 3 = 12. Çarpanların yerini değiştirsen de sonuç aynı!", tts: "Üç çarpı dört on iki. Dört çarpı üç de on iki! Sonuç hep aynı.", visual: "arrayLearn", rows: 4, cols: 3, note: "3x4 ile 4x3 aynı olduğunu görmek için diziyi döndür!" },
      { title: "İkileme Stratejisi", text: "6 × 4: önce 6 × 2 = 12, sonra 12'nin iki katı = 24.", tts: "Altı çarpı dört: önce altı çarpı iki on iki, iki katı yirmi dört!", visual: "multiplyLearn", groups: 4, perGroup: 6, note: "Stratejileri anlamak kalıcı öğrenme sağlar." },
      { title: "Bir Grup Ekle veya Çıkar", text: "9 × 6: 10 × 6 = 60, bir 6'yı çıkar: 54.", tts: "Dokuz çarpı altı: on çarpı altı altmış, bir altı çıkar elli dört!", visual: "arrayLearn", rows: 9, cols: 3, note: "Bildiğin bir çarpımdan türet!" },
      { title: "🚀 Şarj Tamamlandı!", text: "Çarpma reaktörün aktif! Eşit gruplar, tekrarlı toplama ve dizi modeli gücün yüklendi.", tts: "Aferin, çarpma reaktörü aktif! Göreve hazırsın.", visual: "timesTableLearn", note: "Anlayarak yüklenen çarpma enerjisi kalıcıdır." }
    ]
  },

  // KATEGORİ 4d: BÖLME
  level5_division: {
    title: "⚡ Bölme Reaktörü", subtitle: "Paylaştırma gücünü etkinleştir", icon: "⚡", color: "#0891b2",
    steps: [
      { title: "Eşit Paylaşmak", text: "6 kurabiyeyi 2 arkadaşa eşit dağıt: herkes 3 tane alır! 6 ÷ 2 = 3.", tts: "Altı kurabiyeyi iki arkadaşa eşit dağıt. Herkes üç tane alır!", visual: "divisionLearn", total: 6, groups: 2, note: "Eşit paylaştırma, bölmenin temelidir!" },
      { title: "Birer Birer Dağıt", text: "12 şekeri 4 çocuğa birer birer dağıt: herkes 3 tane aldı! 12 ÷ 4 = 3.", tts: "On iki şekeri dört çocuğa birer birer dağıt. Herkes üç tane!", visual: "divisionLearn", total: 12, groups: 4, note: "Birer birer paylaştırma, bölmeyi öğrenmenin en doğal yoludur." },
      { title: "Eşit Gruplara Ayırmak", text: "12 yıldız taşını 3'erli gruplara ayır: 4 grup oldu! 12 ÷ 3 = 4.", tts: "On iki yıldız taşını üçerli gruplara ayır: dört grup!", visual: "groupingLearn", total: 12, groupSize: 3, note: "Kaç tane eşit grup yapabilirim?" },
      { title: "Paylaştır mı, Grupla mı?", text: "İki soru: '12 elmayı 3 çocuğa paylaştır' ve '12 elmayı 4'erli grupla'. İkisi de bölme!", tts: "Paylaştır: her biri kaç alır? Grupla: kaç grup olur? İkisi de bölme!", visual: "divisionLearn", total: 12, groups: 3, note: "Paylaşma ve gruplama — bölmenin iki farklı anlamı." },
      { title: "Yarıya Bölmek", text: "8'in yarısı 4 → 8 ÷ 2 = 4.", tts: "Sekizin yarısı dört!", visual: "halfDoubleLearn", examples: [4, 6, 8, 10], note: "Yarılama ve ikileme birbirinin tersidir." },
      { title: "İki Kat ve Yarım: Kardeş İşlemler", text: "4'ün iki katı 8, 8'in yarısı 4. Çarpma ve bölme hep birlikte!", tts: "Dördün iki katı sekiz. Sekizin yarısı dört.", visual: "halfDoubleLearn", examples: [6, 8, 10, 12], note: "×2 ailesi → ÷2 otomatik olarak gelir." },
      { title: "Çarpmayı Düşün!", text: "12 ÷ 3 = ? → '3 ile ne çarparsam 12 yaparım?' 3 × 4 = 12 → cevap 4!", tts: "On iki bölü üç: üç çarpı kaç on iki eder? Dört!", visual: "divisionLearn", total: 12, groups: 3, note: "Bölme gerçeklerinin anahtarı çarpma gerçekleridir." },
      { title: "Tekrarlı Çıkarma ile Bölme", text: "15 ÷ 3: 15'ten 3'er çıkar → 5 kez çıkardın. Cevap 5!", tts: "On beşten üçer üçer çıkar: beş kez! Cevap beş.", visual: "groupingLearn", total: 15, groupSize: 3, note: "Toplam bitene kadar çıkarmaya devam et." },
      { title: "Çarpma Ailesi: 4 Gerçek Bir Arada", text: "3x4=12 biliyorsan: 4x3=12, 12÷3=4, 12÷4=3 de bilirsin!", tts: "Üç çarpı dört on iki biliyorsan, on iki bölü üç de dört. Hepsi bir aile!", visual: "divisionLearn", total: 12, groups: 4, note: "Çarpma ve bölme birbirinin tersidir." },
      { title: "🚀 Şarj Tamamlandı!", text: "Bölme reaktörün aktif! Paylaştırma, gruplama ve çarpma ailesi gücün yüklendi.", tts: "Aferin, bölme reaktörü aktif! Göreve hazırsın.", visual: "groupingLearn", total: 12, groupSize: 4, note: "Bölme ve çarpma birbirinin aynasıdır." }
    ]
  },

  // KATEGORİ 5: İLİŞKİSEL DÜŞÜNME
  level6: {
    title: "⚡ Desen Şifresi", subtitle: "Gizli düzenleri çöz", icon: "⚡", color: "#0891b2",
    steps: [
      { title: "Her Sayı Parçalanabilir", text: "7 = 3+4 = 2+5. Buna 'parça-bütün' düşüncesi denir.", tts: "Yedi: üç artı dört de olur, iki artı beş de! Hadi parçalayalım.", visual: "partWholeLearn", whole: 7, examples: [[3, 4], [2, 5], [1, 6]], note: "Toplama ve çıkarma aynı sayı bağının iki yüzüdür." },
      { title: "Parçalardan Bütüne", text: "3 + 4 = 7 → parçaları bilirsen bütünü bulursun. 7 − 3 = 4 → bütünü bilirsen parçayı da.", tts: "Üç artı dört yedi. Yedi eksi üç dört.", visual: "partWholeLearn", whole: 7, examples: [[3, 4]], note: "Parça-bütün ilişkisi toplama ve çıkarmayı birbirine bağlar." },
      { title: "Eksik Sayı: Toplama", text: "5 + ? = 8 → cevap 3!", tts: "Beş artı ne eşittir sekiz? Cevap üç!", visual: "missingLearn", examples: [{ eq: "3 + ? = 7", answer: 4 }, { eq: "? + 5 = 9", answer: 4 }], note: "Eksik sayı bulma, cebir düşüncesinin başlangıcıdır." },
      { title: "Eksik Sayı: Çıkarma", text: "10 − ? = 6 → cevap 4!", tts: "On eksi ne eşittir altı? Cevap dört!", visual: "missingLearn", examples: [{ eq: "10 − ? = 6", answer: 4 }], note: "Eksik çıkan bulma, ters ilişkinin uygulamasıdır." },
      { title: "Fark Bulma", text: "8 ile 5 arasındaki fark: 5'ten 8'e 3 adım → fark 3.", tts: "Sekiz ile beş arasındaki fark üç!", visual: "differenceLearn", a: 8, b: 5, note: "Fark bulmak, iki sayı arasındaki mesafeyi ölçmektir." },
      { title: "Sayı Doğrusunda Fark", text: "5'ten 8'e kaç adım? 6, 7, 8 — 3 adım!", tts: "Beşten sekize: altı, yedi, sekiz — üç adım!", visual: "numberLineDiffLearn", from: 5, to: 8, range: [0, 10], note: "Enerji kapsülünde farkı görmek." },
      { title: "Tahmin Etme", text: "Enerji kapsülündeki yıldız taşlarına bakarak miktarı tahmin et. Saymadan, sadece bakarak!", tts: "Beşten az mı, fazla mı? Hadi tahmin et!", visual: "estimateLearn", examples: [3, 7, 11, 5], note: "Yaklaşık olarak nerede olduğunu tahmin et!" },
      { title: "Sayı Doğrusunda Tahmin", text: "Uzun enerji kapsülü büyük sayı, kısa enerji kapsülü küçük sayı.", tts: "Ortadaysa beş civarı!", visual: "numberLine", range: [0, 10], note: "Sayı doğrusunda doğru yeri bul!" },
      { title: "🚀 Şarj Tamamlandı!", text: "Desen şifrelerin çözüldü! Parça-bütün, eksik sayı ve tahmin gücün yüklendi.", tts: "Aferin, desen şifresi çözüldü! Göreve hazırsın.", visual: "numberLine", range: [0, 10], note: "İlişkisel düşünme sensörü, problem çözmenin anahtarıdır." }
    ]
  },

  // KATEGORİ 6: ZİHİNSEL BECERİLER
  level7: {
    title: "⚡ Şimşek Şarjı", subtitle: "Hızlı tanıma gücünü yükle", icon: "⚡", color: "#c026d3",
    steps: [
      { title: "Bir Bakışta Tanıma", text: "Küçük miktarları bir bakışta tanımaya 'sanbil' denir. Saymadan, sadece bakarak kaç tane olduğunu bil!", tts: "Kısa süre bak ve saymadan kaç tane olduğunu söyle! Hadi dene.", visual: "subitizingLearn", examples: [2, 3, 4], note: "Sanbil: 1-4 arası miktarları saymadan tanıma." },
      { title: "Gruplar Halinde Tanıma", text: "7 yıldız taşını '5 ve 2' olarak görürsen hemen tanırsın!", tts: "Yediyi beş ve iki olarak gör!", visual: "subitizingLearn", examples: [5, 6, 7, 8], note: "Parçaları ayrı ayrı tanı, sonra birleştir." },
      { title: "Renk Gruplaması", text: "5 mavi + kırmızılar düzeni hafızana yardımcı olur.", tts: "Beş mavi artı üç kırmızı: sekiz!", visual: "memoryLearn", count: 8, note: "Renkleri kullanarak sayıları daha kolay hatırla!" },
      { title: "Parmak Stratejisi", text: "Bir elde 5, iki elde 10 parmak var. 8 = bir el + 3 parmak daha.", tts: "Bir el beş parmak! Sekiz yapmak için üç parmak daha aç.", visual: "memoryLearn", count: 8, note: "Parmaklarınla say!" },
      { title: "5 Referans Noktası", text: "3 → '5'ten 2 eksik'. 7 → '5 ve 2 fazla'.", tts: "Üç: beşten iki eksik. Yedi: beş ve iki fazla.", visual: "refPointLearn", examples: [{ num: 3, ref: "5'ten 2 eksik" }, { num: 7, ref: "5 ve 2 fazla" }, { num: 5, ref: "Tam 5" }], note: "5 ve 10 referans sistemi." },
      { title: "10 Referans Noktası", text: "9 → '10'dan 1 eksik'. 6 → '10'a 4 eksik'.", tts: "Dokuz, ondan sadece bir eksik! Ona çok yakın.", visual: "refPointLearn", examples: [{ num: 9, ref: "10'dan 1 eksik" }, { num: 6, ref: "10'a 4 eksik" }, { num: 8, ref: "10'a 2 eksik" }], note: "10'a göre düşünme." },
      { title: "Geriye Doğru Sayma Stratejisi", text: "9 − 2: dokuzdan iki geri → 8, 7. Cevap 7!", tts: "Dokuz eksi iki: sekiz, yedi!", visual: "backCountLearn", from: 9, note: "Geriye sayma, çıkarılan küçükse en verimlidir." },
      { title: "Doğru Stratejiyi Seç", text: "5+5 → çiftler! 9+4 → 10'a tamamla! 8−2 → geriye say!", tts: "Her soru için en kolay yolu seç!", visual: "refPointLearn", examples: [{ num: 5, ref: "Çiftler: 5+5=10" }, { num: 9, ref: "10'a tamamla" }], note: "Aynı soruyu birden fazla yolla çözebilirsin!" },
      { title: "🚀 Şarj Tamamlandı!", text: "Şimşek sensörlerin aktif! Sanbil, referans noktaları ve strateji seçme gücün yüklendi.", tts: "Aferin, şimşek şarjı tamamlandı! Artık çok hızlısın.", visual: "refPointLearn", note: "Esnek düşünme, tek bir yönteme bağlı kalmaktan çok daha güçlüdür." }
    ]
  },

  // KATEGORİ 7: BASAMAK DEĞERİ
  level4: {
    title: "⚡ Katman Şarjı", subtitle: "Basamak enerjisini haritalandır", icon: "⚡", color: "#b45309",
    steps: [
      { title: "10 Özel Bir Sayıdır", text: "Sayı sistemimiz 10'a dayanır! 9'dan sonra yeni bir basamak başlar: 10.", tts: "On çok özel bir sayıdır! Sayı sistemimiz ona dayanır.", visual: "bundleLearn", count: 10, note: "Sayı sistemi 10'luk gruplara dayanır." },
      { title: "10 Birlik = 1 Onluk", text: "10 tane birliği bir araya getirince bir 'onluk' oluşur. 10 birlik = 1 onluk.", tts: "On tane birliği grupla ve bir onluk yap! Hadi deneyelim.", visual: "bundleLearn", count: 10, note: "10 birlik = 1 onluk." },
      { title: "Grubu Grup Olarak Gör", text: "10 yıldız taşını tek tek saymak yerine bir grup olarak gör: '1 onluk'.", tts: "On yıldız taşını tek tek sayma, bir grup olarak gör: bir onluk!", visual: "rodBundleLearn", examples: [10, 20, 30], note: "10 yıldız taşını tek tek saymak yerine bir grup olarak görmek önemlidir." },
      { title: "Enerji Kapsülü ile Onluk", text: "DokunSay enerji kapsülünde 10 yıldız taşı = bir onluk.", tts: "On yıldız taşı: tam bir onluk!", visual: "pvRodLearn", examples: [13, 27, 35], note: "Enerji kapsülleri birleştirilebilir ve ayrılabilir." },
      { title: "Onluk ve Birlik", text: "14 = 1 onluk + 4 birlik. 23 = 2 onluk + 3 birlik.", tts: "On dört: bir onluk, dört birlik!", visual: "decomposeLearn", examples: [{ num: 14, tens: 1, ones: 4 }, { num: 23, tens: 2, ones: 3 }, { num: 45, tens: 4, ones: 5 }], note: "Soldaki rakam onlukları, sağdaki rakam birlikleri gösterir." },
      { title: "Dikkat: Rakamın Gerçek Değeri", text: "35'teki '3' aslında 30 değerindedir! '5' ise 5. Yani 35 = 30 + 5.", tts: "Otuz beşteki üç aslında otuz değerinde! Buna basamak değeri denir.", visual: "decomposeLearn", examples: [{ num: 35, tens: 3, ones: 5 }, { num: 68, tens: 6, ones: 8 }], note: "35'teki 3, üç nesne değil üç onluk demektir." },
      { title: "Parçalardan Sayı Oluştur", text: "3 onluk + 6 birlik = 36.", tts: "Üç onluk artı altı birlik: otuz altı!", visual: "composeLearn", examples: [{ tens: 1, ones: 7 }, { tens: 3, ones: 2 }, { tens: 5, ones: 0 }], note: "Çocuklar 0 birliğini de anlamalı." },
      { title: "Genişletilmiş Gösterim", text: "56 = 50 + 6. 70 = 70 + 0.", tts: "Elli altı eşittir elli artı altı!", visual: "expandLearn", examples: [{ num: 18, expanded: "10 + 8" }, { num: 34, expanded: "30 + 4" }, { num: 70, expanded: "70 + 0" }], note: "35 = 30 + 5 yazılışı basamak değerini anlamaya yardımcı olur." },
      { title: "Esnek Parçalama", text: "53 = 5 onluk + 3 birlik. Ama 4 onluk + 13 birlik de olur! Bir onluğu 10 birliğe açtık.", tts: "Elli üç: beş onluk ve üç birlik. Ama dört onluk ve on üç birlik de olabilir!", visual: "flexDecomposeLearn", examples: [{ num: 53, standard: "5O + 3B", nonStandard: "4O + 13B" }, { num: 42, standard: "4O + 2B", nonStandard: "3O + 12B" }], note: "Bir onluğu 10 birliğe açabilmek, çıkarmada çok işe yarar." },
      { title: "Ritmik Saymalar", text: "10'ar: 10, 20, 30, 40, 50... 5'er: 5, 10, 15, 20, 25...", tts: "Onar onar say: on, yirmi, otuz, kırk, elli!", visual: "rhythmicCountLearn", step: 10, count: 5, note: "Ritmik sayma, onluk yapısını pekiştirir." },
      { title: "🚀 Şarj Tamamlandı!", text: "Katman şarjın tamamlandı! Onluk, birlik ve basamak değeri gücün yüklendi.", tts: "Aferin, katman şarjı tamamlandı! Basamak değeri gücün yüklendi.", visual: "rhythmicCountLearn", step: 10, count: 5, note: "Basamak değeri enerjisi, çok basamaklı görevlerin temel yakıtıdır." }
    ]
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// KÜRTÇE (KURMANCÎ) NAVEROKÊ FÊRBÛNÊ
// Referans: Ferhenga Matematikê, Prof. Dr. Yılmaz MUTLU
// Têgehên matematîkî: HEJMAR, KIRARÎ, PARJIMAR, CÎYOMETRÎ, PÎVANDIN
// ═══════════════════════════════════════════════════════════════════════════

export const LEARN_CONTENT_KU = {
  // KATEGORİ 1: NASKIRINA HEJMARAN — Têgehên bingehîn, hevsankirina yekeyê, kardinalîte
  level1: {
    title: "⚡ Şarjkirina Jimartinê",
    subtitle: "Ji bo jimartina kevirên stêrkan enerjiyê bar bike",
    icon: "⚡",
    color: "#16a34a",
    steps: [
      { title: "Kapsulê Enerjiyê Çi Ye?", text: "Li ser kapsulê enerjiyê kevirên stêrkan yên rengîn hene. Her kevirekî stêrkan tiştekî nîşan dide. Bi tiliya xwe li kevirên stêrkan dest bide, bihejmêre û hîn bibe!", tts: "Di kapsulê enerjiyê de kevirên stêrkan yên rengîn hene. Bi destdayînê hejmaran hîn bibe!", visual: "rod", rodCount: 5, note: "Jimartina bi destdayînê têgeha hejmaran somut dike." },
      { title: "Yek bi Yek Jimartin", text: "Dema ku dihejmêrî li her kevirekî stêrkan bi tiliya xwe dest bide û hejmarekê bibêje: yek, du, sê, çar... Li her yekî tenê carekê dest bide! Bê bazdanê û bê dubarekirinê bihejmêre.", tts: "Li her kevirekî stêrkan dest bide û hejmarekê bibêje: yek, du, sê... Ti yekî nebazde!", visual: "counting", countTo: 5, note: "Ji her tiştî re hejmarek tê. Ji vê re 'hevsankirina yekeyê' tê gotin." },
      { title: "Hejmar Her Dem Di Heman Rêzê De Ne", text: "Hejmar her dem di heman rêzê de tên gotin: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10. Ev rêz tu caran naguhere! Sêv jî bihejmêrî kevirên stêrkan jî ev rêz ew yek e.", tts: "Hejmar her dem di heman rêzê de tên gotin: yek, du, sê, çar, pênc... Ev rêz tu caran naguhere!", visual: "counting", countTo: 10, note: "Hejmar her dem di rêza yek de tên gotin. Ji vê rêzikê re 'rêza sabît' tê gotin." },
      { title: "Hejmara Dawî = Giştî", text: "Te bi destdayînê li kevirên stêrkan 1, 2, 3, 4 got. Hejmara herî dawî '4' — ev hejmara giştî ya kevirên stêrkan nîşan dide! Dema bê pirsîn 'Çend kevirên stêrkan hene?' gotina '4' bes e.", tts: "Hejmara herî dawî ya ku gotî giştî nîşan dide. Eger te çar hejmartibe, giştî çar e!", visual: "counting", countTo: 4, note: "Hejmara herî dawî ya ku tê gotin hejmara giştî ya di komê de nîşan dide." },
      { title: "Ji Ku Dest Pê Bikî", text: "Kevirên stêrkan ji çepê ber bi rastê bihejmêre an jî ji rastê ber bi çepê — encam her dem yek e! Cihê destpêkê cuda be jî giştî naguhere. Ya girîng ew e ku li her kevirî carekê dest bidî.", tts: "Ji çepê bihejmêre an ji rastê — encam yek e! Giştî naguhere.", visual: "counting", countTo: 6, note: "Ji ku dest pê bikî, hejmara giştî her dem yek dimîne." },
      { title: "Rêzika Du Rengan", text: "Di kapsulê de 5 kevirên stêrkan yên yekem şîn in, yên piştî wê sor in. Dema 5 kevirên şîn dibînî bê jimartin zû 'pênc' bibêje! Paşê yên sor bihejmêre û zêde bike. Mînak: 5 şîn + 2 sor = 7.", tts: "Pêncî kevirên stêrkan yên yekem şîn in, yên piştî wê sor in! Pêncî zû nas bike, yên sor zêde bike.", visual: "twoColor", examples: [3, 5, 7, 9], note: "Naskirina 5'an bi çavan rêyek pir bihêz e ji bo zêdekirinê." },
      { title: "Sê Nîşandanên Hejmarê", text: "Her hejmar bi sê awayên cuda tê nîşandan: Wekî tişt di kapsulê de, Wekî sembol jimareya nivîskî û Wekî peyv navê dengî. 5 kevirên stêrkan (tişt), '5' (sembol) û 'pênc' (peyv) — her sê heman hejmarê vedibêjin!", tts: "Her hejmarê sê nîşandan hene: tişt, sembol û peyv. Pênc kevirên stêrkan bibîne, jimareya pênc bixwîne, pênc bibêje!", visual: "tripleCodeLearn", examples: [{ n: 3, chips: 3, symbol: "3", word: "sê" }, { n: 5, chips: 5, symbol: "5", word: "pênc" }, { n: 8, chips: 8, symbol: "8", word: "heşt" }], note: "Tişt (mîqdar), Sembol (jimare) û Peyv (nav): Sê nîşandanên cuda yên heman hejmarê." },
      { title: "Yek Zêde, Yek Kêm", text: "Li kapsulê 5 kevirên stêrkan binêre — li ser her yekî hejmara rêzê heye. Beriya 5'an 4 e, piştî 5'an 6 e. Kevirên stêrkan yên kesk rêzê nîşan didin. Her hejmarê cîranekî heye!", tts: "Beriya pêncan çar e, piştî pêncan şeş e! Kevirên stêrkan yên kesk rêzê nîşan didin.", visual: "successorPredecessor", rodCount: 5, note: "Zêdekirina an derxistina kevirekî stêrkan gavê yekem ê fêrbûna zêdekirin û kemkirinê ye." },
      { title: "Tavilzanîn: Bê Jimartin Naskirin", text: "Tu dizarê li xalan bê jimartin dizanî çend heb in! Naskirin bi nêrînekê ya mîqdarên biçûk ji 'tavilzanîn' re tê gotin. 1, 2, 3 û 4 kevirên stêrkan yên kapsulê bê jimartin naskirinê biceribîne!", tts: "Li kevirên stêrkan demek kurt binêre û zû bibêje çend heb in! Ji vê re tavilzanîn tê gotin.", visual: "subitizing", examples: [2, 3, 4, 5], note: "Mîqdarên biçûk bê jimartin bi nêrînek nas bike!" },
      { title: "Parastina Hejmarê", text: "5 kevirên stêrkan li kêleka hev rûne, paşê bi navbêran rûne. Rêzkirin guherî lê hejmar hîn jî 5 e! Rêzkirina tiştan biguhere jî hejmar naguhere. Hejmar bi şeklê girêdayî nîne.", tts: "Rêzkirin guherî lê hejmar ew yek ma! Pênc kevirên stêrkan, çawa rêz bikî hîn jî pênc in.", visual: "conservation", count: 5, note: "Cihê tiştan an şeklê wan biguhere jî hejmara giştî ew yek dimîne." },
      { title: "🚀 Şarjkirin Qediya!", text: "Enerjiya jimartinê bi tevahî bar bû! Jimartina yek bi yek, ku hejmara dawî giştî nîşan dide û rêzika du rengan bar kirine. Gemî amade ye, dest bi berhevkirina kevirên stêrkan bike!", tts: "Şarjkirina enerjiyê qediya! Hêza jimartinê bar bû, tu ji bo peywirê amade yî!", visual: "rod", rodCount: 10, note: "Her modulê enerjiyê yê bar bûyî, bingeha peywira pêş e." }
    ]
  },

  // KATEGORİ 2: TÊKILIYÊN HEJMARAN — Berhevkirin, rêzkirin, jimêrxêz
  level2: {
    title: "⚡ Şarjkirina Dengê",
    subtitle: "Enerjiya berhevkirinê kalibre bike",
    icon: "⚡",
    color: "#93c5fd",
    steps: [
      { title: "Du Koman Berhev Bike", text: "Du komên kevirên stêrkan berhev bike bi rûniştina wan a li binê hev. Her kevirekî stêrkan yek bi yek hevsanî bike. Li kîjan aliyê bê hevsanî bimîne kevirên stêrkan zêdetir hene!", tts: "Du koman li kêleka hev rûne. Her kevirê yek bi yek hevsanî bike. Yên bê hevsanî zêdeyî ne!", visual: "compare", pairs: [{ a: 3, b: 5, answer: "5 > 3 → 2 zêde" }, { a: 4, b: 4, answer: "4 = 4 → wekhev" }], note: "Kapsulên enerjiyê li binê hev rûne — kîjan dirêjtir be ew zêdetir e!" },
      { title: "Kêmtir, Wekhev, Zêdetir", text: "Dema du mîqdaran berhev dikî sê encam dibe: kêmtir, wekhev an zêdetir. 3 kevirên stêrkan bi 5 kevirên stêrkan: 3 kêmtir e, 5 zêdetir e. 4 kevirên stêrkan bi 4: wekhev!", tts: "Sê encam hene: kêmtir, wekhev, zêdetir!", visual: "lessMoreEqual", examples: [{ a: 2, b: 5, result: "kêm" }, { a: 4, b: 4, result: "wekhev" }, { a: 7, b: 3, result: "zêde" }], note: "Kêmtir, wekhev, zêdetir — sê encamên berhevkirinê." },
      { title: "Hejmara Mezin, Kapsulê Dirêj", text: "Her ku hejmar mezin dibe kapsul jî dirêj dibe. Kapsulê 3 kevirî kurt e, kapsulê 8 kevirî dirêj e. Bi berhevkirina dirêjahiya kapsulên tu dikarî bibînî kîjan hejmar mezintir e.", tts: "Kapsulê hejmara mezin dirêjtir e! Sê kurt e, heşt dirêj e.", visual: "compare", pairs: [{ a: 3, b: 8, answer: "8 > 3" }], note: "Kapsulê dirêj = hejmara mezin." },
      { title: "Jimare bi Mîqdarê Hevsankirin", text: "Dema jimareyekê dibînî divê bizanî ew çend tiştan nîşan dide. 5 kevirên stêrkan bihejmêre, paşê karta '5' bibîne û hevsanî bike! Jimare û mîqdar her dem bi hev re diçin.", tts: "Kevirên stêrkan bihejmêre û jimareya rast bibîne. Jimare û mîqdar heval in!", visual: "matching", examples: [{ num: 3, desc: "3 kevirên stêrkan → jimareya 3" }, { num: 7, desc: "7 kevirên stêrkan → jimareya 7" }], note: "Kevirên stêrkan bihejmêre, jimareya rast bibîne û hevsanî bike!" },
      { title: "Ji Biçûk Heta Mezin Rêzkirin", text: "Ji bo rêzkirina hejmaran ya herî biçûk bibîne û bide pêş. Paşê ji yên mayî ya herî biçûk hilbijêre. 5, 2, 8, 1 → rêzkirî: 1, 2, 5, 8.", tts: "Ya herî biçûk bibîne û bide pêş. Paşê ya herî biçûk hilbijêre!", visual: "ordering", numbers: [5, 2, 8, 1], note: "Ya herî biçûk bibîne, bide pêş, ji yên mayî bidomîne." },
      { title: "Ji Mezin Heta Biçûk Rêzkirin", text: "Berevajiyê jî dikarî bikî! Ya herî mezin bide pêş, paşê ya duyem herî mezin hilbijêre. 3, 7, 1, 9 → ji mezin heta biçûk: 9, 7, 3, 1.", tts: "Ya herî mezin bide pêş: neh, heft, sê, yek!", visual: "ordering", numbers: [3, 7, 1, 9], note: "Hem ji biçûk heta mezin hem ji mezin heta biçûk rêzkirin girîng e." },
      { title: "Yek Berê û Yek Piştê", text: "Her hejmarê beriya wê û piştî wê yek heye. Beriya 5'an 4 tê, piştî 5'an 6 tê. Hejmara piştê yek zêdetir e, ya berê yek kêmtir e.", tts: "Her hejmarê du cîranên wê hene. Ya berê yek kêmtir, ya piştê yek zêdetir e!", visual: "beforeAfter", examples: [{ num: 4, before: 3, after: 5 }, { num: 7, before: 6, after: 8 }], note: "Zanîna hejmarên cîran, ji bo zêdekirin û kemkirinê amadekar e." },
      { title: "Di Navbêrê de Kîjan Hejmar Heye?", text: "Di navbera 3 û 5 de kîjan hejmar heye? 4! Di navbera her du hejmarên cîran de tam hejmarek heye. Di navbera 6 û 8 de? 7!", tts: "Di navbera sê û pêncê de çi heye? Çar! Di navbera şeş û heştê de? Heft!", visual: "beforeAfter", examples: [{ num: 4, before: 3, after: 5 }], note: "Di navbera 3 û 5 de 4, di navbera 6 û 8 de 7 heye." },
      { title: "Jimêrxêz", text: "Hejmaran li ser xêzekê bifikire: ber bi çepê biçûk dibin, ber bi rastê mezin dibin. Ji vê xêzê re 'jimêrxêz' tê gotin. Hejmarên nêzîk li kêleka hev radiwestin.", tts: "Di hiş de jimêrxêzek xeyal bike. Çep biçûk e, rast mezin e!", visual: "numberLine", range: [0, 10], note: "Çep biçûk e, rast mezin e — hejmar li ser kapsulê rêz dibin." },
      { title: "🚀 Şarjkirin Qediya!", text: "Hêzikên dengê te hatin kalibre kirin! Berhevkirin, rêzkirin û enerjiya jimêrxêzê hat barkirin.", tts: "Şarjkirina dengê qediya! Hêza berhevkirinê bar bû, ji bo peywirê amade yî!", visual: "numberLine", range: [0, 10], note: "Hêzikên berhevkirinê bingeha hemû peywirên galaksiyê ne." }
    ]
  },

  // KATEGORİ 3: AVAHIYA HEJMARAN
  level3: {
    title: "⚡ Şarjkirina Avahiyê", subtitle: "Hêza girêdanên hejmaran vekin", icon: "⚡", color: "#ea580c",
    steps: [
      { title: "Hejmaran Wekî Parçeyan Bibîne", text: "Li şûna jimartina yek bi yek, dîtina hejmaran wekî parçeyên biçûk zûtir e. 7'yan bifikire: dîtina wekî '5 û 2' ji jimartina yek bi yek pir hêsantir e!", tts: "Heftê wekî pênc û du bifikire.", visual: "fiveRef", examples: [{ n: 3, desc: "3 = komek" }, { n: 7, desc: "7 = 5 + 2" }, { n: 9, desc: "9 = 5 + 4" }], note: "Dîtina hejmaran wekî parçeyan gavê yekem e ji şêwaza jimartina yek bi yek." },
      { title: "5 Hejmareke Girîng E", text: "5 hejmareke pir girîng e ji ber ku hejmara tiliyên destekî ye!", tts: "Pênc, hejmara tiliyên destekî ye!", visual: "fiveRef", examples: [{ n: 2, desc: "ji 5'an 3 kêm" }, { n: 5, desc: "Tam 5 — destek" }, { n: 8, desc: "5 û 3 zêde" }], note: "5 û 10 'hejmarên referansa krîtîk' in." },
      { title: "Girêdanên Hejmaran heta 5", text: "Zanîna parçeyên 5'an pir bi kar tê: 1+4=5, 2+3=5, 0+5=5.", tts: "Girêdanên hejmaran yên pêncê: yek zêde çar, du zêde sê.", visual: "makeN", target: 5, examples: [2, 3, 4, 1], note: "Girêdanên hejmaran: Zanîna cotên parçeyan yên ku hejmarekê çêdikin kirariyên zûtir dike." },
      { title: "Hevalên 10'an", text: "Cotên hejmaran yên ku 10 çêdikin ji ber bike! 1+9, 2+8, 3+7, 4+6, 5+5.", tts: "Hevalên dehan: yek zêde neh, du zêde heşt, sê zêde heft... Hemûyan hîn bibî!", visual: "makeN", target: 10, examples: [6, 8, 3, 7], note: "Zanîna hevalên 10'an ji bo jimartina zikrî pir girîng e." },
      { title: "Ramana Parçe-Giştî", text: "Her hejmar ji parçeyên cuda dikare çêbibe. 8 = 5+3 = 4+4 = 6+2 = 7+1.", tts: "Heşt: pênc zêde sê jî dibe, çar zêde çar jî! Hejmar bi çend rêyan dikare bê parçekirin.", visual: "numberBonds", examples: [{ whole: 8, parts: [[5,3], [4,4], [6,2]] }], note: "Parçekirina heman hejmarê bi awayên cuda, zêdekirin û kemkirinê bi hev re girê dide." },
      { title: "🚀 Şarjkirin Qediya!", text: "Modula avahiyê çalak e! Referansên enerjiyê yên 5 û 10, girêdanên hejmaran û hêza parçe-giştî hat barkirin.", tts: "Şarjkirina avahiyê qediya!", visual: "makeN", target: 10, examples: [6, 8, 3], note: "Xalên referansa 5 û 10, bingeha enerjiyê ya hemû peywiran in." }
    ]
  },

  // KATEGORİ 4: KIRARÎ — ZÊDEKIRIN
  level5_addition: {
    title: "⚡ Sotemeniya Zêdekirinê", subtitle: "Enerjiya yekkirinê bar bike", icon: "⚡", color: "#f59e0b",
    steps: [
      { title: "Zêdekirin Çi Ye?", text: "Zêdekirin, anîna du koman li yek e. 3 + 4 = 7.", tts: "Zêdekirin, yekkirina du koman e. Sê zêde çar wekhev heft!", visual: "additionLearn", a: 3, b: 4, note: "Yekkirina du koman." },
      { title: "Bi Zêdekirina Kevirên Stêrkan Zêde Bike", text: "3 kevirên stêrkan yên te hene. 4 hên din zêde bike. Hemûyan bihejmêre: 7!", tts: "Sê kevirên stêrkan yên te hene. Çar hên din zêde bike. Ji destpêkê bihejmêre: heft!", visual: "countAllLearn", a: 3, b: 4, note: "Jimartina hemûyan bi rêzê gavê yekem ê fêrbûna zêdekirinê ye." },
      { title: "Sifir Zêdekirin", text: "Li hejmarekê sifir zêde bikî hejmar naguhere! 5 + 0 = 5.", tts: "Pênc zêde sifir wekhev pênc e.", visual: "additionLearn", a: 5, b: 0, note: "Zêdekirina sifir hejmarê naguherîne!" },
      { title: "Ji Mezin Dest Pê Bike", text: "3 + 5 ji bo hejmara mezin dest pê bike: ji 5'an dest pê bike, 3 ber bi pêş bihejmêre: 6, 7, 8.", tts: "Ji mezin dest pê bike: ji pêncan dest pê bike, sê ber bi pêş bihejmêre: şeş, heft, heşt!", visual: "countOnLearn", start: 5, add: 3, note: "Destpêkirina ji hejmara mezin kurtereyek girîng e di zêdekirinê de." },
      { title: "Guheztina Cihan: 3+5 = 5+3", text: "Di zêdekirinê de cihên hejmaran biguherînî jî encam yek e!", tts: "Sê zêde pênc jî pênc zêde sê jî heşt e!", visual: "commutativityLearn", a: 3, b: 5, note: "3+5 bi 5+3 heman encamê dide." },
      { title: "Ducar: 3+3, 4+4, 5+5...", text: "Zanîna du carê heman hejmarê pir hêsan e: 2+2=4, 3+3=6, 4+4=8, 5+5=10.", tts: "Ducar pir hêsan e! Du zêde du çar, sê zêde sê şeş. Heman hejmarê du car zêde bike!", visual: "doublesLearn", examples: [{ a: 3, b: 3 }, { a: 4, b: 4 }, { a: 5, b: 5 }], note: "Heman hejmarê du car zêdekirin pir hêsan e!" },
      { title: "10'an Temam Bike, Paşê Zêde Bike", text: "8 + 5 zehmet e? Pêşî 10'an temam bike! 8 + 2 = 10. Paşê 3'yê mayî zêde bike: 10 + 3 = 13.", tts: "Heşt zêde pênc. Pêşî ji heştê du zêde bike, deh bû! Paşê sêyê zêde bike, sêzde!", visual: "bridgingLearn", a: 8, b: 5, note: "10'an temam bike û bermayiyê zêde bike." },
      { title: "🚀 Şarjkirin Qediya!", text: "Sotemeniya zêdekirinê tije ye! Yekkirinê, zêdekirinê, girêdanên hejmaran û stratejiya temamkirina 10'an bar kirine.", tts: "Sotemeniya zêdekirinê hat barkirin!", visual: "progressionLearn", note: "Bê enerjiya têgihîştinî ezberata sist dimîne." }
    ]
  },

  // KATEGORİ 4b: KEMKIRIN
  level5_subtraction: {
    title: "⚡ Sotemeniya Kemkirinê", subtitle: "Enerjiya veqetandinê bar bike", icon: "⚡", color: "#ef4444",
    steps: [
      { title: "Kemkirin Çi Ye? Veqetandin", text: "Ji 7 kevirên stêrkan 3 heb derxe. 7 − 3 = 4.", tts: "Ji heft kevirên stêrkan sê heb derxe: çar dimîne!", visual: "subtractionLearn", total: 7, remove: 3, note: "Veqetandin, rêbaza herî bingehîn a kemkirinê ye." },
      { title: "Dîtina Ferqê", text: "7 kevirên stêrkan bi 4 kevirên stêrkan li kêleka hev rûne. Di 7'yan de 3 heb zêde hene → ferq 3 e.", tts: "Di navbera heft û çaran de ferq sê ye!", visual: "differenceLearn", a: 7, b: 4, note: "Du kapsulên enerjiyê berhev bike, ferqê bibîne!" },
      { title: "Parçeya Kêm", text: "? + 4 = 7 → parçeya kêm çend e? Bersiv 3 e.", tts: "Pirsmark zêde çar wekhev heft e. Hejmara kêm sê ye!", visual: "inverseLearn", a: 3, b: 4, whole: 7, note: "Dîtina parçeya kêm jî kemkirinek e!" },
      { title: "Ber Bi Paş Jimartin", text: "8 − 3: Ji heştê dest pê bike, sê ber bi paş → 7, 6, 5. Bersiv 5 e!", tts: "Ji heştê sê ber bi paş bihejmêre: heft, şeş, pênc!", visual: "backCount", start: 8, steps: 3, note: "Jimartina ber bi paş, dema ku bermayî biçûk e stratejiya herî bi bandor e." },
      { title: "Zêdekirin û Kemkirin Xwişk û Bira Ne", text: "3 + 5 = 8 dizanî: 8 − 5 = 3 û 8 − 3 = 5 jî dizanî!", tts: "Sê zêde pênc heşt e. Heşt kemker pênc sê ye!", visual: "inverseLearn", a: 3, b: 5, whole: 8, note: "Zêdekirinê bizanî kemkirinê jî dizanî!" },
      { title: "🚀 Şarjkirin Qediya!", text: "Sotemeniya kemkirinê tije ye!", tts: "Sotemeniya kemkirinê hat barkirin!", visual: "subProgressionLearn", note: "Kemkirin û zêdekirin neynika hev in." }
    ]
  },

  // KATEGORİ 4c: CARKIRIN
  level5_multiplication: {
    title: "⚡ Reaktora Carkirinê", subtitle: "Hêza komdarkirinê çalak bike", icon: "⚡", color: "#9333ea",
    steps: [
      { title: "Koma Wekhev Çi Ye?", text: "Li ser masê 3 teştên hene û di her teştê de 4 tûtik hene. Ji van re 'komên wekhev' tê gotin.", tts: "Sê teşt, di her teştê de çar tûtik!", visual: "multiplyLearn", groups: 3, perGroup: 4, note: "Naskirina avahiya koma wekhev bingeha ramana carkirinê ye." },
      { title: "Zêdekirina Dubare", text: "Di 3 teştan de 4'an: 4 + 4 + 4 = 12. Ji vê re 'zêdekirina dubare' tê gotin.", tts: "Çar zêde çar zêde çar wekhev dwazde ye.", visual: "multiplyLearn", groups: 3, perGroup: 4, note: "Zêdekirina dubare rêya sezgiyî ya ber bi carkirinê ye." },
      { title: "Nîşana Carkirinê: ×", text: "Li şûna nivîsandina 4 + 4 + 4 dikarin bi kurterê 3 × 4 binivîsin. Encam: 12.", tts: "Sê carîn çar, dwazde.", visual: "multiplyLearn", groups: 3, perGroup: 4, note: "Carkirin ji zêdekirina dubare têgeheke berfirehtir e." },
      { title: "Jimartina Rîtmîk bi Carkirinê", text: "5'an 5'an bihejmêre: 5, 10, 15, 20, 25. Hejmara pêncemîn = 5 × 5 = 25!", tts: "Pêncan pêncan bihejmêre: pênc, deh, pazde, bîst, bîst û pênc!", visual: "skipCountLearn", step: 5, count: 5, note: "Bi her gavê komeke din zêde dikî!" },
      { title: "🚀 Şarjkirin Qediya!", text: "Reaktora carkirinê çalak e!", tts: "Reaktora carkirinê çalak e!", visual: "timesTableLearn", note: "Enerjiya carkirinê ya bi têgihîştinê bar bûye mayîndar e." }
    ]
  },

  // KATEGORİ 4d: PARKIRIN
  level5_division: {
    title: "⚡ Reaktora Parkirinê", subtitle: "Hêza dabeşkirinê çalak bike", icon: "⚡", color: "#0891b2",
    steps: [
      { title: "Wekhev Dabeşkirin", text: "6 nanên şîrîn ji 2 hevalan re wekhev belav bike: her kes 3 heb! 6 ÷ 2 = 3.", tts: "Şeş nanên şîrîn ji du hevalan re wekhev belav bike!", visual: "divisionLearn", total: 6, groups: 2, note: "Dabeşkirina wekhev bingeha parkirinê ye!" },
      { title: "Yek bi Yek Belav Bike", text: "12 şêranî ji 4 zarokan re yek bi yek belav bike: her kes 3 bû. 12 ÷ 4 = 3.", tts: "Yek bi yek belav bike!", visual: "divisionLearn", total: 12, groups: 4, note: "Belavkirina yek bi yek rêya herî xwezayî ya fêrbûna parkirinê ye." },
      { title: "Carkirinê Bifikire!", text: "12 ÷ 3 = ? → 'Bi 3 çi carkirin bikim ku 12 bibe?' 3 × 4 = 12 → bersiv 4 e!", tts: "Dwazde par sê: sê carîn çend dwazde dike? Çar!", visual: "divisionLearn", total: 12, groups: 3, note: "Mifteya rastiyên parkirinê rastiyên carkirinê ne." },
      { title: "🚀 Şarjkirin Qediya!", text: "Reaktora parkirinê çalak e!", tts: "Reaktora parkirinê çalak e!", visual: "groupingLearn", total: 12, groupSize: 4, note: "Parkirin û carkirin neynika hev in." }
    ]
  },

  // KATEGORİ 5: RAMANA TÊKILDAR
  level6: {
    title: "⚡ Şîfreya Desenê", subtitle: "Rêzikên veşartî çareser bike", icon: "⚡", color: "#0891b2",
    steps: [
      { title: "Her Hejmar Dikare Bê Parçekirin", text: "7 = 3+4 = 2+5. Ji vê re ramana 'parçe-giştî' tê gotin.", tts: "Heft: sê zêde çar jî dibe, du zêde pênc jî!", visual: "partWholeLearn", whole: 7, examples: [[3, 4], [2, 5], [1, 6]], note: "Zêdekirin û kemkirin du rûyên heman girêdana hejmaran in." },
      { title: "Hejmara Kêm: Zêdekirin", text: "5 + ? = 8 → bersiv 3 e!", tts: "Pênc zêde çi wekhev heşt e? Bersiv sê ye!", visual: "missingLearn", examples: [{ eq: "3 + ? = 7", answer: 4 }, { eq: "? + 5 = 9", answer: 4 }], note: "Dîtina hejmara kêm destpêka ramana cebîrî ye." },
      { title: "Dîtina Ferqê", text: "Ferqa di navbera 8 û 5 de: ji 5'an heta 8'an 3 gav → ferq 3 e.", tts: "Ferqa di navbera heşt û pêncê de sê ye!", visual: "differenceLearn", a: 8, b: 5, note: "Dîtina ferqê pîvandina dûrahiya di navbera du hejmaran de ye." },
      { title: "Texmînkirin", text: "Li kevirên stêrkan yên kapsulê binêre û mîqdarê texmîn bike.", tts: "Ji pêncan kêmtir e, zêdetir e? Bi xalên referansê texmîn bike!", visual: "estimateLearn", examples: [3, 7, 11, 5], note: "Nêzîkî li ku ye texmîn bike!" },
      { title: "🚀 Şarjkirin Qediya!", text: "Şîfreyên te yên desenê hatin çareserkirin!", tts: "Şîfreya desenê hat çareserkirin!", visual: "numberLine", range: [0, 10], note: "Hêzika ramana têkildar mifteya çareserkirina pirsgirêkan e." }
    ]
  },

  // KATEGORİ 6: ŞIYANÊN ZIKRÎ
  level7: {
    title: "⚡ Şarjkirina Birûskê", subtitle: "Hêza naskirina bilez bar bike", icon: "⚡", color: "#c026d3",
    steps: [
      { title: "Bi Nêrînek Naskirin", text: "Naskirin bi nêrînekê ya mîqdarên biçûk ji 'tavilzanîn' re tê gotin.", tts: "Li kevirên stêrkan demek kurt binêre. Bê jimartin çend heb in bibîne!", visual: "subitizingLearn", examples: [2, 3, 4], note: "Tavilzanîn: mîqdarên 1-4 bê jimartin nas bike." },
      { title: "Bi Koman Naskirin", text: "7 kevirên stêrkan wekî '5 û 2' bibînî zû nas dikî!", tts: "Heftê wekî pênc û du bibîne!", visual: "subitizingLearn", examples: [5, 6, 7, 8], note: "Parçeyan ji hev cuda nas bike, paşê bike yek." },
      { title: "Xala Referansa 5", text: "3 → '5'an 2 kêm'. 7 → '5 û 2 zêde'.", tts: "Sê: ji pêncan du kêm. Heft: pênc û du zêde.", visual: "refPointLearn", examples: [{ num: 3, ref: "5'an 2 kêm" }, { num: 7, ref: "5 û 2 zêde" }, { num: 5, ref: "Tam 5" }], note: "Pergala referansa 5 û 10." },
      { title: "Stratejiya Rast Hilbijêre", text: "5+5 → ducar! 9+4 → 10'an temam bike! 8−2 → ber bi paş bihejmêre!", tts: "Ji bo her pirsê rêya herî hêsan hilbijêre!", visual: "refPointLearn", examples: [{ num: 5, ref: "Ducar: 5+5=10" }, { num: 9, ref: "10'an temam bike" }], note: "Tu dikarî heman pirsê bi çend rêyan çareser bikî!" },
      { title: "🚀 Şarjkirin Qediya!", text: "Hêzikên birûskê çalak bûn!", tts: "Şarjkirina birûskê qediya!", visual: "refPointLearn", note: "Ramana nerm ji girêdayîbûna bi yekê rêbazê pir bihêztir e." }
    ]
  },

  // KATEGORİ 7: NIRXANE (XANE)
  level4: {
    title: "⚡ Şarjkirina Qatan", subtitle: "Enerjiya xaneyan nexşe bike", icon: "⚡", color: "#b45309",
    steps: [
      { title: "10 Hejmareke Taybet E", text: "Pergala hejmaran li ser 10'an e! Piştî 9'an xaneyeke nû dest pê dike: 10.", tts: "Deh hejmareke taybet e!", visual: "bundleLearn", count: 10, note: "Pergala hejmaran li ser komên 10'an e." },
      { title: "10 Yekane = 1 Dehane", text: "10 heb yekanan li hev bînî 'dehane' çêdibe.", tts: "Deh yekan komdar bike û dehaneyekê çêke!", visual: "bundleLearn", count: 10, note: "10 yekane = 1 dehane." },
      { title: "Dehane û Yekane", text: "14 = 1 dehane + 4 yekane. 23 = 2 dehane + 3 yekane.", tts: "Çarde: yek dehane, çar yekane!", visual: "decomposeLearn", examples: [{ num: 14, tens: 1, ones: 4 }, { num: 23, tens: 2, ones: 3 }, { num: 45, tens: 4, ones: 5 }], note: "Jimareyê çepê dehan nîşan dide, ya rastê yekan." },
      { title: "Baldar: Nirxa Rastîn a Jimareyê", text: "3'ya di 35'an de = 30! 5 = 5. 35 = 30 + 5.", tts: "Sêya di sî û pêncan de bi rastî sî nirx e!", visual: "decomposeLearn", examples: [{ num: 35, tens: 3, ones: 5 }, { num: 68, tens: 6, ones: 8 }], note: "3'ya di 35'an de ne sê tişt in lê sê dehane ye." },
      { title: "Ji Parçeyan Hejmar Çêke", text: "3 dehane + 6 yekane = 36.", tts: "Sê dehane zêde şeş yekane: sî û şeş!", visual: "composeLearn", examples: [{ tens: 1, ones: 7 }, { tens: 3, ones: 2 }, { tens: 5, ones: 0 }], note: "Zarok divê yekaneya 0 jî fêm bikin." },
      { title: "Nîşandana Berfirehkirî", text: "56 = 50 + 6. 70 = 70 + 0.", tts: "Pêncî û şeş wekhev pêncî zêde şeş e!", visual: "expandLearn", examples: [{ num: 18, expanded: "10 + 8" }, { num: 34, expanded: "30 + 4" }, { num: 70, expanded: "70 + 0" }], note: "35 = 30 + 5 nivîsandin alîkariya têgihîştina nirxaneyê dike." },
      { title: "🚀 Şarjkirin Qediya!", text: "Şarjkirina qatan qediya!", tts: "Şarjkirina qatan qediya!", visual: "rhythmicCountLearn", step: 10, count: 5, note: "Enerjiya nirxaneyê sotemeniya bingehîn a peywirên pirjimareyî ye." }
    ]
  },
};

// ═══ DİL FARKINDALIKLI ÖĞRENME İÇERİĞİ ERİŞİMCİSİ ═══════════════════
export const getLearnContent = (category, lang = "tr") => {
  if (lang === "ku" && LEARN_CONTENT_KU[category]) {
    return LEARN_CONTENT_KU[category];
  }
  return LEARN_CONTENT[category] || null;
};
