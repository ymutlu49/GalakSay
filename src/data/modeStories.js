// ═══ HİKÂYE/GÖREV ÇERÇEVELEMESİ ══════════════════════════════════════════
// Rapor §4.2: Her mod bir "görev/macera" olarak sunulur
// v5.5: Geliştirilmiş narratif — briefing, lore, completion, alien encounter, strategy tips, pedagogical insights
export const MODE_STORIES = {
  counting: { mission: "Göktaşlarını Say!", story: "Her yıldız taşına dokun, her dokunuşta bir sayı söyle!", briefing: "Yıldız taşlarını tek tek say!", completion: "Yıldız taşları envantere eklendi!", alienEncounter: "Zıplayan Sayalon cücesi bir yıldız taşı uzatıyor — 'Bunu da sayar mısın?' diyor.", strategyTip: "Her yıldız taşına bir kez dokun ve sesli say — atlamamak için sırayla ilerle.", wrongInsight: "Saydığın yıldız taşlarını parmağınla işaretle — böylece hangisini saydığını unutmazsın." },
  chipGuess: { mission: "Uzay Hafızası!", story: "Yıldız taşlarını dikkatlice say — gizlenince hatırlaman gerek!", briefing: "Kısa süre gör, sonra hatırla — kaç tane?", completion: "Hafıza sensörlerin güçleniyor!", alienEncounter: "Gizlenen yıldız taşlarının arasından bir Şimşeron'lu göz kırpıyor — 'Hatırla beni!' diyor.", strategyTip: "Kapsül görünürken hızlıca say veya gruplayarak hatırla — 5+2 gibi.", wrongInsight: "Grup halinde düşün: 5 ve kaç tane daha var? Bu, saymadan hatırlamayı kolaylaştırır." },
  rodBack: { mission: "Hafıza Şimşeği!", story: "Yıldız taşlarını farklı biçimlerde gör — enerji kapsülü, çerçeve, domino, parmak — ve aklında tut!", briefing: "Aynı sayıyı farklı gösterimlerde tanı!", completion: "Çoklu temsil yeteneğin gelişti!", alienEncounter: "Bir Terazya'lı şekil değiştirici aynı sayıyı üç farklı biçimde gösteriyor.", strategyTip: "Her gösterim aynı miktarı anlatır — parmak, kapsül, çerçeve hepsi aynı sayıdır.", wrongInsight: "Gösterimi değil, yıldız taşlarının sayısını düşün — şekil değişse de miktar aynı kalır." },
  addition: { mission: "Güçleri Birleştir!", story: "İki enerji kapsülü bir araya gelince yıldız taşlarını topla — hepsini say veya büyükten devam et!", briefing: "İki grubu topla! Büyükten saymaya başla.", completion: "Enerji grupları başarıyla birleştirildi!", alienEncounter: "Toplarya'nın çift başlı ejderhası iki grubun birleşmesini izliyor — 'Güç ikiye katlandı!' diyor.", strategyTip: "Büyük sayıdan başlayıp küçük sayı kadar devam et — 3+5 yerine 5'ten başla: 6, 7, 8!", wrongInsight: "Büyük kapsülü bul, o sayıdan devam ederek say — her parmak bir ekleme." },
  subtraction: { mission: "Enerji Ayır!", story: "Büyük gruptan küçüğü çıkar — kalanı bulmak için say veya ileriye say!", briefing: "Büyükten küçüğü çıkar, kalanı bul!", completion: "Enerji düzenleme başarılı!", alienEncounter: "Toplarya'nın buz ejderhası bazı yıldız taşlarını dondurarak ayırıyor.", strategyTip: "Küçük sayıdan büyüğe ileriye sayarak farkı bul — veya büyükten geriye say.", wrongInsight: "Çıkarılan kadar yıldız taşını kapla, kalanları say — gördüğün yıldız taşları cevap." },
  addChips: { mission: "Yıldız Taşı Birleştir!", story: "Mevcut yıldız taşlarına yenilerini ekle — hedef sayıya ulaş!", briefing: "Yeni taşlar ekle, hedefe ulaş!", completion: "Kapsül hedef enerjiye ulaştı!", alienEncounter: "Toplarya'nın madencisi kapsüle yeni yıldız taşları ekliyor — 'Hedefe ulaşmamıza yardım et!' diyor.", strategyTip: "Mevcut sayıdan hedef sayıya kadar kaç tane eklemen gerektiğini say.", wrongInsight: "Mevcut sayıdan ileriye sayarak hedef sayıya ulaş — kaç adım attıysan o kadar eklemen lazım." },
  removeChips: { mission: "Yıldız Taşı Ayır!", story: "Yıldız taşlarını çıkararak ayır — kalan yıldız taşlarını say!", briefing: "Taşları çıkar, kalanı say!", completion: "Ayırma işlemi tamamlandı!", alienEncounter: "Toplarya'nın buz ejderhası fazla yıldız taşlarını üfleyerek uzaklaştırıyor — 'Kaç tane kaldı?' diyor.", strategyTip: "Çıkarılan yıldız taşlarını kapat ve kalanları say.", wrongInsight: "Çıkarılanları parmağınla kapat — geri kalanlar senin cevabın." },
  subitizing: { mission: "Işık Hızı!", story: "Saymadan, bir bakışta kaç tane olduğunu anla!", briefing: "Saymadan, bir bakışta kaç tane?", completion: "Anlık algılama gücün yükseldi!", alienEncounter: "Şimşeron'un baykuşu gözlerini kocaman açıp bir bakışta sayıyı buluyor!", strategyTip: "Küçük grupları tanı: 2 ve 3'ü birlikte görürsen 5 olduğunu bilirsin.", wrongInsight: "Saymaya çalışma — bildiğin küçük grupları (2, 3, 4) bir bakışta tanımaya çalış." },
  makeFive: { mission: "5 Yıldız Taşı Topla!", story: "5'in parçalarını keşfet — boş kutuları sayarak eksik parçayı bul!", briefing: "5'e tamamla! Boşlukları say.", completion: "5'in sırrını çözdün!", alienEncounter: "Bileşya'nın mühendisi 5'lik bir çerçeve çıkarıyor — 'Boşlukları say!' diyor.", strategyTip: "5'lik çerçevedeki boşluklar, eksik parçanın kendisidir.", wrongInsight: "Çerçevedeki boş kutuları say — boş kutu sayısı, 5'e tamamlamak için gereken miktar." },
  makeTen: { mission: "10 Yıldız Taşı Topla!", story: "10'luk çerçevedeki boşlukları say — 10'un diğer parçasını keşfet!", briefing: "10'a tamamla! Boş kutuları say.", completion: "10'un arkadaşlarını öğrendin!", alienEncounter: "10 kollu uzaylı her koluna bir yıldız taşı yerleştirmek istiyor — kaç kol boş?", strategyTip: "10'un arkadaşları: 1+9, 2+8, 3+7, 4+6, 5+5 — bunları ezberle!", wrongInsight: "Çerçevedeki boş kutuları say — o sayı, 10'a tamamlamak için gereken miktar." },
  tensFrame: { mission: "Onlu Radar!", story: "Üst sıra doluysa 5! Sonra alt sıradakileri ekle — saymadan yapılandır!", briefing: "Üst sıra 5, alt sırayı ekle — toplam kaç?", completion: "Onlu radar kalibre edildi!", alienEncounter: "Basamara'nın robotu 10'luk çerçeveyi tarayarak — '5 üstte, altta kaç var?' diye soruyor.", strategyTip: "Üst sıra tam doluysa zaten 5. Alt sıradakileri ekle: 5 + alt sıra = toplam.", wrongInsight: "Üst sırayı 5 olarak kabul et, sadece alt sıradaki yıldız taşlarını say ve 5'e ekle." },
  doubleTensFrame: { mission: "Çift Onlu Radar!", story: "Sol çerçeve tam 10! Sağdakileri ekle — 10 artı kaç?", briefing: "Sol çerçeve 10, sağdakileri ekle!", completion: "Çift radar sistemi aktif!", alienEncounter: "Basamara'nın ikiz pilotları birer çerçeve tutuyor — 'Solu biz doldurduk, sağı sen say!' diyorlar.", strategyTip: "Sol çerçeve 10. Sağ çerçevedeki yıldız taşlarını say ve 10'a ekle.", wrongInsight: "Sol çerçeve her zaman 10. Sadece sağ çerçevedekileri sayıp 10+? yap." },
  comparison: { mission: "Gezegen Düellosu!", story: "İki enerji kapsülünü karşılaştır — uzun olan daha fazla yıldız taşına sahiptir!", briefing: "İki kapsülü karşılaştır — hangisi daha fazla?", completion: "Karşılaştırma sistemi güncellendi!", alienEncounter: "Terazya'nın hakemi iki kapsülü tartıyor — 'Hangisi ağır?' diye soruyor.", strategyTip: "Kapsüllerin uzunluğuna bak — daha uzun kapsülde daha fazla yıldız taşı var.", wrongInsight: "Kapsülleri yan yana getir ve karşılaştır — hangisi daha uzun, o daha fazla." },
  matching: { mission: "Yıldız Eşle!", story: "Rakamı oku, enerji kapsülündeki yıldız taşlarını say ve doğru eşi bul!", briefing: "Rakam ile miktarı eşleştir!", completion: "Eşleştirme başarılı!", alienEncounter: "Sayalon'un posta robotu her kapsüle doğru etiketi yapıştırmak istiyor — 'Hangisi hangisi?' diyor.", strategyTip: "Önce kapsüldeki yıldız taşlarını say, sonra o sayıyı gösteren rakamı bul.", wrongInsight: "Kapsüldeki yıldız taşlarını tek tek say — sayı, rakamla eşleşmeli." },
  partWhole: { mission: "Parça-Bütün Puzzle!", story: "Bütünün eksik parçasını bul ve puzzle'ı tamamla!", briefing: "Bütünün eksik parçasını bul!", completion: "Puzzle tamamlandı!", alienEncounter: "Bileşya'nın puzzle ustası parçaları havada döndürüyor — 'Eksik olan ne?' diye soruyor.", strategyTip: "Bütünden bilinen parçayı çıkar — kalan, eksik parçadır.", wrongInsight: "Bütün = parça + parça. Bildiğin parçayı bütünden çıkar — kalan senin cevabın." },
  missingNumber: { mission: "Kayıp Yıldız!", story: "Gizlenen sayıyı bul — ipuçları enerji kapsüllerinde!", briefing: "Denklemdeki kayıp sayıyı bul!", completion: "Kayıp yıldız bulundu!", alienEncounter: "Gizemli bir uzay korsanı bir sayıyı çalıp kaçırmış — dedektif ol!", strategyTip: "Denklemi oku ve bildiğin sayılarla bilinmeyeni hesapla.", wrongInsight: "Denklemin iki tarafı eşit olmalı — bildiğin sayıları kullanarak eksik olanı bul." },
  trueFalse: { mission: "Denklem Dedektifi!", story: "Denklemi incele — iki taraf gerçekten aynı miktarda mı? Kozmik terazi dengede mi bak!", briefing: "Bu denklem doğru mu, yanlış mı?", completion: "Dedektiflik görevi başarılı!", alienEncounter: "Terazya'nın hakemi kocaman bir terazi getiriyor — iki tarafı kontrol et!", strategyTip: "Her iki tarafı ayrı ayrı hesapla — sonuçlar aynıysa doğru, farklıysa yanlış.", wrongInsight: "Sol tarafı hesapla, sağ tarafı hesapla — iki sonuç eşitse doğru, değilse yanlış." },
  wpAdd: { mission: "Toplama Görevi!", story: "Görevi oku, verilenleri bul ve toplamayı kullanarak çöz!", briefing: "Problemi oku ve toplayarak çöz!", completion: "Görev raporu kaydedildi!", alienEncounter: "Toplarya'nın habercisi bir görev mektubu getiriyor — 'Hepsini bir araya topla!' diyor.", strategyTip: "'Toplam', 'hepsi', 'birlikte' gibi kelimeler toplama işareti.", wrongInsight: "Problemi tekrar oku — verilenleri altını çiz ve topla." },
  wpSub: { mission: "Çıkarma Görevi!", story: "Görevi oku, verilenleri bul ve çıkarma ile çöz!", briefing: "Problemi oku ve çıkararak çöz!", completion: "Görev başarıyla tamamlandı!", alienEncounter: "Toplarya'nın kurtarma ekibi yıldız taşlarını tahliye ediyor — 'Kaç tane kurtardık?' diye soruyor.", strategyTip: "'Kalan', 'fark', 'eksildi', 'kaç tane az' gibi kelimeler çıkarma işareti.", wrongInsight: "Problemi tekrar oku — büyük sayıdan küçük sayıyı çıkar." },
  wpMul: { mission: "Çarpma Görevi!", story: "Eşit grupları bul, çarpma ile çöz!", briefing: "Eşit grupları bul, çarparak çöz!", completion: "Çarpma görevi kaydedildi!", alienEncounter: "Çarpanya'nın aşçısı her tabağa eşit porsiyon koyuyor — 'Toplam kaç parça?' diyor.", strategyTip: "'Her birinde', 'eşit gruplar', 'tane' gibi kelimeler çarpma işareti.", wrongInsight: "Kaç grup var? Her grupta kaç tane? Grup sayısı × miktar = toplam." },
  wpDiv: { mission: "Bölme Görevi!", story: "Paylaşılan grupları bul, bölme ile çöz!", briefing: "Eşit paylaş, bölerek çöz!", completion: "Paylaşım başarılı!", alienEncounter: "Çarpanya'nın adalet robotu yıldız taşlarını eşit dağıtıyor — 'Herkese adil!' diyor.", strategyTip: "'Eşit paylaş', 'kaçar tane', 'bölüştür' gibi kelimeler bölme işareti.", wrongInsight: "Toplamı gruplara eşit böl — her gruba kaç düşer?" },
  wpCompare: { mission: "Karşılaştırma Görevi!", story: "İki grubu karşılaştır, farkı veya büyük olanı bul!", briefing: "İki grubu karşılaştır, farkı bul!", completion: "Karşılaştırma raporu hazır!", alienEncounter: "Terazya'nın ikiz gezegenleri yarışıyor — 'Aramızdaki fark ne kadar?' diye soruyorlar.", strategyTip: "'Kaç fazla', 'kaç eksik', 'fark' gibi kelimeler karşılaştırma işareti.", wrongInsight: "İki sayıyı yan yana koy — büyükten küçüğü çıkararak farkı bul." },
  ordering: { mission: "Yörünge Sırala!", story: "Enerji kapsüllerini en kısadan en uzuna doğru sırala!", briefing: "Küçükten büyüğe sırala!", completion: "Yörüngeler düzenlendi!", alienEncounter: "Yörünge robotu kapsülleri karıştırmış — doğru sıraya dizmeye yardım et!", strategyTip: "En küçük sayıyı bul, sonra ikinci en küçüğü — sırayla diz.", wrongInsight: "Tüm sayılara bak ve en küçüğünden başla — her seferinde bir sonraki büyüğü bul." },
  beforeAfter: { mission: "Yörünge Komşusunu Bul!", story: "Her sayının bir öncesi ve bir sonrası var — onları bul!", briefing: "Sayının öncesini ve sonrasını bul!", completion: "Komşu gezegenler haritalandı!", alienEncounter: "Sayalon'un yörünge bekçisi iki komşu gezegeni gösteriyor — 'Ortadaki kim?' diye soruyor.", strategyTip: "Bir sayının öncesi için 1 çıkar, sonrası için 1 ekle.", wrongInsight: "Sayı doğrusunu düşün — sağa gidersen 1 artar, sola gidersen 1 azalır." },
  buildNumber: { mission: "Yıldız Taşlarını Yerleştir!", story: "Hedef sayıyı düşün ve tek tek yıldız taşı koyarak oluştur!", briefing: "Hedef sayı kadar taş yerleştir!", completion: "Sayı başarıyla inşa edildi!", alienEncounter: "Sayalon'un mimarı yıldız taşlarını tek tek yerleştiriyor — 'Sen de inşa et!' diyor.", strategyTip: "Her dokunuşta sesli say — hedef sayıya ulaşınca dur.", wrongInsight: "Koyduğun yıldız taşlarını sesli say — hedefe ulaşınca durman gerekiyor." },
  fiveMore: { mission: "5 Yıldız Skalası!", story: "Enerji kapsülünü 5 veya 10'luk referans enerji kapsülüyle karşılaştır — altında mı, eşit mi, üstünde mi?", briefing: "5 veya 10 ile karşılaştır — az mı, çok mu?", completion: "Skala ölçümü tamamlandı!", alienEncounter: "Bileşya'nın ölçüm uzmanı referans kapsülünü uzatıyor — 'Buna göre daha az mı, çok mu?' diyor.", strategyTip: "5'lik referans kapsülüne bak — hedef kapsül daha kısa mı, aynı mı, daha uzun mu?", wrongInsight: "Kapsülleri yan yana getir — referans kapsülüyle karşılaştır." },
  timesTable: { mission: "Strateji Ustası!", story: "İkileme, bir grup ekle, yakın kare — stratejiyle çöz!", briefing: "Çarpım tablosunu stratejiyle çöz!", completion: "Strateji başarıyla uygulandı!", alienEncounter: "Çarpanya'nın ahtapotu 8 kolunu çarpım tablosuna dönüştürüyor!", strategyTip: "Bildiğin bir çarpımdan yola çık: 6×7'yi bilmiyorsan 6×6=36'ya bir 6 ekle.", wrongInsight: "Çarpmayı tekrarlı toplama olarak düşün: 4×3 = 4+4+4." },
  divisionBasic: { mission: "Bölme Ustası!", story: "Bir sayıyı 1'e bölersen kendisi kalır, kendisine bölersen 1 olur — stratejiyle böl!", briefing: "Bölme kurallarını uygula ve çöz!", completion: "Bölme ustası unvanın onaylandı!", alienEncounter: "Çarpanya'nın bölme robotu bir pastayı eşit dilimlere ayırıyor — 'Her dilim kaç parça?' diyor.", strategyTip: "Bölmeyi çarpmanın tersi olarak düşün: 12÷3=? demek 3×?=12 demektir.", wrongInsight: "Çarpım tablosunu düşün — hangi sayı çarpılırsa sonucu verir?" },
  mulDivInverse: { mission: "Ters Bağlantı!", story: "3×4=12 ise 12÷4=3! Çarpma ↔ bölme bağını kur!", briefing: "Çarpma biliyorsan bölmeyi de çöz!", completion: "Ters bağlantı kuruldu!", alienEncounter: "Çarpanya'nın ayna ustası her çarpımın tersini gösteriyor — 'Biri varsa diğeri de var!' diyor.", strategyTip: "Çarpma ve bölme ters işlemler: bir çarpımı biliyorsan iki bölme işlemi de bilirsin.", wrongInsight: "Çarpma ailesini düşün: 3×4=12, 4×3=12, 12÷3=4, 12÷4=3." },
  katConcept: { mission: "Kaç Kat?", story: "5'in 3 katı 15! Kat kavramı = çarpma gücü!", briefing: "Kaç kat? Kat demek çarpma demek!", completion: "Kat kavramı öğrenildi!", alienEncounter: "Çarpanya'nın büyüteç robotu her şeyi katlıyor — 'Bunu 3 katına çıkar!' diyor.", strategyTip: "'Katı' kelimesini 'çarpı' olarak oku: 5'in 3 katı = 5 × 3.", wrongInsight: "Kat = çarpma. 'N'in K katı' demek N × K demektir." },
  placeValue: { mission: "Katman Keşfet!", story: "Soldaki rakam onlukları, sağdaki birlikleri söyler — gerçek değeri bul!", briefing: "Rakamın yeri değerini belirler!", completion: "Basamak sistemi çözüldü!", alienEncounter: "Basamara'nın kedisi piramitlerin katmanlarını gösteriyor — her katman farklı değerde!", strategyTip: "Soldaki rakam onlukları gösterir: 23'teki 2, 20 demek. Sağdaki birlikler: 3.", wrongInsight: "Onlar basamağındaki rakam × 10, birler basamağındaki rakam × 1." },
  bundleTens: { mission: "Onluk Nebula!", story: "10 birliği bir araya getirip onluk oluştur — kaç onluk, kaç birlik kaldı?", briefing: "10'arla paketle! Kaç onluk, kaç birlik?", completion: "Paketleme başarılı!", alienEncounter: "Basamara'nın paketçisi 10'ar 10'ar yıldız taşı bağlıyor — 'Kaç paket oldu?' diye soruyor.", strategyTip: "Her 10 yıldız taşı bir onluk oluşturur. Kalanlar birlik olarak kalır.", wrongInsight: "10'ar 10'ar say — kaç kez 10'a ulaştın? Kalan yıldız taşları birlik." },
  expandForm: { mission: "Galaktik Açılım!", story: "Sayının onluk ve birlik parçalarını ayır — genişletilmiş gösterimi bul!", briefing: "Sayıyı onluk + birlik olarak ayır!", completion: "Sayı açılımı tamamlandı!", alienEncounter: "Basamara'nın bilgini sayıyı parçalarına ayırarak gösteriyor — 'Gizli yapısını gör!' diyor.", strategyTip: "İki basamaklı sayı = onluk değeri + birlik değeri. 45 = 40 + 5.", wrongInsight: "Onlar basamağındaki rakam kaç onluk gösterir? O sayı + birler = sayının kendisi." },
  composeNumber: { mission: "Gezegen Oluştur!", story: "Onluk enerji kapsülleri ve birlik yıldız taşları bir araya getir — hangi sayı oluşur?", briefing: "Onluk ve birlikleri birleştir — hangi sayı?", completion: "Yeni gezegen oluşturuldu!", alienEncounter: "Basamara'nın inşaat ustası onluk ve birlik blokları birleştiriyor — 'Hangi sayı doğdu?' diyor.", strategyTip: "Onluk sayısı × 10 + birlik sayısı = toplam. 3 onluk + 5 birlik = 35.", wrongInsight: "Onlukları 10'ar say, sonra birlikleri ekle." },
  lessMoreEqual: { mission: "Kozmik Terazi!", story: "İki grubu karşılaştır ve doğru kararı ver!", briefing: "Büyük mü, küçük mü, eşit mi?", completion: "Terazi dengede!", alienEncounter: "Terazya'nın dev terazisi sallanıyor — 'Hangi taraf ağır basıyor?' diye soruyor.", strategyTip: "İki kapsüldeki yıldız taşlarını say ve karşılaştır.", wrongInsight: "Her iki taraftaki yıldız taşlarını say — eşitse =, ilki fazlaysa >, azsa <." },
  conservation: { mission: "Yanılsama mı?", story: "Yıldız taşları yerini değiştirdi — ama sayı değişti mi?", briefing: "Dizilim değişti — sayı da değişti mi?", completion: "Yanılsama testi geçildi!", alienEncounter: "Bir uzay büyücüsü yıldız taşlarını farklı dizmiş — sayı değişti mi?", strategyTip: "Dizilim değişse de miktar değişmez — eklenmedi veya çıkarılmadıysa aynı kalır.", wrongInsight: "Hiçbir yıldız taşı eklenmedi veya çıkarılmadı — sadece yerleri değişti, sayı aynı." },
  quantityMatch: { mission: "Göktaşı Eşle!", story: "Yıldız taşlarını say ve doğru sayıyı bul!", briefing: "Say ve doğru sayıyı seç!", completion: "Eşleştirme başarılı!", alienEncounter: "Sayalon'un kartçısı havada kartları çeviriyor — 'Doğru sayıyı yakala!' diyor.", strategyTip: "Dikkatlice say, sonra eşleşen sayıyı bul.", wrongInsight: "Yıldız taşlarını tekrar say — her birine bir kez dokun." },
  fivesFrame: { mission: "Beşli Radar!", story: "5'lik çerçevedeki yıldız taşlarını ve boşlukları say!", briefing: "5'lik çerçevede kaç dolu, kaç boş?", completion: "Beşli radar kalibre edildi!", alienEncounter: "Bileşya'nın teknisyeni 5'lik çerçeveyi kontrol ediyor — 'Kaç kutu dolu, kaçı boş?' diyor.", strategyTip: "5'lik çerçevedeki dolu kutuları say — boşluklar eksik kısmı gösterir.", wrongInsight: "Çerçevedeki dolu kutuları say — toplam 5 kutunun kaçı dolu?" },
  estimateCount: { mission: "Galaktik Tahmin!", story: "Süper kaşif gözüyle hızlı tahmin yap!", briefing: "Saymadan tahmin et — yaklaşık kaç tane?", completion: "Tahmin yeteneğin gelişti!", alienEncounter: "Bir uzay kaşifi dürbünüyle bakıp tahmin ediyor — sen de yapabilirsin!", strategyTip: "Bildiğin bir referans noktası kullan: 5'lik grup tanıyorsan, kaç 5'lik grup var?", wrongInsight: "Küçük bir grubu say (5 gibi), sonra toplam ne kadar büyük olduğunu tahmin et." },
  repeatAdd: { mission: "Galaktik Tekrar!", story: "Eşit grupları topla — çarpmanın ilk adımı!", briefing: "Eşit grupları topla — çarpmanın temeli!", completion: "Tekrarlı toplama görevi tamamlandı!", alienEncounter: "Çarpanya'nın davulcusu her vuruşta aynı sayıyı ekliyor — 'Ritmi tut ve topla!' diyor.", strategyTip: "Her grubu topla: 3 + 3 + 3 = 9. Bu aslında 3 × 3 = 9 demek!", wrongInsight: "Grupları tek tek topla — veya kaç grup var ve her grupta kaç tane var, onu çarp." },
  skipCount: { mission: "Galaktik Ritim!", story: "2'şer, 5'er, 10'ar ritmik say — her adım bir çarpma!", briefing: "2'şer, 5'er, 10'ar atlayarak say!", completion: "Galaktik ritim yakalandı!", alienEncounter: "Sayalon'un müzisyeni ritmik atlayarak gezegenler arası zıplıyor — 'Ritme katıl!' diyor.", strategyTip: "Ritmi tut: 2, 4, 6, 8... Her adımda aynı miktarı ekle.", wrongInsight: "Son sayıya atlama miktarını ekle — bu seni bir sonraki sayıya götürür." },
  backwardCount: { mission: "Geri Sayım!", story: "Büyük sayıdan başla ve geriye doğru say — her adım bir çıkarmadır!", briefing: "Büyük sayıdan geriye doğru say!", completion: "Geri sayım tamamlandı!", alienEncounter: "Sayalon'un roket komutanı geri sayımı başlatıyor — '3, 2, 1... Fırla!' diyor.", strategyTip: "Her geri adım 1 çıkarmaktır: 10, 9, 8, 7...", wrongInsight: "Yavaş ve dikkatli say — her adımda sayı bir azalır." },
  halfDouble: { mission: "Bölün-İkilen!", story: "÷2 bölünme, ×2 ikileme — çarpma-bölme köprüsü!", briefing: "İkiye katla veya yarıya böl!", completion: "Yarılama-ikileme ustası oldun!", alienEncounter: "Şimşeron'un ikiz yıldızları parlıyor — 'Biz her şeyi ikiye katlarız!' diyorlar.", strategyTip: "İkileme = sayıyı kendisiyle topla. Yarılama = sayıyı iki eşit parçaya böl.", wrongInsight: "İki katı = sayı + sayı. Yarısı = iki eşit gruba ayır." },
  arrayDots: { mission: "Yıldız Dizisi!", story: "Diziyi gör, satırları say, sütunları say — çarp!", briefing: "Satır say, sütun say, çarp!", completion: "Dizi keşfi tamamlandı!", alienEncounter: "Çarpanya'nın ahtapotu yıldız taşlarını düzgün sıralara diziyor!", strategyTip: "Satır sayısı × sütun sayısı = toplam. 3 satır, 4 sütun = 12.", wrongInsight: "Satırları say, sütunları say — çarp: satır × sütun = toplam." },
  multiplyVisual: { mission: "Çarpım Gücü!", story: "Her kutuda aynı miktar — grupları çarparak toplamı bul!", briefing: "Eşit grupları çarparak toplamı bul!", completion: "Çarpım gücü yüklendi!", alienEncounter: "Çarpanya'nın koleksiyoncusu eşit kutular dolduruyor — 'Her kutuda aynı, toplamı bul!' diyor.", strategyTip: "Grup sayısı × her gruptaki miktar = toplam.", wrongInsight: "Her kutuyu say, sonra kutu sayısıyla çarp." },
  equalShare: { mission: "Galaktik Paylaşım!", story: "Herkese eşit dağıt — her grupta kaç tane olur?", briefing: "Herkese eşit dağıt — kaçar tane?", completion: "Adil paylaşım gerçekleşti!", alienEncounter: "Toplarya'nın şefi yıldız taşlarını herkese eşit dağıtıyor — 'Adaletli olmalı!' diyor.", strategyTip: "Her gruba birer tane ver, sonra tekrarla — herkes eşit alana kadar devam et.", wrongInsight: "Toplam ÷ grup sayısı = her gruba düşen miktar." },
  groupCount: { mission: "Filo Grupla!", story: "Eşit gruplara ayır ve kaç grup oluştuğunu say!", briefing: "Eşit gruplara ayır — kaç grup oldu?", completion: "Filo düzenlendi!", alienEncounter: "Çarpanya'nın filo komutanı gemileri gruplara ayırıyor — 'Kaç filo oluştu?' diye soruyor.", strategyTip: "Belirtilen miktarda gruplar oluştur ve kaç grup olduğunu say.", wrongInsight: "Toplam ÷ her gruptaki sayı = grup sayısı." },
  numbersInNumbers: { mission: "Sayı Galaksisi!", story: "Bir sayının içindeki tüm parçaları keşfet — 7 = 3+4 = 5+2 = 6+1!", briefing: "Sayının tüm ikili parçalarını bul!", completion: "Sayı galaksisi haritalandı!", alienEncounter: "Sayı galaksisinin keşifçisi her sayının içinde gizli dünyalar buluyor!", strategyTip: "0+N'den başla, N+0'a kadar tüm toplama çiftlerini bul.", wrongInsight: "Her sayı farklı parçalara ayrılabilir: 7 = 1+6 = 2+5 = 3+4." },
  patternAB: { mission: "Galaktik Desen!", story: "Tekrar eden deseni bul ve devam ettir — sonraki ne?", briefing: "Tekrar eden deseni bul ve devam ettir!", completion: "Desen çözüldü!", alienEncounter: "Örünya'nın bukalemunu renk değiştirerek desen oluşturuyor!", strategyTip: "Tekrar eden en küçük birimi bul — çekirdek kalıp bu! Sonra devam ettir.", wrongInsight: "İlk birkaç elemanı grupla — hangi kalıp tekrar ediyor?" },
  growingPattern: { mission: "Büyüyen Desen!", story: "Sayılar büyüyor veya küçülüyor — kuralı bul, sonrakini tahmin et!", briefing: "Büyüyen desenin kuralını bul, sonrakini tahmin et!", completion: "Büyüyen desen kuralı bulundu!", alienEncounter: "Örünya'nın bahçıvanı her sırada daha fazla çiçek ekiyor — 'Sonraki sırada kaç tane?' diyor.", strategyTip: "Ardışık sayılar arasındaki farkı bul — her adımda ne kadar artıyor?", wrongInsight: "Her iki komşu sayı arasındaki farkı hesapla — fark her yerde aynıysa, onu son sayıya ekle." },
  patternTranslate: { mission: "Desen Çevirmen!", story: "Aynı desen, farklı kılık! Çekirdeği keşfet, çevir!", briefing: "Aynı kalıbı farklı elemanlarla yeniden kur!", completion: "Desen çevirisi başarılı!", alienEncounter: "Örünya'nın tercümanı aynı deseni farklı dillerde söylüyor — 'Yapı aynı, kılık farklı!' diyor.", strategyTip: "Kalıbın yapısına bak (A-B-A-B gibi) — aynı yapıyı farklı elemanlarla yeniden oluştur.", wrongInsight: "Kalıbın yapısı önemli, elemanları değil. A-B-A-B yapısı Kırmızı-Mavi ile de Daire-Kare ile de olabilir." },
  counterFromN: { mission: "Yörüngeden Say!", story: "1'den başlamadan herhangi bir sayıdan ileriye-geriye doğru say — gerçek sayma ustası!", briefing: "Verilen sayıdan ileriye veya geriye say!", completion: "Sayma ustalığın onaylandı!", alienEncounter: "Sayalon'un navigatörü haritanın ortasını gösteriyor — 'Buradan devam et!' diyor.", strategyTip: "Başlangıç sayısından itibaren dikkatli say — her adımda 1 ekle veya çıkar.", wrongInsight: "Sayı doğrusunu düşün — verilen sayıdan ileriye veya geriye doğru ilerle." },
  ordinalCount: { mission: "Sıra Keşfi!", story: "1., 2., 3. — sıra sayılarını kullanarak pozisyonları bul!", briefing: "Kaçıncı sırada? Sıra sayısını bul!", completion: "Sıra numaraları öğrenildi!", alienEncounter: "Sayalon'un yarış hakemi gezegenleri sıralıyor — 'Bu gezegen kaçıncı?' diye soruyor.", strategyTip: "Soldan (veya sağdan) başlayarak sırayla say — hedef nesne kaçıncı sırada?", wrongInsight: "Parmağınla işaret ederek say: birinci, ikinci, üçüncü... hedef nesneye ulaşana kadar." },
  decadeCount: { mission: "Onluk Geçişi!", story: "29'dan 30'a, 39'dan 40'a — onluk sınırını geç!", briefing: "Onluk sınırını geç! 29'dan sonra ne gelir?", completion: "Onluk geçişi başarılı!", alienEncounter: "Onluk koruyucusu kapıyı açıyor — '9'dan sonra bir sonraki onluğa hoş geldin!' diyor.", strategyTip: "9'la biten sayıdan sonra yeni bir onluk başlar: 29 → 30, 39 → 40.", wrongInsight: "9'dan sonra 0 gelir ve onlar basamağı 1 artar: 19 → 20, 29 → 30." },
  countOnAdd: { mission: "Büyükten Say!", story: "Büyük sayıyı aklında tut, küçük sayı kadar ileriye say — toplama kolaylaştı!", briefing: "Büyük sayıdan üzerine sayarak topla!", completion: "Üzerine sayma stratejisi öğrenildi!", alienEncounter: "Toplarya'nın pilotu büyük sayıdan devam ediyor — 'Hep ileriye say!' diyor.", strategyTip: "Büyük sayıyı bul, o sayıdan başla ve küçük sayı kadar ileriye say.", wrongInsight: "Büyük sayıyı aklında tut, küçük sayı kadar parmak kaldır ve say." },
  difference: { mission: "Mesafe Ölç!", story: "İki sayı arasındaki farkı bul — mesafeyi ölç!", briefing: "İki sayı arasındaki farkı bul!", completion: "Fark ölçümü tamamlandı!", alienEncounter: "Terazya'nın mühendisi iki gezegen arasındaki mesafeyi ölçüyor — 'Aradaki fark ne kadar?' diyor.", strategyTip: "Küçük sayıdan büyük sayıya kadar ileriye say — kaç adım attıysan fark odur.", wrongInsight: "İki sayıyı yan yana koy — büyükten küçüğü çıkar veya küçükten büyüğe say." },
  inversePractice: { mission: "Ters Düşün!", story: "3+4=7 ise 7-4=3! Toplama ve çıkarma birbirinin tersi!", briefing: "Toplama biliyorsan çıkarmayı da çöz!", completion: "Ters bağlantı kuruldu!", alienEncounter: "Toplarya'nın ayna ustası her toplama işleminin tersini gösteriyor — 'Biri varsa diğeri de var!' diyor.", strategyTip: "Toplama ve çıkarma ters işlemler: bir toplama biliyorsan iki çıkarma da bilirsin.", wrongInsight: "Sayı ailesini düşün: 3+4=7, 4+3=7, 7-3=4, 7-4=3." },
  lengthGuess: { mission: "Gizli Nebula!", story: "Enerji kapsülünün uzunluğuna bakarak kaç yıldız taşı olduğunu tahmin et!", briefing: "Uzunluktan yıldız taşı sayısını tahmin et!", completion: "Uzunluk tahmini başarılı!", alienEncounter: "Terazya'nın ölçüm uzmanı kapsülü uzaktan tutuyor — 'Saymadan tahmin et!' diyor.", strategyTip: "Bildiğin bir referans kapsülüyle karşılaştır — daha uzunsa daha fazla yıldız taşı var.", wrongInsight: "Referans kapsülünü düşün — hedef kapsül ona göre ne kadar uzun veya kısa?" },
  nlPlacement: { mission: "Yörüngeye Yerleştir!", story: "Sayıyı sayı doğrusunda doğru konuma yerleştir!", briefing: "Sayıyı doğru konuma koy!", completion: "Yerleştirme başarılı!", alienEncounter: "Terazya'nın haritacısı sayıları yörüngeye diziyor — 'Doğru yere koy!' diyor.", strategyTip: "Başlangıç ve bitiş noktalarına bak — sayının nereye düşeceğini tahmin et.", wrongInsight: "Ortayı bul, sonra sayının ortanın solunda mı sağında mı olduğuna karar ver." },
  numberLine: { mission: "Kayıp Kapsül!", story: "Sayı doğrusundaki gizli kapsülü bul — konumdan sayıyı tahmin et!", briefing: "Sayı doğrusunda gizli kapsülü bul!", completion: "Kayıp kapsül bulundu!", alienEncounter: "Terazya'nın dedektifi sayı doğrusunda iz sürüyor — 'Gizli kapsül nerede?' diyor.", strategyTip: "İşaretli sayılara bak ve aradaki boşlukları eşit böl.", wrongInsight: "Sayı doğrusundaki işaretleri referans al — hedef konum hangi iki sayı arasında?" },
  numberLineEstimate: { mission: "Galaktik Konum!", story: "Sayı doğrusunda konumu tahmin et — yaklaşık nereye düşer?", briefing: "Konumdan sayıyı tahmin et!", completion: "Konum tahmini başarılı!", alienEncounter: "Terazya'nın navigatörü galaksi haritasında konum belirlemeye çalışıyor — 'Burası neresi?' diyor.", strategyTip: "Başlangıç ve bitiş değerlerini kontrol et, ortayı bul ve tahminini yap.", wrongInsight: "0 ile 10 arasında ortası 5'tir — sayının 5'ten küçük mü büyük mü olduğuna bak." },
  rodSplit: { mission: "İkili Görev!", story: "Enerji kapsülünü kes ve tüm parçalara ayır — her bölünme yeni bir keşif!", briefing: "Kapsülü kes, tüm parçalarını bul!", completion: "Kapsül başarıyla bölündü!", alienEncounter: "Bileşya'nın cerrahı enerji kapsülünü dikkatli kesiyor — 'Her parça değerli!' diyor.", strategyTip: "Farklı noktalardan kes — her kesim iki parça verir ve bunların toplamı hep aynıdır.", wrongInsight: "Nereyi kesersen kes, iki parçanın toplamı her zaman orijinal sayıya eşittir." },
  spaceBalance: { mission: "Uzay Terazisi!", story: "İki tarafı dengele — eşitlik kavramını keşfet!", briefing: "Terazinin iki tarafını dengele!", completion: "Denge sağlandı!", alienEncounter: "Terazya'nın terazi bekçisi iki kefenin eşit olmasını istiyor — 'Denge kurulmalı!' diyor.", strategyTip: "Eşitlik işaretinin iki tarafı aynı değerde olmalı — eksik tarafı tamamla.", wrongInsight: "Sol tarafı hesapla, sağ tarafı hesapla — eşit olmuyorsa eksik olanı bul ve ekle." },
  spaceKitchen: { mission: "Uzay Mutfağı!", story: "Enerji kapsüllerini sürükleyerek hedef sayıyı oluştur — birden fazla çözüm var!", briefing: "Kapsülleri birleştirerek hedef sayıyı yap!", completion: "Uzay tarifi başarılı!", alienEncounter: "Bileşya'nın şefi enerji kapsüllerini karıştırıyor — 'Doğru tarifi bul!' diyor.", strategyTip: "Farklı kapsül kombinasyonlarını dene — aynı hedefe birden fazla yoldan ulaşabilirsin.", wrongInsight: "Küçük kapsüllerden başla ve hedef sayıya ulaşana kadar ekle." },
};

