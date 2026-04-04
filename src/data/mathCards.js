// ═══ KOLEKSİYON KARTI SİSTEMİ ═════════════════════════════════════════════
// Rapor §6.2: Oyun sonrası matematik kartı, değişken ödül mekanizması
// v5.5: Genişletilmiş kart koleksiyonu — 36 kart, uzay temalı özel kartlar eklendi
export const MATH_CARDS = [
  // ═══ SAYILAR KATEGORİSİ ═══
  { id: "pi", emoji: "🥧", name: "Pi Sayısı", fact: "π ≈ 3.14159... Hiçbir zaman bitmez!", rarity: "rare", category: "sayılar" },
  { id: "zero", emoji: "0️⃣", name: "Sıfırın Gücü", fact: "Sıfır ne pozitif ne negatiftir. Özel bir sayı!", rarity: "common", category: "sayılar" },
  { id: "dozen", emoji: "📦", name: "Düzine", fact: "12'li gruba düzine denir. 1 düzine yumurta = 12!", rarity: "common", category: "sayılar" },
  { id: "prime", emoji: "⭐", name: "Asal Sayı", fact: "Sadece 1'e ve kendisine bölünebilen sayılar: 2, 3, 5, 7...", rarity: "epic", category: "sayılar" },
  { id: "binary", emoji: "💻", name: "İkili Sistem", fact: "Bilgisayarlar sadece 0 ve 1 kullanır!", rarity: "legendary", category: "sayılar" },
  { id: "negative", emoji: "❄️", name: "Negatif Sayılar", fact: "Sıfırın altında sayılar var — termometre gibi!", rarity: "rare", category: "sayılar" },
  { id: "seven", emoji: "🎰", name: "Yedinin Gücü", fact: "7 günlük hafta, 7 renk gökkuşağı, 7 nota — her yerde 7!", rarity: "common", category: "sayılar" },
  { id: "palindrome", emoji: "🔄", name: "Palindrom Sayılar", fact: "121, 343, 12321 — soldan da sağdan da aynı okunan sayılar!", rarity: "rare", category: "sayılar" },
  { id: "googol", emoji: "🔢", name: "Googol", fact: "1'in arkasına 100 sıfır koyarsan googol olur — evrendeki atomlardan fazla!", rarity: "legendary", category: "sayılar" },

  // ═══ DİZİLER KATEGORİSİ ═══
  { id: "fibonacci", emoji: "🌻", name: "Fibonacci Dizisi", fact: "1, 1, 2, 3, 5, 8, 13... Doğada da var!", rarity: "epic", category: "diziler" },

  // ═══ GEOMETRİ KATEGORİSİ ═══
  { id: "triangle", emoji: "📐", name: "Üçgen", fact: "Bir üçgenin açılarının toplamı her zaman 180°", rarity: "common", category: "geometri" },
  { id: "pythagoras", emoji: "📏", name: "Pisagor", fact: "a² + b² = c² — Dik üçgenin sihirli formülü!", rarity: "epic", category: "geometri" },
  { id: "symmetry", emoji: "🦋", name: "Simetri", fact: "Kelebekler doğanın en güzel simetri örnekleri!", rarity: "rare", category: "geometri" },
  { id: "cube", emoji: "🎲", name: "Küp", fact: "Zarın 6 yüzü var — karşılıklı yüzler hep 7 eder!", rarity: "rare", category: "geometri" },
  { id: "tessellation", emoji: "🐝", name: "Tesselasyon", fact: "Arı petekleri altıgen — boşluk bırakmadan döşenir!", rarity: "epic", category: "geometri" },
  { id: "compass", emoji: "🧭", name: "Pusula Geometrisi", fact: "360° bir tam daire — Babilliler böyle karar verdi!", rarity: "rare", category: "geometri" },
  { id: "mobius", emoji: "♾️", name: "Möbius Şeridi", fact: "Tek yüzü olan bir şekil — kağıttan yapabilirsin!", rarity: "epic", category: "geometri" },

  // ═══ KAVRAMLAR KATEGORİSİ ═══
  { id: "infinity", emoji: "♾️", name: "Sonsuz", fact: "Sayılar hiç bitmez — her sayıdan sonra bir tane daha var!", rarity: "legendary", category: "kavramlar" },
  { id: "percent", emoji: "💯", name: "Yüzde", fact: "Yüzde demek 'yüzde bir' yani 100'de kaç demek!", rarity: "common", category: "kavramlar" },
  { id: "golden", emoji: "🌀", name: "Altın Oran", fact: "φ ≈ 1.618... Doğanın en güzel oranı!", rarity: "legendary", category: "kavramlar" },
  { id: "fraction", emoji: "🍕", name: "Kesirler", fact: "Pizzayı bölünce kesir yaparsın: 1/2, 1/4, 1/8...", rarity: "common", category: "kavramlar" },
  { id: "euler", emoji: "🌐", name: "Euler Sayısı", fact: "e ≈ 2.71828... Doğanın büyüme sayısı!", rarity: "epic", category: "kavramlar" },
  { id: "magic_square", emoji: "🔮", name: "Sihirli Kare", fact: "Her satır, sütun ve çaprazın toplamı aynı olan kareler!", rarity: "rare", category: "kavramlar" },

  // ═══ TARİH KATEGORİSİ ═══
  { id: "abacus", emoji: "🧮", name: "Abaküs", fact: "İnsanlar 5000 yıldır abaküs ile hesap yapıyor!", rarity: "rare", category: "tarih" },
  { id: "clock", emoji: "🕐", name: "Saat Matematiği", fact: "Saat 12 tabanlı bir sayı sistemi kullanır", rarity: "common", category: "günlük" },

  // ═══ UZAY ÖZEL KARTLARI — Yeni v5.5 ═══
  { id: "light_year", emoji: "💡", name: "Işık Yılı", fact: "Işık 1 yılda 9.46 trilyon km yol alır — galaksiler bu birimle ölçülür!", rarity: "epic", category: "uzay" },
  { id: "planets_count", emoji: "🪐", name: "8 Gezegen", fact: "Güneş sisteminde 8 gezegen var — eskiden 9'du ama Plüton cüce gezegen oldu!", rarity: "common", category: "uzay" },
  { id: "star_count", emoji: "🌟", name: "Yıldız Sayısı", fact: "Samanyolu'nda yaklaşık 100-400 milyar yıldız var — sayamazsın!", rarity: "rare", category: "uzay" },
  { id: "moon_phases", emoji: "🌙", name: "Ay Evreleri", fact: "Ay 29.5 günde bir tam döngü tamamlar — her gece biraz farklı görünür!", rarity: "common", category: "uzay" },
  { id: "black_hole", emoji: "🕳️", name: "Kara Delik", fact: "Kara delikler o kadar güçlü ki ışık bile kaçamaz!", rarity: "legendary", category: "uzay" },
  { id: "rocket_speed", emoji: "🚀", name: "Roket Hızı", fact: "Dünya yörüngesine çıkmak için saatte 28.000 km hız gerekir!", rarity: "rare", category: "uzay" },
  { id: "galaxy_spiral", emoji: "🌌", name: "Spiral Galaksi", fact: "Samanyolu bir spiral galaksi — kolları matematik spirallerinden oluşur!", rarity: "epic", category: "uzay" },
  { id: "astronaut_math", emoji: "🧑‍🚀", name: "Astronot Matematiği", fact: "Astronotlar yörünge hesapları için sürekli matematik kullanır!", rarity: "rare", category: "uzay" },
  { id: "constellation", emoji: "⭐", name: "Takımyıldızları", fact: "Gökyüzünde 88 takımyıldız var — hepsinin geometrik şekilleri var!", rarity: "common", category: "uzay" },
  { id: "gravity", emoji: "🍎", name: "Yerçekimi", fact: "Newton bir elma düşünce yerçekimini buldu — F = G × m1 × m2 / r²!", rarity: "epic", category: "uzay" },

  // ═══ EK KARTLAR — v5.6 Koleksiyon Genişletmesi ═══
  // Sayılar
  { id: "perfect_number", emoji: "💎", name: "Mükemmel Sayı", fact: "6'nın bölenleri 1, 2, 3. Toplamları 6 eder — buna 'mükemmel sayı' denir!", rarity: "epic", category: "sayılar" },
  { id: "square_numbers", emoji: "🔲", name: "Kare Sayılar", fact: "1, 4, 9, 16, 25... Kare sayılar, bir sayının kendisiyle çarpımıdır!", rarity: "rare", category: "sayılar" },
  { id: "roman_numerals", emoji: "🏛️", name: "Roma Rakamları", fact: "Romalılar I, V, X, L, C, D, M harfleriyle sayı yazardı — IV = 4!", rarity: "common", category: "sayılar" },
  { id: "triangle_numbers", emoji: "🔺", name: "Üçgen Sayılar", fact: "1, 3, 6, 10, 15... Her sırada bir fazla eklenir — bowling pinleri gibi!", rarity: "rare", category: "sayılar" },

  // Diziler
  { id: "pascal_triangle", emoji: "📐", name: "Pascal Üçgeni", fact: "Her sayı üstündeki iki sayının toplamı — içinde Fibonacci de gizli!", rarity: "epic", category: "diziler" },
  { id: "powers_of_two", emoji: "✌️", name: "2'nin Kuvvetleri", fact: "1, 2, 4, 8, 16, 32, 64... Her adımda iki katına çıkar — bilgisayarların dili!", rarity: "rare", category: "diziler" },

  // Geometri
  { id: "hexagon", emoji: "⬡", name: "Altıgen", fact: "Altıgen doğanın favori şekli — arı petekleri, kar taneleri, bazalt sütunları!", rarity: "common", category: "geometri" },
  { id: "sphere", emoji: "🌐", name: "Küre", fact: "Küre, aynı hacmi en az yüzeyle kaplayan şekil — sabun köpükleri hep küre!", rarity: "rare", category: "geometri" },
  { id: "fractal", emoji: "🥦", name: "Fraktal", fact: "Brokoli, kar tanesi ve sahil şeritleri fraktaldır — yakınlaştırdıkça aynı desen tekrarlar!", rarity: "legendary", category: "geometri" },

  // Kavramlar
  { id: "even_odd", emoji: "🎭", name: "Çift ve Tek", fact: "Çift sayılar 2'ye tam bölünür, tek sayılar bölünemez — 0 çifttir!", rarity: "common", category: "kavramlar" },
  { id: "commutative", emoji: "🔄", name: "Değişme Özelliği", fact: "3+5 = 5+3 ve 3×5 = 5×3 — yer değiştir, sonuç değişmez!", rarity: "rare", category: "kavramlar" },
  { id: "estimation", emoji: "🎯", name: "Tahmin Gücü", fact: "Yaklaşık hesaplama günlük hayatın en çok kullanılan matematik becerisi!", rarity: "common", category: "kavramlar" },

  // Tarih
  { id: "mayan_math", emoji: "🗿", name: "Maya Matematiği", fact: "Mayalar 20 tabanlı sayı sistemi kullandı ve sıfırı Hintlerden önce icat etti!", rarity: "epic", category: "tarih" },
  { id: "al_khwarizmi", emoji: "📖", name: "Harezmi", fact: "Cebir kelimesi Harezmi'nin 'el-Cebir' kitabından gelir — matematiğin babası!", rarity: "rare", category: "tarih" },

  // Uzay
  { id: "mars_math", emoji: "🔴", name: "Mars Yolculuğu", fact: "Mars'a gitmek 7 ay sürer — rotayı hesaplamak için karmaşık matematik gerekir!", rarity: "rare", category: "uzay" },
  { id: "sun_distance", emoji: "☀️", name: "Güneş Uzaklığı", fact: "Güneş 150 milyon km uzakta — ışığı bize 8 dakika 20 saniyede ulaşır!", rarity: "common", category: "uzay" },
  { id: "iss_speed", emoji: "🛰️", name: "Uzay İstasyonu", fact: "ISS saatte 27.600 km hızla gider — 90 dakikada Dünya'nın turunu atar!", rarity: "epic", category: "uzay" },
];

