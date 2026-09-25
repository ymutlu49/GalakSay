// Galaksay — Bilimsel Temel (öğretmen/uzman için kanıt sayfası)
// İçerik: scratchpad/research/kanit-temeli.md (25 Eylül 2026 kaynak taraması) — her ilke,
// uygulamadaki karşılığıyla birlikte verilir; sayısal iddialar yalnızca hakemli kaynaklara dayanır.
import React from 'react';
import { colors } from '../design-system/colors.js';
import { typography } from '../design-system/typography.js';
import { Modal } from '../design-system/components/Modal.jsx';

const F = typography.fontFamily.display;

export const EVIDENCE_PRINCIPLES = [
  {
    icon: '🧭',
    title: 'Öğrenme yörüngeleri (Clements & Sarama)',
    app: 'Galaksi haritasındaki 8 gezegen ve 59 görev, sayma → nicelik eşleme → karşılaştırma → parça-bütün → toplama/çıkarma gelişimsel sırasını izler; bir üst düzey, alt düzeyde %60 başarı olmadan açılmaz.',
    evidence: 'Küme-randomize Building Blocks çalışmalarında ES = 1,07 (kontrol) ve 0,47 (karşılaştırma grubu).',
    ref: 'Clements & Sarama, 2008; Clements ve ark., 2011',
  },
  {
    icon: '🧱',
    title: 'Somut → görsel → sembolik (CRA) ipuçları',
    app: 'Her soruda "Nesnelerle Göster" ve kademeli ipucu: önce manipülatif (yıldız taşı, onluk çerçeve, sayı çubuğu), sonra görsel model, en son sembol. Üçlü kod (nicelik – rakam – sayı adı) her seçenekte birlikte gösterilir ve seslendirilir.',
    evidence: 'CRA dizisi ve temsiller IES/WWC 2021 kılavuzunda "güçlü kanıt"; açık öğretim g = 1,22.',
    ref: 'Fuchs ve ark. (IES/WWC), 2021; Gersten ve ark., 2009; Dehaene, 1992',
  },
  {
    icon: '📏',
    title: 'Sayı doğrusu ve büyüklük karşılaştırma',
    app: '"Yörüngeye Yerleştir", "Sayı Doğrusu", "Tahmin" ve "Az–Çok" görevleri; karşılaştırmada sayısal uzaklık çocuğun serisine göre daralır (Weber-uyarlamalı).',
    evidence: 'Sayı doğrusu becerisi genel matematik başarısıyla r = 0,44 ilişkili; doğrusal sayı tahtası oyunları kalıcı kazanım sağlar.',
    ref: 'Schneider ve ark., 2018; Siegler & Ramani, 2009; Wilson ve ark., 2006',
  },
  {
    icon: '💬',
    title: 'Anlık ve hataya özgü geri bildirim',
    app: 'Yanlışta yalnız "yanlış" denmez: doğru cevap, kısa bir strateji açıklaması ("Büyükten say…", "Önce 10 yap…") ve hata tipi sınıflandırması (birim sayma, işlem karışıklığı, büyüklük algısı…) kaydedilir; ceza ve olumsuz ses yoktur.',
    evidence: 'Bilgisayar ortamında açıklayıcı geri bildirim ES = 0,49; yalnız doğru/yanlış bildirimi 0,05.',
    ref: 'Van der Kleij ve ark., 2015; Wisniewski ve ark., 2020',
  },
  {
    icon: '🎚️',
    title: 'Uyarlanabilir zorluk ve akıcılık',
    app: 'Beş zorluk düzeyi, mikro-adaptasyon (çeldirici yakınlığı, sayı aralığı) ve yalnızca öğrenilmiş becerilerde açılan kısa süreli Akıcılık Modu; hız baskısı okul öncesinde kapalıdır.',
    evidence: 'Kısa zamanlı akıcılık etkinlikleri IES/WWC 2021 Öneri 6; uyarlanabilir sistemler ES = 0,34.',
    ref: 'Fuchs ve ark., 2013; Alam ve ark., 2025',
  },
  {
    icon: '🫶',
    title: 'Kaygıya duyarlı tasarım ve oturum dozu',
    app: 'Hayal kırıklığı algılama (ardışık hata, yanıt süresi) → çeldirici eleme ve rehber desteği; oturum süresi sınırı ve mola hatırlatıcısı; önerilen doz haftada 3–5 kez 15–20 dakika.',
    evidence: 'Diskalkulide yüksek matematik kaygısı 2 kat yaygın; Calcularis RKÇ: ≥42 oturum × 20 dk ile aritmetikte g = 0,49, 3 ay kalıcı.',
    ref: 'Devine ve ark., 2018; Kohn ve ark., 2020',
  },
  {
    icon: '📈',
    title: 'Öğretmen için veri temelli izleme',
    app: 'Oturum bazlı doğruluk, yanıt süresi, ipucu kullanımı, hata profili ve yörünge düzeyi; PDF/CSV raporu; MEB 2024 1. sınıf öğrenme çıktılarıyla (MAT.1.1.x – MAT.1.2.x) eşleme.',
    evidence: 'Erken sayı becerileri için 1 dakikalık müfredata dayalı ölçümler güvenilir (r = ,78–,93) ve yordayıcıdır.',
    ref: 'Clarke & Shinn, 2004; MEB, 2024',
  },
];