// ═══ MOD HİKÂYELERİ — KÜRTÇE (KURMANCÎ) ══════════════════════════════════
// Referans: FerMat — Ferhenga Matematikê. Eksik mod/alan otomatik TR'ye düşer.
// (Kademeli doldurulur — getModeStory KU'yu TR üzerine birleştirir.)
export const MODE_STORIES_KU = {
  counting: { mission: "Meteoran Bijmêre!", story: "Dest bide her kevirê stêrkê, di her destdayînê de hejmarekê bibêje!", briefing: "Kevirên stêrkan yek bi yek bijmêre!", completion: "Kevirên stêrkan li embarê hatin zêdekirin!", alienEncounter: "Cinawirê piçûk ê Jimaron diqevize û kevirekî stêrkê dirêjî te dike — 'Tu vê jî dihejmêrî?' dibêje.", strategyTip: "Carekê dest bide her kevirê stêrkê û bi deng bihejmêre — ji bo ku tu yekê neqevizînî, li rêzê biçe.", wrongInsight: "Kevirên stêrkan ên ku te jimartin bi tiliya xwe nîşan bide — wisa tu ji bîr nakî ka te kîjan jimart." },
  chipGuess: { mission: "Bîra Fezayê!", story: "Kevirên stêrkan bi baldarî bijmêre — gava ku veşêrin divê tu bînî bîra xwe!", briefing: "Demeke kurt bibîne, paşê bîne bîra xwe — çend heb in?", completion: "Hestepîvanên te yên bîrê bihêztir dibin!", alienEncounter: "Ji nav kevirên stêrkan ên veşartî yekî Birûskonî çavê xwe dixe — 'Min bîne bîra xwe!' dibêje.", strategyTip: "Gava kapsul xuya dibe bi lez bijmêre an bi komkirinê bîne bîra xwe — mîna 5+2.", wrongInsight: "Bi awayê komê bifikire: 5 û çend heb din hene? Ev, bîranîna bê jimartin hêsantir dike." },
  rodBack: { mission: "Birûska Bîrê!", story: "Kevirên stêrkan di awayên cuda de bibîne — kapsula enerjiyê, çarçove, domîno, tilî — û di hiş de bigire!", briefing: "Heman hejmarê di nîşandanên cuda de nas bike!", completion: "Şiyana te ya gelek nîşandanan pêş ket!", alienEncounter: "Şeklguherekî Mêzînyayî heman hejmarê di sê awayên cuda de nîşan dide.", strategyTip: "Her nîşandan heman mîqdarê dibêje — tilî, kapsul, çarçove hemû heman hejmar in.", wrongInsight: "Ne nîşandanê, hejmara kevirên stêrkan bifikire — şekil biguhere jî mîqdar heman dimîne." },
  subitizing: { mission: "Leza Ronahiyê!", story: "Bê jimartin, bi nêrînek fêhm bike ka çend heb in!", briefing: "Bê jimartin, bi nêrînek çend heb in?", completion: "Hêza te ya tavilzanînê bilind bû!", alienEncounter: "Kundê Birûskonê çavên xwe vedike û bi nêrînek hejmarê dibîne!", strategyTip: "Komên biçûk nas bike: heke tu 2 û 3'an bi hev re bibînî, dizanî ku 5 e.", wrongInsight: "Hewl nede bihejmêrî — komên biçûk ên ku dizanî (2, 3, 4) bi nêrînek nas bike." },
  tensFrame: { mission: "Radara Dehan!", story: "Heke rêza jor tijî be 5! Paşê yên rêza jêr zêde bike — bê jimartin ava bike!", briefing: "Rêza jor 5, rêza jêr zêde bike — bi giştî çend?", completion: "Radara dehan hat eyarkirin!", alienEncounter: "Robotê Merteba çarçoveya 10'î dişopîne û dipirse — '5 li jor, li jêr çend hene?'", strategyTip: "Heke rêza jor temam tijî be ew jixwe 5 e. Yên rêza jêr zêde bike: 5 + rêza jêr = giştî.", wrongInsight: "Rêza jor wekî 5 qebûl bike, tenê kevirên stêrkan ên rêza jêr bijmêre û li ser 5'an zêde bike." },
  doubleTensFrame: { mission: "Radara Cot-Dehan!", story: "Çarçoveya çepê temam 10! Yên rastê zêde bike — 10 û çend?", briefing: "Çarçoveya çepê 10, yên rastê zêde bike!", completion: "Pergala radara cot çalak bû!", alienEncounter: "Pîlotên cêwî yên Merteba her yek çarçoveyekê digirin — 'Me çep dagirt, tu rastê bijmêre!' dibêjin.", strategyTip: "Çarçoveya çepê 10. Kevirên stêrkan ên çarçoveya rastê bijmêre û li ser 10'an zêde bike.", wrongInsight: "Çarçoveya çepê her dem 10 e. Tenê yên çarçoveya rastê bijmêre û 10+? bike." },
  comparison: { mission: "Dûeloya Gerstêrkan!", story: "Du kapsulên enerjiyê berhev bike — ya dirêj xwedî kevirên stêrkan ên zêdetir e!", briefing: "Du kapsulan berhev bike — kîjan zêdetir e?", completion: "Pergala berhevkirinê hat nûkirin!", alienEncounter: "Hakemê Mêzînya du kapsulan dikişîne — 'Kîjan giran e?' dipirse.", strategyTip: "Li dirêjahiya kapsulan binêre — di kapsula dirêjtir de kevirên stêrkan zêdetir in.", wrongInsight: "Kapsulan li tenişta hev bîne û berhev bike — kîjan dirêjtir e, ew zêdetir e." },
  matching: { mission: "Stêrkan Hev Bike!", story: "Reqemê bixwîne, kevirên stêrkan ên di kapsula enerjiyê de bijmêre û cota rast bibîne!", briefing: "Reqem û mîqdarê hev bike!", completion: "Hevkirin serketî bû!", alienEncounter: "Robotê postê yê Jimaron dixwaze etîketa rast li her kapsulê bizeliqîne — 'Kîjan kîjan e?' dibêje.", strategyTip: "Pêşî kevirên stêrkan ên di kapsulê de bijmêre, paşê reqemê ku wê hejmarê nîşan dide bibîne.", wrongInsight: "Kevirên stêrkan ên di kapsulê de yek bi yek bijmêre — hejmar divê bi reqemê re li hev bike." },
  quantityMatch: { mission: "Meteoran Hev Bike!", story: "Kevirên stêrkan bijmêre û hejmara rast bibîne!", briefing: "Bijmêre û hejmara rast hilbijêre!", completion: "Hevkirin serketî bû!", alienEncounter: "Kartçiyê Jimaron kartan di hewayê de digerîne — 'Hejmara rast bigire!' dibêje.", strategyTip: "Bi baldarî bijmêre, paşê hejmara ku li hev dike bibîne.", wrongInsight: "Kevirên stêrkan dîsa bijmêre — carekê dest bide her yekê." },
  fivesFrame: { mission: "Radara Pêncan!", story: "Kevirên stêrkan û valahiyên di çarçoveya 5'î de bijmêre!", briefing: "Di çarçoveya 5'î de çend tijî, çend vala?", completion: "Radara pêncan hat eyarkirin!", alienEncounter: "Teknîsyenê Pêkhatya çarçoveya 5'î kontrol dike — 'Çend qutî tijî ne, çend vala ne?' dibêje.", strategyTip: "Qutiyên tijî yên di çarçoveya 5'î de bijmêre — valahî beşa kêm nîşan didin.", wrongInsight: "Qutiyên tijî yên di çarçoveyê de bijmêre — ji 5 qutiyan bi giştî çend tijî ne?" },
  estimateCount: { mission: "Texmîna Galaktîk!", story: "Bi çavê keşifgerê super texmîneke bilez bike!", briefing: "Bê jimartin texmîn bike — bi qasî çend heb in?", completion: "Şiyana te ya texmînê pêş ket!", alienEncounter: "Keşifgerek fezayê bi dûrbîna xwe dinêre û texmîn dike — tu jî dikarî bikî!", strategyTip: "Xaleke referansê ya ku dizanî bi kar bîne: heke koma 5'î nas bikî, çend komên 5'î hene?", wrongInsight: "Komeke biçûk bijmêre (mîna 5), paşê texmîn bike ka giştî çiqas mezin e." },
  skipCount: { mission: "Rîtma Galaktîk!", story: "2-2, 5-5, 10-10 bi rîtm bijmêre — her gav carkirinek e!", briefing: "2-2, 5-5, 10-10 bi qevizandinê bijmêre!", completion: "Rîtma galaktîk hat girtin!", alienEncounter: "Muzîkjenê Jimaron bi rîtm diqevize û di navbera gerstêrkan de dilîze — 'Tev li rîtmê bibe!' dibêje.", strategyTip: "Rîtmê bigire: 2, 4, 6, 8... Di her gavê de heman mîqdarê zêde bike.", wrongInsight: "Li ser hejmara dawî mîqdara qevizandinê zêde bike — ev te dibe hejmara paşîn." },
  backwardCount: { mission: "Jimartina Paşverû!", story: "Ji hejmara mezin dest pê bike û ber bi paş bijmêre — her gav kêmkirinek e!", briefing: "Ji hejmara mezin ber bi paş bijmêre!", completion: "Jimartina paşverû temam bû!", alienEncounter: "Fermandarê roketê yê Jimaron jimartina paşverû dest pê dike — '3, 2, 1... Bifire!' dibêje.", strategyTip: "Her gava paşverû 1 kêmkirin e: 10, 9, 8, 7...", wrongInsight: "Hêdî û bi baldarî bijmêre — di her gavê de hejmar yek kêm dibe." },
  counterFromN: { mission: "Ji Gerdûnê Bijmêre!", story: "Bê dest pêkirina ji 1'ê, ji her hejmarê ber bi pêş an paş bijmêre — hostayê rastîn ê jimartinê!", briefing: "Ji hejmara hatî dayîn ber bi pêş an paş bijmêre!", completion: "Hostatiya te ya jimartinê hat pejirandin!", alienEncounter: "Navîgatorê Jimaron navenda nexşeyê nîşan dide — 'Ji vir bidomîne!' dibêje.", strategyTip: "Ji hejmara destpêkê bi baldarî bijmêre — di her gavê de 1 zêde bike an kêm bike.", wrongInsight: "Jimêrxêzê bifikire — ji hejmara hatî dayîn ber bi pêş an paş biçe." },
  ordinalCount: { mission: "Keşfa Rêzê!", story: "1., 2., 3. — bi hejmarên rêzê cihan bibîne!", briefing: "Di rêza çendan de? Hejmara rêzê bibîne!", completion: "Hejmarên rêzê hatin hîn kirin!", alienEncounter: "Hakemê pêşbaziyê yê Jimaron gerstêrkan rêz dike — 'Ev gerstêrk a çendan e?' dipirse.", strategyTip: "Ji çepê (an rastê) dest pê bike û bi rêz bijmêre — tişta armanc di rêza çendan de ye?", wrongInsight: "Bi tiliya xwe nîşan bide û bijmêre: yekem, duyem, sêyem... heta digihîjî tişta armanc." },
  decadeCount: { mission: "Derbasa Dehekan!", story: "Ji 29'an bo 30'î, ji 39'an bo 40'î — sînorê dehekê derbas bike!", briefing: "Sînorê dehekê derbas bike! Piştî 29'an çi tê?", completion: "Derbasbûna dehekê serketî bû!", alienEncounter: "Parêzgerê dehekê derî vedike — 'Piştî 9'an bi xêr hatî dehekê nû!' dibêje.", strategyTip: "Piştî hejmara ku bi 9'ê diqede dehekek nû dest pê dike: 29 → 30, 39 → 40.", wrongInsight: "Piştî 9'ê 0 tê û mertebeya dehekan 1 zêde dibe: 19 → 20, 29 → 30." },
  conservation: { mission: "Xapandin e?", story: "Kevirên stêrkan cihê xwe guhert — lê gelo hejmar guherî?", briefing: "Rêzbûn guherî — gelo hejmar jî guherî?", completion: "Testa xapandinê hat derbaskirin!", alienEncounter: "Sêhrbazek fezayê kevirên stêrkan bi awayekî din rêz kiriye — gelo hejmar guherî?", strategyTip: "Rêzbûn biguhere jî mîqdar nayê guhertin — heke nehat zêdekirin an jê nehat kirin, wekî xwe dimîne.", wrongInsight: "Tu kevirê stêrkê nehat zêdekirin an jê nehat kirin — tenê cihê wan guherî, hejmar heman e." },
  beforeAfter: { mission: "Cîranê Gerîngehê Bibîne!", story: "Her hejmarê yek a berê û yek a piştî heye — wan bibîne!", briefing: "Ya berê û ya piştî ya hejmarê bibîne!", completion: "Gerstêrkên cîran hatin nexşekirin!", alienEncounter: "Parêzgerê gerokê yê Jimaron du gerstêrkên cîran nîşan dide — 'Yê navîn kî ye?' dipirse.", strategyTip: "Ji bo ya berê ya hejmarekê 1 kêm bike, ji bo ya piştî 1 lê zêde bike.", wrongInsight: "Li xêza hejmaran bifikire — heke ber bi rastê biçî 1 zêde dibe, heke ber bi çepê biçî 1 kêm dibe." },
  buildNumber: { mission: "Kevirên Stêrkan Bi Cî Bike!", story: "Li hejmara armanc bifikire û yek bi yek kevirê stêrkê deyne û çêke!", briefing: "Bi qasî hejmara armanc kevir bi cî bike!", completion: "Hejmar bi serfirazî hat avakirin!", alienEncounter: "Mîmarê Jimaron kevirên stêrkan yek bi yek bi cî dike — 'Tu jî ava bike!' dibêje.", strategyTip: "Di her destdayînê de bi deng bihejmêre — gava gihîştî hejmara armanc raweste.", wrongInsight: "Kevirên stêrkan ên ku te danîn bi deng bihejmêre — gava gihîştî armancê divê tu rawestî." },
  ordering: { mission: "Gerîngehê Rêz Bike!", story: "Kapsulên enerjiyê ji ya herî kurt heta ya herî dirêj rêz bike!", briefing: "Ji biçûk ber bi mezin rêz bike!", completion: "Gerok hatin saz kirin!", alienEncounter: "Robotê gerokê kapsul tevlihev kirine — alîkariya rêzkirina rast bike!", strategyTip: "Hejmara herî biçûk bibîne, paşê ya duyemîn biçûk — bi rêzê rêz bike.", wrongInsight: "Li hemû hejmaran binêre û ji ya herî biçûk dest pê bike — her carê ya piştre mezin bibîne." },
  lessMoreEqual: { mission: "Mêzîna Kozmîk!", story: "Du koman berhev bike û biryara rast bide!", briefing: "Mezin e, biçûk e, an wekhev e?", completion: "Mêzîn di hevsengiyê de ye!", alienEncounter: "Mêzîna dêw a Mêzînya dihejê — 'Kîjan alî giran tê?' dipirse.", strategyTip: "Kevirên stêrkan yên di her du kapsulan de bihejmêre û berhev bike.", wrongInsight: "Kevirên stêrkan yên her du aliyan bihejmêre — heke wekhev be =, heke ya pêşî zêdetir be >, heke kêmtir be <." },
  fiveMore: { mission: "Skala 5 Stêrkan!", story: "Kapsula enerjiyê bi kapsula referansê ya 5 an 10'î re berhev bike — di binî de ye, wekhev e, an di jorî de ye?", briefing: "Bi 5 an 10'î re berhev bike — kêm e, an zêde?", completion: "Pîvana skalayê hat temamkirin!", alienEncounter: "Pisporê pîvanê yê Pêkhatya kapsula referansê dirêj dike — 'Li gorî vê kêmtir e, an zêdetir?' dibêje.", strategyTip: "Li kapsula referansê ya 5'an binêre — kapsula armanc kurtir e, wekhev e, an dirêjtir e?", wrongInsight: "Kapsulan li tenişt hev bîne — bi kapsula referansê re berhev bike." },
  makeFive: { mission: "5 Kevirên Stêrkan Berhev Bike!", story: "Parçeyên 5'an keşf bike — bi jimartina qutiyên vala parçeyê kêm bibîne!", briefing: "5'an temam bike! Valahiyan bihejmêre.", completion: "Te razê 5'an çareser kir!", alienEncounter: "Endezyarê Pêkhatya çarçoveyeke 5'î derdixe — 'Valahiyan bihejmêre!' dibêje.", strategyTip: "Valahiyên di çarçoveya 5'î de, ew parçeyê kêm bi xwe ye.", wrongInsight: "Qutiyên vala yên di çarçoveyê de bihejmêre — hejmara qutiyên vala, mîqdara ji bo temamkirina 5'an lazim e." },
  makeTen: { mission: "10 Kevirên Stêrkan Berhev Bike!", story: "Valahiyên di çarçoveya 10'î de bihejmêre — parçeyê din ê 10'an keşf bike!", briefing: "10'an temam bike! Qutiyên vala bihejmêre.", completion: "Te hevalên 10'an hîn bûn!", alienEncounter: "Biyaniyê 10 destî dixwaze li her destekî kevirê stêrkê bi cî bike — çend dest vala ne?", strategyTip: "Hevalên 10'an: 1+9, 2+8, 3+7, 4+6, 5+5 — vana ji ber bike!", wrongInsight: "Qutiyên vala yên di çarçoveyê de bihejmêre — ew hejmar, mîqdara ji bo temamkirina 10'an lazim e." },
  partWhole: { mission: "Pazila Perçe-Giştî!", story: "Parçeyê kêm ê tevahiyê bibîne û puzzleyê temam bike!", briefing: "Parçeyê kêm ê tevahiyê bibîne!", completion: "Puzzle hat temamkirin!", alienEncounter: "Hostayê puzzleyê yê Pêkhatya parçeyan li hewayê dizivirîne — 'Yê kêm çi ye?' dipirse.", strategyTip: "Ji tevahiyê parçeyê ku tu dizanî kêm bike — yê mayî, parçeyê kêm e.", wrongInsight: "Tevahî = parçe + parçe. Parçeyê ku tu dizanî ji tevahiyê kêm bike — yê mayî bersiva te ye." },
  numbersInNumbers: { mission: "Galaksiya Hejmaran!", story: "Hemû parçeyên di nav hejmarekê de keşf bike — 7 = 3+4 = 5+2 = 6+1!", briefing: "Hemû parçeyên dudukî yên hejmarê bibîne!", completion: "Galaksiya hejmaran hat nexşekirin!", alienEncounter: "Keşifgerê galaksiya hejmaran di nav her hejmarê de cîhanên veşartî dibîne!", strategyTip: "Ji 0+N dest pê bike, heta N+0 hemû cotên zêdekirinê bibîne.", wrongInsight: "Her hejmar dikare li parçeyên cuda were parkirin: 7 = 1+6 = 2+5 = 3+4." },
  spaceKitchen: { mission: "Metbexa Fezayê!", story: "Bi kişandina kapsulên enerjiyê hejmara armanc çêke — ji yekê zêdetir çareserî hene!", briefing: "Kapsulan zêde bike û hejmara armanc çêke!", completion: "Reçeteya fezayê bi ser ket!", alienEncounter: "Aşpêjê Pêkhatya kapsulên enerjiyê tevlihev dike — 'Reçeteya rast bibîne!' dibêje.", strategyTip: "Kombînasyonên cuda yên kapsulan biceribîne — tu dikarî ji çend rêyan bigihîjî heman armancê.", wrongInsight: "Ji kapsulên biçûk dest pê bike û heta gihîştina hejmara armanc lê zêde bike." },
  rodSplit: { mission: "Peywira Cot!", story: "Kapsula enerjiyê bibire û li hemû parçeyan par bike — her parkirin keşfeke nû ye!", briefing: "Kapsulê bibire, hemû parçeyên wê bibîne!", completion: "Kapsul bi serfirazî hat parkirin!", alienEncounter: "Cerrahê Pêkhatya kapsula enerjiyê bi baldarî kêm dike — 'Her parçe biqîmet e!' dibêje.", strategyTip: "Ji xalên cuda kêm bike — her kêmkirin du parçeyan dide û zêdekirina wan her dem heman e.", wrongInsight: "Tu li ku derê kêm bikî, zêdekirina her du parçeyan her dem wekhevî hejmara orîjînal e." },
  placeValue: { mission: "Qatê Keşf Bike!", story: "Reqema çepê dehekan dibêje, ya rastê yekekan — nirxa rastîn bibîne!", briefing: "Cihê reqemê nirxa wê diyar dike!", completion: "Pergala mertebeyê hat çareserkirin!", alienEncounter: "Pisîka Merteba qatên pîramîdan nîşan dide — her qat bi nirxeke cuda ye!", strategyTip: "Reqema çepê dehekan nîşan dide: 2'ya di 23'an de, tê wateya 20'î. Ya rastê yekek e: 3.", wrongInsight: "Reqema di mertebeya dehekan de × 10, reqema di mertebeya yekekan de × 1." },
  bundleTens: { mission: "Nebula Dehekan!", story: "10 yekekan bîne cem hev û dehekekê çêke — çend dehek, çend yekek mane?", briefing: "Bi 10'an pakêt bike! Çend dehek, çend yekek?", completion: "Pakêtkirin bi ser ket!", alienEncounter: "Pakêtkerê Merteba bi 10'an 10'an kevirên stêrkan girê dide — 'Çend pakêt çêbûn?' dipirse.", strategyTip: "Her 10 kevirên stêrkan dehekekê çêdike. Yên mayî wekî yekek dimînin.", wrongInsight: "Bi 10'an 10'an bihejmêre — çend caran tu gihîştî 10'î? Kevirên stêrkan yên mayî yekek in." },
  expandForm: { mission: "Vekirina Galaktîk!", story: "Parçeyên dehek û yekek ên hejmarê veqetîne — nimandina berfireh bibîne!", briefing: "Hejmarê wekî dehek + yekek veqetîne!", completion: "Vebûna hejmarê hat temamkirin!", alienEncounter: "Zanyarê Merteba hejmarê bi parçekirinê nîşan dide — 'Avahiya wê ya veşartî bibîne!' dibêje.", strategyTip: "Hejmara dumertebeyî = nirxa dehekê + nirxa yekekê. 45 = 40 + 5.", wrongInsight: "Reqema di mertebeya dehekan de çend dehekan nîşan dide? Ew hejmar + yekek = hejmar bi xwe." },
  composeNumber: { mission: "Gerstêrk Çêbike!", story: "Kapsulên enerjiyê yên dehek û kevirên stêrkan yên yekek bîne cem hev — kîjan hejmar çêdibe?", briefing: "Dehek û yekekan zêde bike — kîjan hejmar?", completion: "Gerstêrkeke nû hat çêkirin!", alienEncounter: "Hostayê avahiyê yê Merteba blokên dehek û yekek zêde dike — 'Kîjan hejmar ji dayik bû?' dibêje.", strategyTip: "Hejmara dehekan × 10 + hejmara yekekan = giştî. 3 dehek + 5 yekek = 35.", wrongInsight: "Dehekan bi 10'an bihejmêre, paşê yekekan lê zêde bike." },
  addition: { mission: "Hêzan Bike Yek!", story: "Gava du kapsulên enerjiyê tên cem hev, kevirên stêrkan zêde bike — hemûyan bihejmêre an ji ya mezin bidomîne!", briefing: "Du koman zêde bike! Ji ya mezin dest bi jimartinê bike.", completion: "Komên enerjiyê bi serketî hatin yekkirin!", alienEncounter: "Ejderhayê du-serî yê Kombûnyayê li yekbûna du koman temaşe dike — 'Hêz du qat bû!' dibêje.", strategyTip: "Ji hejmara mezin dest pê bike û bi qasî ya biçûk bidomîne — li şûna 3+5, ji 5'an dest pê bike: 6, 7, 8!", wrongInsight: "Kapsula mezin bibîne, ji wê hejmarê bidomîne û bihejmêre — her tilî zêdekirinek e." },
  subtraction: { mission: "Enerjiyê Ji Hev Veqetîne!", story: "Ji koma mezin ya biçûk kêm bike — ji bo dîtina mayî bihejmêre an ber bi pêş bihejmêre!", briefing: "Ji ya mezin ya biçûk kêm bike, mayî bibîne!", completion: "Rêkxistina enerjiyê bi serket!", alienEncounter: "Ejderhayê cemedê yê Kombûnyayê hin kevirên stêrkan bi qerisandinê ji hev vediqetîne.", strategyTip: "Ji hejmara biçûk ber bi mezin ber bi pêş bihejmêre û ferqê bibîne — an ji ya mezin ber bi paş bihejmêre.", wrongInsight: "Bi qasî yê jêkirî kevirên stêrkan bigire, yên mayî bihejmêre — kevirên stêrkan yên ku tu dibînî bersiv in." },
  addChips: { mission: "Kevirên Stêrkan Bike Yek!", story: "Li kevirên stêrkan yên heyî yên nû zêde bike — bigihîje hejmara armanc!", briefing: "Kevirên nû zêde bike, bigihîje armancê!", completion: "Kapsulê gihîşte enerjiya armanc!", alienEncounter: "Madenkarê Kombûnyayê li kapsulê kevirên stêrkan yên nû zêde dike — 'Ji bo gihîştina armancê alîkariya me bike!' dibêje.", strategyTip: "Ji hejmara heyî heta hejmara armanc bihejmêre ka divê çend heb zêde bikî.", wrongInsight: "Ji hejmara heyî ber bi pêş bihejmêre û bigihîje hejmara armanc — te çend gav avêt ewqas divê zêde bikî." },
  removeChips: { mission: "Kevirên Stêrkan Veqetîne!", story: "Bi derxistina kevirên stêrkan ji hev veqetîne — kevirên stêrkan yên mayî bihejmêre!", briefing: "Keviran derxe, mayî bihejmêre!", completion: "Karê veqetandinê temam bû!", alienEncounter: "Ejderhayê cemedê yê Kombûnyayê kevirên stêrkan yên zêde bi pûfkirinê dûr dixe — 'Çend heb man?' dibêje.", strategyTip: "Kevirên stêrkan yên derxistî bigire û yên mayî bihejmêre.", wrongInsight: "Yên derxistî bi tiliya xwe bigire — yên mayî bersiva te ne." },
  countOnAdd: { mission: "Ji Ya Mezin Bihejmêre!", story: "Hejmara mezin di hiş de bigire, bi qasî ya biçûk ber bi pêş bihejmêre — zêdekirin hêsan bû!", briefing: "Ji hejmara mezin li ser bihejmêre û zêde bike!", completion: "Stratejiya li-ser-jimartinê hat hîn kirin!", alienEncounter: "Pîlotê Kombûnyayê ji hejmara mezin didomîne — 'Her dem ber bi pêş bihejmêre!' dibêje.", strategyTip: "Hejmara mezin bibîne, ji wê hejmarê dest pê bike û bi qasî ya biçûk ber bi pêş bihejmêre.", wrongInsight: "Hejmara mezin di hiş de bigire, bi qasî ya biçûk tilî rake û bihejmêre." },
  difference: { mission: "Mesafê Bipîve!", story: "Ferqa di navbera du hejmaran de bibîne — mesafê bipîve!", briefing: "Ferqa di navbera du hejmaran de bibîne!", completion: "Pîvana ferqê temam bû!", alienEncounter: "Endezyarê Mêzînyayê mesafa di navbera du gerstêrkan de dipîve — 'Ferqa di navberê de çiqas e?' dibêje.", strategyTip: "Ji hejmara biçûk heta hejmara mezin ber bi pêş bihejmêre — te çend gav avêt ferq ew e.", wrongInsight: "Her du hejmaran li tenişta hev deyne — ji ya mezin ya biçûk kêm bike an ji biçûk ber bi mezin bihejmêre." },
  inversePractice: { mission: "Berevajî Bifikire!", story: "Eger 3+4=7 be, hingê 7-4=3! Zêdekirin û kêmkirin berevajiyê hev in!", briefing: "Eger zêdekirinê dizanî, kêmkirinê jî çareser bike!", completion: "Girêdana berevajî hat danîn!", alienEncounter: "Hostayê neynikê yê Kombûnyayê berevajiya her zêdekirinê nîşan dide — 'Eger yek hebe, ya din jî heye!' dibêje.", strategyTip: "Zêdekirin û kêmkirin karên berevajî ne: eger zêdekirinek dizanî, du kêmkirinan jî dizanî.", wrongInsight: "Li malbata hejmaran bifikire: 3+4=7, 4+3=7, 7-3=4, 7-4=3." },
  wpAdd: { mission: "Erka Zêdekirinê!", story: "Erkê bixwîne, yên hatine dayîn bibîne û bi karanîna zêdekirinê çareser bike!", briefing: "Pirsgirêkê bixwîne û bi zêdekirinê çareser bike!", completion: "Rapora erkê hat tomarkirin!", alienEncounter: "Peyamberê Kombûnyayê nameyeke erkê tîne — 'Hemûyan bike yek!' dibêje.", strategyTip: "Peyvên wekî 'giştî', 'hemû', 'bi hev re' nîşana zêdekirinê ne.", wrongInsight: "Pirsgirêkê dîsa bixwîne — binê yên hatine dayîn xêz bike û zêde bike." },
  wpSub: { mission: "Erka Kêmkirinê!", story: "Erkê bixwîne, yên hatine dayîn bibîne û bi kêmkirinê çareser bike!", briefing: "Pirsgirêkê bixwîne û bi kêmkirinê çareser bike!", completion: "Erk bi serketî hat temamkirin!", alienEncounter: "Tîma rizgarkirinê ya Kombûnyayê kevirên stêrkan derdixe — 'Me çend heb rizgar kirin?' dibêje.", strategyTip: "Peyvên wekî 'mayî', 'ferq', 'kêm bû', 'çend heb kêmtir' nîşana kêmkirinê ne.", wrongInsight: "Pirsgirêkê dîsa bixwîne — ji hejmara mezin ya biçûk kêm bike." },
  wpCompare: { mission: "Erka Berhevkirinê!", story: "Du koman berhev bike, ferqê an ya mezin bibîne!", briefing: "Du koman berhev bike, ferqê bibîne!", completion: "Rapora berhevkirinê amade ye!", alienEncounter: "Gerstêrkên cêwî yên Mêzînyayê pêşbaziyê dikin — 'Ferqa di navbera me de çiqas e?' dibêjin.", strategyTip: "Peyvên wekî 'çend zêdetir', 'çend kêmtir', 'ferq' nîşana berhevkirinê ne.", wrongInsight: "Her du hejmaran li tenişta hev deyne — ji ya mezin ya biçûk kêm bike û ferqê bibîne." },
  missingNumber: { mission: "Stêrka Winda!", story: "Hejmara veşartî bibîne — şopên wê di kapsulên enerjiyê de ne!", briefing: "Hejmara winda ya di hevkêşeyê de bibîne!", completion: "Stêrka winda hat dîtin!", alienEncounter: "Korsanekî sirûştî yê fezayê hejmarek dizî û reviya — bibe detektîf!", strategyTip: "Hevkêşeyê bixwîne û bi hejmarên ku dizanî ya nenas hesab bike.", wrongInsight: "Her du aliyên hevkêşeyê divê wekhev bin — bi karanîna hejmarên ku dizanî ya kêm bibîne." },
  trueFalse: { mission: "Detektîfê Hevkêşeyê!", story: "Hevkêşeyê vekole — gelo her du alî bi rastî bi qasî hev in? Binêre ka mêzîna kozmîk di hevsengiyê de ye!", briefing: "Ev hevkêşe rast e an çewt e?", completion: "Erka detektîfiyê bi serket!", alienEncounter: "Hakemê Mêzînyayê mêzîneke mezin tîne — her du aliyan kontrol bike!", strategyTip: "Her aliyî cuda hesab bike — eger encam wekhev bin rast e, eger cuda bin çewt e.", wrongInsight: "Aliyê çepê hesab bike, aliyê rastê hesab bike — eger her du encam wekhev bin rast e, eger ne wekhev bin çewt e." },
  timesTable: { mission: "Hostayê Stratejiyê!", story: "Ducarkirin, komek zêde bike, kareya nêzîk — bi stratejiyê çareser bike!", briefing: "Tabloya carkirinê bi stratejiyê çareser bike!", completion: "Stratejî bi serketî hat bicîhanîn!", alienEncounter: "Heştpê yê Carcaryayê 8 milên xwe vediguherîne tabloya carkirinê!", strategyTip: "Ji carkirineke ku dizanî dest pê bike: eger 6×7 nizanî, li 6×6=36 carekê 6 zêde bike.", wrongInsight: "Carkirinê wekî zêdekirina dubare bifikire: 4×3 = 4+4+4." },
  divisionBasic: { mission: "Hostayê Parkirinê!", story: "Eger hejmarek li 1'ê par bikî, ew bi xwe dimîne; eger li xwe par bikî, dibe 1 — bi stratejiyê par bike!", briefing: "Rêzikên parkirinê bicîh bîne û çareser bike!", completion: "Sernavê te yê hostayê parkirinê hat pejirandin!", alienEncounter: "Robotê parkirinê yê Carcaryayê kêkekê li perçeyên wekhev vediqetîne — 'Her perçe çend par e?' dibêje.", strategyTip: "Parkirinê wekî berevajiya carkirinê bifikire: 12÷3=? tê wateya 3×?=12.", wrongInsight: "Li tabloya carkirinê bifikire — kîjan hejmar were carkirin encamê dide?" },
  mulDivInverse: { mission: "Girêdana Berevajî!", story: "Eger 3×4=12 be, hingê 12÷4=3! Girêdana carkirin ↔ parkirinê deyne!", briefing: "Eger carkirinê dizanî, parkirinê jî çareser bike!", completion: "Girêdana berevajî hat danîn!", alienEncounter: "Hostayê neynikê yê Carcaryayê berevajiya her carkirinê nîşan dide — 'Eger yek hebe, ya din jî heye!' dibêje.", strategyTip: "Carkirin û parkirin karên berevajî ne: eger carkirinekê dizanî, du parkirinan jî dizanî.", wrongInsight: "Li malbata carkirinê bifikire: 3×4=12, 4×3=12, 12÷3=4, 12÷4=3." },
  katConcept: { mission: "Çend Car?", story: "3 carî 5 dibe 15! Têgeha carê = hêza carkirinê!", briefing: "Çend car? Car tê wateya carkirinê!", completion: "Têgeha carê hat hîn kirin!", alienEncounter: "Robotê dûrbînê yê Carcaryayê her tiştî car dike — 'Vê 3 caran zêde bike!' dibêje.", strategyTip: "Peyva 'carî' wekî 'car' bixwîne: 3 carî 5 = 3 × 5.", wrongInsight: "Car = carkirin. '3 carî N' tê wateya 3 × N." },
  repeatAdd: { mission: "Dubarekirina Galaktîk!", story: "Komên wekhev zêde bike — gava yekem a carkirinê!", briefing: "Komên wekhev zêde bike — bingeha carkirinê!", completion: "Erka zêdekirina dubare hat temamkirin!", alienEncounter: "Dahollêvanê Carcaryayê di her lêdanê de heman hejmarê zêde dike — 'Ritmê bigire û zêde bike!' dibêje.", strategyTip: "Her komê zêde bike: 3 + 3 + 3 = 9. Ev bi rastî 3 × 3 = 9 e!", wrongInsight: "Koman yek bi yek zêde bike — an çend kom hene û di her komê de çend hene, wê car bike." },
  halfDouble: { mission: "Nîvkirin-Ducarkirin!", story: "÷2 parkirin, ×2 ducarkirin — pira carkirin-parkirinê!", briefing: "Du caran bike an bo nîvê par bike!", completion: "Tu bûyî hostayê nîvkirin-ducarkirinê!", alienEncounter: "Stêrkên cêwî yên Birûskonê dibiriqin — 'Em her tiştî du caran dikin!' dibêjin.", strategyTip: "Ducarkirin = hejmarê bi xwe re zêde bike. Nîvkirin = hejmarê li du parçeyên wekhev par bike.", wrongInsight: "Du car = hejmar + hejmar. Nîvê wê = li du komên wekhev veqetîne." },
  arrayDots: { mission: "Rêza Stêrkan!", story: "Rêzê bibîne, rêzan bijmêre, stûnan bijmêre — car bike!", briefing: "Rêzik bijmêre, stûn bijmêre, car bike!", completion: "Keşfa rêzê hat temamkirin!", alienEncounter: "Ahtapota Carcaryayê kevirên stêrkan li rêzên rêkûpêk rêz dike!", strategyTip: "Hejmara rêzan × hejmara stûnan = giştî. 3 rêz, 4 stûn = 12.", wrongInsight: "Rêzikan bijmêre, stûnan bijmêre — car bike: rêz × stûn = giştî." },
  multiplyVisual: { mission: "Hêza Carkirinê!", story: "Di her qutiyê de heman mîqdar — bi carkirina koman giştiyê bibîne!", briefing: "Komên wekhev car bike û giştiyê bibîne!", completion: "Hêza carkirinê hat barkirin!", alienEncounter: "Berhevkarê Carcaryayê qutiyên wekhev tijî dike — 'Di her qutiyê de wekhev e, giştiyê bibîne!' dibêje.", strategyTip: "Hejmara koman × mîqdara di her komê de = giştî.", wrongInsight: "Her qutiyê bijmêre, paşê bi hejmara qutiyan car bike." },
  equalShare: { mission: "Parvekirina Galaktîk!", story: "Ji her kesî re wekhev par bike — di her komê de çend dikevin?", briefing: "Ji her kesî re wekhev par bike — çend bi çend?", completion: "Parvekirina dadmend pêk hat!", alienEncounter: "Serşêfê Kombûnyayê kevirên stêrkan ji her kesî re wekhev par dike — 'Divê dadmend be!' dibêje.", strategyTip: "Ji her komê re yek bide, paşê dubare bike — heta her kes wekhev distîne bidomîne.", wrongInsight: "Giştî ÷ hejmara koman = mîqdara ku dikeve her komê." },
  groupCount: { mission: "Filoyê Kom Bike!", story: "Li komên wekhev veqetîne û bijmêre çend kom çêbûn!", briefing: "Li komên wekhev veqetîne — çend kom çêbûn?", completion: "Filo hat rêxistinkirin!", alienEncounter: "Fermandarê filoya Carcaryayê keştiyan li koman veqetîne — 'Çend filo çêbûn?' dipirse.", strategyTip: "Bi qasî mîqdara diyarkirî koman çêbike û bijmêre çend kom hene.", wrongInsight: "Giştî ÷ hejmara di her komê de = hejmara koman." },
  wpMul: { mission: "Erka Carkirinê!", story: "Komên wekhev bibîne, bi carkirinê çareser bike!", briefing: "Komên wekhev bibîne, bi carkirinê çareser bike!", completion: "Erka carkirinê hat tomarkirin!", alienEncounter: "Aşpêjê Carcaryayê di her firaqê de pareke wekhev datîne — 'Bi giştî çend parçe?' dibêje.", strategyTip: "Peyvên wekî 'di her yekê de', 'komên wekhev', 'heb' nîşana carkirinê ne.", wrongInsight: "Çend kom hene? Di her komê de çend hene? Hejmara koman × mîqdar = giştî." },
  wpDiv: { mission: "Erka Parkirinê!", story: "Komên parvekirî bibîne, bi parkirinê çareser bike!", briefing: "Wekhev parve bike, bi parkirinê çareser bike!", completion: "Parvekirin bi serketî bû!", alienEncounter: "Robotê dadweriyê yê Carcaryayê kevirên stêrkan wekhev belav dike — 'Ji her kesî re dadmend!' dibêje.", strategyTip: "Peyvên wekî 'wekhev parve bike', 'çend bi çend', 'par bike' nîşana parkirinê ne.", wrongInsight: "Giştiyê li koman wekhev par bike — ji her komê re çend dikeve?" },
  patternAB: { mission: "Nimûneya Galaktîk!", story: "Nimûneya dubarebûyî bibîne û bidomîne — ya pişt re çi ye?", briefing: "Nimûneya dubarebûyî bibîne û bidomîne!", completion: "Nimûne hat çareserkirin!", alienEncounter: "Bûqelemûnê Nimûneyayê bi guhertina rengan nimûneyê çêdike!", strategyTip: "Yekeya herî biçûk a dubarebûyî bibîne — ev qalibê navikê ye! Paşê bidomîne.", wrongInsight: "Çend hêmanên pêşî kom bike — kîjan qalib dubare dibe?" },
  growingPattern: { mission: "Nimûneya Mezinbûyî!", story: "Hejmar mezin dibin an biçûk dibin — qaîdeyê bibîne, ya pişt re texmîn bike!", briefing: "Qaîdeya nimûneya mezinbûyî bibîne, ya pişt re texmîn bike!", completion: "Qaîdeya nimûneya mezinbûyî hat dîtin!", alienEncounter: "Baxçevanê Nimûneyayê di her rêzê de bêtir kulîlk diçîne — 'Di rêza pişt re de çend?' dibêje.", strategyTip: "Ferqa di navbera hejmarên li pey hev bibîne — di her gavê de çiqas zêde dibe?", wrongInsight: "Ferqa di navbera her du hejmarên cîran de bihejmêre — heke ferq li her derê wekhev be, wê li hejmara dawî zêde bike." },
  patternTranslate: { mission: "Wergêrê Nimûneyê!", story: "Heman nimûne, kincê cuda! Navikê keşf bike, wergerîne!", briefing: "Heman qalibî bi hêmanên cuda ji nû ve ava bike!", completion: "Wergera nimûneyê bi serketî bû!", alienEncounter: "Wergêrê Nimûneyayê heman nimûneyê bi zimanên cuda dibêje — 'Avahî wekhev e, kinc cuda ne!' dibêje.", strategyTip: "Li avahiya qalib binêre (mîna A-B-A-B) — heman avahiyê bi hêmanên cuda ji nû ve ava bike.", wrongInsight: "Avahiya qalib girîng e, ne hêmanên wê. Avahiya A-B-A-B dikare bi Sor-Şîn jî, bi Gilover-Çargoşe jî be." },
  spaceBalance: { mission: "Mêzîna Fezayê!", story: "Her du aliyan hevseng bike — têgeha wekheviyê keşf bike!", briefing: "Her du aliyên mêzînê hevseng bike!", completion: "Hevsengî hat saz kirin!", alienEncounter: "Pasvanê mêzînê yê Mêzînyayê dixwaze her du kefî wekhev bin — 'Divê hevsengî were saz kirin!' dibêje.", strategyTip: "Divê her du aliyên nîşana wekheviyê di heman nirxê de bin — aliyê kêm temam bike.", wrongInsight: "Aliyê çepê bihejmêre, aliyê rastê bihejmêre — heke wekhev nebin ya kêm bibîne û zêde bike." },
  lengthGuess: { mission: "Nebula Veşartî!", story: "Li dirêjahiya kapsula enerjiyê binêre û texmîn bike çend kevirên stêrkan hene!", briefing: "Ji dirêjahiyê hejmara kevirên stêrkan texmîn bike!", completion: "Texmîna dirêjahiyê bi serketî bû!", alienEncounter: "Pisporê pîvanê yê Mêzînyayê kapsulê ji dûr digire — 'Bê jimartin texmîn bike!' dibêje.", strategyTip: "Bi kapsuleke referansê ya ku dizanî berhev bike — heke dirêjtir be bêtir kevirên stêrkan hene.", wrongInsight: "Kapsula referansê bifikire — kapsula armanc li gorî wê çiqas dirêj an kurt e?" },
  nlPlacement: { mission: "Li Gerîngehê Bi Cî Bike!", story: "Hejmarê li ser jimêrxêzê li cîhê rast bi cî bike!", briefing: "Hejmarê li cîhê rast deyne!", completion: "Bicîkirin bi serketî bû!", alienEncounter: "Nexşekêşê Mêzînyayê hejmaran li gerdûnê rêz dike — 'Li cîhê rast deyne!' dibêje.", strategyTip: "Li xalên destpêk û dawiyê binêre — texmîn bike hejmar wê li ku bikeve.", wrongInsight: "Navê bibîne, paşê biryarê bide ka hejmar li çepê navê ye an li rastê." },
  numberLine: { mission: "Kapsula Winda!", story: "Kapsula veşartî ya li ser jimêrxêzê bibîne — ji cîhê wê hejmarê texmîn bike!", briefing: "Li ser jimêrxêzê kapsula veşartî bibîne!", completion: "Kapsula winda hat dîtin!", alienEncounter: "Detektîfê Mêzînyayê li ser jimêrxêzê şopê dişopîne — 'Kapsula veşartî li ku ye?' dibêje.", strategyTip: "Li hejmarên nîşankirî binêre û valahiyên di navberê de wekhev par bike.", wrongInsight: "Nîşanên li ser jimêrxêzê referans bigire — cîhê armanc di navbera kîjan du hejmaran de ye?" },
  numberLineEstimate: { mission: "Cihê Galaktîk!", story: "Li ser jimêrxêzê cîhê texmîn bike — bi qasî li ku dikeve?", briefing: "Ji cîh hejmarê texmîn bike!", completion: "Texmîna cîhê bi serketî bû!", alienEncounter: "Navîgatorê Mêzînyayê li nexşeya galaksiyê hewl dide cîh diyar bike — 'Vir ku ye?' dibêje.", strategyTip: "Nirxên destpêk û dawiyê kontrol bike, navê bibîne û texmîna xwe bike.", wrongInsight: "Di navbera 0 û 10'an de nav 5 e — binêre ka hejmar ji 5'an biçûktir e an mezintir." },
};