export const RARITY_COLORS = { common: "#94a3b8", rare: "#60a5fa", epic: "#8b5cf6", legendary: "#f59e0b" };
export const RARITY_LABELS = { common: "Yaygın", rare: "Nadir", epic: "Epik", legendary: "Efsanevi" };
export const RARITY_GLOW = { common: "none", rare: "0 0 12px rgba(59,130,246,.3)", epic: "0 0 16px rgba(139,92,246,.4)", legendary: "0 0 24px rgba(245,158,11,.5), 0 0 48px rgba(245,158,11,.2)" };

export const getRandomCard = (ownedIds) => {
  // Ağırlıklı rastgele: common %50, rare %30, epic %15, legendary %5
  const weights = { common: 50, rare: 30, epic: 15, legendary: 5 };
  const pool = MATH_CARDS.filter(c => !ownedIds.includes(c.id));
  if (pool.length === 0) return MATH_CARDS[Math.floor(Math.random() * MATH_CARDS.length)]; // duplicate ok
  const weighted = pool.flatMap(c => Array(weights[c.rarity] || 10).fill(c));
  return weighted[Math.floor(Math.random() * weighted.length)];
};

// Koleksiyon tamamlama yüzdesi
export const getCollectionProgress = (ownedIds) => {
  const total = MATH_CARDS.length;
  const unique = new Set(ownedIds).size;
  return { owned: unique, total, percent: Math.round((unique / total) * 100) };
};

// Kategori bazlı koleksiyon
export const getCollectionByCategory = (ownedIds) => {
  const cats = {};
  MATH_CARDS.forEach(card => {
    if (!cats[card.category]) cats[card.category] = { total: 0, owned: 0, cards: [] };
    cats[card.category].total++;
    cats[card.category].cards.push({ ...card, isOwned: ownedIds.includes(card.id) });
    if (ownedIds.includes(card.id)) cats[card.category].owned++;
  });
  return cats;
};
