#!/usr/bin/env python3
"""Canlı derlemede (GalakSay-hIWssnXL.js) öğrenme yörüngesi düzeltmeleri — 27 Eylül 2026.

Gerekçeler docs/YORUNGE_DENETIMI.md dosyasındadır. Her değişiklik birebir metin eşleşmesiyle,
tam bir kez uygulanır; eşleşme yoksa betik durur (yanlış yere yazmaz). Yalnız veri: yörünge
etiketleri (öğretmen/rapor gösterimi) ve yaş grubu yolculuk duraklarının görev listeleri.
"""
import glob, sys

ROOT = sys.argv[1] if len(sys.argv) > 1 else 'canli-surum/site/oyna/assets'
path = glob.glob(f'{ROOT}/GalakSay-*.js')[0]
s = open(path, encoding='utf-8').read()

R = []  # (eski, yeni)

# ── 1. Sanbil: Clements–Sarama'da "Kavramsal Sanbil (7'ye kadar)" basamağı yok;
#       kanonik basamaklar: Algısal (4) → Algısal (5) → Kavramsal (5) → Kavramsal (10) → Kavramsal (20)
R.append(('level:"Algısal Sanbil (4’e kadar) → Kavramsal Sanbil (7’ye kadar)",ltLevel:[5,8]',
          'level:"Algısal Sanbil (4’e kadar) → Kavramsal Sanbil (10’a kadar)",ltLevel:[5,8]'))
R.append(('level:"Kavramsal Sanbil (7’ye kadar)",ltLevel:8,ageRange:"5-6",desc:"10\'luk çerçevede kavramsal sanbil"',
          'level:"Kavramsal Sanbil (10’a kadar)",ltLevel:8,ageRange:"5-6",desc:"10\'luk çerçevede kavramsal sanbil (5+n yapısı)"'))
for k in ('chipGuess', 'rodBack'):
    R.append((f'{k}:{{trajectory:"Saymadan Anlık Bilme (Sanbil)",code:"Y01",level:"Kavramsal Sanbil (7’ye kadar) → Kavramsal Sanbil (10’a kadar)"',
              f'{k}:{{trajectory:"Saymadan Anlık Bilme (Sanbil)",code:"Y01",level:"Kavramsal Sanbil (5’e kadar) → Kavramsal Sanbil (10’a kadar)"'))

# ── 2. Tahmin: yapılandırılmamış koleksiyonu tahmin etmek sanbil değil, karşılaştırma-sıralama-tahmin yörüngesidir
R.append(('estimateCount:{trajectory:"Saymadan Anlık Bilme (Sanbil)",code:"Y01",level:"Kavramsal Sanbil (10’a kadar) → Kavramsal Sanbil (20’ye kadar)",ltLevel:[9,10]',
          'estimateCount:{trajectory:"Karşılaştırma, Sıralama ve Tahmin",code:"Y03",level:"Kapladığı Yere Bakıp Tahmin Eden → Referans Kümeyle Tahmin Eden (5/10)",ltLevel:[17,22]'))

# ── 3. Önce/sonra: "bir sayının hemen öncesi-sonrası" Sayma yörüngesindeki "İstenen Sayıdan Sayan (N+1, N−1)" basamağıdır
R.append(('beforeAfter:{trajectory:"Karşılaştırma ve Sıralama",code:"Y03",level:"Sayarak Karşılaştıran (Eş Boy Nesneler) → Zihinsel Sayı Doğrusu (10’a kadar)",ltLevel:[8,15]',
          'beforeAfter:{trajectory:"Sayma",code:"Y02",level:"10’a Kadar Sayan → İstenen Sayıdan Sayan (öncesi/sonrası: N+1, N−1)",ltLevel:[8,10]'))

# ── 4. Onluk geçişi (29→30): "100’e Kadar Sayan" basamağı; "Ritim Tutarak Üzerine Sayan" farklı bir beceridir
R.append(('decadeCount:{trajectory:"Sayma",code:"Y02",level:"Ritim Tutarak Üzerine Sayan",ltLevel:13',
          'decadeCount:{trajectory:"Sayma",code:"Y02",level:"100’e Kadar Sayan (onluk geçişleri)",ltLevel:12'))

# ── 5. Sayı içinde sayılar / çubuk ayırma: Sayı Birleştirme yörüngesinin "Sayı Kuran" basamakları
R.append(('numbersInNumbers:{trajectory:"Sayı Birleştirme (Parça-Bütün)",code:"Y05",level:"Bildiklerinden Türeten (parça-bütün)",ltLevel:8',
          'numbersInNumbers:{trajectory:"Sayı Birleştirme (Parça-Bütün)",code:"Y05",level:"Sayı Kuran (5’e kadar) → Sayı Kuran (10’a kadar): tüm ayrışımlar",ltLevel:[4,6]'))
R.append(('rodSplit:{trajectory:"Sayı Birleştirme (Parça-Bütün)",code:"Y05",level:"Bildiklerinden Türeten (parça-bütün)",ltLevel:8',
          'rodSplit:{trajectory:"Sayı Birleştirme (Parça-Bütün)",code:"Y05",level:"Sayı Kuran (7’ye kadar) → Sayı Kuran (10’a kadar): sistematik ayrışım",ltLevel:[5,6]'))