let _storyLang = "tr";
export const setStoryLang = (lang) => { _storyLang = lang; };
/** Mod hikâyesini aktif dile göre döndürür (KU varsa TR üzerine birleştirir). */
export const getModeStory = (id) => {
  const base = MODE_STORIES[id];
  if (_storyLang === "ku" && MODE_STORIES_KU[id]) return { ...base, ...MODE_STORIES_KU[id] };
  return base;
};

// ═══ UZAY RASTGELE OLAYLARI — Oyun sırasında sürpriz karşılaşmalar ═══
// v5.5: Oyun içi rastgele narratif olaylar — motivasyon ve sürpriz
export const SPACE_EVENTS = [
  { id: "meteor_shower", emoji: "☄️", title: "Meteor Yağmuru!", desc: "Meteorlar sana ışık tutuyor — bonus puan!", effect: "xp_bonus", rarity: 0.08 },
  { id: "friendly_alien", emoji: "👽", title: "Dost Uzaylı!", desc: "Doğru cevapla arkadaş ol!", effect: "xp_bonus", rarity: 0.06 },
  { id: "star_fragment", emoji: "💎", title: "Yıldız Parçası!", desc: "Koleksiyonuna ekle!", effect: "fragment_bonus", rarity: 0.1 },
  { id: "wormhole", emoji: "🌀", title: "Solucan Deliği!", desc: "Kestirme yol açıldı — sürpriz puan!", effect: "xp_bonus", rarity: 0.05 },
  { id: "space_whale", emoji: "🐋", title: "Uzay Balinası!", desc: "Devasa balina geçiyor!", effect: "morale_boost", rarity: 0.07 },
  { id: "crystal_rain", emoji: "✨", title: "Kristal Yağmuru!", desc: "Her doğru cevap ekstra değerli!", effect: "score_multiplier", rarity: 0.04 },
  { id: "nebula_cloud", emoji: "🌌", title: "Nebula Bulutu!", desc: "Matematik enerjin yükleniyor!", effect: "energy_boost", rarity: 0.09 },
  { id: "space_message", emoji: "📡", title: "Uzay Mesajı!", desc: "Uzaydan selam geldi — sürpriz puan!", effect: "xp_bonus", rarity: 0.06 },
  { id: "cosmic_library", emoji: "📚", title: "Kozmik Kütüphane!", desc: "Matematik bilgeliği keşfet!", effect: "xp_bonus", rarity: 0.05 },
  { id: "aurora_dance", emoji: "🌈", title: "Kutup Işığı Dansı!", desc: "Desenleri takip et!", effect: "morale_boost", rarity: 0.07 },
  { id: "time_crystal", emoji: "🔮", title: "Zaman Kristali!", desc: "Kristal parıldadı — sana bonus puan!", effect: "xp_bonus", rarity: 0.04 },
  { id: "space_concert", emoji: "🎵", title: "Uzay Konseri!", desc: "Matematik ritimleri çalıyor!", effect: "morale_boost", rarity: 0.06 },
  { id: "comet_rider", emoji: "☄️", title: "Kuyruklu Yıldız!", desc: "Kuyruklu yıldız geçti — parıltısı sana bonus bıraktı!", effect: "xp_bonus", rarity: 0.05 },
  { id: "galaxy_garden", emoji: "🌺", title: "Galaktik Bahçe!", desc: "Sayı sırları keşfet!", effect: "fragment_bonus", rarity: 0.07 },
];

