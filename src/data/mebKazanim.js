// ═══ MEB KAZANIM EŞLEMESİ (§9.1) ══════════════════════════════════════════
// Türkiye Yüzyılı Maarif Modeli — 2024 Okul Öncesi Eğitim Programı &
// İlkokul Matematik Dersi Öğretim Programı öğrenme çıktıları ile mod eşlemesi
export const MEB_KAZANIM = {
  // ─── Okul Öncesi (60-72 ay) — Matematik Alan Becerileri ─────────────────
  quantityMatch:  { kod: "MAB.1.b",  kazanim: "1 ile 20 arasında nesne/varlık sayısını söyler", sinif: "Okul Öncesi (60-72 ay)", alan: "Sayma" },
  subitizing:     { kod: "MAB.1.c",  kazanim: "1 ile 5 arasında nesnelerin/varlıkların miktarını bir bakışta söyler", sinif: "Okul Öncesi (60-72 ay)", alan: "Sayma" },
  conservation:   { kod: "MAB.2.b",  kazanim: "Bir bütünü oluşturan parçalar arasındaki ilişki/ilişkisizlik durumlarını açıklar", sinif: "Okul Öncesi (60-72 ay)", alan: "Matematiksel Muhakeme" },
  matching:       { kod: "MAB.9.a",  kazanim: "Matematiksel bağlama uygun temsil kullanır", sinif: "Okul Öncesi (60-72 ay)", alan: "Matematiksel Temsil" },

  // ─── 1. Sınıf — Sayılar ve Nicelikler ──────────────────────────────────
  counting:       { kod: "MAT.1.1.1", kazanim: "Rakamları ve 20'ye kadar olan sayıları, niceliklerin büyüklüklerini temsil etmek için kullanabilme", sinif: "1. Sınıf", alan: "Sayılar ve Nicelikler" },
  fivesFrame:     { kod: "MAT.1.1.2", kazanim: "Bir nesne grubunu sayarken parçalar arasındaki ilişkileri çözümleyebilme", sinif: "1. Sınıf", alan: "Sayılar ve Nicelikler" },
  buildNumber:    { kod: "MAT.1.1.2", kazanim: "Bir nesne grubunu sayarken parçalar arasındaki ilişkileri çözümleyebilme", sinif: "1. Sınıf", alan: "Sayılar ve Nicelikler" },
  tensFrame:      { kod: "MAT.1.1.2", kazanim: "Bir nesne grubunu sayarken parçalar arasındaki ilişkileri çözümleyebilme", sinif: "1. Sınıf", alan: "Sayılar ve Nicelikler" },
  doubleTensFrame:{ kod: "MAT.1.1.7", kazanim: "Verilen bir çokluktaki ilişkilerden yararlanarak 20'ye kadar olan nesnelerin sayısını tahmin edebilme — 10+n stratejisi", sinif: "1. Sınıf", alan: "Sayılar ve Nicelikler" },
  beforeAfter:    { kod: "MAT.1.1.1", kazanim: "Rakamları ve 20'ye kadar olan sayıları, niceliklerin büyüklüklerini temsil etmek için kullanabilme", sinif: "1. Sınıf", alan: "Sayılar ve Nicelikler" },
  fiveMore:       { kod: "MAT.1.1.1", kazanim: "Rakamları ve 20'ye kadar olan sayıları, niceliklerin büyüklüklerini temsil etmek için kullanabilme", sinif: "1. Sınıf", alan: "Sayılar ve Nicelikler" },
  comparison:     { kod: "MAT.1.1.4", kazanim: "İki niceliğin büyüklüğünü 'çok', 'daha çok', 'az', 'daha az' veya 'eşit' terimleriyle karşılaştırabilme", sinif: "1. Sınıf", alan: "Sayılar ve Nicelikler" },
  lessMoreEqual:  { kod: "MAT.1.1.4", kazanim: "İki niceliğin büyüklüğünü 'çok', 'daha çok', 'az', 'daha az' veya 'eşit' terimleriyle karşılaştırabilme", sinif: "1. Sınıf", alan: "Sayılar ve Nicelikler" },
  backwardCount:  { kod: "MAT.1.1.5", kazanim: "100'e kadar ileriye ve 20'den geriye doğru ritmik sayabilme", sinif: "1. Sınıf", alan: "Sayılar ve Nicelikler" },
  ordinalCount:   { kod: "MAT.1.1.3", kazanim: "Sayıların sıra belirtme özelliğini kavrayabilme", sinif: "1. Sınıf", alan: "Sayılar ve Nicelikler" },
  decadeCount:    { kod: "MAT.1.1.5", kazanim: "100'e kadar ileriye ve 20'den geriye doğru ritmik sayabilme; onluk geçişlerini doğru yapabilme", sinif: "1. Sınıf", alan: "Sayılar ve Nicelikler" },
  chipGuess:      { kod: "MAT.1.1.7", kazanim: "Verilen bir çokluktaki ilişkilerden yararlanarak 20'ye kadar olan nesnelerin sayısını tahmin edebilme", sinif: "1. Sınıf", alan: "Sayılar ve Nicelikler" },
  rodBack:        { kod: "MAT.1.1.7", kazanim: "Verilen bir çokluktaki ilişkilerden yararlanarak 20'ye kadar olan nesnelerin sayısını tahmin edebilme", sinif: "1. Sınıf", alan: "Sayılar ve Nicelikler" },
  lengthGuess:    { kod: "MAT.1.1.7", kazanim: "Verilen bir çokluktaki ilişkilerden yararlanarak 20'ye kadar olan nesnelerin sayısını tahmin edebilme", sinif: "1. Sınıf", alan: "Sayılar ve Nicelikler" },
  numberLine:     { kod: "MAT.1.1.6", kazanim: "Artan veya azalan sayı ve şekil örüntülerini çözümleyebilme", sinif: "1. Sınıf", alan: "Sayılar ve Nicelikler" },

  // ─── 1. Sınıf — İşlemlerden Cebirsel Düşünmeye ─────────────────────────
  addChips:       { kod: "MAT.1.2.1", kazanim: "Günlük yaşamın içerdiği toplama ve çıkarma işlemlerini çözümleyebilme", sinif: "1. Sınıf", alan: "İşlemlerden Cebirsel Düşünmeye" },
  removeChips:    { kod: "MAT.1.2.1", kazanim: "Günlük yaşamın içerdiği toplama ve çıkarma işlemlerini çözümleyebilme", sinif: "1. Sınıf", alan: "İşlemlerden Cebirsel Düşünmeye" },
  countOnAdd:     { kod: "MAT.1.2.2", kazanim: "Toplama ve çıkarma işlemlerinin sonuçlarını tahminde bulunarak ve zihinden işlem yaparak muhakeme edebilme; büyük sayıdan üzerine sayma stratejisi", sinif: "1. Sınıf", alan: "İşlemlerden Cebirsel Düşünmeye" },
  inversePractice:{ kod: "MAT.1.2.4", kazanim: "Toplama ve çıkarma işlemlerinin ilişkisini yorumlayabilme; ters işlem ilişkisi", sinif: "1. Sınıf", alan: "İşlemlerden Cebirsel Düşünmeye" },
  makeFive:       { kod: "MAT.1.2.2", kazanim: "Toplama ve çıkarma işlemlerinin sonuçlarını tahminde bulunarak ve zihinden işlem yaparak muhakeme edebilme", sinif: "1. Sınıf", alan: "İşlemlerden Cebirsel Düşünmeye" },
  makeTen:        { kod: "MAT.1.2.2", kazanim: "Toplama ve çıkarma işlemlerinin sonuçlarını tahminde bulunarak ve zihinden işlem yaparak muhakeme edebilme", sinif: "1. Sınıf", alan: "İşlemlerden Cebirsel Düşünmeye" },
  addition:       { kod: "MAT.1.2.2", kazanim: "Toplama ve çıkarma işlemlerinin sonuçlarını tahminde bulunarak ve zihinden işlem yaparak muhakeme edebilme", sinif: "1. Sınıf", alan: "İşlemlerden Cebirsel Düşünmeye" },
  subtraction:    { kod: "MAT.1.2.2", kazanim: "Toplama ve çıkarma işlemlerinin sonuçlarını tahminde bulunarak ve zihinden işlem yaparak muhakeme edebilme", sinif: "1. Sınıf", alan: "İşlemlerden Cebirsel Düşünmeye" },
  partWhole:      { kod: "MAT.1.2.3", kazanim: "Eşit işaretinin anlamını toplama ve çıkarma işlemi bağlamında yorumlayabilme", sinif: "1. Sınıf", alan: "İşlemlerden Cebirsel Düşünmeye" },
  missingNumber:  { kod: "MAT.1.2.3", kazanim: "Eşit işaretinin anlamını toplama ve çıkarma işlemi bağlamında yorumlayabilme", sinif: "1. Sınıf", alan: "İşlemlerden Cebirsel Düşünmeye" },
  trueFalse:      { kod: "MAT.1.2.3", kazanim: "Eşit işaretinin anlamını toplama ve çıkarma işlemi bağlamında yorumlayabilme", sinif: "1. Sınıf", alan: "İşlemlerden Cebirsel Düşünmeye" },
  wpAdd:          { kod: "MAT.1.2.1", kazanim: "Toplama ve çıkarma işlemleri gerektiren günlük yaşam problemlerini çözebilme", sinif: "1. Sınıf", alan: "İşlemlerden Cebirsel Düşünmeye" },
  wpSub:          { kod: "MAT.1.2.1", kazanim: "Toplama ve çıkarma işlemleri gerektiren günlük yaşam problemlerini çözebilme", sinif: "1. Sınıf", alan: "İşlemlerden Cebirsel Düşünmeye" },
  wpCompare:      { kod: "MAT.1.2.4", kazanim: "Toplama ve çıkarma işlemlerinin ilişkisini yorumlayabilme", sinif: "1. Sınıf", alan: "İşlemlerden Cebirsel Düşünmeye" },
  wpMul:          { kod: "MAT.2.2.4", kazanim: "Çarpma işlemini gerektiren günlük yaşam problemlerini çözebilme", sinif: "2. Sınıf", alan: "İşlemlerden Cebirsel Düşünmeye" },
  wpDiv:          { kod: "MAT.2.2.4", kazanim: "Bölme işlemini gerektiren günlük yaşam problemlerini çözebilme", sinif: "2. Sınıf", alan: "İşlemlerden Cebirsel Düşünmeye" },
  difference:     { kod: "MAT.1.2.4", kazanim: "Toplama ve çıkarma işlemlerinin ilişkisini yorumlayabilme", sinif: "1. Sınıf", alan: "İşlemlerden Cebirsel Düşünmeye" },

  // ─── 2. Sınıf — Sayılar ve Nicelikler ──────────────────────────────────
  composeNumber:  { kod: "MAT.2.1.1", kazanim: "100'e kadar olan niceliklerin büyüklüklerini temsil etmede sayıların sembolik temsillerinden yararlanabilme", sinif: "2. Sınıf", alan: "Sayılar ve Nicelikler" },
  bundleTens:     { kod: "MAT.2.1.2", kazanim: "İki basamaklı sayıları çözümleyebilme", sinif: "2. Sınıf", alan: "Sayılar ve Nicelikler" },
  placeValue:     { kod: "MAT.2.1.2", kazanim: "İki basamaklı sayıları çözümleyebilme", sinif: "2. Sınıf", alan: "Sayılar ve Nicelikler" },
  expandForm:     { kod: "MAT.2.1.2", kazanim: "İki basamaklı sayıları çözümleyebilme", sinif: "2. Sınıf", alan: "Sayılar ve Nicelikler" },
  ordering:       { kod: "MAT.2.1.3", kazanim: "Sayıların sırasını belirleyebilme", sinif: "2. Sınıf", alan: "Sayılar ve Nicelikler" },
  numberLineEstimate: { kod: "MAT.2.1.3", kazanim: "Sayıların sırasını belirleyebilme", sinif: "2. Sınıf", alan: "Sayılar ve Nicelikler" },
  nlPlacement: { kod: "MAT.2.1.3", kazanim: "Sayı doğrusunda sayıların konumlarını belirleyebilme", sinif: "2. Sınıf", alan: "Sayılar ve Nicelikler" },
  skipCount:      { kod: "MAT.2.1.4", kazanim: "İleriye ve geriye doğru ritmik sayabilme", sinif: "2. Sınıf", alan: "Sayılar ve Nicelikler" },
  estimateCount:  { kod: "MAT.2.1.6", kazanim: "Bir çokluktaki ilişkilerden yararlanarak 50'ye kadar olan nesnelerin sayısını tahmin edebilme", sinif: "2. Sınıf", alan: "Sayılar ve Nicelikler" },

  // ─── 2. Sınıf — İşlemlerden Cebirsel Düşünmeye ─────────────────────────
  repeatAdd:      { kod: "MAT.2.2.4", kazanim: "Çarpma ve bölme işlemlerini toplama ve çıkarma işlemlerine dayalı olarak çözümleyebilme", sinif: "2. Sınıf", alan: "İşlemlerden Cebirsel Düşünmeye" },
  arrayDots:      { kod: "MAT.2.2.4", kazanim: "Çarpma ve bölme işlemlerini toplama ve çıkarma işlemlerine dayalı olarak çözümleyebilme", sinif: "2. Sınıf", alan: "İşlemlerden Cebirsel Düşünmeye" },
  multiplyVisual: { kod: "MAT.2.2.4", kazanim: "Çarpma ve bölme işlemlerini toplama ve çıkarma işlemlerine dayalı olarak çözümleyebilme", sinif: "2. Sınıf", alan: "İşlemlerden Cebirsel Düşünmeye" },
  equalShare:     { kod: "MAT.2.2.4", kazanim: "Çarpma ve bölme işlemlerini toplama ve çıkarma işlemlerine dayalı olarak çözümleyebilme", sinif: "2. Sınıf", alan: "İşlemlerden Cebirsel Düşünmeye" },
  groupCount:     { kod: "MAT.2.2.4", kazanim: "Çarpma ve bölme işlemlerini toplama ve çıkarma işlemlerine dayalı olarak çözümleyebilme", sinif: "2. Sınıf", alan: "İşlemlerden Cebirsel Düşünmeye" },
  divisionBasic:  { kod: "MAT.2.2.5", kazanim: "Çarpma ve bölme işlemlerinin sonuçlarını muhakeme edebilme (n÷1, n÷n, çarpmayı düşün)", sinif: "2. Sınıf", alan: "İşlemlerden Cebirsel Düşünmeye" },
  mulDivInverse:  { kod: "MAT.2.2.5", kazanim: "Çarpma ve bölme işlemlerinin ilişkisini yorumlayabilme (ters ilişki)", sinif: "2. Sınıf", alan: "İşlemlerden Cebirsel Düşünmeye" },
  katConcept:     { kod: "MAT.3.2.3", kazanim: "Çarpma işleminin kat kavramı ile ilişkisini fark edebilme", sinif: "3. Sınıf", alan: "İşlemlerden Cebirsel Düşünmeye" },
  timesTable:     { kod: "MAT.2.2.5", kazanim: "Çarpma ve bölme işlemlerinin sonuçlarını muhakeme edebilme", sinif: "2. Sınıf", alan: "İşlemlerden Cebirsel Düşünmeye" },
  halfDouble:     { kod: "MAT.2.2.5", kazanim: "Çarpma ve bölme işlemlerinin sonuçlarını muhakeme edebilme", sinif: "2. Sınıf", alan: "İşlemlerden Cebirsel Düşünmeye" },

  // ─── v5.2 Yeni Modlar ─────────────────────────────────────────────────
  numbersInNumbers: { kod: "MAT.1.2.2", kazanim: "Toplama ve çıkarma işlemlerinin sonuçlarını tahminde bulunarak ve zihinden işlem yaparak muhakeme edebilme", sinif: "1. Sınıf", alan: "İşlemlerden Cebirsel Düşünmeye" },
  patternAB:     { kod: "MAT.1.1.6 / MAT.2.1.5", kazanim: "Artan veya azalan sayı ve şekil örüntülerini çözümleyebilme; tekrar eden desen, 4-elemanlı çekirdek (L5+)", sinif: "1-2. Sınıf", alan: "Sayılar ve Nicelikler" },
  growingPattern:{ kod: "MAT.2.1.5 / MAT.3.1.7 / MAT.4.1.5", kazanim: "Sayı ve şekil örüntülerine dayalı çıkarım yapabilme; kuralı genelleyebilme (artan/azalan, değişken adım)", sinif: "2-4. Sınıf", alan: "Sayılar ve Nicelikler" },
  patternTranslate:{ kod: "MAT.2.1.5", kazanim: "Sayı ve sayı temsiline dönüşen şekil örüntülerine dayalı çıkarım yapabilme (çeviri/çekirdek)", sinif: "2. Sınıf", alan: "Sayılar ve Nicelikler" },
  counterFromN:  { kod: "MAT.1.1.5", kazanim: "100'e kadar ileriye ve 20'den geriye doğru ritmik sayabilme", sinif: "1. Sınıf", alan: "Sayılar ve Nicelikler" },
};