export const EVIDENCE_FACTS = [
  { big: '%3–7', text: 'Gelişimsel diskalkulinin okul çağı yaygınlığı (2.421 çocukluk örneklemde %5,7).', ref: 'Morsanyi ve ark., 2018' },
  { big: 'd = 0,83', text: 'Matematik güçlüğü müdahalelerinin ortalama etkisi; bilgisayarla verilen müdahale yüz yüze kadar etkili.', ref: 'Chodura ve ark., 2015' },
  { big: 'ES = 0,55', text: '15 randomize çalışma, 1.073 çocuk: dijital müdahalelerin etkisi — belirleyici olan oyun değil, öğretim tasarımı.', ref: 'Benavides-Varela ve ark., 2020' },
  { big: '42 × 20 dk', text: 'Kalıcı kazanım için raporlanan doz eşiği (≈14 saat, ≤13 hafta).', ref: 'Kohn ve ark., 2020' },
];

export const EVIDENCE_REFERENCES = [
  'Benavides-Varela, S., Zandonella Callegher, C., Fagiolini, B., Leo, I., Altoè, G., & Lucangeli, D. (2020). Effectiveness of digital-based interventions for children with mathematical learning difficulties: A meta-analysis. Computers & Education, 157, 103953.',
  'Chodura, S., Kuhn, J.-T., & Holling, H. (2015). Interventions for children with mathematical difficulties: A meta-analysis. Zeitschrift für Psychologie, 223(2), 129–144.',
  'Clarke, B., & Shinn, M. R. (2004). A preliminary investigation into the identification and development of early mathematics curriculum-based measurement. School Psychology Review, 33(2), 234–248.',
  'Clements, D. H., & Sarama, J. (2008). Experimental evaluation of the effects of a research-based preschool mathematics curriculum. American Educational Research Journal, 45(2), 443–494.',
  'Dehaene, S. (1992). Varieties of numerical abilities. Cognition, 44(1–2), 1–42.',
  'Devine, A., Hill, F., Carey, E., & Szűcs, D. (2018). Cognitive and emotional math problems largely dissociate. Journal of Educational Psychology, 110(3), 431–444.',
  'Fuchs, L. S., ve ark. (2021). Assisting students struggling with mathematics: Intervention in the elementary grades (WWC 2021006). IES/NCEE.',
  'Gersten, R., Chard, D. J., Jayanthi, M., Baker, S. K., Morphy, P., & Flojo, J. (2009). Mathematics instruction for students with learning disabilities: A meta-analysis. Review of Educational Research, 79(3), 1202–1242.',
  'Kohn, J., Rauscher, L., Kucian, K., Käser, T., Wyschkon, A., Esser, G., & von Aster, M. (2020). Efficacy of a computer-based learning program in children with developmental dyscalculia. Frontiers in Psychology, 11, 1115.',
  'MEB (2024). İlkokul Matematik Dersi Öğretim Programı (1–4. sınıflar) — Türkiye Yüzyılı Maarif Modeli.',
  'Morsanyi, K., van Bers, B. M. C. W., McCormack, T., & McGourty, J. (2018). The prevalence of specific learning disorder in mathematics and comorbidity with other developmental disorders in primary school-age children. British Journal of Psychology, 109(4), 917–940.',
  'Olkun, S., Altun, A., Göçer Şahin, S., & Akkurt Denizli, Z. (2015). Deficits in basic number competencies may cause low numeracy in primary school children. Eğitim ve Bilim, 40(177), 141–159.',
  'Schneider, M., Merz, S., Stricker, J., De Smedt, B., Torbeyns, J., Verschaffel, L., & Luwel, K. (2018). Associations of number line estimation with mathematical competence: A meta-analysis. Child Development, 89(5), 1467–1484.',
  'Siegler, R. S., & Ramani, G. B. (2009). Playing linear number board games—but not circular ones—improves low-income preschoolers’ numerical understanding. Journal of Educational Psychology, 101(3), 545–560.',
  'Van der Kleij, F. M., Feskens, R. C. W., & Eggen, T. J. H. M. (2015). Effects of feedback in a computer-based learning environment on students’ learning outcomes: A meta-analysis. Review of Educational Research, 85(4), 475–511.',
  'Wilson, A. J., Dehaene, S., Pinel, P., Revkin, S. K., Cohen, L., & Cohen, D. (2006). Principles underlying the design of "The Number Race", an adaptive computer game for remediation of dyscalculia. Behavioral and Brain Functions, 2, 19.',
];