// Rastgele uzay olayı seç (her 3-5 soruda bir)
export const getRandomSpaceEvent = () => {
  const roll = Math.random();
  let cumulative = 0;
  for (const event of SPACE_EVENTS) {
    cumulative += event.rarity;
    if (roll < cumulative) return event;
  }
  return null;
};

// ═══ KAPTAN GÜNLÜĞÜ — Narratif Süreklilik Sistemi ══════════════════════════
// Her oyun oturumundan sonra kaptan günlüğü girişi oluştur
// Oyuncunun yolculuğunu hikâyeleştirir — her giriş önceki bağlama bağlanır
export const CAPTAINS_LOG = {
  // Oturum sonucu + gezegen bazlı günlük girişleri
  generateEntry: (planet, mode, acc, level, gamesOnPlanet, streak) => {
    const date = new Date();
    const stardate = `${date.getFullYear()}.${String(date.getMonth()+1).padStart(2,'0')}.${String(date.getDate()).padStart(2,'0')}`;

    // Performansa göre günlük tonu
    if (acc >= 90) {
      const entries = [
        `${stardate} — ${planet}: Olağanüstü keşif! Seviye ${level} kusursuz! ⭐`,
        `${stardate} — ${planet}: %${acc} doğruluk — parlıyoruz!`,
        `${stardate} — ${planet}: Yeni sırlar açıldı! Enerji doruğunda!`,
      ];
      return entries[gamesOnPlanet % entries.length];
    }
    if (acc >= 70) {
      const entries = [
        `${stardate} — ${planet}: İstikrarlı keşif! %${acc} başarı. 🚀`,
        `${stardate} — ${planet}: İlerliyoruz! Gemi sağlam, devam!`,
        `${stardate} — ${planet}: Her hata öğretiyor, güçleniyoruz!`,
      ];
      return entries[gamesOnPlanet % entries.length];
    }
    const entries = [
      `${stardate} — ${planet}: Zorlu gün ama devam ediyoruz! 💪`,
      `${stardate} — ${planet}: Beynimiz yeni bağlantılar kuruyor!`,
      `${stardate} — ${planet}: Her deneme bizi yaklaştırıyor!`,
    ];
    return entries[gamesOnPlanet % entries.length];
  },

  // Milestone girişleri — özel anlar
  milestones: {
    firstGame: "İlk giriş! Galaksi keşfine çıkıyoruz! 🚀",
    firstPerfect: "%100 doğruluk! Kusursuz görev! ⭐",
    tenGames: "10 görev tamam! Artık acemi değilim!",
    newPlanet: "Yeni gezegen! Yeni macera başlıyor!",
    shipUpgrade: "GEMİ YÜKSELTMESİ! Daha güçlüyüz! 🚀",
    streak7: "7 ardışık doğru! Süper güç doruğunda!",
    allBadges: "Tüm rozetler kazanıldı! Adım Adım Usta!",
    twentyGames: "20 görev! Galaksi haritası şekilleniyor!",
    fiftyGames: "50 görev! NuméraYıldız parlıyor!",
    streak10: "10 ardışık doğru! Çalışmanın gücü! 💪",
    levelMax: "Seviye 7 — Usta! Sayılar artık dost!",
    firstArtifact: "İlk uzay eseri keşfedildi! 💎",
  },
};

// ═══ GÖREV STRATEJİ YANSITMA — Sonuç ekranı pedagogik derinlik ═══
// Her modda performansa göre strateji yansıtma mesajları
export const STRATEGY_REFLECTIONS = {
  // Sayma stratejileri
  counting: {
    mastery: ["Birebir eşleme ustası oldun! Her nesneye tam bir kez dokundun.", "Sayma ilkelerini mükemmel uyguladın — kardinalite ilkesi: son söylediğin sayı toplamı verir!"],
    growing: ["Sabit sıra ilkesini uyguluyorsun — sayıları hep aynı sırada söylüyorsun, harika!", "Her nesneye bir kez dokunmayı öğreniyorsun — bu birebir eşleme ilkesi!"],
    struggling: ["Nesneleri tek tek işaretle ve sesli say — her birine bir kez dokun.", "Sayarken nesneleri sıraya diz — böylece hangisini saydığını takip edebilirsin."],
  },
  addition: {
    mastery: ["Büyükten saymaya başlama stratejini mükemmel kullanıyorsun!", "10'a tamamlama ve parçalama stratejilerin güçlü — zihinsel toplama ustasısın!"],
    growing: ["Büyük sayıdan başlayıp küçük sayı kadar ileri saymayı deniyorsun — doğru yoldasın!", "Toplama stratejilerin gelişiyor — 10'un arkadaşlarını kullanmayı dene!"],
    struggling: ["Somut düşün: Önce büyük grubu bul, sonra küçük grubun yıldız taşlarını tek tek ekle.", "Parmaklarını kullan — büyük sayıyı kafanda tut, küçük sayı kadar parmak kaldır ve say."],
  },
  subtraction: {
    mastery: ["İleriye sayma stratejini harika kullanıyorsun — çıkarma ve toplama arasındaki bağı gördün!", "Sayı aileleri düşüncen güçlü — her çıkarma bir toplama sorusu olarak da düşünülebilir!"],
    growing: ["Geriye sayma veya ileriye sayma — iki strateji de kullanıyorsun, harika!", "Çıkarmayı toplama ile kontrol etmeyi öğreniyorsun — bu güçlü bir matematik becerisi!"],
    struggling: ["Somut düşün: Büyük gruptan çıkarılacak kadarını kapat, kalanları say.", "Sayı doğrusunda geriye sayarak düşün — veya küçükten büyüğe ileriye sayarak farkı bul."],
  },
  timesTable: {
    mastery: ["Çarpım tablosunda strateji ustasısın! İkileme, yakın kare, bir grup ekleme — hepsini kullanıyorsun.", "Değişme özelliğini mükemmel kullanıyorsun — 7×3 = 3×7, bildiğinden bilmediğine köprü kuruyorsun!"],
    growing: ["Çarpım tablosu stratejilerin gelişiyor — bildiğin çarpımlardan yola çıkarak yenilerini hesaplayabiliyorsun.", "Tekrarlı toplama ile çarpma arasındaki bağı kurmaya başladın — harika bir ilerleme!"],
    struggling: ["Her çarpma aslında eşit grupları toplamaktır: 4×3 = 3+3+3+3. Grupları düşün!", "Bildiğin bir çarpımdan yola çık: 6×5 biliyorsan, 6×6 = 6×5 + 6 = 36!"],
  },
  makeTen: {
    mastery: ["10'un arkadaşlarını tamamen öğrendin! Bu bilgi toplama ve çıkarmada süper güç veriyor.", "10'a tamamlama stratejin otomatikleşti — artık düşünmeden kullanıyorsun!"],
    growing: ["10'un arkadaşlarını öğreniyorsun — 1+9, 2+8, 3+7, 4+6, 5+5. Her gün biraz daha güçleniyorsun!"],
    struggling: ["10'luk çerçeveyi düşün: boş kutuları say, o sayı 10'a tamamlamak için gereken miktar."],
  },
  subitizing: {
    mastery: ["Anlık algılama gücün muhteşem! Saymadan, bir bakışta miktarı görüyorsun.", "Kavramsal algılama ustasısın — grupları görüp zihinden topluyorsun!"],
    growing: ["Küçük grupları bir bakışta tanımaya başladın — 2, 3, 4 için hızlısın!", "Gruplama stratejin gelişiyor — 5+2 gibi bildiğin alt grupları kullanıyorsun."],
    struggling: ["Küçük grupları tanımaya çalış: 2 ve 3'ü bir bakışta görürsen 5 olduğunu bilirsin.", "Düzenli dizilimler sana yardımcı olur — zar desenleri gibi düşün."],
  },
  default: {
    mastery: ["Strateji ustasısın! Farklı yaklaşımları duruma göre kullanabiliyorsun.", "Matematik düşünme gücün doruk noktasında — her probleme birden fazla yoldan yaklaşabiliyorsun!"],
    growing: ["Stratejilerin gelişiyor — her oyunda biraz daha güçleniyorsun!", "Doğru yoldasın — pratik yaptıkça stratejilerin otomatikleşecek."],
    struggling: ["Somut düşün: Nesneleri, parmakları veya çizimleri kullan — görsel düşünce seni güçlendirir.", "Her hata bir öğrenme fırsatı — beynin yeni bağlantılar kuruyor, devam et!"],
  },
};

// ═══ KÜRTÇE STRATEJİ YANSITMA MESAJLARI ═══════════════════════════════
// Referans: Ferhenga Matematikê — TÊGEHÊN PERWERDEYÎ bölümü
export const STRATEGY_REFLECTIONS_KU = {
  counting: {
    mastery: ["Tu bûyî hostayê hevsankirina yekeyê! Te li her tiştî tam carekê dest da.", "Te prensîbên jimartinê bi tevahî bicîh anîn — prensîba kardinalîteyê: hejmara dawî ya ku te got giştî dide!"],
    growing: ["Tu prensîba rêza sabît bicîh tînî — tu hejmaran her dem di heman rêzê de dibêjî, pîroz be!", "Tu fêrî destdayîna carekê li her tiştî dibî — ev prensîba hevsankirina yekeyê ye!"],
    struggling: ["Tiştan yek bi yek nîşan bide û bi deng bihejmêre — li her yekî carekê dest bide.", "Dema dihejmêrî tiştan li rêzê rûne — wisa tu dişopînî ka kîjanê te jimartiye."],
  },
  addition: {
    mastery: ["Tu stratejiya destpêkirina ji mezin bi awayekî bêkêmasî bi kar tînî!", "Stratejiyên te yên temamkirina 10'an û parçekirinê bihêz in — tu hostayê zêdekirina zikrî yî!"],
    growing: ["Tu hewl didî ji hejmara mezin dest pê bikî û bi qasî ya biçûk bihejmêrî — tu li ser rêya rast î!", "Stratejiyên te yên zêdekirinê pêş dikevin — hevalên 10'an bi kar bîne!"],
    struggling: ["Somut bifikire: Pêşî koma mezin bibîne, paşê kevirên stêrkan yên koma biçûk yek bi yek zêde bike.", "Tiliyên xwe bi kar bîne — hejmara mezin di hiş de bigire, bi qasî ya biçûk tilî rake û bihejmêre."],
  },
  subtraction: {
    mastery: ["Tu stratejiya jimartina ber bi pêş bi awayekî ecêb bi kar tînî — te girêdana di navbera kemkirin û zêdekirinê de dît!", "Ramana te ya malbata hejmaran bihêz e — her kemkirin dikare wekî pirsa zêdekirinê jî were fikirîn!"],
    growing: ["Jimartina ber bi paş an ber bi pêş — tu her du stratejiyan bi kar tînî, pîroz be!", "Tu fêrî kontrolkirina kemkirinê bi zêdekirinê re dibî — ev şiyaneke bihêz a matematîkê ye!"],
    struggling: ["Somut bifikire: Ji koma mezin bi qasî yê derxistî veşêre, yên mayî bihejmêre.", "Li ser jimêrxêzê ber bi paş bihejmêre — an jî ji biçûk heta mezin ber bi pêş bihejmêre û ferqê bibîne."],
  },
  timesTable: {
    mastery: ["Di tabloya carkirinê de tu hostayê stratejiyê yî! Ducarkirin, kareya nêzîk, zêdekirina komê — hemûyan bi kar tînî.", "Tu taybetmendiya guheztinê bi awayekî bêkêmasî bi kar tînî — 7×3 = 3×7, ji ya ku dizanî pira ber bi ya ku nizanî ava dikî!"],
    growing: ["Stratejiyên te yên tabloya carkirinê pêş dikevin — tu ji carkirinên ku dizanî yên nû jî bihejmêrî.", "Te dest bi avakrina pira di navbera zêdekirina dubare û carkirinê de kir — pêşveçûneke ecêb!"],
    struggling: ["Her carkirin bi rastî zêdekirina komên wekhev e: 4×3 = 3+3+3+3. Li koman bifikire!", "Ji carkirineke ku dizanî dest pê bike: 6×5 dizanî, 6×6 = 6×5 + 6 = 36!"],
  },
  makeTen: {
    mastery: ["Te hevalên 10'an bi tevahî hîn bûn! Ev zanîn di zêdekirin û kemkirinê de hêzeke super dide.", "Stratejiya te ya temamkirina 10'an otomatîk bû — tu êdî bê fikirîn bi kar tînî!"],
    growing: ["Tu hevalên 10'an fêr dibî — 1+9, 2+8, 3+7, 4+6, 5+5. Her roj hinek bihêztir dibî!"],
    struggling: ["Çarçoveya 10'î bifikire: qutiyên vala bihejmêre, ew hejmar ji bo temamkirina 10'an lazim e."],
  },
  subitizing: {
    mastery: ["Hêza tavilzanîna te ecêb e! Bê jimartin, bi nêrînek mîqdarê dibînî.", "Tu hostayê tavilzanîna têgehî yî — koman dibînî û di hiş de zêde dikî!"],
    growing: ["Tu dest bi naskirina komên biçûk bi nêrînek kir — ji bo 2, 3, 4 bilez î!", "Stratejiya te ya komkirinê pêş dikeve — tu binkomên ku dizanî mîna 5+2 bi kar tînî."],
    struggling: ["Komên biçûk naskirinê biceribîne: 2 û 3 bi nêrînek bibînî 5 bûyîna wê dizanî.", "Rêzkirinên birêkûpêk alîkariya te dikin — mîna desenên zarê bifikire."],
  },
  default: {
    mastery: ["Tu hostayê stratejiyê yî! Tu nêrînên cuda li gorî rewşê bi kar tînî.", "Hêza te ya ramana matematîkê li lûtkeyê ye — tu ji çend rêyan nêzîkî her pirsgirêkê dibî!"],
    growing: ["Stratejiyên te pêş dikevin — bi her lîstikê hinek bihêztir dibî!", "Tu li ser rêya rast î — bi pratîkê stratejiyên te dê otomatîk bibin."],
    struggling: ["Somut bifikire: Tiştan, tiliyan an nîgaran bi kar bîne — ramana dîtbarî te xurt dike.", "Her xeletî derfeteke fêrbûnê ye — mejiyê te girêdanên nû ava dike, bidomîne!"],
  },
};

// Strateji yansıtma mesajı al (dil destekli)
export const getStrategyReflection = (mode, acc, lang = "tr") => {
  const reflections = lang === "ku" ? STRATEGY_REFLECTIONS_KU : STRATEGY_REFLECTIONS;
  const pool = reflections[mode] || reflections.default;
  const tier = acc >= 85 ? "mastery" : acc >= 55 ? "growing" : "struggling";
  const msgs = pool[tier] || pool.growing;
  return msgs[Math.floor(Math.random() * msgs.length)];
};

// ═══ GEZEGENLERARASI GEÇİŞ MESAJLARI — Ekran geçişlerinde narratif köprü ═══
export const PLANET_TRANSITION_STORIES = {
  toGame: (planetName, modeName) => {
    const stories = [
      `${planetName} yörüngesine giriş yapılıyor... Görev: ${modeName}!`,
      `Geminin motorları çalışıyor — ${planetName}'a iniş başladı!`,
      `${planetName}'ın atmosferi titreşiyor... Matematik enerjisi algılandı!`,
      `Koordinatlar kilitleniyor: ${planetName}, görev alanı hazır!`,
    ];
    return stories[Math.floor(Math.random() * stories.length)];
  },
  toResults: (planetName, acc) => {
    if (acc >= 90) return `${planetName} görev raporu: OLAĞANÜSTÜ BAŞARI!`;
    if (acc >= 70) return `${planetName} görev raporu: İYİ İLERLEME.`;
    return `${planetName} görev raporu: DEVAM EDEN EĞİTİM.`;
  },
  toJourney: () => {
    const msgs = [
      "Galaksi haritasına geri dönülüyor...",
      "Yörünge haritası yeniden yükleniyor...",
      "NuméraYıldız seni yönlendiriyor...",
    ];
    return msgs[Math.floor(Math.random() * msgs.length)];
  },
};

// ═══ UZAY ESERLERİ — Toplanabilir Matematik Eserler Sistemi ═══════════════
// Her gezegenden toplanabilen eşsiz eserler — matematik kavramlarına bağlı
export const ALIEN_ARTIFACTS = [
  // Sayalon Eserleri (Sayma)
  { id: "sayalon_abacus", planet: "Sayalon", emoji: "🧮", name: "Antik Abaküs", desc: "Sayalon'un ilk sakinlerinin kullandığı sayma aleti. Binlerce yıl önce yapılmış.", rarity: "common", unlockCondition: "counting modunda %80+ başarı", mathFact: "İlk abaküs 5000 yıl önce Mezopotamya'da icat edildi!" },
  { id: "sayalon_scroll", planet: "Sayalon", emoji: "📜", name: "Sayı Papirüsü", desc: "Üzerinde evrenin ilk sayıları yazılı antik bir rulo.", rarity: "rare", unlockCondition: "3 farklı sayma modunda oyna", mathFact: "Sıfır sayısı Hintliler tarafından M.S. 628'de keşfedildi!" },
  { id: "sayalon_compass", planet: "Sayalon", emoji: "🧭", name: "Yıldız Pusulası", desc: "Sayıları takip ederek galakside yol bulur.", rarity: "epic", unlockCondition: "Sayma modlarında toplam %90+ genel başarı", mathFact: "Sayılar sonsuz — ne kadar büyük bir sayı düşünürsen düşün, her zaman daha büyüğü var!" },

  // Şimşeron Eserleri (Anlık Algılama)
  { id: "simseron_lens", planet: "Şimşeron", emoji: "🔮", name: "Kristal Mercek", desc: "Bir bakışta miktarı gösteren büyülü mercek.", rarity: "common", unlockCondition: "subitizing modunda %80+ başarı", mathFact: "İnsanlar saymadan 1-4 nesneyi bir bakışta algılayabilir — buna 'subitizing' denir!" },
  { id: "simseron_eye", planet: "Şimşeron", emoji: "👁️", name: "Kartal Gözü", desc: "Uzak yıldızları bile görebilen efsanevi göz.", rarity: "rare", unlockCondition: "subitizing ve tensFrame modlarında %85+ başarı", mathFact: "Beyin, düzenli grupları düzensizlerden çok daha hızlı sayar!" },
  { id: "simseron_flash", planet: "Şimşeron", emoji: "⚡", name: "Şimşek Taşı", desc: "Matematiksel düşünceyi ışık hızına çıkarır.", rarity: "epic", unlockCondition: "Tüm anlık algılama modlarında %90+", mathFact: "Beyin, matematiksel bir hesabı 0.3 saniyede yapabilir!" },

  // Terazya Eserleri (Karşılaştırma)
  { id: "terazya_scale", planet: "Terazya", emoji: "⚖️", name: "Kozmik Terazi", desc: "Evrendeki her şeyi tartabilen minyatür terazi.", rarity: "common", unlockCondition: "comparison modunda %80+ başarı", mathFact: "Teraziler 4000 yıl önce Mısır'da icat edildi — ticaret için kullanılırdı!" },
  { id: "terazya_crown", planet: "Terazya", emoji: "👑", name: "Denge Tacı", desc: "Taşıyanın her zaman doğru karşılaştırma yapmasını sağlar.", rarity: "epic", unlockCondition: "Karşılaştırma modlarında %90+ genel başarı", mathFact: "'Eşit' işareti (=) 1557'de Robert Recorde tarafından icat edildi!" },

  // Bileşya Eserleri (Bileşim)
  { id: "bilesya_puzzle", planet: "Bileşya", emoji: "🧩", name: "Sonsuz Puzzle", desc: "Parçaları her zaman yeni şekillerde birleşen gizemli puzzle.", rarity: "common", unlockCondition: "makeFive veya makeTen modunda %80+ başarı", mathFact: "10'un arkadaşları (1+9, 2+8, 3+7, 4+6, 5+5) toplama-çıkarmayı hızlandırır!" },
  { id: "bilesya_gem", planet: "Bileşya", emoji: "💎", name: "Bileşim Mücevheri", desc: "Sayıların gizli yapısını gösteren parlak mücevher.", rarity: "epic", unlockCondition: "Bileşim modlarında toplam 20+ oyun", mathFact: "Her sayı sonsuz farklı şekilde parçalara ayrılabilir!" },

  // Toplarya Eserleri (İşlemler)
  { id: "toplarya_sword", planet: "Toplarya", emoji: "⚔️", name: "Toplama Kılıcı", desc: "İki gücü birleştirip tek güçlü darbe yapan efsanevi kılıç.", rarity: "common", unlockCondition: "addition modunda %80+ başarı", mathFact: "Toplama ve çıkarma ters işlemlerdir — birini bilirsen diğerini de bilirsin!" },
  { id: "toplarya_shield", planet: "Toplarya", emoji: "🛡️", name: "Çıkarma Kalkanı", desc: "Fazla enerjiyi emen koruyucu kalkan.", rarity: "rare", unlockCondition: "subtraction modunda %85+ başarı", mathFact: "Çıkarmayı 'ileriye sayarak' yapmak genellikle geriye saymaktan daha kolaydır!" },
  { id: "toplarya_helm", planet: "Toplarya", emoji: "🪖", name: "Stratejist Miğferi", desc: "Taşıyanın matematik stratejisini güçlendiren efsanevi miğfer.", rarity: "epic", unlockCondition: "Toplama ve çıkarma modlarında %90+ genel başarı", mathFact: "Matematik, problem çözmenin birçok farklı yolu olduğunu öğretir!" },

  // Çarpanya Eserleri (Çarpma/Bölme)
  { id: "carpanya_octopus", planet: "Çarpanya", emoji: "🐙", name: "Altın Ahtapot", desc: "8 kollu matematik ustası — her kolda farklı bir çarpım.", rarity: "common", unlockCondition: "timesTable modunda %80+ başarı", mathFact: "Çarpım tablosundaki 100 çarpımın yarısından fazlası tekrardır (3×4 = 4×3)!" },
  { id: "carpanya_star", planet: "Çarpanya", emoji: "🌟", name: "Çarpım Yıldızı", desc: "Galaksinin en parlak yıldızı — çarpmanın gücünü simgeler.", rarity: "epic", unlockCondition: "Çarpma-bölme modlarında toplam %90+ başarı", mathFact: "Çarpma, tekrarlı toplamanın kısayoludur — ama çok daha güçlü!" },

  // Basamara Eserleri (Basamak Değeri)
  { id: "basamara_pyramid", planet: "Basamara", emoji: "🏛️", name: "Sayı Piramidi", desc: "Her katmanı farklı basamak değerini temsil eden antik piramit.", rarity: "rare", unlockCondition: "placeValue modunda %85+ başarı", mathFact: "Onluk sayı sistemi Hindistan'da icat edildi ve Araplar aracılığıyla dünyaya yayıldı!" },
  { id: "basamara_key", planet: "Basamara", emoji: "🔑", name: "Basamak Anahtarı", desc: "Sayıların gizli yapısının kilidini açan altın anahtar.", rarity: "epic", unlockCondition: "Tüm basamak değeri modlarında %90+", mathFact: "Bir rakamın değeri konumuna göre değişir — 2'nin '23'teki değeri 20, '32'deki değeri ise 2!" },

  // Örünya Eserleri (Örüntü)
  { id: "orunya_chameleon", planet: "Örünya", emoji: "🦎", name: "Desen Bukalemunu", desc: "Desenlere göre renk değiştiren akıllı bukalemun.", rarity: "common", unlockCondition: "patternAB modunda %80+ başarı", mathFact: "Doğada her yerde desenler var — arı kovanları altıgen, çiçek yaprakları Fibonacci spirali!" },
  { id: "orunya_mirror", planet: "Örünya", emoji: "🪞", name: "Simetri Aynası", desc: "Her deseni yansıtarak çeviren büyülü ayna.", rarity: "epic", unlockCondition: "Tüm örüntü modlarında %90+", mathFact: "Cebir, aslında desenlerin dilidir — 'x' bilinmeyen bir desendeki eksik parçadır!" },

  // Efsanevi Eser (Tüm Gezegenler)
  { id: "galactic_core", planet: "Galaksi Çekirdeği", emoji: "🌌", name: "Galaksi Kalbi", desc: "Tüm gezegenlerin bilgeliğini birleştiren efsanevi eser. Evrenin matematik sırrını barındırır.", rarity: "legendary", unlockCondition: "20+ farklı modda %80+ başarı", mathFact: "Evren matematiksel yasalarla çalışır — gezegenlerin yörüngeleri, yıldızların ışığı, hatta müzik bile matematiğin bir parçası!" },
];

// Eser durumunu kontrol et
export const checkArtifactUnlock = (artifactId, modeStats) => {
  const artifact = ALIEN_ARTIFACTS.find(a => a.id === artifactId);
  if (!artifact) return false;
  // Basit kontrol — tam kontrol game engine'de yapılır
  return true;
};

// Rastgele eser öner (henüz kazanılmamışlardan)
export const suggestNextArtifact = (unlockedIds, currentPlanet) => {
  const locked = ALIEN_ARTIFACTS.filter(a => !unlockedIds.includes(a.id));
  // Mevcut gezegene ait olanlara öncelik ver
  const planetArtifacts = locked.filter(a => a.planet === currentPlanet);
  if (planetArtifacts.length > 0) return planetArtifacts[0];
  // Olmazsa rarity sırasına göre
  const rarityOrder = { common: 0, rare: 1, epic: 2, legendary: 3 };
  locked.sort((a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity]);
  return locked[0] || null;
};

// ═══ GEMİ YÜKSELTMELERİ — Yıldız Parçası Sistemi ═══════════════════════
// Her yükseltme yeni yetenekler ve görsel değişimler getirir
export const SHIP_UPGRADES = [
  { level: 1, name: "Keşif Kapsülü", emoji: "🛸", min: 0, max: 24, color: "#94a3b8", desc: "İlk geminiz — küçük ama cesur!", ability: "Temel navigasyon", hull: 1 },
  { level: 2, name: "Yıldız Yelkenlisi", emoji: "⛵", min: 25, max: 74, color: "#60a5fa", desc: "Yıldız rüzgârlarıyla yelken açan zarif gemi.", ability: "Rüzgâr itişi — ipucu bonusu", hull: 2 },
  { level: 3, name: "Nebula Kruvazörü", emoji: "🚀", min: 75, max: 149, color: "#8b5cf6", desc: "Nebula bulutlarını aşabilen güçlü kruvazör.", ability: "Nebula kalkanı — hata koruması", hull: 3 },
  { level: 4, name: "Kuantum Fırkateyni", emoji: "🛡️", min: 150, max: 299, color: "#10b981", desc: "Kuantum motoruyla donatılmış savaş gemisi.", ability: "Kuantum sıçrama — bonus XP", hull: 4 },
  { level: 5, name: "Galaktik Amiral Gemisi", emoji: "👑", min: 300, max: 499, color: "#f59e0b", desc: "Filonun en güçlü gemisi — galaksiyi yönetir!", ability: "Amiral komutu — çift puan", hull: 5 },
  { level: 6, name: "Efsanevi Işık Gemisi", emoji: "✨", min: 500, max: Infinity, color: "#ec4899", desc: "Işık hızında yol alan efsanevi gemi. Yalnızca en büyük kaşifler kullanabilir.", ability: "Işık hızı — üç kat puan", hull: 6 },
];

export const getShipLevel = (fragments) => {
  return SHIP_UPGRADES.find(s => fragments >= s.min && fragments <= s.max) || SHIP_UPGRADES[0];
};

export const calcStarFragments = (acc, maxStreak, level, rounds) => {
  let base = Math.floor(acc / 10); // 0-10 base
  if (acc === 100) base += 5; // perfect bonus
  if (maxStreak >= 7) base += 3;
  else if (maxStreak >= 5) base += 2;
  else if (maxStreak >= 3) base += 1;
  base += Math.floor(level / 2); // difficulty bonus
  base = Math.max(1, base); // minimum 1 fragment
  return base;
};