# ── 6. Çarpma-bölme: ölçme bölmesi (kaç grup?) ve tekrarlı toplama somut modelleme / ritmik sayma basamaklarıdır
R.append(('groupCount:{trajectory:"Çarpma ve Bölme",code:"Y06",level:"Kişi Artarsa Payın Azalacağını Bilen",ltLevel:5',
          'groupCount:{trajectory:"Çarpma ve Bölme",code:"Y06",level:"Somut Modelleyen (×/÷) → Ritmik Sayarak Çözen (×/÷): ölçme bölmesi",ltLevel:[4,6]'))
R.append(('repeatAdd:{trajectory:"Çarpma ve Bölme",code:"Y06",level:"Teker Teker Dağıtmaya Başlayan → Somut Modelleyen (×/÷)",ltLevel:[2,4]',
          'repeatAdd:{trajectory:"Çarpma ve Bölme",code:"Y06",level:"Somut Modelleyen (×/÷) → Ritmik Sayarak Çözen (×/÷)",ltLevel:[4,6]'))
R.append(('fractionPart:{trajectory:"Çarpma ve Bölme",code:"Y06",level:"Eşit Paylaştıran → Birim Kesri Adlandıran"',
          'fractionPart:{trajectory:"Çarpma ve Bölme",code:"Y06",level:"Eşit Paylaştıran → Birim Kesri Adlandıran (eşit paylaştırma yörüngesiyle birlikte)"'))

# ── 7. Kod çakışması: Y08 hem Ölçme hem Örüntü için kullanılıyordu; Ölçme → Y07. wpSchema Toplama-Çıkarma → Y04
R.append(('rulerRead:{trajectory:"Ölçme (Uzunluk)",code:"Y08"', 'rulerRead:{trajectory:"Ölçme (Uzunluk)",code:"Y07"'))
R.append(('lengthCompare:{trajectory:"Ölçme (Uzunluk)",code:"Y08"', 'lengthCompare:{trajectory:"Ölçme (Uzunluk)",code:"Y07"'))
R.append(('calendarRead:{trajectory:"Ölçme (Zaman)",code:"Y08"', 'calendarRead:{trajectory:"Ölçme (Zaman)",code:"Y07"'))
R.append(('wpSchema:{trajectory:"Toplama ve Çıkarma",code:"Y05"', 'wpSchema:{trajectory:"Toplama ve Çıkarma",code:"Y04"'))

# ── 8. Eksik kayıtlar: clockRead ve coinCount
miss_old = 'missingNumber:{trajectory:"Örüntü, Yapı ve Cebirsel Düşünme",code:"Y08",level:"İlişkisel Düşünen (+/−)",ltLevel:8,ageRange:"6-7",desc:"Denklemde bilinmeyeni ilişkisel düşünerek bulur"}'
R.append((miss_old, miss_old
          + ',clockRead:{trajectory:"Ölçme (Zaman)",code:"Y07",level:"Tam ve Yarım Saati Okuyan",ltLevel:[2,4],ageRange:"6-8",desc:"Analog saatte tam ve yarım saatleri okur (MEB zaman ölçme; Clements–Sarama yörüngelerinin dışında)"}'
          + ',coinCount:{trajectory:"Sayma",code:"Y02",level:"Ritmik Sayan (5’er, 10’ar) → Nicel Birimleri Sayan (para değerleri)",ltLevel:[14,16],ageRange:"6-8",desc:"Paraları değerlerine göre sayar ve toplar (MEB paralarımız)"}'))

# ── 9. Yolculuk sıralaması
# 1. sınıf: "Üzerine sayarak toplama" (countOnAdd), "İstenen Sayıdan Sayan"ı (counterFromN) ön koşul alır;
#    counterFromN 10. durakta, countOnAdd 5. durakta idi → 5. durağa counterFromN eklenir (10. durakta da kalır).
R.append(('modes:["addChips","countOnAdd","addition","coinCount"]',
          'modes:["addChips","counterFromN","countOnAdd","addition","coinCount"]'))
# Okul öncesi: yolda hiç örüntü görevi yoktu (AB örüntüleri 3-5 yaş); 4. durağa (Yörünge Komşuları) eklenir.
R.append(('modes:["ordering","beforeAfter","counterFromN","ordinalCount"]',
          'modes:["ordering","beforeAfter","counterFromN","ordinalCount","patternAB","patternTranslate"]'))

errors = 0
for old, new in R:
    n = s.count(old)
    if n != 1:
        print(f'EŞLEŞME {n} (1 beklenirdi): {old[:90]}')
        errors += 1
        continue
    s = s.replace(old, new, 1)
if errors:
    sys.exit(f'{errors} düzeltme uygulanamadı; dosya değiştirilmedi.')
open(path, 'w', encoding='utf-8').write(s)
print(f'{len(R)} düzeltme uygulandı → {path}')