const h3 = { fontSize: 15, fontWeight: 800, color: colors.text.primary, fontFamily: F, margin: '18px 0 8px' };
const p = { fontSize: 13.5, lineHeight: 1.6, color: colors.text.secondary, fontFamily: F, margin: '0 0 8px' };

export function EvidenceBaseContent() {
  return (
    <div style={{ fontFamily: F }}>
      <p style={p}>
        Galaksay bir oyun değil, oyun görünümlü bir <strong style={{ color: colors.text.primary }}>öğretim programıdır</strong>.
        Tasarımı, matematik öğrenme güçlüğü olan çocuklar için meta-analizlerde ve uygulama kılavuzlarında
        etkili bulunan bileşenleri uygulama düzeyinde doğrulanabilir biçimde içerir. Aşağıda her ilke,
        uygulamadaki karşılığı ve temel kaynağıyla verilmiştir.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 8, margin: '12px 0 6px' }}>
        {EVIDENCE_FACTS.map((f) => (
          <div key={f.big} style={{ padding: '10px 12px', borderRadius: 12, background: 'rgba(108,99,255,.10)', border: '1px solid rgba(108,99,255,.25)' }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: colors.accent.primaryLight, fontFamily: F }}>{f.big}</div>
            <div style={{ fontSize: 12, lineHeight: 1.45, color: colors.text.secondary, marginTop: 4 }}>{f.text}</div>
            <div style={{ fontSize: 11, color: colors.text.tertiary, marginTop: 4 }}>{f.ref}</div>
          </div>
        ))}
      </div>

      <h3 style={h3}>Tasarım ilkeleri ve uygulamadaki karşılıkları</h3>
      <div style={{ display: 'grid', gap: 8 }}>
        {EVIDENCE_PRINCIPLES.map((it) => (
          <article key={it.title} style={{ padding: '12px 14px', borderRadius: 12, background: 'rgba(30,27,75,.55)', border: `1px solid ${colors.surface.divider}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 20 }} aria-hidden="true">{it.icon}</span>
              <h4 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: colors.text.primary, fontFamily: F }}>{it.title}</h4>
            </div>
            <p style={{ ...p, margin: '0 0 6px' }}><strong style={{ color: colors.text.primary }}>Galaksay'da:</strong> {it.app}</p>
            <p style={{ ...p, margin: 0, fontSize: 12.5 }}><strong style={{ color: colors.text.primary }}>Kanıt:</strong> {it.evidence} <span style={{ color: colors.text.tertiary }}>({it.ref})</span></p>
          </article>
        ))}
      </div>

      <h3 style={h3}>Önerilen kullanım dozu</h3>
      <p style={p}>
        Haftada 3–5 oturum, oturum başına 15–20 dakika; araştırmalarda anlamlı ve kalıcı kazanım için yaklaşık
        42 oturum (≈14 saat) eşiği raporlanmıştır. Uygulama, oturum süresini yaş grubuna göre sınırlar ve
        mola önerir; öğretmen panosu toplam oturum sayısını ve haftalık uyumu gösterir.
      </p>

      <h3 style={h3}>Neyi iddia etmiyoruz</h3>
      <p style={p}>
        Galaksay tanı koymaz; tarama ve ilerleme verisi uzman değerlendirmesinin yerine geçmez. "Hafıza eğitimi"
        ya da "diskalkuliye özel yazı tipi" gibi kanıtı zayıf iddialar taşımaz; erişilebilirlikte WCAG ölçütleri
        esas alınır.
      </p>

      <h3 style={h3}>Kaynaklar</h3>
      <ol style={{ paddingLeft: 18, margin: 0 }}>
        {EVIDENCE_REFERENCES.map((r) => (
          <li key={r} style={{ fontSize: 12, lineHeight: 1.5, color: colors.text.tertiary, marginBottom: 4 }}>{r}</li>
        ))}
      </ol>
    </div>
  );
}

export function EvidenceBaseModal({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title="Bilimsel temel" maxWidth={640}>
      <div style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: 4 }}>
        <EvidenceBaseContent />
      </div>
    </Modal>
  );
}

export default EvidenceBaseModal;