// ═══ GÖREV ARKI — Büyük Hikâye Sistemi ════════════════════════════════════
// Oyuncunun genel ilerlemesine bağlı ana hikâye çizgisi
export const MISSION_ARC = {
  title: "Kayıp Mürettebatı Kurtar!",
  prologue: "Galaksi'nin en uzak köşesinde bir keşif gemisi kayboldu. Mürettebatın her üyesi farklı bir gezegende mahsur kaldı. Onları kurtarmak için her gezegenin matematik bilmecelerini çözmen gerekiyor!",

  chapters: [
    {
      id: "ch1",
      title: "Bölüm 1: İlk Sinyal",
      desc: "Sayalon'dan zayıf bir sinyal geliyor. İlk mürettebat üyesi burada olmalı!",
      planet: "Sayalon",
      requiredModes: 3,     // Bu bölümü tamamlamak için min mod sayısı
      requiredAcc: 60,      // Min genel başarı
      crewMember: { name: "Pilot Elif", emoji: "👩‍🚀", role: "Pilot", rescued: false },
      introScene: "Uzay boşluğunda süzülürken radarına zayıf bir sinyal düşer. Sayalon gezegeninden geliyor! 'Bu... Pilot Elif'in acil durum sinyali!' Hemen rotanı Sayalon'a çeviriyorsun.",
      completionScene: "Sayalon'un derin mağaralarında Pilot Elif'i buldun! 'Sonunda geldin!' diyor gülümseyerek. 'Sayıların gücüyle bu mağaradan çıkış yolunu buldum ama yalnız başıma açamadım. Şimdi birlikte uçabiliriz!'",
    },
    {
      id: "ch2",
      title: "Bölüm 2: Şimşek Fırtınası",
      desc: "Şimşeron'un enerji fırtınaları arasında bir sinyal daha!",
      planet: "Şimşeron",
      requiredModes: 3,
      requiredAcc: 65,
      crewMember: { name: "Mühendis Kaan", emoji: "👨‍🔧", role: "Mühendis", rescued: false },
      introScene: "Pilot Elif geminin motorlarını çalıştırıyor. 'Sonraki sinyal Şimşeron'dan geliyor — ama enerji fırtınaları çok yoğun!' Hızlı düşünmen gerekecek.",
      completionScene: "Mühendis Kaan, Şimşeron'un enerji merkezinde fırtınalardan korunuyormuş. 'Enerji kalıplarını çözebildim ama motorları tamir edemiyordum. Seninle birlikte artık yapabiliriz!'",
    },
    {
      id: "ch3",
      title: "Bölüm 3: Denge Noktası",
      desc: "Terazya'nın yerçekimi anomalileri arasında kayıp bir bilim insanı!",
      planet: "Terazya",
      requiredModes: 3,
      requiredAcc: 65,
      crewMember: { name: "Dr. Zeynep", emoji: "👩‍🔬", role: "Bilim İnsanı", rescued: false },
      introScene: "Mühendis Kaan sensörleri kalibre ediyor. 'Terazya'da tuhaf yerçekimi dalgaları var — biri orada dengeleri değiştiriyor. Bu Dr. Zeynep'in çalışması olmalı!'",
      completionScene: "Dr. Zeynep, Terazya'nın denge laboratuvarında! 'Karşılaştırma deneylerim sayesinde burada hayatta kaldım. Ama evren büyük bir dengesizliğe doğru gidiyor — yardımına ihtiyacımız var!'",
    },
    {
      id: "ch4",
      title: "Bölüm 4: Yapı Taşları",
      desc: "Bileşya'nın kristal yapılarında mahsur kalmış bir mimar!",
      planet: "Bileşya",
      requiredModes: 3,
      requiredAcc: 70,
      crewMember: { name: "Mimar Deniz", emoji: "👷", role: "Mimar", rescued: false },
      introScene: "Dr. Zeynep haritaları analiz ediyor. 'Bileşya'da kristal yapılar çökmeye başlamış — biri orada yapıları ayakta tutmaya çalışıyor. Bu Mimar Deniz olmalı!'",
      completionScene: "Mimar Deniz, sayıların bileşim gücüyle devasa kristal köprüler inşa etmiş! 'Sayıların parça-bütün ilişkisini kullanarak bu yapıları ayakta tuttum. Artık birlikte daha büyük şeyler inşa edebiliriz!'",
    },
    {
      id: "ch5",
      title: "Bölüm 5: Toplama Seferi",
      desc: "Toplarya'nın volkanik bölgesinde sıkışmış bir kahraman!",
      planet: "Toplarya",
      requiredModes: 4,
      requiredAcc: 70,
      crewMember: { name: "Kaptan Bora", emoji: "🦸", role: "Kaptan", rescued: false },
      introScene: "Tüm mürettebat toplanmaya başladı. Ama en önemli sinyal Toplarya'dan geliyor — Kaptan Bora! 'Kaptanı kurtarmalıyız — o olmadan galaksinin karanlık bölgelerine giremeyiz!'",
      completionScene: "Kaptan Bora, Toplarya'nın lav nehirleri arasında bir ada üzerinde bekliyormuş. 'Toplama ve çıkarma ile lav akışlarını yönlendirip hayatta kaldım. Mürettebatım sonunda bir araya geldi — ama görevimiz henüz bitmedi!'",
    },
    {
      id: "ch6",
      title: "Bölüm 6: Çarpım Fırtınası",
      desc: "Çarpanya'nın gizemli labirentinde kayıp bir matematikçi!",
      planet: "Çarpanya",
      requiredModes: 4,
      requiredAcc: 75,
      crewMember: { name: "Prof. Yıldız", emoji: "🧙", role: "Matematikçi", rescued: false },
      introScene: "Kaptan Bora dürbünü kaldırıyor. 'Çarpanya'nın labirentinden tuhaf sinyaller geliyor. Bu Prof. Yıldız'ın matematik formüllerle bıraktığı izler olmalı!'",
      completionScene: "Prof. Yıldız, çarpım tablosunu kullanarak labirentteki tüm kapıları açmayı başarmış! 'Çarpma ve bölme evrenin en güçlü araçları. Artık son göreve hazırız!'",
    },
    {
      id: "ch7",
      title: "Bölüm 7: Galaktik Birlik",
      desc: "Tüm mürettebat bir araya geldi — galaksiyi kurtarma zamanı!",
      planet: "Galaksi Çekirdeği",
      requiredModes: 6,
      requiredAcc: 75,
      crewMember: null,
      introScene: "Tüm mürettebat gemide. Prof. Yıldız ciddi bir yüzle konuşuyor: 'Galaksinin çekirdeğindeki matematik motoru bozulmaya başladı. Tüm bildiklerimizi birleştirerek onu onarmalıyız!'",
      completionScene: "Galaksinin matematik motoru yeniden çalışıyor! Yıldızlar parlamaya, gezegenler dönmeye, nebulalar renklere boyanmaya başlıyor. Kaptan Bora gülümsüyor: 'Sen olmasaydın, galaksi karanlığa gömülürdü. Sen artık bir Adım Adım Usta'sın!'",
    },
  ],

  // Bölüm ilerlemesini kontrol et
  getProgress: (modeStats, totalGames) => {
    const chapters = MISSION_ARC.chapters;
    const progress = chapters.map((ch, idx) => {
      // Gezegene ait modlarda oynanan farklı mod sayısı
      const modesPlayed = Object.keys(modeStats).filter(m => (modeStats[m]?.games || 0) > 0).length;
      const overallAcc = Object.values(modeStats).reduce((s, m) => s + (m?.correct || 0), 0) /
        Math.max(1, Object.values(modeStats).reduce((s, m) => s + (m?.total || 0), 0)) * 100;
      // Bölüm tamamlandı mı?
      const prevComplete = idx === 0 ? true : null; // loop'ta set edilecek
      const complete = modesPlayed >= ch.requiredModes && overallAcc >= ch.requiredAcc;
      return { ...ch, complete, modesPlayed, overallAcc: Math.round(overallAcc) };
    });

    // Sıralı kilitleme
    for (let i = 0; i < progress.length; i++) {
      if (i === 0) progress[i].unlocked = true;
      else progress[i].unlocked = progress[i - 1].complete;
    }

    const currentIdx = progress.findIndex(ch => ch.unlocked && !ch.complete);
    const allComplete = progress.every(ch => ch.complete);
    const rescuedCrew = progress.filter(ch => ch.complete && ch.crewMember).map(ch => ch.crewMember);

    return { chapters: progress, currentIdx: currentIdx >= 0 ? currentIdx : progress.length - 1, allComplete, rescuedCrew };
  },
};

// ═══ GEZEGENLERARASI GEÇİŞ MESAJLARI — Ekranlar arası narratif köprü ═══
export const TRANSITION_MESSAGES = {
  toGame: [
    "Koordinatlar ayarlandı... Hedefe ışık hızıyla ilerliyoruz!",
    "Motor ateşleniyor... 3... 2... 1... Fırla!",
    "Işık hızı sürüşü başlatılıyor... Yıldızlar bulanıklaşıyor...",
    "Rotamız belirlendi! Matematik enerjisi yükleniyor...",
    "Yıldız haritası yükleniyor... Hedef kilitlendi!",
    "Galaktik pusula yönünü gösteriyor... İleri!",
  ],
  toResults: [
    "Görev verileri analiz ediliyor...",
    "Keşif raporu hazırlanıyor...",
    "Yıldız parçaları sayılıyor...",
    "Mürettebat başarıyı değerlendiriyor...",
  ],
  toMenu: [
    "Üsse dönülüyor...",
    "Ana gemi yörüngesine giriş yapılıyor...",
    "Güvenli limana varış...",
    "NuméraYıldız'ın enerjisi seninle yenileniyor...",
  ],
  getRandomMessage: (type) => {
    const msgs = TRANSITION_MESSAGES[type];
    return msgs ? msgs[Math.floor(Math.random() * msgs.length)] : "";
  },
};

// ═══ MÜRETTEBAT DİYALOG SİSTEMİ — Kurtarılan mürettebattan bağlamsal mesajlar ═══
// Kurtarılan mürettebat üyeleri, oyuncunun ilerlemesine göre konuşur
export const CREW_DIALOGUES = {
  // Her mürettebat üyesi farklı durumlarda yorum yapar
  "Pilot Elif": {
    onCorrect: [
      "Tam hedef! Pilotluk sende var, kaşif!",
      "Harika manevra! Rotamız doğru.",
      "Elif gülümsüyor: 'Navigasyonda ustalaşıyorsun!'",
    ],
    onStreak3: "Elif: 'Üç isabetli atış! Bu gidişle galaksiyi geçeriz!'",
    onStreak5: "Elif heyecanla: '5 üst üste! Otopilotu sen kullan artık!'",
    onStruggle: "Elif sakin bir sesle: 'Her pilot düşer, önemli olan tekrar kalkman. Bir daha deneyelim.'",
    onNewPlanet: "Elif: 'Yeni gezegen menzilde! İniş koordinatlarını hesaplıyorum...'",
    onLevelUp: "Elif: 'Seviye atlıyoruz! Daha yüksek yörüngelere çıkma zamanı!'",
  },
  "Mühendis Kaan": {
    onCorrect: [
      "Kaan: 'Sistem çalışıyor! Güzel hesaplama.'",
      "Motor verimliliği arttı! İyi iş.",
      "Kaan başparmak kaldırıyor: 'Mekanik mükemmel!'",
    ],
    onStreak3: "Kaan: 'Üç doğru! Motorlar tam güçte çalışıyor!'",
    onStreak5: "Kaan hayranlıkla: 'Beş! Bu enerji seviyesi harika!'",
    onStruggle: "Kaan: 'Motor biraz takıldı ama sorun değil — birlikte tamir ederiz.'",
    onNewPlanet: "Kaan: 'Yeni gezegen tespit edildi! Sensörleri kalibre ediyorum...'",
    onLevelUp: "Kaan: 'Motor güçlendirmesi tamamlandı! Daha hızlı gidebiliriz!'",
  },
  "Dr. Zeynep": {
    onCorrect: [
      "Dr. Zeynep: 'Bilimsel olarak kusursuz!'",
      "Zeynep not alıyor: 'Bu veriyi kaydedeceğim!'",
      "Zeynep: 'Hipotezim doğrulandı — harikasın!'",
    ],
    onStreak3: "Zeynep: 'Üç deneyden üç başarı! Bilimsel metod işliyor!'",
    onStreak5: "Zeynep heyecanla: 'Beş üst üste! Bu bilimsel olarak muhteşem!'",
    onStruggle: "Zeynep: 'Her bilim insanı hata yapar — önemli olan gözlem yapmaya devam etmek.'",
    onNewPlanet: "Zeynep: 'Yeni bir ekosistem! Numuneleri incelemeye hazırım.'",
    onLevelUp: "Zeynep: 'Araştırma derinliği artıyor! Daha karmaşık desenler keşfedeceğiz.'",
  },
  "Mimar Deniz": {
    onCorrect: [
      "Deniz: 'Yapı sağlam! İyi hesap.'",
      "Deniz gülümsüyor: 'Bu temeli iyi attın!'",
      "Deniz: 'Bir tuğla daha yerine oturdu!'",
    ],
    onStreak3: "Deniz: 'Üç kat inşa ettik! Yapı yükseliyor!'",
    onStreak5: "Deniz hayranlıkla: 'Beş! Bu bir uzay istasyonu olacak!'",
    onStruggle: "Deniz: 'Bazen temeli yeniden atmak gerekir — daha güçlü olur.'",
    onNewPlanet: "Deniz: 'Yeni bir inşaat sahası! Tasarımları çiziyorum...'",
    onLevelUp: "Deniz: 'Daha yüksek katlara çıkıyoruz! Temeller sağlam.'",
  },
  "Kaptan Bora": {
    onCorrect: [
      "Kaptan Bora: 'Aferin, asker! Mükemmel!'",
      "Bora selamla: 'Bu bir komutan cevabıydı!'",
      "Bora: 'Mürettebat seninle gurur duyuyor!'",
    ],
    onStreak3: "Bora: 'Üç üst üste! Galaktik filo seni izliyor!'",
    onStreak5: "Bora ayağa kalkarak: 'Beş! Amiral unvanına yakışır bir seri!'",
    onStruggle: "Bora: 'Her komutan zor görevlerle karşılaşır. Stratejini değiştir, tekrar dene.'",
    onNewPlanet: "Bora: 'Yeni keşif bölgesi! Mürettebat hazır, kaptan!'",
    onLevelUp: "Bora: 'Rütbe terfi! Daha zorlu görevlere hazır mısın?'",
  },
  "Prof. Yıldız": {
    onCorrect: [
      "Prof. Yıldız: 'Matematiksel olarak zarif!'",
      "Yıldız: 'Bu çözüm bir sanat eseri!'",
      "Prof: 'Formül doğru! Evren seninle konuşuyor.'",
    ],
    onStreak3: "Yıldız: 'Üç teorem ispatlandı! Büyük keşfe yaklaşıyoruz!'",
    onStreak5: "Yıldız gözleri parlayarak: 'Beş! Bu bir matematik efsanesi!'",
    onStruggle: "Yıldız: 'En büyük matematikçiler de hata yaptı — Euler bile! Önemli olan merak etmeye devam etmek.'",
    onNewPlanet: "Yıldız: 'Yeni matematik formülleri bu gezegende gizli!'",
    onLevelUp: "Yıldız: 'Bilgelik seviyesi arttı! Daha derin gizemler seni bekliyor.'",
  },

  // Kurtarılmış mürettebattan rastgele bağlamsal diyalog al
  getCrewMessage: (rescuedCrew, context, streak) => {
    if (!rescuedCrew || rescuedCrew.length === 0) return null;
    const crew = rescuedCrew[Math.floor(Math.random() * rescuedCrew.length)];
    const dialogues = CREW_DIALOGUES[crew.name];
    if (!dialogues) return null;

    let message = null;
    if (context === "correct" && dialogues.onCorrect) {
      message = dialogues.onCorrect[Math.floor(Math.random() * dialogues.onCorrect.length)];
    } else if (context === "streak3") message = dialogues.onStreak3;
    else if (context === "streak5") message = dialogues.onStreak5;
    else if (context === "struggle") message = dialogues.onStruggle;
    else if (context === "newPlanet") message = dialogues.onNewPlanet;
    else if (context === "levelUp") message = dialogues.onLevelUp;

    return message ? { crew, message } : null;
  },
};

// ═══ GEZEGEN LOR GİRİŞLERİ — Keşfedilebilir dünya bilgisi ═══════════════
// Her gezegen hakkında kısa lore girişleri — oyuncu ilerledikçe açılır
export const PLANET_LORE = {
  Sayalon: {
    name: "Sayalon",
    subtitle: "Sayıların Doğduğu Yer",
    entries: [
      { id: "s1", title: "Antik Sayıcılar", text: "Sayalon'un ilk sakinleri gökteki yıldızları sayarak matematiği keşfettiler. Her yıldız bir hikâye, her sayı bir keşifti.", unlock: 1 },
      { id: "s2", title: "Yıldız Taşları", text: "Sayalon'un yıldız taşları özel bir mineral içerir — dokunulduğunda sayısal enerji yayar. Bu yüzden sayma burada doğal bir aktivite.", unlock: 3 },
      { id: "s3", title: "Sayma Mağaraları", text: "Gezegenin derinlerindeki mağara duvarlarında binlerce yıllık sayma işaretleri bulundu — evrendeki ilk matematik kaydı!", unlock: 5 },
    ],
  },
  Şimşeron: {
    name: "Şimşeron",
    subtitle: "Şimşek Algının Gezegeni",
    entries: [
      { id: "si1", title: "Enerji Fırtınaları", text: "Şimşeron'un atmosferi sürekli enerji fırtınalarıyla dolu. Burada yaşayanlar bir bakışta miktarı algılama yeteneği geliştirdi.", unlock: 1 },
      { id: "si2", title: "Baykuş Gözlemciler", text: "Şimşeron'un baykuşları karanlıkta bile nesneleri sayabilir — onların sırrı yapılandırılmış grupları tanımak.", unlock: 3 },
      { id: "si3", title: "Kristal Hafıza", text: "Şimşeron kristalleri kısa süreli hafızayı güçlendirir — enerji fırtınaları sırasında hızlı düşünmek için şart!", unlock: 5 },
    ],
  },
  Terazya: {
    name: "Terazya",
    subtitle: "Dengenin Efendisi",
    entries: [
      { id: "t1", title: "Yerçekimi Anomalileri", text: "Terazya'da yerçekimi her bölgede farklı — denge kavramı burada bir yaşam becerisi.", unlock: 1 },
      { id: "t2", title: "Kozmik Terazi", text: "Gezegenin merkezinde devasa bir kozmik terazi var — efsaneye göre evrendeki tüm dengeleri o kontrol ediyor.", unlock: 3 },
      { id: "t3", title: "Karşılaştırma Sanatı", text: "Terazya halkı hiçbir zaman 'büyük' veya 'küçük' demez — her zaman 'neye göre?' diye sorar. Bu bilgelik onları güçlü kılar.", unlock: 5 },
    ],
  },
  Bileşya: {
    name: "Bileşya",
    subtitle: "Yapıtaşlarının Dünyası",
    entries: [
      { id: "b1", title: "Kristal Mimarisi", text: "Bileşya'nın tüm yapıları sayıların bileşim kurallarına göre inşa edilir — her parça bir bütünün parçası.", unlock: 1 },
      { id: "b2", title: "Parça-Bütün Felsefesi", text: "Bileşya halkı şöyle der: 'Bütünü anlamak için parçalarını tanı, parçaları anlamak için bütüne bak.'", unlock: 3 },
      { id: "b3", title: "10'un Sırrı", text: "Bileşya'da 10 sayısı kutsal kabul edilir — çünkü 10 farklı şekilde parçalara ayrılabilir ve her parça bir yapı taşıdır.", unlock: 5 },
    ],
  },
  Toplarya: {
    name: "Toplarya",
    subtitle: "Birleşimin ve Ayrılmanın Yurdu",
    entries: [
      { id: "to1", title: "Lav Nehirleri", text: "Toplarya'nın lav nehirleri birleşip ayrılarak sürekli yeni yollar oluşturur — tıpkı toplama ve çıkarma gibi.", unlock: 1 },
      { id: "to2", title: "İkiz Ejderhalar", text: "Toplama Ejderhası ve Çıkarma Ejderhası kardeştir — biri birleştirir, diğeri ayırır. İkisi birlikte dengeyi korur.", unlock: 3 },
      { id: "to3", title: "Stratejiler Tapınağı", text: "Toplarya'da bir tapınak var: duvarlarında tüm toplama ve çıkarma stratejileri yazılı. 'Büyükten say' en eski kural.", unlock: 5 },
    ],
  },
  Çarpanya: {
    name: "Çarpanya",
    subtitle: "Çarpımın Gizemi",
    entries: [
      { id: "c1", title: "Labirent Kapıları", text: "Çarpanya'nın labirentindeki her kapı bir çarpım tablosu sorusuyla açılır — doğru cevap, doğru yol.", unlock: 1 },
      { id: "c2", title: "Ahtapot Bilgeleri", text: "Çarpanya'nın sekiz kollu ahtapotları çarpım tablosunun canlı ansiklopedileridir — her kolda farklı bir çarpan.", unlock: 3 },
      { id: "c3", title: "Bölme Adaleti", text: "Çarpanya halkı adalet kavramını bölmeden öğrenir: herkes eşit pay almalı, artık kalmamalı.", unlock: 5 },
    ],
  },
  Basamara: {
    name: "Basamara",
    subtitle: "Basamakların Piramidi",
    entries: [
      { id: "ba1", title: "Sayı Piramitleri", text: "Basamara'nın piramitleri basamak değeri ilkesiyle inşa edilmiş — her kat bir öncekinin 10 katı.", unlock: 1 },
      { id: "ba2", title: "Konumun Gücü", text: "Basamara'da bir rakamın değeri konumuna göre değişir — 2 bazen 2, bazen 20, bazen 200 olabilir!", unlock: 3 },
      { id: "ba3", title: "Onluk Sistemi", text: "Basamara halkı onluk sistemi evrenin en zarif icadı olarak görür — 10 sembolle sonsuz sayı yazılabilir.", unlock: 5 },
    ],
  },
  Örünya: {
    name: "Örünya",
    subtitle: "Desenlerin Ormanı",
    entries: [
      { id: "o1", title: "Değişen Orman", text: "Örünya'nın ormanı sürekli desen değiştirir — ağaçlar, çiçekler, yapraklar hep bir kalıba göre büyür.", unlock: 1 },
      { id: "o2", title: "Bukalemun Rehberler", text: "Örünya'nın bukalemunları desenleri görerek renk değiştirir — aslında matematiğin doğadaki görünümünü yansıtırlar.", unlock: 3 },
      { id: "o3", title: "Cebirin Tohumu", text: "Örünya halkı şöyle der: 'Deseni gören, geleceği görür.' Bu felsefe cebirin temelini oluşturur.", unlock: 5 },
    ],
  },

  // Oyuncunun oyun sayısına göre açılmış lor girişlerini getir
  getUnlockedEntries: (planet, gamesOnPlanet) => {
    const lore = PLANET_LORE[planet];
    if (!lore) return [];
    return lore.entries.filter(e => gamesOnPlanet >= e.unlock);
  },
};

