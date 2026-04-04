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
      { title: "Enerji Kapsülü Nedir?", text: "DokunSay enerji kapsülü üzerinde renkli yıldız taşları var. Her yıldız taşı bir nesneyi gösterir. Yıldız taşlarına parmağınla dokun, say ve öğren! Tıpkı gerçek enerji kapsülleri gibi her yıldız taşına tek tek dokunabilirsin.", tts: "DokunSay enerji kapsülünde renkli yıldız taşları var. Her yıldız taşına dokunarak sayıları öğrenelim!", visual: "rod", rodCount: 5, note: "Dokunarak sayma, sayı kavramını elle tutulur hale getirir." },
      { title: "Tek Tek Sayma", text: "Sayarken her yıldız taşına parmağınla dokun ve bir sayı söyle: bir, iki, üç, dört... Her yıldız taşına yalnızca bir kez dokun! Atlamadan ve tekrar etmeden say.", tts: "Her yıldız taşına dokun ve bir sayı söyle: bir, iki, üç... Hiçbirini atlama!", visual: "counting", countTo: 5, note: "Her nesneye bir sayı düşer. Buna 'birebir eşleme' denir." },
      { title: "Sayılar Hep Aynı Sırada", text: "Sayılar her zaman aynı sırayla söylenir: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10. Bu sıra hiç değişmez! Elma da saysan yıldız taşı da saysan sıra hep aynıdır.", tts: "Sayılar hep aynı sırayla söylenir: bir, iki, üç, dört, beş... Bu sıra hiç değişmez!", visual: "counting", countTo: 10, note: "Sayılar her zaman aynı düzende söylenir. Bu kurala 'sabit sıra' denir." },
      { title: "Son Söylediğin Sayı = Toplam", text: "Yıldız taşlarına dokunarak 1, 2, 3, 4 dedin. En son söylediğin sayı '4' — bu toplam yıldız taşı sayısını gösterir! 'Kaç yıldız taşı var?' diye sorulunca '4' demek yeterli.", tts: "En son söylediğin sayı toplamı gösterir. Dört yıldız taşı saydıysan, toplam dört!", visual: "counting", countTo: 4, note: "En son söylenen sayı, gruptaki toplam nesne sayısını belirtir." },
      { title: "Nereden Başlarsan Başla", text: "Yıldız taşlarını soldan sağa say ya da sağdan sola say — sonuç hep aynı! Başlangıç yeri farklı olsa da toplam değişmez. Önemli olan her yıldız taşına bir kez dokunmak.", tts: "Soldan say ya da sağdan say — sonuç aynı! Toplam değişmez.", visual: "counting", countTo: 6, note: "Saymaya nereden başlarsan başla, toplam sayı hep aynı kalır." },
      { title: "İki Renk Kuralı", text: "DokunSay enerji kapsülünde ilk 5 yıldız taşı mavi, sonrakiler kırmızıdır. 5 mavi yıldız taşı gördüğünde saymadan hemen 'beş' de! Sonra kırmızıları say ve ekle. Örneğin: 5 mavi + 2 kırmızı = 7.", tts: "İlk beş yıldız taşı mavi, sonrakiler kırmızı! Beşi hemen tanı, kırmızıları ekle.", visual: "twoColor", examples: [3, 5, 7, 9], note: "5'i gözle hemen tanımak, toplama için çok güçlü bir kısayoldur." },
      { title: "Sayının Üç Gösterimi", text: "Her sayı üç farklı şekilde gösterilir: Nesne olarak enerji kapsülünde, Sembol olarak yazılı rakam ve Sözcük olarak söylenen isim. 5 yıldız taşı (nesne), '5' (sembol) ve 'beş' (sözcük) — üçü de aynı sayıyı anlatır!", tts: "Her sayının üç gösterimi var: nesne, sembol ve sözcük. Beş yıldız taşı gör, beş rakamını oku, beş diye söyle!", visual: "tripleCodeLearn", examples: [{ n: 3, chips: 3, symbol: "3", word: "üç" }, { n: 5, chips: 5, symbol: "5", word: "beş" }, { n: 8, chips: 8, symbol: "8", word: "sekiz" }], note: "Nesne (miktar), Sembol (rakam) ve Sözcük (isim): Aynı sayının üç farklı gösterimi." },
      { title: "Bir Fazla, Bir Eksik", text: "5 yıldız taşlı enerji kapsülüne bak — her yıldız taşının üstünde sıra numarası var. 5'in bir öncesi 4, bir sonrası 6'dır. Yeşil yıldız taşları hangi sırada olduğunu gösterir. Her sayının bir komşusu vardır!", tts: "Beşin bir öncesi dört, bir sonrası altı! Yeşil yıldız taşları sırayı gösterir.", visual: "successorPredecessor", rodCount: 5, note: "Bir yıldız taşı eklemek veya çıkarmak, toplama ve çıkarma öğrenmenin ilk adımıdır." },
      { title: "Sanbil: Saymadan Tanıma", text: "Zarın üstündeki noktaları saymadan kaç tane olduğunu bilirsin! Küçük sayıları bir bakışta tanımaya 'sanbil' denir. 1, 2, 3 ve 4 yıldız taşlı enerji kapsüllerini saymadan tanımayı dene!", tts: "Yıldız taşlarına kısa süre bak ve kaç tane olduğunu hızlıca söyle! Buna sanbil denir.", visual: "subitizing", examples: [2, 3, 4, 5], note: "Küçük miktarları saymadan bir bakışta tanı!" },
      { title: "Sayı Korunumu", text: "5 yıldız taşını yan yana diz, sonra aralıklı koy. Diziliş değişti ama sayı hâlâ 5! Nesnelerin dizilişi değişse bile sayıları değişmez. Sayı, şekle bağlı değildir.", tts: "Diziliş değişti ama sayı aynı kaldı! Beş yıldız taşı, nasıl dizersen diz, hâlâ beştir.", visual: "conservation", count: 5, note: "Nesnelerin yeri veya şekli değişse bile toplam sayı aynı kalır." },
      { title: "🚀 Şarj Tamamlandı!", text: "Sayma enerjin tam şarj oldu! Tek tek saymayı, son sayının toplamı gösterdiğini ve iki renk kuralını yükledin. Gemi hazır, yıldız taşlarını toplamaya başla! Her doğru cevap gemini daha güçlü yapar.", tts: "Enerji şarjı tamamlandı! Sayma gücün yüklendi, artık göreve hazırsın!", visual: "rod", rodCount: 10, note: "Her yüklenen enerji modülü, bir sonraki görevin temelidir." }
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
      { title: "İki Grubu Karşılaştır", text: "İki grup yıldız taşını karşılaştırmak için onları alt alta koy. Her yıldız taşını birer birer eşle. Eşi kalmayan tarafta daha çok yıldız taşı vardır!", tts: "İki grubu yan yana koy. Her yıldız taşını birer birer eşle. Eşi kalmayanlar fazlalıktır!", visual: "compare", pairs: [{ a: 3, b: 5, answer: "5 > 3 → 2 fazla" }, { a: 4, b: 4, answer: "4 = 4 → eşit" }], note: "Enerji kapsüllerini alt alta koy — hangisi uzunsa o daha çok!" },
      { title: "Daha Az, Eşit, Daha Çok", text: "İki miktarı karşılaştırınca üç sonuç olabilir: daha az, eşit veya daha çok. 3 yıldız taşı ile 5 yıldız taşı: 3 daha az, 5 daha çok. 4 yıldız taşı ile 4 yıldız taşı: eşit!", tts: "Üç sonuç var: daha az, eşit, daha çok!", visual: "lessMoreEqual", examples: [{ a: 2, b: 5, result: "az" }, { a: 4, b: 4, result: "eşit" }, { a: 7, b: 3, result: "çok" }], note: "Daha az, eşit, daha çok — karşılaştırmanın üç sonucu." },
      { title: "Büyük Sayı, Uzun Enerji Kapsülü", text: "Bir sayı büyüdükçe enerji kapsülü de uzar. 3 yıldız taşlı enerji kapsülü kısa, 8 yıldız taşlı enerji kapsülü uzundur. Enerji kapsüllerinin boyunu karşılaştırarak hangi sayının büyük olduğunu görebilirsin.", tts: "Büyük sayının enerji kapsülü daha uzun! Üç kısa, sekiz uzun.", visual: "compare", pairs: [{ a: 3, b: 8, answer: "8 > 3" }], note: "Uzun enerji kapsülü = büyük sayı." },
      { title: "Rakam ile Miktar Eşleme", text: "Bir rakam gördüğünde onun kaç nesneyi gösterdiğini bilmelisin. 5 yıldız taşını say, sonra '5' kartını bul ve eşle! Rakam ile miktar her zaman birlikte gider.", tts: "Yıldız taşlarını say ve doğru rakamı bul. Rakam ile miktar arkadaştır!", visual: "matching", examples: [{ num: 3, desc: "3 yıldız taşı → rakam 3" }, { num: 7, desc: "7 yıldız taşı → rakam 7" }], note: "Yıldız taşlarını say, doğru rakamı bul ve eşle!" },
      { title: "Küçükten Büyüğe Sıralama", text: "Sayıları sıralamak için en küçüğü bul ve başa koy. Sonra kalanlardan en küçüğü seç. 5, 2, 8, 1 → sıralayınca: 1, 2, 5, 8.", tts: "En küçüğü bul ve başa koy. Sonra en küçüğünü seç!", visual: "ordering", numbers: [5, 2, 8, 1], note: "En küçüğü bul, başa koy, kalanlardan devam et." },
      { title: "Büyükten Küçüğe Sıralama", text: "Tersini de yapabilirsin! En büyüğü başa koy, sonra kalanlardan en büyüğü seç. 3, 7, 1, 9 → büyükten küçüğe: 9, 7, 3, 1.", tts: "En büyüğü başa koy: dokuz, yedi, üç, bir!", visual: "ordering", numbers: [3, 7, 1, 9], note: "Hem küçükten büyüğe hem büyükten küçüğe sıralayabilmek önemlidir." },
      { title: "Bir Önce ve Bir Sonra", text: "Her sayının bir öncesi ve bir sonrası vardır. 5'ten önce 4, sonra 6 gelir. Bir sonraki sayı bir fazla, bir önceki sayı bir eksik demektir.", tts: "Her sayının iki komşusu var. Bir önceki bir eksik, bir sonraki bir fazla demek!", visual: "beforeAfter", examples: [{ num: 4, before: 3, after: 5 }, { num: 7, before: 6, after: 8 }], note: "Komşu sayıları bilmek, toplama ve çıkarmaya hazırlık sağlar." },
      { title: "Arada Hangi Sayı Var?", text: "3 ile 5 arasında hangi sayı var? 4! Her iki komşu sayı arasında tam bir sayı bulunur. 6 ile 8 arası? 7!", tts: "Üç ile beş arasında ne var? Dört! Altı ile sekiz arasında? Yedi!", visual: "beforeAfter", examples: [{ num: 4, before: 3, after: 5 }], note: "3 ile 5 arasında 4, 6 ile 8 arasında 7 var." },
      { title: "Sayı Doğrusu", text: "Sayıları bir çizgi üzerinde düşün: sola gittikçe küçülür, sağa gittikçe büyür. Bu çizgiye 'sayı doğrusu' denir. Yakın sayılar yan yana durur.", tts: "Kafanda bir sayı doğrusu hayal et. Sol küçük, sağ büyük!", visual: "numberLine", range: [0, 10], note: "Sol küçük, sağ büyük — sayılar enerji kapsülünün üzerinde sıralanır." },
      { title: "Geçişli Çıkarım", text: "5, 3'ten büyük. 3, 1'den büyük. O zaman 5, 1'den de büyüktür! Bunu saymadan biliriz. İki karşılaştırmayı birleştirerek yeni bir sonuç çıkardık.", tts: "Beş üçten büyük, üç birden büyük. O zaman beş birden de büyüktür!", visual: "transitive", examples: [{ a: 5, b: 3, c: 1, desc: "5 > 3 > 1 → 5 > 1" }], note: "A > B ve B > C ise A > C olur — saymaya gerek yok!" },
      { title: "🚀 Şarj Tamamlandı!", text: "Denge sensörlerin kalibre edildi! Karşılaştırma, sıralama ve sayı doğrusu enerjisi yüklendi.", tts: "Denge şarjı tamamlandı! Karşılaştırma gücün yüklendi, göreve hazırsın!", visual: "numberLine", range: [0, 10], note: "Karşılaştırma sensörleri, galaksideki tüm görevlerin temelidir." }
    ]
  },

  // KATEGORİ 3: SAYI YAPISI
  level3: {
    title: "⚡ Yapı Şarjı", subtitle: "Sayı bağlarının gücünü çöz", icon: "⚡", color: "#ea580c",
    steps: [
      { title: "Sayıları Parçalar Halinde Gör", text: "Sayıları tek tek saymak yerine küçük parçalar halinde görmek daha hızlıdır. 7'yi düşün: '5 ve 2 daha' olarak görmek, tek tek saymaktan çok daha kolay!", tts: "Yediyi beş ve iki daha olarak düşün.", visual: "fiveRef", examples: [{ n: 3, desc: "3 = tek grup" }, { n: 7, desc: "7 = 5 + 2" }, { n: 9, desc: "9 = 5 + 4" }], note: "Sayıları parçalar halinde görmek, tek tek sayma alışkanlığından çıkışın ilk adımıdır." },
      { title: "5 Önemli Bir Sayıdır", text: "5 çok önemli bir sayıdır çünkü bir elin parmak sayısıdır!", tts: "Beş, bir elin parmak sayısı!", visual: "fiveRef", examples: [{ n: 2, desc: "5'ten 3 eksik" }, { n: 5, desc: "Tam 5 — bir el" }, { n: 8, desc: "5 ve 3 fazla" }], note: "5 ve 10 'kritik referans sayıları'dır." },
      { title: "5'e Kadar Sayı Bağları", text: "5'in parçalarını bilmek çok işe yarar: 1+4=5, 2+3=5, 0+5=5.", tts: "Beşin sayı bağları: bir artı dört, iki artı üç.", visual: "makeN", target: 5, examples: [2, 3, 4, 1], note: "Sayı bağları: Bir sayıyı oluşturan parça çiftlerini bilmek işlemleri hızlandırır." },
      { title: "5'lik Kart", text: "5'lik kart 5 kutuluk bir çerçevedir. Yıldız taşlarını kutulara yerleştir.", tts: "Beşlik karta yıldız taşlarını yerleştir. Kaç dolu, kaç boş?", visual: "fivesFrameLearn", examples: [2, 3, 5], note: "5'lik çerçeve, bakarak tanımayı güçlendirir." },
      { title: "10'luk Çerçeve", text: "10'luk çerçevede 2 sıra ve her sırada 5 kutu var. Üst sıra doluysa saymadan '5' de!", tts: "Onluk çerçevede üst sıra beş, alt sıra beş.", visual: "tensFrameLearn", examples: [4, 7, 10], note: "10'luk çerçeve: Parçaları görerek büyük sayıları hızlıca tanımayı sağlar." },
      { title: "10'luk Çerçevede Boşluklar", text: "10'luk çerçevede 7 yıldız taşı varsa 3 kutu boş kalır. Boş kutular '10'a ne kadar eksik' olduğunu gösterir.", tts: "Yedi yıldız taşı, üç boş kutu. Ona üç eksik!", visual: "tensFrameLearn", examples: [6, 8, 9], note: "Boş kutuları saymak, 10'a ne kadar eksik olduğunu gösterir." },
      { title: "Yıldız Taşı Dizmek", text: "Hedef sayıyı düşün, enerji kapsülüne yıldız taşlarını sürükleyerek yerleştir ve say.", tts: "Hedef sayıyı düşün, yıldız taşı koy ve say.", visual: "buildNumberLearn", examples: [{ n: 3, desc: "3 yıldız taşı" }, { n: 6, desc: "6 yıldız taşı" }], note: "Yıldız taşı dizerek sayı oluşturma, somuttan soyuta geçişin ilk adımıdır." },
      { title: "10'un Arkadaşları", text: "10 yapan sayı çiftlerini ezberle! 1+9, 2+8, 3+7, 4+6, 5+5.", tts: "Onun arkadaşları: bir artı dokuz, iki artı sekiz, üç artı yedi... Hepsini öğreneceksin!", visual: "makeN", target: 10, examples: [6, 8, 3, 7], note: "10'un arkadaşlarını bilmek, zihinden toplama için çok önemlidir." },
      { title: "Parça-Bütün Düşüncesi", text: "Her sayı farklı parçalardan oluşabilir. 8 = 5+3 = 4+4 = 6+2 = 7+1.", tts: "Sekiz: beş artı üç de olur, dört artı dört de! Bir sayı birçok yolla parçalanır.", visual: "numberBonds", examples: [{ whole: 8, parts: [[5,3], [4,4], [6,2]] }], note: "Aynı sayıyı farklı şekillerde parçalamak, toplama ve çıkarmayı birbirine bağlar." },
      { title: "İki El = On", text: "İki elini aç: toplam 10 parmak! Sol elde 5, sağ elde 5.", tts: "İki elini aç: on parmak!", visual: "makeN", target: 10, examples: [7, 4, 9], note: "İki elin toplamı 10 eder." },
      { title: "🚀 Şarj Tamamlandı!", text: "Yapı modülün aktif! 5'lik ve 10'luk enerji referansları, sayı bağları ve parça-bütün gücü yüklendi.", tts: "Yapı şarjı tamamlandı!", visual: "makeN", target: 10, examples: [6, 8, 3], note: "5 ve 10 referans noktaları, tüm görevlerin enerji çekirdeğidir." }
    ]
  },

  // KATEGORİ 4: İŞLEMLER — TOPLAMA
  level5_addition: {
    title: "⚡ Toplama Yakıtı", subtitle: "Birleştirme enerjisi yükle", icon: "⚡", color: "#f59e0b",
    steps: [
      { title: "Toplama Nedir?", text: "Toplama, iki grubu bir araya getirmektir. 3 + 4 = 7.", tts: "Toplama, iki grubu birleştirmektir. Üç artı dört eşittir yedi!", visual: "additionLearn", a: 3, b: 4, note: "İki grubu bir araya getirme." },
      { title: "Yıldız Taşı Ekleyerek Topla", text: "3 yıldız taşın var. 4 tane daha ekle. Hepsini say: 7!", tts: "Üç yıldız taşın var. Dört tane daha ekle. Hepsini baştan say: yedi!", visual: "countAllLearn", a: 3, b: 4, note: "Hepsini sırayla saymak, toplamayı öğrenmenin ilk yoludur." },
      { title: "Sıfır Ekleme", text: "Bir sayıya 0 eklersen sayı değişmez! 5 + 0 = 5.", tts: "Beş artı sıfır eşittir beş.", visual: "additionLearn", a: 5, b: 0, note: "Sıfır eklemek sayıyı değiştirmez!" },
      { title: "Büyükten Başla", text: "3 + 5 için büyük sayıdan başla: 5'ten başla, 3 ileri say: 6, 7, 8.", tts: "Büyükten başla: beşten başla, üç ileri say: altı, yedi, sekiz!", visual: "countOnLearn", start: 5, add: 3, note: "Büyük sayıdan devam etmek, toplamada önemli bir kısayoldur." },
      { title: "Yer Değiştirme: 3+5 = 5+3", text: "Toplamada sayıların yerini değiştirsen de sonuç aynıdır!", tts: "Üç artı beş de beş artı üç de sekiz!", visual: "commutativityLearn", a: 3, b: 5, note: "3+5 ile 5+3 aynı sonucu verir." },
      { title: "Çiftler: 3+3, 4+4, 5+5...", text: "Aynı sayının iki katını bilmek çok kolay: 2+2=4, 3+3=6, 4+4=8, 5+5=10.", tts: "Çiftler çok kolay! İki artı iki dört, üç artı üç altı. Aynı sayıyı iki kez topla!", visual: "doublesLearn", examples: [{ a: 3, b: 3 }, { a: 4, b: 4 }, { a: 5, b: 5 }], note: "Aynı sayıyı iki kez toplamak çok kolay!" },
      { title: "Yakın Çiftler: 6+7, 5+6...", text: "6 + 7 zor mu? 6 + 6 = 12 biliyorsan, bir fazlası 13.", tts: "Altı artı yedi: altı artı altı on iki yapar. Bir tane daha eklersen on üç!", visual: "doublesLearn", examples: [{ a: 6, b: 7 }, { a: 5, b: 6 }], note: "Bildiğin bir çiftten yola çıkarak yeni işlem türetebilirsin." },
      { title: "10'a Tamamla, Sonra Ekle", text: "8 + 5 zor mu? Önce 10'a tamamla! 8 + 2 = 10. Sonra kalan 3'ü ekle: 10 + 3 = 13.", tts: "Sekiz artı beş. Önce sekize iki ekle, on oldu! Sonra üçü ekle, on üç!", visual: "bridgingLearn", a: 8, b: 5, note: "10'a tamamla ve kalanı ekle." },
      { title: "10'a Tamamla: Başka Örnekler", text: "9 + 4: 9 + 1 = 10, 10 + 3 = 13. 7 + 6: 7 + 3 = 10, 10 + 3 = 13.", tts: "Dokuz artı dört. Dokuza bir ekle, on oldu! Sonra üç ekle, on üç!", visual: "bridgingLearn", a: 9, b: 4, note: "10'a tamamlama, 10'un arkadaşlarını bilmeye dayanır." },
      { title: "Toplama ve Çıkarma Kardeştir", text: "3 + 5 = 8 biliyorsan, 8 − 5 = 3 ve 8 − 3 = 5 de bilirsin!", tts: "Üç artı beş sekiz. Sekiz eksi beş üç!", visual: "inverseLearn", a: 3, b: 5, whole: 8, note: "Toplama bilirsen çıkarmayı da bilirsin!" },
      { title: "🚀 Şarj Tamamlandı!", text: "Toplama yakıtın dolu! Birleştirme, ekleme, sayı bağları ve 10'a tamamlama stratejilerini yükledin.", tts: "Toplama yakıtı yüklendi!", visual: "progressionLearn", note: "Kavramsal enerji olmadan ezberleme kırılgan kalır." }
    ]
  },

  // KATEGORİ 4b: ÇIKARMA
  level5_subtraction: {
    title: "⚡ Çıkarma Yakıtı", subtitle: "Ayırma enerjisi yükle", icon: "⚡", color: "#ef4444",
    steps: [
      { title: "Çıkarma Nedir? Ayırma", text: "7 yıldız taşından 3 tanesini çıkar. 7 − 3 = 4.", tts: "Yedi yıldız taşından üç tanesini çıkar: dört kalır!", visual: "subtractionLearn", total: 7, remove: 3, note: "Ayırma, en temel çıkarma yöntemidir." },
      { title: "Fark Bulma", text: "7 yıldız taşı ile 4 yıldız taşını yan yana koy. 7'de 3 tane fazla var → fark 3.", tts: "Yedi ile dört arasındaki fark üç!", visual: "differenceLearn", a: 7, b: 4, note: "İki enerji kapsülünü karşılaştır, farkı gör!" },
      { title: "Eksik Parça", text: "? + 4 = 7 → eksik parça kaç? Cevap 3.", tts: "Soru işareti artı dört eşittir yedi. Eksik sayı üç!", visual: "inverseLearn", a: 3, b: 4, whole: 7, note: "Eksik parçayı bulmak da bir çıkarmadır!" },
      { title: "Sıfır Çıkarma", text: "5 − 0 = 5. 5 − 5 = 0.", tts: "Beş eksi sıfır eşittir beş. Beş eksi beş eşittir sıfır!", visual: "subtractionLearn", total: 5, remove: 0, note: "Sıfır çıkarınca sayı değişmez, kendini çıkarınca sıfır kalır." },
      { title: "Yıldız Taşı Çıkar ve Say", text: "Enerji kapsülünde 7 yıldız taşı var, 3 tanesine dokun ve çıkar. Kalan: 4!", tts: "Yedi yıldız taşı kur, üç çıkar, kalanları say: dört!", visual: "separatingLearn", total: 7, remove: 3, note: "Enerji kapsülünden yıldız taşı çıkar ve kalanları say!" },
      { title: "Geriye Doğru Sayma", text: "8 − 3: Sekizden başla, üç geriye → 7, 6, 5. Cevap 5!", tts: "Sekizden üç geriye doğru say: yedi, altı, beş!", visual: "backCount", start: 8, steps: 3, note: "Geriye sayma, çıkarılan küçükse en verimli stratejidir." },
      { title: "İleriye Sayma", text: "8 − 5: Beşten başla, sekize kadar → 6, 7, 8. Üç adım, fark 3!", tts: "Beşten sekize ileriye say: altı, yedi, sekiz!", visual: "countUpLearn", from: 5, to: 8, note: "Küçük sayıdan büyüğe say — adım sayısı farkı verir!" },
      { title: "Toplama-Çıkarma Ters İlişkisi", text: "3 + 5 = 8 biliyorsan: 8 − 5 = 3 ve 8 − 3 = 5 de bilirsin!", tts: "Üç artı beş sekiz. Sekiz eksi beş üç!", visual: "inverseLearn", a: 3, b: 5, whole: 8, note: "Toplama bilirsen çıkarmayı da bilirsin!" },
      { title: "Çiftlerden Çıkarma", text: "4 + 4 = 8 biliyorsan → 8 − 4 = 4!", tts: "Dört artı dört sekiz. Sekiz eksi dört dört!", visual: "doublesLearn", examples: [{ a: 4, b: 4 }], note: "4+4=8 biliyorsan 8-4=4 de bilirsin!" },
      { title: "10'dan Geri Köprüleme", text: "15 − 8 zor mu? Önce 10'a in: 15 − 5 = 10, sonra 10 − 3 = 7.", tts: "On beş eksi sekiz: önce ona in, on eksi üç yedi!", visual: "bridgeBackLearn", minuend: 15, subtrahend: 8, note: "Önce 10'a in, sonra kalanı çıkar!" },
      { title: "🚀 Şarj Tamamlandı!", text: "Çıkarma yakıtın dolu!", tts: "Çıkarma yakıtı yüklendi!", visual: "subProgressionLearn", note: "Çıkarma ve toplama birbirinin aynasıdır." }
    ]
  },

  // KATEGORİ 4c: ÇARPMA
  level5_multiplication: {
    title: "⚡ Çarpma Reaktörü", subtitle: "Gruplama gücünü etkinleştir", icon: "⚡", color: "#9333ea",
    steps: [
      { title: "Eşit Grup Nedir?", text: "Masada 3 tabak var ve her tabakta 4 çilek var. Bunlara 'eşit gruplar' diyoruz.", tts: "Üç tabak, her tabakta dört çilek!", visual: "multiplyLearn", groups: 3, perGroup: 4, note: "Eşit grup yapısını tanımak çarpımsal düşüncenin çekirdeğidir." },
      { title: "Eşit Grupları Toplama", text: "3 tabakta 4'er çilek: 4 + 4 + 4 = 12. Buna 'tekrarlı toplama' denir.", tts: "Dört artı dört artı dört eşittir on iki.", visual: "multiplyLearn", groups: 3, perGroup: 4, note: "Tekrarlı toplama, çarpmaya giden sezgisel yoldur." },
      { title: "Çarpma İşareti: ×", text: "4 + 4 + 4 yazmak yerine kısa yoldan 3 × 4 yazabiliriz. Sonuç: 12.", tts: "Üç çarpı dört, on iki.", visual: "multiplyLearn", groups: 3, perGroup: 4, note: "Çarpma tekrarlı toplamadan daha geniş bir kavramdır." },
      { title: "Atlayarak Sayma ile Çarpma", text: "5'er say: 5, 10, 15, 20, 25. Beşinci sayı = 5 × 5 = 25!", tts: "Beşer say: beş, on, on beş, yirmi, yirmi beş!", visual: "skipCountLearn", step: 5, count: 5, note: "Her adımda bir grup daha ekliyorsun!" },
      { title: "İkinin Katları", text: "2 × 7 = 7 + 7 = 14. Çiftleri zaten biliyorsun!", tts: "İki çarpı yedi: yedi artı yedi on dört!", visual: "multiplyLearn", groups: 2, perGroup: 7, note: "×2 çiftlerle doğrudan bağlantılıdır." },
      { title: "Beşler ve Onlar", text: "5 ile çarpmak için 5'er say. 10 ile çarpmak: sonuna sıfır ekle!", tts: "Beşer say, on ile çarp: sonuna sıfır ekle!", visual: "skipCountLearn", step: 10, count: 5, note: "×2, ×5, ×10 temel gerçekleridir." },
      { title: "Dizi Modeli: Satır ve Sütun", text: "3 satır, 4 sütun. Her satırda 4 → 3 × 4 = 12.", tts: "Üç satır, dört sütun: on iki!", visual: "arrayLearn", rows: 3, cols: 4, note: "Satır ve sütun düzeni çarpmanın yapısını gösterir." },
      { title: "Sıra Değiştirme", text: "3 × 4 = 4 × 3 = 12. Sonuç aynı!", tts: "Üç çarpı dört on iki. Dört çarpı üç de on iki!", visual: "arrayLearn", rows: 4, cols: 3, note: "3×4 ile 4×3 aynı olduğunu görmek için diziyi döndür!" },
      { title: "İkileme Stratejisi", text: "6 × 4: önce 6 × 2 = 12, sonra 12'nin iki katı = 24.", tts: "Altı çarpı dört: önce altı çarpı iki on iki, iki katı yirmi dört!", visual: "multiplyLearn", groups: 4, perGroup: 6, note: "Stratejileri anlamak kalıcı öğrenme sağlar." },
      { title: "Bir Grup Ekle veya Çıkar", text: "9 × 6: 10 × 6 = 60, bir 6'yı çıkar: 54.", tts: "Dokuz çarpı altı: on çarpı altı altmış, bir altı çıkar elli dört!", visual: "arrayLearn", rows: 9, cols: 3, note: "Bildiğin bir çarpımdan türet!" },
      { title: "🚀 Şarj Tamamlandı!", text: "Çarpma reaktörün aktif!", tts: "Çarpma reaktörü aktif!", visual: "timesTableLearn", note: "Anlayarak yüklenen çarpma enerjisi kalıcıdır." }
    ]
  },

  // KATEGORİ 4d: BÖLME
  level5_division: {
    title: "⚡ Bölme Reaktörü", subtitle: "Paylaştırma gücünü etkinleştir", icon: "⚡", color: "#0891b2",
    steps: [
      { title: "Eşit Paylaşmak", text: "6 kurabiyeyi 2 arkadaşa eşit dağıt: herkes 3 tane! 6 ÷ 2 = 3.", tts: "Altı kurabiyeyi iki arkadaşa eşit dağıt!", visual: "divisionLearn", total: 6, groups: 2, note: "Eşit şekilde paylaştırmak bölmenin temelidir!" },
      { title: "Birer Birer Dağıt", text: "12 şekeri 4 çocuğa birer birer dağıt: herkes 3 oldu. 12 ÷ 4 = 3.", tts: "Birer birer dağıt!", visual: "divisionLearn", total: 12, groups: 4, note: "Birer birer paylaştırma, bölmeyi öğrenmenin en doğal yoludur." },
      { title: "Eşit Gruplara Ayırmak", text: "12 yıldız taşını 3'erli gruplara ayır: 4 grup oldu! 12 ÷ 3 = 4.", tts: "On iki yıldız taşını üçerli gruplara ayır: dört grup!", visual: "groupingLearn", total: 12, groupSize: 3, note: "Kaç tane eşit grup yapabilirim?" },
      { title: "Paylaştır mı, Grupla mı?", text: "İki soru: ① '12 elmayı 3 çocuğa paylaştır' ② '12 elmayı 4'erli grupla'. İkisi de bölme!", tts: "Paylaştır: her biri kaç alır? Grupla: kaç grup olur?", visual: "divisionLearn", total: 12, groups: 3, note: "Paylaşma ve gruplama — bölmenin iki farklı anlamı." },
      { title: "Yarıya Bölmek", text: "8'in yarısı 4 → 8 ÷ 2 = 4.", tts: "Sekizin yarısı dört!", visual: "halfDoubleLearn", examples: [4, 6, 8, 10], note: "Yarılama ve ikileme birbirinin tersidir." },
      { title: "İki Kat ve Yarım: Kardeş İşlemler", text: "4'ün iki katı 8, 8'in yarısı 4. Çarpma ve bölme hep birlikte!", tts: "Dördün iki katı sekiz. Sekizin yarısı dört.", visual: "halfDoubleLearn", examples: [6, 8, 10, 12], note: "×2 ailesi → ÷2 otomatik olarak gelir." },
      { title: "Çarpmayı Düşün!", text: "12 ÷ 3 = ? → '3 ile ne çarparsam 12 yaparım?' 3 × 4 = 12 → cevap 4!", tts: "On iki bölü üç: üç çarpı kaç on iki eder? Dört!", visual: "divisionLearn", total: 12, groups: 3, note: "Bölme gerçeklerinin anahtarı çarpma gerçekleridir." },
      { title: "Tekrarlı Çıkarma ile Bölme", text: "15 ÷ 3: 15'ten 3'er çıkar → 5 kez. Cevap 5.", tts: "On beşten üçer çıkar: beş kez!", visual: "groupingLearn", total: 15, groupSize: 3, note: "Toplam bitene kadar çıkarmaya devam et." },
      { title: "Çarpma Ailesi: 4 Gerçek Bir Arada", text: "3×4=12 biliyorsan: 4×3=12, 12÷3=4, 12÷4=3.", tts: "Üç çarpı dört on iki. On iki bölü üç dört. Bir aile!", visual: "divisionLearn", total: 12, groups: 4, note: "Çarpma ve bölme birbirinin tersidir." },
      { title: "🚀 Şarj Tamamlandı!", text: "Bölme reaktörün aktif!", tts: "Bölme reaktörü aktif!", visual: "groupingLearn", total: 12, groupSize: 4, note: "Bölme ve çarpma birbirinin aynasıdır." }
    ]
  },

  // KATEGORİ 5: İLİŞKİSEL DÜŞÜNME
  level6: {
    title: "⚡ Desen Şifresi", subtitle: "Gizli düzenleri çöz", icon: "⚡", color: "#0891b2",
    steps: [
      { title: "Her Sayı Parçalanabilir", text: "7 = 3+4 = 2+5. Bu 'parça-bütün' düşüncesidir.", tts: "Yedi: üç artı dört de olur, iki artı beş de!", visual: "partWholeLearn", whole: 7, examples: [[3, 4], [2, 5], [1, 6]], note: "Toplama ve çıkarma aynı sayı bağının iki yüzüdür." },
      { title: "Parçalardan Bütüne", text: "3 + 4 = 7 → parçaları bilirsen bütünü bulursun. 7 − 3 = 4 → bütünü bilirsen parçayı da.", tts: "Üç artı dört yedi. Yedi eksi üç dört.", visual: "partWholeLearn", whole: 7, examples: [[3, 4]], note: "Parça-bütün ilişkisi toplama ve çıkarmayı birbirine bağlar." },
      { title: "Eksik Sayı: Toplama", text: "5 + ? = 8 → cevap 3!", tts: "Beş artı ne eşittir sekiz? Cevap üç!", visual: "missingLearn", examples: [{ eq: "3 + ? = 7", answer: 4 }, { eq: "? + 5 = 9", answer: 4 }], note: "Eksik sayı bulma, cebir düşüncesinin başlangıcıdır." },
      { title: "Eksik Sayı: Çıkarma", text: "10 − ? = 6 → cevap 4!", tts: "On eksi ne eşittir altı? Cevap dört!", visual: "missingLearn", examples: [{ eq: "10 − ? = 6", answer: 4 }], note: "Eksik çıkan bulma, ters ilişkinin uygulamasıdır." },
      { title: "Fark Bulma", text: "8 ile 5 arasındaki fark: 5'ten 8'e 3 adım → fark 3.", tts: "Sekiz ile beş arasındaki fark üç!", visual: "differenceLearn", a: 8, b: 5, note: "Fark bulmak, iki sayı arasındaki mesafeyi ölçmektir." },
      { title: "Sayı Doğrusunda Fark", text: "5'ten 8'e kaç adım? 6, 7, 8 — 3 adım!", tts: "Beşten sekize: altı, yedi, sekiz — üç adım!", visual: "numberLineDiffLearn", from: 5, to: 8, range: [0, 10], note: "Enerji kapsülünde farkı görmek." },
      { title: "Tahmin Etme", text: "DokunSay enerji kapsülündeki yıldız taşlarına bakarak miktarı tahmin et.", tts: "Beşten az mı, fazla mı? Referans noktalarıyla tahmin et!", visual: "estimateLearn", examples: [3, 7, 11, 5], note: "Yaklaşık olarak nerede olduğunu tahmin et!" },
      { title: "Sayı Doğrusunda Tahmin", text: "Uzun enerji kapsülü büyük sayı, kısa enerji kapsülü küçük sayı.", tts: "Ortadaysa beş civarı!", visual: "numberLine", range: [0, 10], note: "Sayı doğrusunda doğru yeri bul!" },
      { title: "🚀 Şarj Tamamlandı!", text: "Desen şifrelerin çözüldü!", tts: "Desen şifresi çözüldü!", visual: "numberLine", range: [0, 10], note: "İlişkisel düşünme sensörü, problem çözmenin anahtarıdır." }
    ]
  },

  // KATEGORİ 6: ZİHİNSEL BECERİLER
  level7: {
    title: "⚡ Şimşek Şarjı", subtitle: "Hızlı tanıma gücünü yükle", icon: "⚡", color: "#c026d3",
    steps: [
      { title: "Bir Bakışta Tanıma", text: "Küçük miktarları bir bakışta tanımaya 'sanbil' denir.", tts: "Yıldız taşlarına kısa süre bak. Saymadan kaç tane olduğunu bul!", visual: "subitizingLearn", examples: [2, 3, 4], note: "Sanbil: 1-4 arası miktarları saymadan tanıma." },
      { title: "Gruplar Halinde Tanıma", text: "7 yıldız taşını '5 ve 2' olarak görürsen hemen tanırsın!", tts: "Yediyi beş ve iki olarak gör!", visual: "subitizingLearn", examples: [5, 6, 7, 8], note: "Parçaları ayrı ayrı tanı, sonra birleştir." },
      { title: "Renk Gruplaması", text: "5 mavi + kırmızılar düzeni hafızana yardımcı olur.", tts: "Beş mavi artı üç kırmızı: sekiz!", visual: "memoryLearn", count: 8, note: "Renkleri kullanarak sayıları daha kolay hatırla!" },
      { title: "Parmak Stratejisi", text: "Bir elde 5, iki elde 10 parmak. 8 = bir el + 3.", tts: "Bir el beş parmak!", visual: "memoryLearn", count: 8, note: "Parmaklarınla say!" },
      { title: "5 Referans Noktası", text: "3 → '5'ten 2 eksik'. 7 → '5 ve 2 fazla'.", tts: "Üç: beşten iki eksik. Yedi: beş ve iki fazla.", visual: "refPointLearn", examples: [{ num: 3, ref: "5'ten 2 eksik" }, { num: 7, ref: "5 ve 2 fazla" }, { num: 5, ref: "Tam 5" }], note: "5 ve 10 referans sistemi." },
      { title: "10 Referans Noktası", text: "9 → '10'dan 1 eksik'. 6 → '10'a 4 eksik'.", tts: "Dokuz, ondan sadece bir eksik! Ona çok yakın.", visual: "refPointLearn", examples: [{ num: 9, ref: "10'dan 1 eksik" }, { num: 6, ref: "10'a 4 eksik" }, { num: 8, ref: "10'a 2 eksik" }], note: "10'a göre düşünme." },
      { title: "Geriye Doğru Sayma Stratejisi", text: "9 − 2: dokuzdan iki geri → 8, 7. Cevap 7!", tts: "Dokuz eksi iki: sekiz, yedi!", visual: "backCountLearn", from: 9, note: "Geriye sayma, çıkarılan küçükse en verimlidir." },
      { title: "Doğru Stratejiyi Seç", text: "5+5 → çiftler! 9+4 → 10'a tamamla! 8−2 → geriye say!", tts: "Her soru için en kolay yolu seç!", visual: "refPointLearn", examples: [{ num: 5, ref: "Çiftler: 5+5=10" }, { num: 9, ref: "10'a tamamla" }], note: "Aynı soruyu birden fazla yolla çözebilirsin!" },
      { title: "🚀 Şarj Tamamlandı!", text: "Şimşek sensörlerin aktif!", tts: "Şimşek şarjı tamamlandı!", visual: "refPointLearn", note: "Esnek düşünme, tek bir yönteme bağlı kalmaktan çok daha güçlüdür." }
    ]
  },

  // KATEGORİ 7: BASAMAK DEĞERİ
  level4: {
    title: "⚡ Katman Şarjı", subtitle: "Basamak enerjisini haritalandır", icon: "⚡", color: "#b45309",
    steps: [
      { title: "10 Özel Bir Sayıdır", text: "Sayı sistemimiz 10'a dayanır! 9'dan sonra yeni bir basamak başlar: 10.", tts: "On özel bir sayıdır!", visual: "bundleLearn", count: 10, note: "Sayı sistemi 10'luk gruplara dayanır." },
      { title: "10 Birlik = 1 Onluk", text: "10 tane birliği bir araya getirince 'onluk' oluşur.", tts: "On birliği grupla ve bir onluk yap!", visual: "bundleLearn", count: 10, note: "10 birlik = 1 onluk." },
      { title: "Grubu Grup Olarak Gör", text: "10 yıldız taşını tek tek saymak yerine bir grup olarak gör: '1 onluk'.", tts: "On yıldız taşını bir grup olarak gör!", visual: "rodBundleLearn", examples: [10, 20, 30], note: "10 yıldız taşını tek tek saymak yerine bir grup olarak görmek önemlidir." },
      { title: "Enerji Kapsülü ile Onluk", text: "DokunSay enerji kapsülünde 10 yıldız taşı = bir onluk.", tts: "On yıldız taşı: tam bir onluk!", visual: "pvRodLearn", examples: [13, 27, 35], note: "Enerji kapsülleri birleştirilebilir ve ayrılabilir." },
      { title: "Onluk ve Birlik", text: "14 = 1 onluk + 4 birlik. 23 = 2 onluk + 3 birlik.", tts: "On dört: bir onluk, dört birlik!", visual: "decomposeLearn", examples: [{ num: 14, tens: 1, ones: 4 }, { num: 23, tens: 2, ones: 3 }, { num: 45, tens: 4, ones: 5 }], note: "Soldaki rakam onlukları, sağdaki rakam birlikleri gösterir." },
      { title: "Dikkat: Rakamın Gerçek Değeri", text: "35'teki '3' = 30! '5' = 5. 35 = 30 + 5.", tts: "Otuz beşteki üç aslında otuz değerinde!", visual: "decomposeLearn", examples: [{ num: 35, tens: 3, ones: 5 }, { num: 68, tens: 6, ones: 8 }], note: "35'teki 3, üç nesne değil üç onluk demektir." },
      { title: "Parçalardan Sayı Oluştur", text: "3 onluk + 6 birlik = 36.", tts: "Üç onluk artı altı birlik: otuz altı!", visual: "composeLearn", examples: [{ tens: 1, ones: 7 }, { tens: 3, ones: 2 }, { tens: 5, ones: 0 }], note: "Çocuklar 0 birliğini de anlamalı." },
      { title: "Genişletilmiş Gösterim", text: "56 = 50 + 6. 70 = 70 + 0.", tts: "Elli altı eşittir elli artı altı!", visual: "expandLearn", examples: [{ num: 18, expanded: "10 + 8" }, { num: 34, expanded: "30 + 4" }, { num: 70, expanded: "70 + 0" }], note: "35 = 30 + 5 yazılışı basamak değerini anlamaya yardımcı olur." },
      { title: "Esnek Parçalama", text: "53 = 5 onluk + 3 birlik. Ama 4 onluk + 13 birlik de olur!", tts: "Elli üç: beş onluk ve üç birlik. Ama dört onluk ve on üç birlik de olabilir!", visual: "flexDecomposeLearn", examples: [{ num: 53, standard: "5O + 3B", nonStandard: "4O + 13B" }, { num: 42, standard: "4O + 2B", nonStandard: "3O + 12B" }], note: "Bir onluğu 10 birliğe açabilmek çıkarmada çok işe yarar." },
      { title: "Ritmik Saymalar", text: "10'ar: 10, 20, 30, 40, 50... 5'er: 5, 10, 15, 20, 25...", tts: "Onar onar say: on, yirmi, otuz, kırk, elli!", visual: "rhythmicCountLearn", step: 10, count: 5, note: "Ritmik sayma, onluk yapısını pekiştirir." },
      { title: "🚀 Şarj Tamamlandı!", text: "Katman şarjın tamamlandı!", tts: "Katman şarjı tamamlandı!", visual: "rhythmicCountLearn", step: 10, count: 5, note: "Basamak değeri enerjisi, çok basamaklı görevlerin temel yakıtıdır." }
    ]
  },
};
