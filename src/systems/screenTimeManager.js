// ═══════════════════════════════════════════════════════════════════════════
// EKRAN SÜRESİ YÖNETİCİSİ
// Uzman Konsensüsü: 3/6 uzman — özellikle 5-6 yaş için kritik
// AAP (2016): 5-8 yaş dijital medya 30-60 dk/gün önerisi
// ═══════════════════════════════════════════════════════════════════════════
export const ScreenTimeManager = {
  // Yaş grubuna göre önerilen maksimum süre (dakika)
  maxMinutes: { okuloncesi: 20, sinif1: 25, sinif2: 30 },

  // Mola hatırlatma aralığı (dakika)
  breakInterval: 15,

  // Mola mesajları — Montessori felsefesi: fiziksel aktivite entegrasyonu
  breakMessages: [
    { msg: "🏃 Mola zamanı! Ayağa kalk ve 10 kez zıpla!", activity: "physical" },
    { msg: "👀 Gözlerini dinlendir! Pencereden dışarı bak ve 3 farklı renk say!", activity: "visual" },
    { msg: "🖐️ Gerçek nesnelerle pratik yap! Masadaki kalem/boncukları say!", activity: "manipulative" },
    { msg: "🧘 Derin nefes al! 4 saniye iç, 4 saniye tut, 4 saniye ver!", activity: "calming" },
    { msg: "💪 Ellerini sık-aç yap! 5 kez sağ, 5 kez sol — motor becerileri güçlendir!", activity: "motor" },
    { msg: "🎵 Bir şarkı söyle veya 10'a kadar ritmik say: 2, 4, 6, 8, 10!", activity: "auditory" },
  ],

  // Fiziksel manipülatif yönlendirme mesajları (Montessori/Reggio entegrasyonu)
  physicalPracticeHints: [
    "💡 İpucu: Evdeki düğmeler, boncuklar veya lego parçalarıyla aynı oyunu gerçek nesnelerle dene!",
    "💡 İpucu: Merdivenleri çıkarken sayarak pratik yap — her basamak bir yıldız taşı!",
    "💡 İpucu: Sofra hazırlarken kaşık ve çatalları sayarak eşle!",
    "💡 İpucu: Parkta taşları toplayıp ikili ve üçlü gruplar oluştur!",
  ],

  getBreakMessage: () => {
    const msgs = ScreenTimeManager.breakMessages;
    return msgs[Math.floor(Math.random() * msgs.length)];
  },

  getPhysicalHint: () => {
    const hints = ScreenTimeManager.physicalPracticeHints;
    return hints[Math.floor(Math.random() * hints.length)];
  },

  // Günlük kullanım bilgilendirmesi
  getDailySummary: (minutesUsed, ageGroup) => {
    const max = ScreenTimeManager.maxMinutes[ageGroup] || 25;
    const pct = Math.round((minutesUsed / max) * 100);
    if (pct >= 100) return { status: "limit", color: "#ef4444", msg: `Bugünkü ${max} dakikalık hedefine ulaştın! Yarın devam ederiz 🌙`, icon: "⏰" };
    if (pct >= 75) return { status: "warning", color: "#f59e0b", msg: `${max - minutesUsed} dakika kaldı — son bir oyun oynayabilirsin!`, icon: "⏳" };
    return { status: "ok", color: "#22c55e", msg: `Bugün ${minutesUsed} dakika kullandın (önerilen: ${max} dk)`, icon: "✅" };
  },
};