// ═══ MATEMATİKSEL İÇGÖRÜ GERİBİLDİRİMLERİ — Pedagojik Derinlik ═════════
// Doğru cevaplarda kısa matematik içgörüsü — sadece "doğru" demek yerine öğretici
export const MATH_INSIGHT_EXTRAS = {
  counting: [
    "Son saydığın sayı, toplam miktarı verir — buna 'kardinalite' denir!",
    "Her nesneye bir sayı, her sayıya bir nesne — birebir eşleme!",
    "Saymayı bitirdiğinde söylediğin son sayı cevaptır.",
    "Sayma sırası hiç değişmez: 1, 2, 3, 4, 5... Buna 'sabit sıra ilkesi' denir!",
    "Nesneleri hangi sırayla sayarsan say, toplam hep aynı kalır!",
  ],
  subitizing: [
    "Saymadan bildin! Beynin küçük grupları anında tanıyabiliyor.",
    "Anlık algılama yeteneğin gelişiyor — bu matematik süper gücü!",
    "Grupları tanımak, hızlı saymanın sırrıdır.",
    "Beyin 1-4 arası miktarları saymadan algılar — 5 ve üzeri için grupla!",
    "Düzenli dizilmiş nesneleri algılamak, düzensizlerden çok daha kolaydır!",
  ],
  addition: [
    "Büyük sayıdan saymaya başlamak toplamayı hızlandırır!",
    "İki parçayı birleştirdiğinde bütünü bulursun.",
    "Toplama, iki grubu bir araya getirmektir.",
    "10'a tamamlama stratejisi: 8+5 = 8+2+3 = 10+3 = 13. Süper hızlı!",
    "Yakın ikilemeleri kullan: 6+7 = 6+6+1 = 13. İki katını bilmek güçlü silah!",
  ],
  subtraction: [
    "Çıkarma, toplamın tersini bulmaktır — biliyorsan birini, bilirsin diğerini!",
    "Farkı bulmak için büyükten küçüğü çıkar.",
    "İleriye sayarak çıkarma yapmak da harika bir strateji!",
    "Çıkarma 3 farklı durumu anlatır: uzaklaştırma, fark bulma, eksik parça bulma!",
    "12-9 zor mu? 9'dan 12'ye kadar ileriye say: 10, 11, 12 = 3 adım = 3!",
  ],
  makeFive: [
    "5'in parçalarını bilmek, daha büyük sayıları çözmenin ilk adımı!",
    "5'lik çerçevedeki boşluklar sana cevabı söylüyor.",
    "5'in parçaları: 0+5, 1+4, 2+3. Bunları ezberlersen çok hızlanırsın!",
    "5'e tamamlamayı bilmek, 10'a tamamlamaya geçişin anahtarıdır.",
  ],
  makeTen: [
    "10'un arkadaşları: 1+9, 2+8, 3+7, 4+6, 5+5 — bunları bilmek süper güç!",
    "10'a tamamlama, iki basamaklı toplamada çok işe yarar.",
    "10'luk çerçevedeki boşlukları sayarak 10'un arkadaşlarını somut görebilirsin!",
    "10'un arkadaşlarını bilmek, zihinsel hesaplamanın en güçlü stratejisidir.",
  ],
  comparison: [
    "Karşılaştırma, matematiğin temelidir — büyüklük hissini geliştirir!",
    "Uzun kapsülde daha çok yıldız taşı var — görsel ipucu kullan!",
    "İki sayıyı karşılaştırırken 'fark'ı düşün — aradaki mesafe ne kadar?",
    "Karşılaştırma üç sonuç verir: daha az, eşit veya daha fazla.",
  ],
  placeValue: [
    "Bir rakamın değeri konumuna göre değişir — bu basamak değerinin sihri!",
    "Onlar basamağı: rakam × 10, birler basamağı: rakam × 1.",
    "3 sayısı 30'daki 3'ten farklı — 30'daki 3 aslında 30 değerinde!",
    "Basamak değeri, sayı sisteminin DNA'sıdır — her konumun 10 kat farkı var.",
  ],
  timesTable: [
    "Çarpım tablosu kalıplarla doludur — 5'ler hep 0 veya 5'le biter!",
    "Bildiğin bir çarpımdan yola çık — bir grup ekle veya çıkar.",
    "9'un çarpım sırrı: birler azalır, onlar artar! 9, 18, 27, 36... Rakamlar toplamı hep 9!",
    "Çarpım tablosunda 100 sonuç var ama değişme özelliği sayesinde sadece 55'ini bilmen yeter!",
    "Kare sayılar çarpım tablosunun köşegenidir: 1, 4, 9, 16, 25...",
  ],
  repeatAdd: [
    "Tekrarlı toplama çarpmanın annesidir! 3+3+3 = 3×3 = 9.",
    "Eşit grupları toplamak = çarpma. Bu geçiş çok önemli!",
    "Grup sayısı × her gruptaki miktar = toplam. Bu çarpmanın özüdür.",
  ],
  inversePractice: [
    "Toplama ve çıkarma ters kardeşler — birini bilirsen diğerini çıkarabilirsin!",
    "5+3=8 biliyorsan, 8-3=5 ve 8-5=3 de biliyorsun — üç gerçek, bir aile!",
    "Ters işlem bilgisi, bilinmeyen sayıyı bulmanın en hızlı yoludur.",
  ],
  difference: [
    "Fark = büyük sayı - küçük sayı. İki grup arasındaki mesafe!",
    "Fark bulmak için ileriye sayma kullan: 5'ten 8'e kaç adım? 3!",
    "Fark kavramı, karşılaştırma ve çıkarma arasındaki köprüdür.",
  ],
  chipGuess: [
    "Kısa süreli hafızan güçleniyor! Gruplayarak hatırlama en iyi strateji.",
    "Görüntüyü zihninde tut — 5+kaç tane daha? Bu yapısal düşüncedir.",
    "Hafıza + yapısal algı = matematik süper gücü!",
  ],
  rodBack: [
    "Aynı miktarı farklı biçimlerde görmek 'çoklu temsil' becerisidir!",
    "Parmak, kapsül, çerçeve — şekil değişse de miktar hep aynı kalır.",
    "Çoklu temsil yeteneği, derin matematik anlayışının işaretidir.",
  ],
  patternAB: [
    "Çekirdek kalıbı bulduysan deseni sonsuza kadar devam ettirebilirsin!",
    "Desenler matematiğin dilidir — cebirin temeli burada başlıyor.",
  ],
  ordering: [
    "Sıralama, sayıların büyüklük ilişkisini anlamaktır!",
    "En küçüğünden başlayarak sırala — adım adım ilerle.",
    "Sayıları sıralamak, zihinsel sayı doğrusu oluşturmanın temelidir.",
  ],
  partWhole: [
    "Bütün = parça + parça. Bu ilişki matematiğin temelidir!",
    "Bir parçayı bilirsen, bütünden çıkararak diğer parçayı bulursun.",
    "Parça-bütün düşünmek, toplama ve çıkarmayı birbirine bağlar.",
  ],
  missingNumber: [
    "Denklemi bir terazi gibi düşün — iki taraf eşit olmalı!",
    "Bilinmeyen sayıyı bulmak, detektiflik gibidir — ipuçlarını kullan.",
    "Eksik sayıyı bulmak, cebirin ilk adımıdır!",
  ],
  buildNumber: [
    "Her dokunuşta sesli say — son saydığın sayı toplam miktarı verir!",
    "Sayıyı inşa etmek, sayı hissini güçlendirir.",
    "Hedefe ulaştığında dur — fazla koymamak da bir beceridir!",
  ],
  beforeAfter: [
    "Sayı doğrusunda her sayının bir öncesi ve sonrası var!",
    "Önceki sayı = 1 çıkar, sonraki sayı = 1 ekle.",
    "Sayı komşulukları, sayı dizilerinin temelidir.",
  ],
  halfDouble: [
    "İki katı = sayı + sayı. Yarısı = iki eşit gruba böl!",
    "İkileme ve yarılama, çarpma ve bölmenin temel yapı taşıdır.",
    "İki katını bilirsen yarısını da bilirsin — ters işlemler!",
  ],
  divisionBasic: [
    "Bölme, çarpmanın tersidir — birini bilirsen diğerini çıkarabilirsin!",
    "Eşit paylaşım = bölme. Herkes adil bir pay almalı!",
    "Bölme aslında 'kaç grup yapılır?' sorusunu cevaplar.",
  ],
  equalShare: [
    "Eşit paylaşım adalettir — matematik adaleti öğretir!",
    "Her gruba birer tane ver, sonra tekrarla — herkes eşit alana kadar.",
    "Toplam ÷ grup sayısı = her gruba düşen miktar.",
  ],
  backwardCount: [
    "Geriye sayma, çıkarmanın temelidir — her adım 1 eksiltmektir!",
    "10, 9, 8, 7... Geri sayım roket fırlatma gibi heyecanlı!",
    "Geriye sayabilmek, sayı doğrusunda sola gitmeyi öğrenmektir.",
  ],
  growingPattern: [
    "Büyüyen desende kural gizlidir — ardışık farkları incele!",
    "Farkı bulduysan, kuralı buldun — sonrakini tahmin edebilirsin!",
    "Büyüyen desenler, fonksiyonların ilk tohumudur.",
  ],
  bundleTens: [
    "10 birlik = 1 onluk. Bu basit kural, tüm sayı sisteminin temelidir!",
    "10'ar 10'ar paketlemek, büyük sayıları anlamanın anahtarıdır.",
    "Onluk sistemi sayesinde sonsuz sayıyı sadece 10 rakamla yazarız!",
  ],
  expandForm: [
    "Her sayı onluk ve birlik parçalarına ayrılabilir — gizli yapısını gör!",
    "23 = 20 + 3 demektir. Onluk değeri + birlik değeri = sayı.",
    "Genişletilmiş gösterim, basamak değerini anlamanın anahtarıdır.",
  ],
  conservation: [
    "Dizilim değişse de miktar değişmez — eklenmedi veya çıkarılmadıysa aynı!",
    "Bu çok önemli bir matematik ilkesi: sayı korunumu!",
    "Gözlerine aldanma — elle say veya grupla!",
  ],
  wpAdd: [
    "Hikâyeyi oku, verilenleri bul — 'toplam', 'hepsi' demek toplama demek!",
    "Sözel problemler, matematiği gerçek hayatla buluşturur.",
    "Problemi okuduğunda, önce neyi bildiğini ve neyi aradığını belirle.",
  ],
  wpSub: [
    "'Kalan', 'eksildi', 'kaçı gitti' gibi kelimeler çıkarma işaretidir!",
    "Çıkarma problemlerini ileriye sayarak da çözebilirsin.",
    "Büyükten küçüğü çıkar — kalan senin cevabın.",
  ],
  composeNumber: [
    "Onluklar × 10 + birlikler = sayı. 3 onluk + 5 birlik = 35!",
    "Sayı oluşturma, basamak değerinin yapısal anlaşılmasıdır.",
    "Her sayı onluk ve birlik bileşiminden oluşur.",
  ],
  skipCount: [
    "Ritmik sayma çarpmanın temelidir — 2'şer saymak 2 ile çarpmaktır!",
    "5'er sayma saati okumayı, 10'ar sayma parayı saymayı kolaylaştırır.",
    "Atlayarak sayma, tekrarlı toplamanın kısayoludur.",
  ],
  fiveMore: [
    "5 ve 10 referans noktalarıdır — büyüklük hissini güçlendirir!",
    "Bir sayıyı 5'e veya 10'a göre konumlamak, karşılaştırmayı hızlandırır.",
    "Referans noktaları, zihinsel sayı doğrusu oluşturmanın anahtarıdır.",
  ],
  matching: [
    "Rakam ile miktar eşleştirmek, sayı kavramını pekiştirir!",
    "Sembol ve miktar aynı sayıyı farklı biçimlerde anlatır.",
    "Doğru eşleşme, sayı okuryazarlığının temel becerisidir.",
  ],
  trueFalse: [
    "Denklemi kontrol etmek, cebirsel düşüncenin ilk adımıdır!",
    "Eşittir işareti 'aynı miktarda' demektir — iki taraf dengelenmelidir.",
    "Her iki tarafı ayrı hesapla — eşitse doğru, farklıysa yanlış!",
  ],
  fivesFrame: [
    "5'lik çerçeve, 5'e göre düşünmenin en güçlü aracıdır!",
    "Dolu ve boş kutuları görmek, parça-bütün ilişkisini somutlaştırır.",
    "5'lik çerçeveyi tanımak, 10'luk çerçeveye geçişi kolaylaştırır.",
  ],
  tensFrame: [
    "Üst sıra 5, alt sıradakileri ekle — saymadan bul!",
    "10'luk çerçeve, sayı yapısını gözle görmeyi sağlar.",
    "10'luk çerçevedeki boşluklar '10'a ne kadar eksik' sorusunu cevaplar.",
  ],
  doubleTensFrame: [
    "Sol çerçeve her zaman 10 — sadece sağdakileri sayıp ekle!",
    "10 artı bir sayı düşünmek, onluk sistemi anlamanın temelidir.",
    "Çift çerçeve, iki basamaklı sayıları somutlaştırır.",
  ],
  quantityMatch: [
    "Miktar ve rakam arasında köprü kurmak, sayı okuryazarlığının temelidir!",
    "Nesneyi say, sembolü bul — bu üçlü kod becerisidir.",
  ],
  decadeCount: [
    "Onluk sınırını geçmek özel bir beceridir — 9'dan sonra yeni bir onluk başlar!",
    "29'dan sonra 30 gelir çünkü birler basamağı 0'a döner, onlar 1 artar.",
    "Onluk geçişlerini bilmek, toplama stratejilerini güçlendirir.",
  ],
  ordinalCount: [
    "Sıra sayıları pozisyonu, sayma sayıları miktarı gösterir — ikisi farklı!",
    "Birinci, ikinci, üçüncü — sıra sayıları günlük hayatta her yerde!",
    "Sıra kavramı, diziler ve örüntüler için temel oluşturur.",
  ],
  counterFromN: [
    "Herhangi bir sayıdan saymaya başlamak, gerçek sayma ustalığıdır!",
    "1'den başlamak zorunda değilsin — büyük sayıdan devam et!",
    "Esnek sayma, toplama stratejilerinin temelini oluşturur.",
  ],
  mulDivInverse: [
    "Çarpma ve bölme kardeş işlemler — birini bilirsen diğerini de bilirsin!",
    "3×4=12 ise 12÷4=3 ve 12÷3=4 — bir aile, dört işlem!",
    "Ters işlem ilişkisi, cebirsel düşüncenin temelini oluşturur.",
  ],
  katConcept: [
    "'Kat' kavramı çarpmanın günlük hayattaki karşılığıdır!",
    "3'ün 4 katı = 3×4 = 12. 'Kat' kelimesi 'çarpı' demektir.",
    "Kat düşüncesi, oran ve orantı kavramlarına hazırlık sağlar.",
  ],
  estimateCount: [
    "Tahmin etmek beynin hızlı hesaplama yeteneğini geliştirir!",
    "Referans noktası kullan: 5'lik grup tanıyorsan, kaç 5'lik var?",
    "Yaklaşık sayma, gerçek hayatta en çok kullanılan matematik becerisidir.",
  ],
  numbersInNumbers: [
    "Her sayının içinde birçok sayı çifti gizlidir!",
    "7 = 1+6 = 2+5 = 3+4 = 0+7 — tüm parçaları keşfet!",
    "Sayı ayrıştırma, esnek düşünmenin ve zihinsel hesaplamanın anahtarıdır.",
  ],
  patternTranslate: [
    "Desen çevirisi, soyut düşüncenin ilk adımıdır!",
    "Yapı aynı kalır, elemanlar değişir — bu cebirin özüdür.",
    "A-B-A-B yapısı kırmızı-mavi ile de daire-kare ile de gösterilebilir.",
  ],
  wpMul: [
    "'Her birinde', 'eşit gruplar' gibi kelimeler çarpma işaretidir!",
    "Çarpma, eşit grupları hızlıca toplama kısayoludur.",
    "Grup sayısı × her gruptaki miktar = toplam.",
  ],
  wpDiv: [
    "'Eşit paylaş', 'kaçar tane' gibi kelimeler bölme işaretidir!",
    "Bölme iki anlama gelir: eşit paylaşım veya gruplama.",
    "Toplam ÷ grup sayısı = her gruba düşen miktar.",
  ],
  wpCompare: [
    "'Kaç fazla', 'kaç eksik', 'aradaki fark' karşılaştırma işaretidir!",
    "Fark bulmak için büyükten küçüğü çıkar.",
    "Karşılaştırma problemleri, çıkarmanın farklı bir yüzüdür.",
  ],
  arrayDots: [
    "Dizi modeli çarpmayı görselleştirir — satır × sütun = toplam!",
    "Diziyi döndürürsen sayılar değişmez: 3×4 = 4×3 (değişme özelliği).",
    "Diziler, alanı hesaplamanın da temelidir.",
  ],
  multiplyVisual: [
    "Eşit grupları görmek, çarpmayı somutlaştırır!",
    "Her kutu bir grup — grup sayısı × miktar = toplam.",
    "Görsel çarpma, soyut çarpıma geçişin köprüsüdür.",
  ],
  groupCount: [
    "Gruplama, bölmenin somut karşılığıdır!",
    "Toplam ÷ her gruptaki sayı = grup sayısı.",
    "Kaç grup oluştuğunu saymak, bölme düşüncesini geliştirir.",
  ],

  // Mod tipine göre rastgele içgörü getir
  getInsight: (modeType) => {
    // Mod tipini ana kategoriye eşle
    const categoryMap = {
      counting: "counting", chipGuess: "chipGuess", rodBack: "rodBack",
      subitizing: "subitizing", fivesFrame: "fivesFrame", tensFrame: "tensFrame",
      doubleTensFrame: "doubleTensFrame",
      addition: "addition", addChips: "addition", countOnAdd: "addition",
      subtraction: "subtraction", removeChips: "subtraction",
      makeFive: "makeFive", makeTen: "makeTen",
      comparison: "comparison", lessMoreEqual: "comparison",
      placeValue: "placeValue", fiveMore: "fiveMore",
      timesTable: "timesTable", multiplyVisual: "multiplyVisual", arrayDots: "arrayDots",
      repeatAdd: "repeatAdd",
      patternAB: "patternAB", patternTranslate: "patternTranslate",
      ordering: "ordering", beforeAfter: "beforeAfter",
      partWhole: "partWhole", missingNumber: "missingNumber", trueFalse: "trueFalse",
      buildNumber: "buildNumber", numbersInNumbers: "numbersInNumbers",
      halfDouble: "halfDouble", divisionBasic: "divisionBasic",
      equalShare: "equalShare", groupCount: "groupCount",
      backwardCount: "backwardCount", counterFromN: "counterFromN",
      ordinalCount: "ordinalCount", decadeCount: "decadeCount",
      growingPattern: "growingPattern",
      bundleTens: "bundleTens", expandForm: "expandForm",
      composeNumber: "composeNumber",
      conservation: "conservation", estimateCount: "estimateCount",
      wpAdd: "wpAdd", wpSub: "wpSub", wpCompare: "wpCompare",
      wpMul: "wpMul", wpDiv: "wpDiv",
      difference: "difference", inversePractice: "inversePractice",
      mulDivInverse: "mulDivInverse", katConcept: "katConcept",
      skipCount: "skipCount", matching: "matching", quantityMatch: "quantityMatch",
    };
    const cat = categoryMap[modeType] || "counting";
    const insights = MATH_INSIGHT_EXTRAS[cat];
    if (!insights || insights.length === 0) return null;
    return insights[Math.floor(Math.random() * insights.length)];
  },
};

// ═══ GÜNLÜK TAKVİYE SİSTEMİ — Motivasyon Mesajları ══════════════════════
// Giriş ekranında günün motivasyon mesajı
export const DAILY_MOTIVATION = [
  { emoji: "🧠", message: "Her doğru cevap beyninde yeni bağlantılar kuruyor!", source: "Nörobilim" },
  { emoji: "💪", message: "Hata yapmak öğrenmenin en güçlü yoludur!", source: "Carol Dweck" },
  { emoji: "⭐", message: "Dün yapamadığını bugün yapabilirsin — çünkü beynin büyüyor!", source: "Büyüme Zihniyeti" },
  { emoji: "🚀", message: "Küçük adımlar büyük keşiflere götürür!", source: "Neil Armstrong" },
  { emoji: "🌟", message: "Merak eden, keşfeder. Keşfeden, öğrenir!", source: "Bilim Felsefesi" },
  { emoji: "🧩", message: "Her problem bir puzzle — çözümü bulmak eğlenceli!", source: "Matematik Eğitimi" },
  { emoji: "🌌", message: "Evren matematikle konuşur — sen de bu dili öğreniyorsun!", source: "Galileo Galilei" },
  { emoji: "🏆", message: "Başarı, denemekten vazgeçmeyenlerindir!", source: "Thomas Edison" },
  { emoji: "🔭", message: "Bugün öğrendiğin her sayı, yarın bir yıldız keşfetmeni sağlayabilir!", source: "GalakSay" },
  { emoji: "🌈", message: "Yanlış cevap demek yanlış yoldasın demek değil — sadece bir adım daha denemelisin!", source: "Matematik Bilgeliği" },
  { emoji: "🔢", message: "Matematik, evrenin gizli şifresidir — her sayı bir kapıyı açar!", source: "Pythagoras" },
  { emoji: "🌍", message: "Hayal gücü bilgiden daha önemlidir — hayal et ve çöz!", source: "Albert Einstein" },
  { emoji: "💫", message: "Yıldızlara bakan herkes matematikçidir — çünkü sayılar her yerdedir!", source: "Katherine Johnson" },
  { emoji: "🎯", message: "Bir problemi çözmek için önce onu sevmelisin!", source: "George Pólya" },
  { emoji: "🧬", message: "Doğadaki her desen bir matematik formülüdür — yapraklardan galaksilere!", source: "Fibonacci" },
  { emoji: "🔬", message: "Matematik öğrenmek beynini güçlendirir — her gün biraz daha zekileşiyorsun!", source: "Nörobilim Araştırmaları" },
  { emoji: "🎨", message: "Matematik bir sanattır — sayılarla tablo çizen bir sanatçısın!", source: "Maryam Mirzakhani" },
  { emoji: "🧭", message: "Bugün attığın her adım seni galaksinin en büyük kaşifi yapmaya bir adım daha yaklaştırıyor!", source: "GalakSay Bilgeliği" },
  // v5.6 ek motivasyon mesajları
  { emoji: "🐢", message: "Yavaş ama kararlı adımlar, en uzak yıldıza bile ulaşır!", source: "Uzay Bilgeliği" },
  { emoji: "🪐", message: "Her gezegen farklıdır — her matematik konusu da. Hepsini keşfet!", source: "GalakSay" },
  { emoji: "🧲", message: "Sayılar birbirini çeker — toplamayı öğrenince çarpmayı da keşfedersin!", source: "Matematik Bağlantıları" },
  { emoji: "🌊", message: "Dalgalar gibi — bazen zor, bazen kolay. Ama hep ilerlersin!", source: "Öğrenme Bilimi" },
  { emoji: "🎵", message: "Müzik de matematik gibidir — ritim, sayı ve örüntülerle doludur!", source: "Müzik Teorisi" },
  { emoji: "🔑", message: "Her yeni beceri bir kapıyı açar — bugün hangi kapıyı açacaksın?", source: "GalakSay" },
  { emoji: "🌱", message: "Bilgi bir tohum gibidir — her gün biraz sularsan kocaman bir ağaç olur!", source: "Eğitim Felsefesi" },
  { emoji: "🦉", message: "Bilge baykuş bile her gün yeni bir şey öğrenir!", source: "GalakSay Bilgeliği" },
  { emoji: "⚡", message: "Beynin bir süper bilgisayar — her pratikle daha hızlı çalışır!", source: "Nöroplastisite" },
  { emoji: "🗺️", message: "Haritası olmayan bir yolcu bile cesaretle yeni kıtalar keşfeder!", source: "Keşif Ruhu" },
  { emoji: "🎭", message: "Bazen sayılar rol yapar — 6'yı ters çevir 9 olur! Sayılar eğlencelidir!", source: "Matematik Eğlencesi" },
  { emoji: "🏗️", message: "Piramitler bile tek bir taşla başladı — sen de tek bir sayıyla başlıyorsun!", source: "Mısır Matematiği" },
];

export const getDailyMotivation = () => {
  const today = new Date();
  const dayIndex = (today.getFullYear() * 366 + today.getMonth() * 31 + today.getDate()) % DAILY_MOTIVATION.length;
  return DAILY_MOTIVATION[dayIndex];
};

// ═══ GEZEGEN KARŞILAMA SAHNELERİ — İlk girişte gösterilen kısa sahne ════
export const PLANET_WELCOME_SCENES = {
  Sayalon: {
    scene: "Geminiz yavaşça Sayalon'un yörüngesine giriyor. Yüzeyde binlerce yıldız taşı parlıyor — her biri saymayı bekliyor!",
    guide: "Merhaba kaşif! Ben Sayacık, Sayalon'un robot rehberi. Burada sayıların gücünü keşfedeceğiz!",
    atmosphere: "Sakin, meraklı, sıcak",
  },
  Şimşeron: {
    scene: "Enerji fırtınaları geminizi sarsıyor! Şimşeron'un atmosferi ışık oyunlarıyla dolu — hızlı düşünmen gerekecek.",
    guide: "Hoş geldin! Ben Bakışık, Şimşeron'un bilge baykuşu. Bir bakışta algılama gücünü test edeceğiz!",
    atmosphere: "Enerjik, hızlı, heyecanlı",
  },
  Terazya: {
    scene: "Terazya'nın yerçekimi alanları geminizi hafifçe sağa sola salıyor. Her şey dengede — veya değil mi?",
    guide: "Hoş geldin, denge arayan! Ben Tartıcı. Karşılaştırma, Terazya'nın kalbidir.",
    atmosphere: "Dengeli, huzurlu, düşünceli",
  },
  Bileşya: {
    scene: "Kristal yapılar gökyüzüne yükseliyor. Bileşya, parçaların bütünlere dönüştüğü bir mimarlık harikası.",
    guide: "Yapıcı burada! Her sayının parçalarını keşfedecek ve yeni yapılar inşa edeceğiz.",
    atmosphere: "Yaratıcı, yapıcı, ilham verici",
  },
  Toplarya: {
    scene: "Lav nehirleri geminizin altında akıyor. Toplarya'da güçler birleşir ve ayrılır — tıpkı toplama ve çıkarma gibi.",
    guide: "Ben İkilem! Toplarya'nın çift başlı ejderhası. Birleştirme ve ayırma gücünü öğreteceğim!",
    atmosphere: "Sıcak, güçlü, dinamik",
  },
  Çarpanya: {
    scene: "Labirent duvarları yükseliyor. Çarpanya'nın gizemli yapılarına giriş izni için çarpım bilmecelerini çöz!",
    guide: "Grupçu hazır! 8 kolumla sana çarpma ve bölmenin sırlarını göstereceğim.",
    atmosphere: "Gizemli, zorlu, ödüllendirici",
  },
  Basamara: {
    scene: "Devasa piramitler ufukta beliriyor. Her katman bir öncekinin 10 katı — basamak değerinin gücü burada!",
    guide: "Katman'ım ben, Basamara'nın kedisi. Piramitlerin katmanları arasında gezineceğiz!",
    atmosphere: "Görkemli, yapılandırılmış, bilge",
  },
  Örünya: {
    scene: "Orman renkleri sürekli değişiyor. Ağaçlar, çiçekler — her şey bir desene göre büyüyor.",
    guide: "Dönüşçü burada! Desenlerin dilini öğreneceğiz — geleceği tahmin etmenin anahtarı!",
    atmosphere: "Doğal, değişken, sürprizli",
  },
};

// ═══ GÖREV TAMAMLAMA KUTLAMALARI — Performansa göre kutlama sahneleri ═══
// Görev tamamlandığında performans seviyesine göre çalan kutlama sahneleri
export const MISSION_COMPLETION_CELEBRATIONS = {
  perfect: [
    { scene: "Yıldızlar dans ediyor! %100! Stratejin işe yaradı, kaşif!", sceneKu: "Stêr dans dikin! %100! Stratejiya te bi ser ket, keşifger!", character: "🌟", animation: "supernova" },
    { scene: "Kusursuz görev! Senin adına yıldız doğdu!", sceneKu: "Erkeke bêkêmasî! Bi navê te stêrek çêbû!", character: "✨", animation: "supernova" },
    { scene: "Her soruyu adım adım çözdün! Evren seni selamlıyor!", sceneKu: "Te her pirs gav bi gav çareser kir! Gerdûn silavê li te dike!", character: "👑", animation: "supernova" },
  ],
  excellent: [
    { scene: "Harika! Mürettebat gurur duyuyor!", sceneKu: "Pir baş! Ekîb serbilind e!", character: "🎉", animation: "starBurst" },
    { scene: "Mükemmele çok yakınsın! Parlıyorsun!", sceneKu: "Tu pir nêzîkî temamiyê yî! Tu dibiriqî!", character: "🚀", animation: "starBurst" },
    { scene: "Olağanüstü! Filo seni onurlandırıyor!", sceneKu: "Awarte! Fîlo te bi rûmet dike!", character: "🏅", animation: "starBurst" },
  ],
  good: [
    { scene: "İyi iş, kaşif! Her görev güçlendiriyor!", sceneKu: "Karê baş, keşifger! Her erk te bihêztir dike!", character: "💪", animation: "pulseGlow" },
    { scene: "Güzel yolculuk! Daha da parlayacaksın!", sceneKu: "Rêwîtiyeke xweş! Tê hê zêdetir bibiriqî!", character: "⭐", animation: "pulseGlow" },
    { scene: "Devam et! Matematik enerjin yükseliyor!", sceneKu: "Bidomîne! Enerjiya te ya matematîkê bilind dibe!", character: "🌠", animation: "pulseGlow" },
  ],
  struggling: [
    { scene: "Her kaşif zorluklarla karşılaşır! Devam!", sceneKu: "Her keşifger bi zehmetiyan re rû bi rû dimîne! Bidomîne!", character: "💫", animation: "gentleFloat" },
    { scene: "Beynin yeni bağlantılar kuruyor! Tekrar dene!", sceneKu: "Mejiyê te girêdanên nû çêdike! Dîsa biceribîne!", character: "🧠", animation: "gentleFloat" },
    { scene: "Her hata bir ders! Tekrar deneyelim!", sceneKu: "Her şaşî dersek e! Em dîsa biceribînin!", character: "🦸", animation: "gentleFloat" },
  ],
};

// ═══ MATEMATİK HARİKA GERÇEKLERİ — "Bunu biliyor muydun?" bilgileri ═══
// Çocukları şaşırtan ve heyecanlandıran kısa matematik/uzay gerçekleri
export const MATH_WONDER_FACTS = [
  { emoji: "🪐", fact: "Satürn'ün halkaları o kadar geniş ki içine 764 tane Dünya sığar — ama halkaların kalınlığı sadece 10 metre!", topic: "uzay" },
  { emoji: "🔢", fact: "1'den 100'e kadar tüm sayıları toplarsanız 5050 eder! Bunu 10 yaşındaki Gauss saniyeler içinde bulmuş.", topic: "sayılar" },
  { emoji: "🌻", fact: "Ayçiçeğinin tohumları Fibonacci spirali şeklinde dizilir — doğa matematiği bizden önce keşfetmiş!", topic: "doğa" },
  { emoji: "⭐", fact: "Gökyüzünde gözle görebildiğimiz yaklaşık 5.000 yıldız var — ama evrende Dünya'daki kum tanelerinden daha fazla yıldız var!", topic: "uzay" },
  { emoji: "🐝", fact: "Arılar peteklerini altıgen şeklinde yapar çünkü altıgen, en az malzemeyle en çok alanı kaplayan şekildir!", topic: "geometri" },
  { emoji: "🎲", fact: "Bir zarın karşılıklı yüzlerindeki sayıların toplamı her zaman 7'dir: 1+6, 2+5, 3+4!", topic: "sayılar" },
  { emoji: "🌙", fact: "Ay, Dünya'dan her yıl 3,8 cm uzaklaşıyor — bu bir matematik formülüyle hesaplanıyor!", topic: "uzay" },
  { emoji: "🕸️", fact: "Örümcek ağları mükemmel geometrik şekillerdir — her ip eşit açıyla yerleştirilir!", topic: "geometri" },
  { emoji: "🧮", fact: "Sıfır sayısı yaklaşık 1.400 yıl önce Hindistan'da icat edildi — ondan önce insanlar 'hiçlik' için bir sayıya sahip değildi!", topic: "tarih" },
  { emoji: "❄️", fact: "Her kar tanesi altıgen simetriye sahiptir ama dünyada hiçbir iki kar tanesi birbirinin aynısı değildir!", topic: "doğa" },
  { emoji: "🌀", fact: "Galaksimizin şekli bir spiral — tıpkı matematik derslerinde çizdiğimiz spiraller gibi!", topic: "uzay" },
  { emoji: "🐚", fact: "Deniz kabukları altın oran spirali şeklinde büyür — bu oran yaklaşık 1,618'dir ve doğanın en güzel sayısı olarak bilinir!", topic: "doğa" },
  { emoji: "🔺", fact: "Piramitler 4.500 yıl önce matematik kullanılarak inşa edildi — taşların her biri milimetrik hassasiyetle yerleştirildi!", topic: "tarih" },
  { emoji: "🪞", fact: "Kelebeklerin kanatları mükemmel simetriktir — sağ ve sol kanat birbirinin ayna görüntüsüdür!", topic: "geometri" },
  { emoji: "🌊", fact: "Işık yılı bir zaman değil, uzaklık birimidir — ışığın bir yılda aldığı mesafe yaklaşık 9,5 trilyon kilometre!", topic: "uzay" },
  { emoji: "🦎", fact: "Bukalemunun dili vücudunun 2 katı uzunluğundadır — doğadaki çarpma bu!", topic: "doğa" },
  { emoji: "🎹", fact: "Müzik aslında matematiktir! Her nota belirli bir frekansa sahiptir ve akorlar oranlarla oluşur.", topic: "sayılar" },
  { emoji: "🏗️", fact: "Üçgen, en güçlü geometrik şekildir — köprüler ve kuleler üçgen yapılarla ayakta durur!", topic: "geometri" },
  { emoji: "🧊", fact: "Bir küpün 6 yüzü, 12 kenarı ve 8 köşesi vardır — 6 + 8 - 12 = 2 (Euler formülü)!", topic: "geometri" },
  { emoji: "🌍", fact: "Dünya'nın çevresi tam 40.075 km — antik Yunanlılar bunu 2200 yıl önce matematikle hesapladı!", topic: "uzay" },
  { emoji: "🐜", fact: "Bir karınca kendi ağırlığının 50 katını taşıyabilir — bu çarpmayı anlamanın harika bir örneği!", topic: "doğa" },
  { emoji: "🎯", fact: "Dart tahtasındaki sayıların toplamı 210'dur — 1'den 20'ye kadar tüm sayıların toplamı!", topic: "sayılar" },
  { emoji: "🧬", fact: "DNA çift sarmalı matematiksel bir spiral oluşturur — yaşamın şifresi geometridir!", topic: "doğa" },
  { emoji: "🏛️", fact: "Antik Mısırlılar piramitleri inşa ederken 3-4-5 üçgenini kullanarak dik açı ölçerdi!", topic: "tarih" },
  { emoji: "🦕", fact: "Dinozorlar 165 milyon yıl yaşadı — insanlar ise sadece 300.000 yıldır burada!", topic: "sayılar" },
  { emoji: "🎪", fact: "Bir dairenin çevresi çapının her zaman Pi (3,14...) katıdır — bu her daire için geçerli!", topic: "geometri" },
  { emoji: "🔭", fact: "Hubble Teleskobu 13,4 milyar ışık yılı uzaktaki galaksileri görebiliyor — evreni matematikle keşfediyoruz!", topic: "uzay" },
  // v5.7 ek harika gerçekler
  { emoji: "🦠", fact: "Bir bakteri her 20 dakikada ikiye bölünür — 24 saatte tek bir bakteri milyarlarca olabilir! Bu üstel büyümenin gücüdür.", topic: "sayılar" },
  { emoji: "🎸", fact: "Gitar telinin tam ortasına basarsan sesin frekansı 2 katına çıkar — müzik ve matematik ikiz kardeştir!", topic: "sayılar" },
  { emoji: "🌈", fact: "Gökkuşağında 7 renk var — ama aslında sonsuz renk tonu barındırır, çünkü ışık sürekli bir spektrumdur!", topic: "doğa" },
  { emoji: "🧊", fact: "Su donarken hacmi %9 artar — bu yüzden buz suyun üstünde yüzer! Doğa bile yüzdeleri kullanır.", topic: "doğa" },
  { emoji: "🏃", fact: "Usain Bolt 100 metreyi 9,58 saniyede koştu — bu saniyede yaklaşık 10,44 metre demek!", topic: "sayılar" },
  { emoji: "🗼", fact: "Eyfel Kulesi yaz aylarında sıcaktan 15 cm uzar — metaller ısıtılınca genişler, bu da bir matematik formülüdür!", topic: "geometri" },
  { emoji: "🎯", fact: "Bir yıl 31.536.000 saniye sürer — her saniyede yeni bir şey öğrenebilirsin!", topic: "sayılar" },
  { emoji: "🐘", fact: "Bir fil günde yaklaşık 150 kg yiyecek yer — bu bir haftada 1050 kg yapar! Çarpmanın gücü!", topic: "doğa" },
  { emoji: "🌋", fact: "Dünya'da her yıl yaklaşık 60 yanardağ patlar — ama okyanus tabanındakileri sayarsak çok daha fazla!", topic: "doğa" },
  { emoji: "📐", fact: "Antik Yunanlılar sadece pergel ve cetvel kullanarak mükemmel geometrik şekiller çizebiliyorlardı!", topic: "tarih" },
];

// ═══ BAŞARI MİLESTONE KUTLAMALARI — Özel anlar için narratif metinler ═══
// v5.7: Daha zengin milestone kutlama sahneleri
export const ACHIEVEMENT_CELEBRATIONS = {
  firstStar: {
    title: "İlk Yıldız!",
    scene: "Galaksinin en parlak yıldızlarından biri senin adını taşıyor artık! İlk yıldızını kazandın — bu başlangıcın en güzel parçası.",
    reward: "Yıldız Koleksiyoncu Rozeti",
  },
  tenPerfect: {
    title: "Mükemmellik Ustası!",
    scene: "10 kez %100 doğruluk! Mürettebat seni 'Adım Adım Usta' olarak anmaya başladı. Gezegenler senin onuruna hizalandı!",
    reward: "Altın Mükemmellik Madalyası",
  },
  allPlanets: {
    title: "Evren Kaşifi!",
    scene: "Tüm gezegenleri ziyaret ettin! Galaksinin haritası artık tamamlandı. Sen gerçek bir evren kaşifisin — hiçbir gezegen keşfedilmemiş kalmadı!",
    reward: "Evren Kaşifi Unvanı",
  },
  hundredGames: {
    title: "Yüz Görev Efsanesi!",
    scene: "100 görev tamamladın! Bu sayı, galaksinin tarih kitaplarına altın harflerle yazılacak. Sen artık bir efsanesin, kaşif!",
    reward: "Efsanevi Yüzüncü Görev Rozeti",
  },
  weekStreak: {
    title: "Haftalık Şampiyon!",
    scene: "7 gün üst üste oynamayı başardın! Güneş sistemi senin kararlılığına hayran — yıldızlar bile bu azmi takdir ediyor!",
    reward: "Haftalık Şampiyon Tacı",
  },
  mathMaster: {
    title: "Matematik Ustası!",
    scene: "20 farklı modda %80 üzeri başarı! Matematik evreninin tüm kapılarını açtın. Prof. Yıldız diyor ki: 'Sen artık benden bile iyisin!'",
    reward: "Matematik Ustası Unvanı",
  },
};

// ═══ UZAY OLAYLARI DİYALOGLARI — Rastgele olay karşılaşma diyalogları ═══
// v5.7: Uzay olaylarına etkileşimli diyalog katmanı
export const SPACE_EVENT_DIALOGUES = {
  meteor_shower: {
    greeting: "Dikkat! Meteor yağmuru yaklaşıyor!",
    dialogue: "Geminin kalkanlarını matematik enerjisiyle güçlendir! Her doğru cevap kalkanı daha sağlam yapar.",
    farewell: "Meteor yağmurunu atlattık! Kalkanların sayesinde gemi sapasağlam.",
  },
  friendly_alien: {
    greeting: "Bip bop! Ben Zixar, Andromeda'dan geliyorum!",
    dialogue: "Gezegenimde sayılar şarkı söyler! Bana senin dilinde matematik öğretir misin?",
    farewell: "Teşekkürler, kaşif! Artık iki galaksinin dilini biliyorum — sayılar ve dostluk!",
  },
  star_fragment: {
    greeting: "Parlak bir ışık yaklaşıyor...",
    dialogue: "Bu bir yıldız parçası! Antik yıldızlardan düşen bu kristal, matematik enerjisi taşıyor.",
    farewell: "Yıldız parçası koleksiyonuna eklendi. Geminin enerjisi yükseldi!",
  },
  space_whale: {
    greeting: "Devasa bir gölge geminizin üzerinden geçiyor...",
    dialogue: "Uzay balinası! Bu nazik devler galaksiler arası göç eder. Yolculukları binlerce ışık yılı sürer.",
    farewell: "Uzay balinası yoluna devam etti. Bu anı asla unutmayacaksın!",
  },
  cosmic_library: {
    greeting: "Antik bir yapı radarınızda beliriyor...",
    dialogue: "Kozmik Kütüphane! Burada evrenin tüm matematik sırları yazılı. Her kitap farklı bir galaksinin bilgeliğini taşıyor.",
    farewell: "Kütüphaneden yeni bilgiler öğrendin. Beynin yeni bağlantılar kurdu!",
  },
  galaxy_garden: {
    greeting: "Renkli bir ışıltı gözünüzü kamaştırıyor...",
    dialogue: "Galaktik Bahçe! Burada matematik çiçekleri açar — her yaprak bir sayı, her çiçek bir denklem.",
    farewell: "Bahçeden bir matematik çiçeği topladın. Kokusu ilham veriyor!",
  },
};

// ═══ GEMİ GÜNLÜĞÜ BAĞLAMSAL NOTLARI — Oyuncu davranışına göre ek notlar ═══
// v5.7: Oyuncunun oyun tarzına göre kaptan günlüğüne eklenen bağlamsal notlar
export const CONTEXTUAL_LOG_NOTES = {
  fastSolver: "Not: Bugün cevaplar şimşek hızıyla geldi — refleksler keskinleşiyor!",
  carefulThinker: "Not: Dikkatli ve düşünceli bir yaklaşım sergilendi. Her cevap özenle verildi.",
  improver: "Not: Dünkü performansa göre belirgin bir ilerleme var — pratik meyvelerini veriyor!",
  explorer: "Not: Bugün yeni bir mod keşfedildi. Merak, keşfin en güçlü motorudur.",
  persistent: "Not: Zorluklara rağmen devam edildi. Bu kararlılık, galaksinin en değerli kaynağıdır.",
  streakMaster: "Not: İnanılmaz bir seri yakalandı! Konsantrasyon seviyesi doruk noktasında.",
  versatile: "Not: Birden fazla farklı konuda çalışıldı. Çok yönlülük, büyük kaşiflerin ortak özelliğidir.",
  morningLearner: "Not: Sabahın erken saatlerinde çalışma yapıldı. Bilimsel araştırmalar sabah öğrenmenin daha kalıcı olduğunu gösteriyor!",
  nightExplorer: "Not: Gece keşfi devam ediyor. Yıldızlar en güzel karanlıkta parlıyor — tıpkı senin matematik gücün gibi!",
};

// ═══════════════════════════════════════════════════════════════════════════
// KÜRTÇE (KURMANCÎ) HİKÂYELER — Ferhenga Matematikê referansıyla
// Referans: Prof. Dr. Yılmaz MUTLU, Ferhenga Matematikê v2.0
// Tüm mod hikayeleri, uzay olayları, başarı kutlamaları Kürtçe
// ═══════════════════════════════════════════════════════════════════════════

// NOT: Bu, önceki oturumdan kalan ALTERNATİF (v2.0) çeviri — aktif KU çevirisi
// dosyanın başındaki MODE_STORIES_KU'dur. Bu blok referans/yedek olarak korunur.
export const MODE_STORIES_KU_LEGACY = {
  counting: { mission: "Kevirên Stêrkan Bihejmêre!", story: "Li her kevirê stêrkan dest bide, bi her destdanê hejmarekê bibêje!", briefing: "Kevirên stêrkan yek bi yek bihejmêre!", completion: "Kevirên stêrkan li envanterê hatin zêdekirin!", alienEncounter: "Cûceyê Jimaron kevirekî stêrkan dirêj dike — 'Tu dikarî vê jî bihejmêrî?' dibêje.", strategyTip: "Li her kevirê stêrkan carekê dest bide û bi deng bihejmêre — ji bo ku nekevin, bi rêzê pêşve biçe.", wrongInsight: "Kevirên ku te jimartine bi tiliya xwe nîşan bide — wisa tu ji bîr nakî ka kîjan te jimartiye." },
  chipGuess: { mission: "Bîranîna Fezayê!", story: "Kevirên stêrkan bi baldarî bihejmêre — dema ku veşartin, divê tu bi bîr bînî!", briefing: "Demek kurt bibîne, paşê bi bîr bîne — çend hene?", completion: "Hêzên bîranînê xurt dibin!", alienEncounter: "Ji navbera kevirên veşartî çavek çirûsk dike — 'Min bi bîr bîne!' dibêje.", strategyTip: "Dema ku kapsul xuya dike zû bihejmêre an jî bi koman bi bîr bîne — mîna 5+2.", wrongInsight: "Bi koman bifikire: 5 û çend hên din? Ev bê jimartin bi bîr anîn hêsantir dike." },
  rodBack: { mission: "Birûska Bîranînê!", story: "Kevirên stêrkan bi şiklên cuda bibîne — kapsul, çarçove, domîno, tilî — û di bîra xwe de bigire!", briefing: "Heman hejmarê di nîşandanên cuda de nas bike!", completion: "Şiyana nîşandana pirhejmar pêş ket!", alienEncounter: "Guhêrbarekî şekil heman hejmarê bi sê awayên cuda nîşan dide.", strategyTip: "Her nîşandan heman mîqdarê dibêje — tilî, kapsul, çarçove hemû heman hejmar in.", wrongInsight: "Ne nîşandanê, lê hejmara kevirên stêrkan bifikire — şekil biguhere jî mîqdar naguhere." },
  addition: { mission: "Hêzan Bike Yek!", story: "Du kapsulên enerjiyê li hev tên — kevirên stêrkan zêde bike — hemûyan bihejmêre an jî ji mezin bidomîne!", briefing: "Du koman zêde bike! Ji hejmara mezin dest pê bike.", completion: "Komên enerjiyê bi serkeftî hatin yekbûn!", alienEncounter: "Ejderhayê duserî yê Zêdekariyê li yekbûna du koman temaşe dike — 'Hêz ducar bû!' dibêje.", strategyTip: "Ji hejmara mezin dest pê bike û bi qasî hejmara biçûk bidomîne — li şûna 3+5, ji 5'an dest pê bike: 6, 7, 8!", wrongInsight: "Kapsula mezin bibîne, ji wê hejmarê dest pê bike û bihejmêre — her tilî zêdekirinek e." },
  subtraction: { mission: "Enerjiyê Veqetîne!", story: "Ji koma mezin koma biçûk derxe — ji bo bermayiyê bihejmêre an ber bi pêş bihejmêre!", briefing: "Ji mezin biçûk derxe, bermayiyê bibîne!", completion: "Rêxistina enerjiyê bi serkeftî!", alienEncounter: "Ejderhayê qeşayê hin kevirên stêrkan dicemidîne û veqetîne.", strategyTip: "Ji hejmara biçûk heta mezin ber bi pêş bihejmêre û ferqê bibîne — an jî ji mezin ber bi paş bihejmêre.", wrongInsight: "Bi qasî yên derxistî kevirên stêrkan veşêre, yên mayî bihejmêre — yên ku tu dibînî bersiv in." },
  addChips: { mission: "Kevirên Stêrkan Zêde Bike!", story: "Li kevirên stêrkan yên heyî yên nû zêde bike — bigihîje hejmara armancê!", briefing: "Kevirên nû zêde bike, bigihîje armancê!", completion: "Kapsul giha enerjiya armancê!", alienEncounter: "Kanîrevanê Zêdekariyê kevirên stêrkan yên nû li kapsulê zêde dike — 'Ji me re bibe alîkar ku bigihîjin armancê!' dibêje.", strategyTip: "Ji hejmara heyî heta hejmara armancê çend heb lazim e bihejmêre.", wrongInsight: "Ji hejmara heyî ber bi pêş bihejmêre heta hejmara armancê — çend gavên ku tu avêtî ew qas zêde bike." },
  removeChips: { mission: "Kevirên Stêrkan Veqetîne!", story: "Kevirên stêrkan bi derxistinê veqetîne — kevirên mayî bihejmêre!", briefing: "Keviran derxe, yên mayî bihejmêre!", completion: "Kirariya veqetandinê qediya!", alienEncounter: "Ejderhayê qeşayê kevirên stêrkan yên zêde bi pifkîna xwe dûr dike — 'Çend heb man?' dibêje.", strategyTip: "Kevirên stêrkan yên derxistî bigire û yên mayî bihejmêre.", wrongInsight: "Yên derxistî bi tiliya xwe bigire — yên mayî bersiva te ne." },
  subitizing: { mission: "Leza Ronahiyê!", story: "Bê jimartin, bi nêrînek bizanibe çend heb in!", briefing: "Bê jimartin, bi nêrînek çend heb in?", completion: "Hêza tavilzanînê bilind bû!", alienEncounter: "Kundê Şimşeron çavên xwe yên mezin vedike û bi nêrînek hejmarê dibîne!", strategyTip: "Komên biçûk nas bike: 2 û 3 bi hev re bibînî 5 bûyîna wê dizanî.", wrongInsight: "Hewl nede bihejmêrî — komên biçûk (2, 3, 4) yên ku dizanî bi nêrînek nas bike." },
  makeFive: { mission: "5 Kevirên Stêrkan Berhev Bike!", story: "Parçeyên 5'an keşf bike — qutiyên vala bihejmêre û parçeya kêm bibîne!", briefing: "5'an temam bike! Valahiyan bihejmêre.", completion: "Sira 5'an vekirî!", alienEncounter: "Endezyarê Pêkhatin çarçoveya 5'î derdixe — 'Valahiyan bihejmêre!' dibêje.", strategyTip: "Valahiyên di çarçoveya 5'î de parçeya kêm bi xwe ne.", wrongInsight: "Qutiyên vala yên di çarçovê de bihejmêre — hejmara valahiyan ew mîqdare ku ji bo temamkirina 5'an lazim e." },
  makeTen: { mission: "10 Kevirên Stêrkan Berhev Bike!", story: "Valahiyên di çarçoveya 10'î de bihejmêre — parçeya din a 10'an keşf bike!", briefing: "10'an temam bike! Qutiyên vala bihejmêre.", completion: "Hevalên 10'an hîn bûyî!", alienEncounter: "Fezayiyek 10 destî li her destê kevirekî dixwaze bicîh bike — çend dest vala ne?", strategyTip: "Hevalên 10'an: 1+9, 2+8, 3+7, 4+6, 5+5 — van ji ber bike!", wrongInsight: "Qutiyên vala yên di çarçovê de bihejmêre — ew hejmar ji bo temamkirina 10'an lazim e." },
  tensFrame: { mission: "Radara Dehî!", story: "Ger rêza jorîn tije ye 5 e! Paşê yên rêza jêrîn zêde bike — bê jimartin avakirin!", briefing: "Rêza jorîn 5, yên jêrîn zêde bike — hemû çend in?", completion: "Radara dehî kalibre bû!", alienEncounter: "Robota Basamara çarçoveya 10'î dişoxilîne — '5 li jor, li jêr çend hene?' dipirse.", strategyTip: "Ger rêza jorîn bi tevahî tije ye wê demê ew 5 e. Yên jêrîn zêde bike: 5 + rêza jêrîn = hemû.", wrongInsight: "Rêza jorîn wekî 5 qebûl bike, tenê kevirên stêrkan yên rêza jêrîn bihejmêre û 5'an zêde bike." },
  doubleTensFrame: { mission: "Radara Dehî ya Ducar!", story: "Çarçoveya çepê tam 10 e! Yên rastê zêde bike — 10 zêde çend?", briefing: "Çarçoveya çepê 10 e, yên rastê zêde bike!", completion: "Pergala radara ducar çalak bû!", alienEncounter: "Pîlotên cêwî yên Basamara her yek çarçoveyekê digirin — 'Me ya çepê tije kir, yên rastê tu bihejmêre!' dibêjin.", strategyTip: "Çarçoveya çepê 10 e. Kevirên stêrkan yên çarçoveya rastê bihejmêre û 10'an zêde bike.", wrongInsight: "Çarçoveya çepê her dem 10 e. Tenê yên rastê bihejmêre û 10+? bike." },
  comparison: { mission: "Şerê Gerstêrkan!", story: "Du kapsulên enerjiyê berhev bike — ya dirêj kevirên stêrkan yên zêdetir hene!", briefing: "Du kapsulên berhev bike — kîjan zêdetir e?", completion: "Pergala berhevkirinê nû bû!", alienEncounter: "Dadgerê Terazya du kapsulên li teraziyê datîne — 'Kîjan girantir e?' dipirse.", strategyTip: "Li dirêjahiya kapsulên binêre — di kapsulê ya dirêjtir de kevirên stêrkan zêdetir hene.", wrongInsight: "Kapsulên li kêleka hev bîne û berhev bike — kîjan dirêjtir e, ew zêdetir e." },
  matching: { mission: "Stêrkan Hevdu Bike!", story: "Jimareyê bixwîne, kevirên stêrkan yên di kapsulê de bihejmêre û hevjotê rast bibîne!", briefing: "Jimare û mîqdarê hevdu bike!", completion: "Hevdukirin bi serkeftî!", alienEncounter: "Robota posteyê ya Jimaron dixwaze li her kapsulê etîketa rast bide — 'Kîjan kîjan e?' dibêje.", strategyTip: "Pêşî kevirên stêrkan yên di kapsulê de bihejmêre, paşê jimareya ku wê hejmarê nîşan dide bibîne.", wrongInsight: "Kevirên stêrkan yên di kapsulê de yek bi yek bihejmêre — hejmar divê bi jimareyê re hevber be." },
  partWhole: { mission: "Puzzle Parçe-Giştî!", story: "Parçeya kêm a giştî bibîne û puzzle temam bike!", briefing: "Parçeya kêm a giştî bibîne!", completion: "Puzzle qediya!", alienEncounter: "Hostayê puzzlê yê Pêkhatin parçeyan di hewayê de dizivîrîne — 'Çi kêm e?' dipirse.", strategyTip: "Ji giştî parçeya diyar kemker bike — ya mayî parçeya kêm e.", wrongInsight: "Giştî = parçe + parçe. Parçeya ku dizanî ji giştî derxe — ya mayî bersiva te ye." },
  missingNumber: { mission: "Stêra Windabûyî!", story: "Hejmara veşartî bibîne — nîşane di kapsulên enerjiyê de ne!", briefing: "Hejmara windabûyî ya di hevkêşanê de bibîne!", completion: "Stêra windabûyî hat dîtin!", alienEncounter: "Korsanekî fezayê yê sîrûştî jimareke dizîye û revîye — detektîf be!", strategyTip: "Hevkêşanê bixwîne û bi hejmarên diyar nayzan bihejmêre.", wrongInsight: "Divê du aliyên hevkêşanê wekhev bin — bi hejmarên diyar yê kêm bibîne." },
  trueFalse: { mission: "Detektîfê Hevkêşanê!", story: "Hevkêşanê lêbikole — du alî bi rastî heman mîqdar in? Binêre ka teraziya kozmîk li ser denge ye!", briefing: "Ev hevkêşan rast e, yan şaş e?", completion: "Peywira detektîfiyê bi serkeftî!", alienEncounter: "Dadgerê Terazya teraziyeke mezin tîne — du aliyan kontrol bike!", strategyTip: "Her du aliyan ji hev cuda bihejmêre — ger encam yek be rast e, ger cuda be şaş e.", wrongInsight: "Aliyê çepê bihejmêre, aliyê rastê bihejmêre — ger du encam wekhev bin rast e, nebe şaş e." },
  wpAdd: { mission: "Peywira Zêdekirinê!", story: "Peywirê bixwîne, daneyên diyar bibîne û bi zêdekirinê çareser bike!", briefing: "Pirsgirêkê bixwîne û bi zêdekirinê çareser bike!", completion: "Rapora peywirê hat tomarkirin!", alienEncounter: "Namebera Zêdekariyê nameya peywirê tîne — 'Hemûyan bike yek!' dibêje.", strategyTip: "'Hemû', 'bi hev re', 'giştî' peyvên zêdekirinê ne.", wrongInsight: "Pirsgirêkê dîsa bixwîne — daneyên diyar binê xêz bihejmêre û zêde bike." },
  wpSub: { mission: "Peywira Kemkirinê!", story: "Peywirê bixwîne, daneyên diyar bibîne û bi kemkirinê çareser bike!", briefing: "Pirsgirêkê bixwîne û bi kemkirinê çareser bike!", completion: "Peywir bi serkeftî qediya!", alienEncounter: "Tîma rizgarkirinê kevirên stêrkan derxe — 'Me çend heb rizgar kirin?' dipirsin.", strategyTip: "'Bermayî', 'ferq', 'kêm bû', 'çend heb kêmtir' peyvên kemkirinê ne.", wrongInsight: "Pirsgirêkê dîsa bixwîne — ji hejmara mezin hejmara biçûk derxe." },
  wpMul: { mission: "Peywira Carkirinê!", story: "Komên wekhev bibîne, bi carkirinê çareser bike!", briefing: "Komên wekhev bibîne, bi carkirinê çareser bike!", completion: "Peywira carkirinê hat tomarkirin!", alienEncounter: "Aşpêjê Çarpanya li her teştê porsiyon wekhev datîne — 'Hemû çend parçe ne?' dibêje.", strategyTip: "'Di her yekê de', 'komên wekhev', 'dane' peyvên carkirinê ne.", wrongInsight: "Çend kom hene? Di her komê de çend heb in? Hejmara koman × mîqdar = giştî." },
  wpDiv: { mission: "Peywira Parkirinê!", story: "Komên parkirî bibîne, bi parkirinê çareser bike!", briefing: "Wekhev par bike, bi parkirinê çareser bike!", completion: "Parkirin bi serkeftî!", alienEncounter: "Robota dadê kevirên stêrkan wekhev belav dike — 'Ji her kes re dadperwer!' dibêje.", strategyTip: "'Wekhev par bike', 'çendan', 'parve bike' peyvên parkirinê ne.", wrongInsight: "Giştî li koman wekhev parve bike — ji her komê re çend ket?" },
  wpCompare: { mission: "Peywira Berhevkirinê!", story: "Du çendînan berhev bike, ferq an yê mezin bibîne!", briefing: "Du koman berhev bike, ferqê bibîne!", completion: "Rapora berhevkirinê amade ye!", alienEncounter: "Du gerstêrkên cêwî yên Terazya pêşbirk dikin — 'Ferqa di navbera me de çend e?' dipirsin.", strategyTip: "'Çend zêdetir', 'çend kêmtir', 'ferq' peyvên berhevkirinê ne.", wrongInsight: "Du hejmaran li kêleka hev rûnîne — ji mezin biçûk derxe û ferqê bibîne." },
  ordering: { mission: "Gerîdeyê Rêz Bike!", story: "Kapsulên enerjiyê ji ya herî kurt heta ya herî dirêj rêz bike!", briefing: "Ji biçûk heta mezin rêz bike!", completion: "Gerîde hatin rêxistinkirin!", alienEncounter: "Robota gerîdeyê kapsulên tevlihev kiriye — ji bo rêza rast alîkariya wê bike!", strategyTip: "Hejmara herî biçûk bibîne, paşê ya duyem herî biçûk — bi rêzê rûne.", wrongInsight: "Li hemû hejmaran binêre û ji ya herî biçûk dest pê bike — her carê ya duyem herî mezin bibîne." },
  beforeAfter: { mission: "Cîranên Gerîdeyê Bibîne!", story: "Her hejmarê yek beriya wê û yek piştî wê heye — wan bibîne!", briefing: "Berî û piştî hejmarê bibîne!", completion: "Gerstêrkên cîran hatin nexşekirin!", alienEncounter: "Nobedarê gerîdeyê yê Jimaron du gerstêrkên cîran nîşan dide — 'Yê navîn kî ye?' dipirse.", strategyTip: "Ji bo beriya hejmarê 1 kemker bike, ji bo piştî 1 zêde bike.", wrongInsight: "Jimêrxêzê bifikire — ger ber bi rastê biçî 1 zêde dibe, ger ber bi çepê 1 kêm dibe." },
  buildNumber: { mission: "Kevirên Stêrkan Bi Cih Bike!", story: "Hejmara armancê bifikire û yek bi yek kevirê stêrkan danê û ava bike!", briefing: "Bi qasî hejmara armancê kevir bi cih bike!", completion: "Hejmar bi serkeftî hat avakirin!", alienEncounter: "Mîmarê Jimaron kevirên stêrkan yek bi yek datîne — 'Tu jî ava bike!' dibêje.", strategyTip: "Bi her destdanê bi deng bihejmêre — gava bigihîjî hejmara armancê rawestîne.", wrongInsight: "Kevirên ku danîyî bi deng bihejmêre — gava bigihîjî armancê divê rawestî." },
  fiveMore: { mission: "Pîvana 5 Stêrkan!", story: "Kapsulê bi kapsulê referansa 5 an 10'an berhev bike — di binê de ye, wekhev e, li ser e?", briefing: "Bi 5 an 10'an berhev bike — kêmtir e, zêdetir e?", completion: "Pîvandina pîvanê qediya!", alienEncounter: "Pisporê pîvandinê yê Pêkhatin kapsulê referansê dirêj dike — 'Li gorî vê kêmtir e, zêdetir e?' dibêje.", strategyTip: "Li kapsulê referansa 5'î binêre — kapsulê armancê kurttir e, wekhev e, dirêjtir e?", wrongInsight: "Kapsulên li kêleka hev bîne — bi kapsulê referansê berhev bike." },
  timesTable: { mission: "Hostayê Stratejiyê!", story: "Ducarkirinê, komek zêde bike, kareya nêzîk — bi stratejiyê çareser bike!", briefing: "Tabloya carkirinê bi stratejiyê çareser bike!", completion: "Stratejî bi serkeftî hat bicihkirin!", alienEncounter: "Ahtapotê Çarpanya 8 destên xwe tabloya carkirinê dike!", strategyTip: "Ji carkirineke ku dizanî dest pê bike: 6×7 nizanî 6×6=36'yî bizanî, 6 zêde bike.", wrongInsight: "Carkirinê wekî zêdekirina dubare bifikire: 4×3 = 4+4+4." },
  divisionBasic: { mission: "Hostayê Parkirinê!", story: "n÷1=n, n÷n=1, carkirinê bifikire — bi stratejiyê par bike!", briefing: "Rêzikên parkirinê bicih bîne û çareser bike!", completion: "Sernivîsa hostayê parkirinê hat pejirandin!", alienEncounter: "Robota parkirinê ya Çarpanya kekek bi beşên wekhev dike — 'Her beş çend parçe ne?' dibêje.", strategyTip: "Parkirinê wekî carkirina berevajî bifikire: 12÷3=? tê wateya 3×?=12.", wrongInsight: "Tabloya carkirinê bifikire — kîjan hejmar ger were carkirin encam dide?" },
  mulDivInverse: { mission: "Girêdana Berevajî!", story: "3×4=12 wê demê 12÷4=3! Girêdana carkirin ↔ parkirin saz bike!", briefing: "Carkirinê dizanî parkirinê jî çareser bike!", completion: "Girêdana berevajî hat avakirin!", alienEncounter: "Hostayê neynikê yê Çarpanya berevajiyê her carkirinê nîşan dide — 'Eger yek hebe ya din jî heye!' dibêje.", strategyTip: "Carkirin û parkirin kirariyên berevajî ne: eger carkirinekê bizanî du parkirin jî dizanî.", wrongInsight: "Malbata carkirinê bifikire: 3×4=12, 4×3=12, 12÷3=4, 12÷4=3." },
  katConcept: { mission: "Çend Car?", story: "3 carê 5'an 15 e! Têgeha carî = hêza carkirinê!", briefing: "Çend car? Car tê wateya carkirin!", completion: "Têgeha carî hat fêrkirin!", alienEncounter: "Robota mezinkerê yê Çarpanya her tiştî car dike — 'Vê 3 car bike!' dibêje.", strategyTip: "'Carê' peyvê wekî 'carîn' bixwîne: 3 carê 5'an = 5 × 3.", wrongInsight: "Car = carkirin. 'N'ê K carî' tê wateya N × K." },
  placeValue: { mission: "Qatan Keşf Bike!", story: "Jimareyê çepê dehan dibêje, ya rastê yekan — nirxa rastîn bibîne!", briefing: "Cihê jimareyê nirxa wê diyar dike!", completion: "Pergala xaneyan hat çareserkirin!", alienEncounter: "Pisîka Basamara qatên pîramîtan nîşan dide — her qat nirxek cuda!", strategyTip: "Jimareyê çepê dehan nîşan dide: 2'ya di 23'an de tê wateya 20. Ya rastê yekan: 3.", wrongInsight: "Jimare li xaneya dehan × 10, jimare li xaneya yekan × 1." },
  bundleTens: { mission: "Nebulaya Dehî!", story: "10 yekan bike yek û dehane çêke — çend dehane, çend yekane man?", briefing: "Bi 10'an pakêt bike! Çend dehane, çend yekane?", completion: "Pakêtkirin bi serkeftî!", alienEncounter: "Pakêtkerê Basamara kevirên stêrkan 10 bi 10 girê dide — 'Çend pakêt çêbûn?' dipirse.", strategyTip: "Her 10 kevirên stêrkan dehaneyekê çêdike. Yên mayî wekî yekane dimînin.", wrongInsight: "10 bi 10 bihejmêre — çend caran te 10'an girt? Kevirên stêrkan yên mayî yekane ne." },
  expandForm: { mission: "Vekirina Galaktîk!", story: "Parçeyên dehî û yekî yên hejmarê ji hev cuda bike — nîşandana berfirehkirî bibîne!", briefing: "Hejmarê wekî dehane + yekane ji hev veqetîne!", completion: "Vekirina hejmarê qediya!", alienEncounter: "Zanyarê Basamara hejmarê li parçeyan dike — 'Avahiya veşartî bibîne!' dibêje.", strategyTip: "Hejmara du jimareyî = nirxa dehî + nirxa yekî. 45 = 40 + 5.", wrongInsight: "Jimare li xaneya dehan çend dehane nîşan dide? Ew hejmar + yekan = hejmarê bi xwe." },
  composeNumber: { mission: "Gerstêrk Çêke!", story: "Kapsulên enerjiyê yên dehî û kevirên stêrkan yên yekî li hev bîne — kîjan hejmar çêdibe?", briefing: "Dehan û yekan bike yek — kîjan hejmar?", completion: "Gerstêrka nû hat çêkirin!", alienEncounter: "Hostayê avahiyê yê Basamara blokên dehî û yekî li hev dike — 'Kîjan hejmar çêbû?' dibêje.", strategyTip: "Hejmara dehan × 10 + hejmara yekan = giştî. 3 dehane + 5 yekane = 35.", wrongInsight: "Dehanan 10'an 10'an bihejmêre, paşê yekanan zêde bike." },
  lessMoreEqual: { mission: "Teraziya Kozmîk!", story: "Du koman berhev bike û biryara rast bide!", briefing: "Mezin e, biçûk e, yan wekhev e?", completion: "Terazî di hevsengiyê de ye!", alienEncounter: "Teraziya dev a Terazya diheje — 'Kîjan alî girantir e?' dipirse.", strategyTip: "Kevirên stêrkan yên di du kapsulên de bihejmêre û berhev bike.", wrongInsight: "Kevirên stêrkan yên di du aliyan de bihejmêre — ger wekhev bin =, ya yekem zêdetir be >, kêmtir be <." },
  conservation: { mission: "Xapandin e?", story: "Kevirên stêrkan cihê xwe guhartin — lê hejmar guherî?", briefing: "Rêzkirin guherî — hejmar jî guherî?", completion: "Testa xapandinê derbas bû!", alienEncounter: "Sêrbazekî fezayê kevirên stêrkan bi awayekî cuda dizîvirîne — hejmar guherî?", strategyTip: "Rêzkirin biguhere jî mîqdar naguhere — eger nehatibe zêdekirin an derxistin ew yek dimîne.", wrongInsight: "Ti kevirekî stêrkan nehat zêdekirin an derxistin — tenê cihên wan guherîn, hejmar ew yek e." },
  quantityMatch: { mission: "Gerstêrkan Hevdu Bike!", story: "Kevirên stêrkan bihejmêre û karta jimareyê ya rast bibîne!", briefing: "Bihejmêre û karta jimareyê ya rast bibîne!", completion: "Hevdukirin bi serkeftî!", alienEncounter: "Kartbazê Jimaron di hewayê de kartan dizivîrîne — 'Karta rast bigire!' dibêje.", strategyTip: "Bi baldarî bihejmêre, paşê jimareya hevber bibîne.", wrongInsight: "Kevirên stêrkan dîsa bihejmêre — li her yekî carekê dest bide." },
  fivesFrame: { mission: "Radara Pêncî!", story: "Kevirên stêrkan û valahiyên di çarçoveya 5'î de bihejmêre!", briefing: "Di çarçoveya 5'î de çend tije, çend vala?", completion: "Radara pêncî kalibre bû!", alienEncounter: "Teknîsyenê Pêkhatin çarçoveya 5'î kontrol dike — 'Çend qutî tije, çend vala?' dibêje.", strategyTip: "Qutiyên tije yên çarçoveya 5'î bihejmêre — valahî parçeya kêm nîşan dide.", wrongInsight: "Qutiyên tije yên çarçovê bihejmêre — ji 5 qutiyan çend heb tije ne?" },
  estimateCount: { mission: "Texmîna Galaktîk!", story: "Bi çavê super kaşifî zû texmîn bike!", briefing: "Bê jimartin texmîn bike — nêzîkî çend heb in?", completion: "Şiyana texmînê pêş ket!", alienEncounter: "Kaşifekî fezayê bi dûrbînê temaşe dike û texmîn dike — tu jî dikarî!", strategyTip: "Xala referansê ya ku dizanî bi kar bîne: eger koma 5'î nasî, çend komên 5'î hene?", wrongInsight: "Komek biçûk bihejmêre (mîna 5), paşê texmîn bike ka giştî çend qat mezintir e." },
  repeatAdd: { mission: "Dubareyê Galaktîk!", story: "Komên wekhev zêde bike — gavê yekem ê carkirinê!", briefing: "Komên wekhev zêde bike — bingeha carkirinê!", completion: "Peywira zêdekirina dubare qediya!", alienEncounter: "Dahûlvanê Çarpanya bi her lêdanê heman hejmarê zêde dike — 'Rîtmê bigire û zêde bike!' dibêje.", strategyTip: "Her komê zêde bike: 3 + 3 + 3 = 9. Ev bi rastî 3 × 3 = 9 tê wateyê!", wrongInsight: "Koman yek bi yek zêde bike — an jî çend kom hene û di her komê de çend heb in, wê carkirin bike." },
  skipCount: { mission: "Rîtma Galaktîk!", story: "2'yan 2'yan, 5'an 5'an, 10'an 10'an rîtmîk bihejmêre — her gav carkirinek e!", briefing: "2'yan, 5'an, 10'an bi bazdanê bihejmêre!", completion: "Rîtma galaktîk hat girtin!", alienEncounter: "Muzîkjenê Jimaron bi rîtmîk ji gerstêrkekê ber bi ya din bazda — 'Tevlî rîtmê bibe!' dibêje.", strategyTip: "Rîtmê bigire: 2, 4, 6, 8... Bi her gavê heman mîqdarê zêde bike.", wrongInsight: "Li hejmara dawî mîqdara bazdanê zêde bike — ev te ber bi hejmara pêş ve dibe." },
  backwardCount: { mission: "Jimartin Berpaş!", story: "Ji hejmara mezin dest pê bike û ber bi paş bihejmêre — her gav kemkirinek e!", briefing: "Ji hejmara mezin ber bi paş bihejmêre!", completion: "Jimartina berpaş qediya!", alienEncounter: "Fermandarê roketa Jimaron jimartina berpaş dest pê dike — '3, 2, 1... Bifirre!' dibêje.", strategyTip: "Her gava berpaş 1 kemkirin e: 10, 9, 8, 7...", wrongInsight: "Hêdî û bi baldarî bihejmêre — bi her gavê hejmar 1 kêm dibe." },
  halfDouble: { mission: "Nîv-Ducar!", story: "÷2 nîvkirin, ×2 ducarkirin — pira carkirin-parkirinê!", briefing: "Du car bike an nîv bike!", completion: "Hostayê nîv-ducarkirinê bûyî!", alienEncounter: "Stêrên cêwî yên Şimşeron dibiriqin — 'Em her tiştî du car dikin!' dibêjin.", strategyTip: "Ducarkirin = hejmarê bi xwe zêde bike. Nîvkirin = hejmarê li du parçeyên wekhev par bike.", wrongInsight: "Du carî = hejmar + hejmar. Nîv = du komên wekhev." },
  arrayDots: { mission: "Rêza Stêrkan!", story: "Rêzê bibîne, rêzan bihejmêre, stûnan bihejmêre — carkirin bike!", briefing: "Rêzan bihejmêre, stûnan bihejmêre, carkirin bike!", completion: "Keşfa rêzê qediya!", alienEncounter: "Ahtapotê Çarpanya kevirên stêrkan bi rêzên birêkûpêk rêz dike!", strategyTip: "Hejmara rêzan × hejmara stûnan = giştî. 3 rêz, 4 stûn = 12.", wrongInsight: "Rêzan bihejmêre, stûnan bihejmêre — carkirin bike: rêz × stûn = giştî." },
  multiplyVisual: { mission: "Hêza Carkirinê!", story: "Di her qutiyê de heman mîqdar — koman carkirin bike û giştî bibîne!", briefing: "Komên wekhev carkirin bike û giştî bibîne!", completion: "Hêza carkirinê hat barkirin!", alienEncounter: "Berhevkarê Çarpanya qutiyên wekhev tije dike — 'Di her yekê de wekhev e, giştî bibîne!' dibêje.", strategyTip: "Hejmara koman × mîqdara her komê = giştî.", wrongInsight: "Her qutiyê bihejmêre, paşê bi hejmara qutiyan carkirin bike." },
  equalShare: { mission: "Parkirina Galaktîk!", story: "Ji her kes re wekhev belav bike — di her komê de çend heb dibin?", briefing: "Ji her kes re wekhev belav bike — çendan?", completion: "Parkirina dadperwer çêbû!", alienEncounter: "Şefê Zêdekariyê kevirên stêrkan ji her kes re wekhev belav dike — 'Divê dadperwer be!' dibêje.", strategyTip: "Ji her komê re yek bi yek bide, paşê dubare bike — heta ku her kes wekhev bistîne.", wrongInsight: "Giştî ÷ hejmara koman = mîqdara her komê." },
  groupCount: { mission: "Fîloyê Komdar Bike!", story: "Li komên wekhev par bike û bihejmêre çend kom çêbûn!", briefing: "Li komên wekhev par bike — çend kom çêbûn?", completion: "Fîlo hat rêxistinkirin!", alienEncounter: "Fermandarê fîloyê yê Çarpanya gemiyan li koman par dike — 'Çend fîlo çêbûn?' dipirse.", strategyTip: "Bi mîqdara diyar koman çêke û bihejmêre ka çend kom çêbûn.", wrongInsight: "Giştî ÷ hejmara her komê = hejmara koman." },
  numbersInNumbers: { mission: "Galaksiya Hejmaran!", story: "Hemû parçeyên di hundurê hejmarê de keşf bike — 7 = 3+4 = 5+2 = 6+1!", briefing: "Hemû cotên dualî yên hejmarê bibîne!", completion: "Galaksiya hejmaran hat nexşekirin!", alienEncounter: "Keşifgerê galaksiyê di hundurê her hejmarê de cîhanên veşartî dibîne!", strategyTip: "Ji 0+N dest pê bike, heta N+0 hemû cotên zêdekirinê bibîne.", wrongInsight: "Her hejmar dikare li parçeyên cuda were parkirin: 7 = 1+6 = 2+5 = 3+4." },
  patternAB: { mission: "Desena Galaktîk!", story: "Desena dubare bibîne û bidomîne — ya pêş çi ye?", briefing: "Desena dubare bibîne û bidomîne!", completion: "Desen hat çareserkirin!", alienEncounter: "Buqelemûnê Desen bi guheztina rengê desena çêdike!", strategyTip: "Yekîneya herî biçûk a dubare bibîne — bingeha kalîb ev e! Paşê bidomîne.", wrongInsight: "Çend hêmanên yekem bi hev re bihejmêre — kîjan kalîb dubare dibe?" },
  growingPattern: { mission: "Desena Mezinbûyî!", story: "Hejmar mezin dibin an biçûk dibin — rêzê bibîne, ya pêş texmîn bike!", briefing: "Rêzika desena mezinbûyî bibîne, ya pêş texmîn bike!", completion: "Rêzika desena mezinbûyî hat dîtin!", alienEncounter: "Baxçevanê Desen di her rêzê de çiçekên zêdetir deyne — 'Di rêza pêş de çend heb in?' dibêje.", strategyTip: "Ferqa di navbera hejmarên li pey hev de bibîne — bi her gavê çend zêde dibe?", wrongInsight: "Ferqa di navbera her du hejmarên cîran de bihejmêre — eger ferq li her derê yek be, wê li hejmara dawî zêde bike." },
  patternTranslate: { mission: "Wergerê Desenê!", story: "Heman desen, kirasê cuda! Bingehê keşf bike, wergerîne!", briefing: "Heman kalîbê bi hêmanên cuda ji nû ve ava bike!", completion: "Wergera desenê bi serkeftî!", alienEncounter: "Wergêrê Desen heman desenê bi zimanên cuda dibêje — 'Avahî yek e, kirasê cuda ye!' dibêje.", strategyTip: "Li avahiya kalîbê binêre (A-B-A-B wek) — heman avahiyê bi hêmanên cuda ji nû ve ava bike.", wrongInsight: "Avahiya kalîbê girîng e, ne hêmanên wê. Avahiya A-B-A-B bi Sor-Şîn jî bi Gilover-Kare jî dibe." },
  counterFromN: { mission: "Ji Gerîdeyê Bihejmêre!", story: "Bê ku ji 1'ê dest pê bikî ji jimareke çi bibe ber bi pêş-ber bi paş bihejmêre — hostayê jimartina rastîn!", briefing: "Ji hejmara diyar ber bi pêş an paş bihejmêre!", completion: "Sernivîsa hostayê jimartinê hat pejirandin!", alienEncounter: "Navîgatorê Jimaron navenda nexşeyê nîşan dide — 'Ji vir bidomîne!' dibêje.", strategyTip: "Ji hejmara destpêkê bi baldarî bihejmêre — bi her gavê 1 zêde bike an derxe.", wrongInsight: "Jimêrxêzê bifikire — ji hejmara diyar ber bi pêş an paş bihejmêre." },
  ordinalCount: { mission: "Keşfa Rêzê!", story: "1., 2., 3. — bi hejmarên rêzê pozîsyonan bibîne!", briefing: "Çendemîn rêzê de ye? Hejmara rêzê bibîne!", completion: "Hejmarên rêzê hatin fêrkirin!", alienEncounter: "Hakemê pêşbirkê yê Jimaron gerstêrkan rêz dike — 'Ev gerstêrk çendemîn e?' dipirse.", strategyTip: "Ji çepê (an rastê) dest pê bike û bi rêzê bihejmêre — heyberê armanc di çendêmîn rêzê de ye?", wrongInsight: "Bi tiliya xwe nîşan bide û bihejmêre: yekem, duyem, sêyem... heta bigihîjî heyberê armancê." },
  decadeCount: { mission: "Derbasbûna Dehî!", story: "Ji 29'an ber bi 30'an, ji 39'an ber bi 40'an — sînorê dehî derbas bike!", briefing: "Sînorê dehî derbas bike! Piştî 29'an çi tê?", completion: "Derbasbûna dehî bi serkeftî!", alienEncounter: "Nobedarê dehî deriyê vedike — 'Piştî 9'ê bi xêr bê ser dehaneyeke nû!' dibêje.", strategyTip: "Ji jimareke ku bi 9 diqede piştî wê dehaneyeke nû dest pê dike: 29 → 30, 39 → 40.", wrongInsight: "Piştî 9'ê 0 tê û xaneya dehan 1 zêde dibe: 19 → 20, 29 → 30." },
  countOnAdd: { mission: "Ji Mezin Bihejmêre!", story: "Hejmara mezin di hiş de bigire, bi qasî ya biçûk ber bi pêş bihejmêre — zêdekirin hêsantir bû!", briefing: "Ji hejmara mezin li ser bihejmêre û zêde bike!", completion: "Stratejiya li ser jimartinê hat fêrkirin!", alienEncounter: "Pîlotê Zêdekariyê ji hejmara mezin didomîne — 'Her dem ber bi pêş bihejmêre!' dibêje.", strategyTip: "Hejmara mezin bibîne, ji wê dest pê bike û bi qasî hejmara biçûk ber bi pêş bihejmêre.", wrongInsight: "Hejmara mezin di hiş de bigire, bi qasî hejmara biçûk tilî rake û bihejmêre." },
  difference: { mission: "Dûrahiyê Bipîve!", story: "Ferqa di navbera du hejmaran de bibîne — dûrahiyê bipîve!", briefing: "Ferqa di navbera du hejmaran de bibîne!", completion: "Pîvandina ferqê qediya!", alienEncounter: "Endezyarê Terazya dûrahiya di navbera du gerstêrkan de dipîve — 'Ferqa çend e?' dibêje.", strategyTip: "Ji hejmara biçûk heta hejmara mezin ber bi pêş bihejmêre — çend gavan ku tu avêtî ferq ew e.", wrongInsight: "Du hejmaran li kêleka hev rûne — ji mezin biçûk derxe an jî ji biçûk heta mezin bihejmêre." },
  inversePractice: { mission: "Berevajî Bifikire!", story: "3+4=7 wê demê 7-4=3! Zêdekirin û kemkirin berevajiyê hev in!", briefing: "Zêdekirinê dizanî kemkirinê jî çareser bike!", completion: "Girêdana berevajî hat avakirin!", alienEncounter: "Hostayê neynikê yê Zêdekariyê berevajiyê her zêdekirinê nîşan dide — 'Eger yek hebe ya din jî heye!' dibêje.", strategyTip: "Zêdekirin û kemkirin kirariyên berevajî ne: eger zêdekirinekê bizanî du kemkirin jî dizanî.", wrongInsight: "Malbata hejmaran bifikire: 3+4=7, 4+3=7, 7-3=4, 7-4=3." },
  lengthGuess: { mission: "Nebulaya Veşartî!", story: "Li dirêjahiya kapsulê binêre û texmîn bike çend kevirên stêrkan hene!", briefing: "Ji dirêjahiyê hejmara kevirên stêrkan texmîn bike!", completion: "Texmîna dirêjahiyê bi serkeftî!", alienEncounter: "Pisporê pîvandinê yê Terazya kapsulê ji dûr de digire — 'Bê jimartin texmîn bike!' dibêje.", strategyTip: "Bi kapsuleke referansê ya ku dizanî berhev bike — eger dirêjtir be kevirên stêrkan zêdetir hene.", wrongInsight: "Kapsulê referansê bifikire — kapsulê armancê li gorî wê çend dirêj an kurt e?" },
  nlPlacement: { mission: "Li Gerîdeyê Bi Cih Bike!", story: "Hejmarê li jimêrxêzê di cihê rast de bi cih bike!", briefing: "Hejmarê di cihê rast de bi cih bike!", completion: "Bicihkirin bi serkeftî!", alienEncounter: "Nexşevanê Terazya hejmaran li gerîdeyê rêz dike — 'Di cihê rast de bide!' dibêje.", strategyTip: "Li xalên destpêk û dawiyê binêre — texmîn bike hejmar li ku dikeve.", wrongInsight: "Navê bibîne, paşê biryarê bide ka hejmar li çepê navê ye an jî li rastê." },
  numberLine: { mission: "Kapsulê Windabûyî!", story: "Kapsulê veşartî ya li ser jimêrxêzê bibîne — ji pozîsyonê hejmarê texmîn bike!", briefing: "Li ser jimêrxêzê kapsulê veşartî bibîne!", completion: "Kapsulê windabûyî hat dîtin!", alienEncounter: "Detektîfê Terazya li jimêrxêzê şopê dişopîne — 'Kapsulê veşartî li ku ye?' dibêje.", strategyTip: "Li hejmarên nîşankirî binêre û valahiyên navbêrê wekhev par bike.", wrongInsight: "Nîşaneyên li ser jimêrxêzê wekî referans bigire — cihê armanc di navbera kîjan du hejmaran de ye?" },
  numberLineEstimate: { mission: "Pozîsyona Galaktîk!", story: "Li ser jimêrxêzê pozîsyonê texmîn bike — nêzîkî li ku dikeve?", briefing: "Ji pozîsyonê hejmarê texmîn bike!", completion: "Texmîna pozîsyonê bi serkeftî!", alienEncounter: "Navîgatorê Terazya hewl dide li ser nexşeya galaksiyê pozîsyonê diyar bike — 'Ev li ku ye?' dipirse.", strategyTip: "Nirxên destpêk û dawiyê kontrol bike, navê bibîne û texmîna xwe bike.", wrongInsight: "Di navbera 0 û 10'an de navê 5 e — binêre ka hejmar ji 5'an biçûktir e an mezintir." },
  rodSplit: { mission: "Peywira Dualî!", story: "Kapsulê bibire û hemû parçeyan veqetîne — her veqetandin keşfeke nû!", briefing: "Kapsulê bibire, hemû parçeyên wê bibîne!", completion: "Kapsul bi serkeftî hat veqetandin!", alienEncounter: "Cerrahê Pêkhatin kapsulê bi baldarî dike — 'Her parçe biha ye!' dibêje.", strategyTip: "Ji xalên cuda bibire — her birrîn du parçe dide û berhevoka wan her dem yek e.", wrongInsight: "Li ku bibirî, berhevoka du parçeyan her dem wekhevê hejmara orîjînal e." },
  spaceBalance: { mission: "Teraziya Fezayê!", story: "Du aliyan denge bike — têgeha wekheviyê keşf bike!", briefing: "Du aliyên teraziyê denge bike!", completion: "Denge hat sazdan!", alienEncounter: "Nobedarê teraziyê yê Terazya dixwaze du kefeyan wekhev bin — 'Divê denge were avakirin!' dibêje.", strategyTip: "Divê du aliyên nîşaneya wekheviyê heman nirx bin — aliyê kêm temam bike.", wrongInsight: "Aliyê çepê bihejmêre, aliyê rastê bihejmêre — ger wekhev nebin yê kêm bibîne û zêde bike." },
  spaceKitchen: { mission: "Metbexê Fezayê!", story: "Kapsulên enerjiyê bikişîne û hejmara armancê ava bike — ji yek bersivê zêdetir heye!", briefing: "Kapsulên bike yek û hejmara armancê çêke!", completion: "Tarifa fezayê bi serkeftî!", alienEncounter: "Şefê Pêkhatin kapsulên enerjiyê tevlihev dike — 'Tarifa rast bibîne!' dibêje.", strategyTip: "Kombînasyonên kapsulên cuda biceribîne — tu dikarî ji çend rêyan bigihîjî heman armancê.", wrongInsight: "Ji kapsulên biçûk dest pê bike û heta hejmara armancê zêde bike." },
};

// (Eski getModeStory(mode,field,lang) kaldırıldı — aktif getModeStory(id) bu modülün başında tanımlı.)
export const getModeStoryField = (mode, field, lang = "tr") => {
  const s = getModeStory(mode);
  return (s && s[field]) || (MODE_STORIES[mode] ? MODE_STORIES[mode][field] || "" : "");
};

// ═══ KÜRTÇE UZAY OLAYLARI ═══════════════════════════════════════════════
export const SPACE_EVENTS_KU = [
  { id: "meteor_shower", emoji: "☄️", title: "Barîna Meteoran!", desc: "Meteor ronahiyê didin te — pûana bonus!" },
  { id: "friendly_alien", emoji: "👽", title: "Fezayiyê Heval!", desc: "Bi bersiva rast heval be!" },
  { id: "star_fragment", emoji: "💎", title: "Perçeya Stêrkê!", desc: "Li koleksiyona xwe zêde bike!" },
  { id: "wormhole", emoji: "🌀", title: "Qulika Kurmê!", desc: "Rêyeke kurt vebû — pûana surprîz!" },
  { id: "space_whale", emoji: "🐋", title: "Balêna Fezayê!", desc: "Balêna devasa derbas dibe!" },
  { id: "crystal_rain", emoji: "✨", title: "Barîna Krîstalan!", desc: "Her bersiva rast nirxê zêde ye!" },
  { id: "nebula_cloud", emoji: "🌌", title: "Ewra Nebulayê!", desc: "Enerjiya matematîkê bar dibe!" },
  { id: "space_message", emoji: "📡", title: "Peyama Fezayê!", desc: "Ji fezayê silav hat — pûana surprîz!" },
  { id: "cosmic_library", emoji: "📚", title: "Pirtûkxaneya Kozmîk!", desc: "Şehrezayiya matematîkê keşf bike!" },
  { id: "aurora_dance", emoji: "🌈", title: "Dansa Ronahiya Bakur!", desc: "Desenan bişopîne!" },
  { id: "time_crystal", emoji: "🔮", title: "Krîstala Demê!", desc: "Krîstal biriqî — pûana bonus ji te re!" },
  { id: "space_concert", emoji: "🎵", title: "Konsera Fezayê!", desc: "Rîtmên matematîkê lê dixin!" },
  { id: "comet_rider", emoji: "☄️", title: "Stêra Bi Dûv!", desc: "Stêra bi dûv derbas bû — biriqîna wê ji te re bonus hişt!" },
  { id: "galaxy_garden", emoji: "🌺", title: "Baxçeya Galaktîk!", desc: "Sirên hejmaran keşf bike!" },
];

// ═══ KÜRTÇE KAPTAN GÜNLÜĞÜ ════════════════════════════════════════════
export const CAPTAINS_LOG_KU = {
  milestones: {
    firstGame: "Têketina yekem! Em derdikevin keşfa galaksiyê! 🚀",
    firstPerfect: "%100 rastbûn! Peywira bêkêmasî! ⭐",
    tenGames: "10 peywir qediya! Êdî ez ne nûkar im!",
    newPlanet: "Gerstêrka nû! Serpêhatiyeke nû dest pê dike!",
    shipUpgrade: "BILINDKIRINA GEMIYÊ! Em bihêztir in! 🚀",
    streak7: "7 rast li pey hev! Hêza super li lûtkeyê!",
    allBadges: "Hemû nîşan hatin wergirtin! Hosteyê Gav bi Gav!",
    twentyGames: "20 peywir! Nexşeya galaksiyê tije dibe!",
    fiftyGames: "50 peywir! NuméraStêrk dibiriqe!",
    streak10: "10 rast li pey hev! Hêza xebatê! 💪",
    levelMax: "Ast 7 — Hosta! Hejmar êdî heval in!",
    firstArtifact: "Kelûpelê yekem ê fezayê hat keşfkirin! 💎",
  },
};

// ═══ KÜRTÇE UZAY OLAYI DİYALOGLARI ═══════════════════════════════════
export const SPACE_EVENT_DIALOGUES_KU = {
  meteor_shower: {
    greeting: "Hay hay! Barîna meteoran nêzîk dibe!",
    dialogue: "Kelûpelên gemiyê bi enerjiya matematîkê xurt bike! Her bersiva rast kelûpelê bihêztir dike.",
    farewell: "Me barîna meteoran derbas kir! Bi saya kelûpelên te gemî sax û selîm e.",
  },
  friendly_alien: {
    greeting: "Bîp bop! Ez Zixar im, ji Andromedayê tême!",
    dialogue: "Li gerstêrka min hejmar stiran dibêjin! Tu dikarî bi zimanê xwe matematîkê hîn min bikî?",
    farewell: "Spas, kaşif! Niha ez du zimanên galaksiyê dizanim — hejmar û hevaltî!",
  },
  star_fragment: {
    greeting: "Ronahiyek geş nêzîk dibe...",
    dialogue: "Ev perçeyek stêrkê ye! Ji stêrên kevnar ketiye, ev krîstal enerjiya matematîkê hildigire.",
    farewell: "Perçeya stêrkê li koleksiyonê hat zêdekirin. Enerjiya gemiyê bilind bû!",
  },
  space_whale: {
    greeting: "Siyayeke devasa ji ser gemiya we derbas dibe...",
    dialogue: "Balêna fezayê! Ev dewarên nerm di navbera galaksiyan de koç dikin. Rêwîtiya wan bi hezaran salên ronahiyê ye.",
    farewell: "Balêna fezayê rêya xwe domand. Tu vê kêliyê qet ji bîr nakî!",
  },
  cosmic_library: {
    greeting: "Avahiyeke kevnar li radarê xuya dibe...",
    dialogue: "Pirtûkxaneya Kozmîk! Li vir sirên hemû matematîka gerdûnê hatine nivîsandin. Her pirtûk şehrezayiya galaksiyeke cuda hildigire.",
    farewell: "Te ji pirtûkxaneyê zanistên nû hîn bûn. Mejiyê te girêdanên nû ava kirin!",
  },
  galaxy_garden: {
    greeting: "Biriqînek rengîn çavên we dixemilîne...",
    dialogue: "Baxçeya Galaktîk! Li vir çiçekên matematîkê vekirine — her pelê hejmarek e, her çiçek hevkêşanek e.",
    farewell: "Te ji baxçê çiçekek matematîkê çinî. Bêhna wê îlham dide!",
  },
};

// ═══ KÜRTÇE BAĞLAMSAL NOTLAR ════════════════════════════════════════════
export const CONTEXTUAL_LOG_NOTES_KU = {
  fastSolver: "Not: Îro bersiv bi leza birûskê hatin — refleksên te tûjtir dibin!",
  carefulThinker: "Not: Nêrîneke baldar û birameter hat nîşandan. Her bersiv bi hewldanê hat dayîn.",
  improver: "Not: Li gorî performansa duh pêşveçûneke diyar heye — pratîk berê xwe dide!",
  explorer: "Not: Îro modeke nû hat keşfkirin. Meraq, motora herî bihêz a keşfê ye.",
  persistent: "Not: Tevî zehmetiyan hat domandin. Ev biryardarî çavkaniya herî biha ya galaksiyê ye.",
  streakMaster: "Not: Rêzeke bawernekir hat girtin! Asta hişmendiyê li lûtkeyê ye.",
  versatile: "Not: Li ser çend mijarên cuda hat xebitîn. Pirrengî taybetmendiya kaşifên mezin e.",
  morningLearner: "Not: Di saetên zû yên sibehê de hat xebitîn. Lêkolînên zanistî nîşan didin ku fêrbûna sibehê mayîntir e!",
  nightExplorer: "Not: Keşfa şevê berdewam e. Stêrk di tariyê de herî xweş dibiriqin — mîna hêza te ya matematîkê!",
};
