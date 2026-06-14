// Galaksay PDF raporları — ORTAK marka katmanı (tek kaynak).
// Palet + ASCII-güvenli dosya adı + Roboto yükleme + jsPDF ile çizilen ÜÇLÜ-KOD logosu.
// Bireysel (PDFReportGenerator) ve Sınıf (ClassReportGenerator) raporları bunu kullanır.

// ── Profesyonel renk paleti (açık tema) ──
export const P = {
  ink:    [30, 41, 59],    // ana metin   #1E293B
  sub:    [71, 85, 105],   // ikincil     #475569
  faint:  [148, 163, 184], // üçüncül     #94A3B8
  brand:  [67, 56, 202],   // marka       #4338CA (indigo)
  brandD: [49, 46, 129],   // koyu marka  #312E81 (kapak bandı)
  brandL: [238, 242, 255], // açık marka  #EEF2FF
  green:  [22, 163, 74],   // güçlü       #16A34A
  greenL: [240, 253, 244],
  amber:  [217, 119, 6],   // gelişim     #D97706
  amberL: [255, 247, 237],
  red:    [220, 38, 38],   // risk        #DC2626
  redL:   [254, 242, 242],
  cyan:   [8, 145, 178],   // öneri       #0891B2
  cyanL:  [236, 254, 255],
  line:   [226, 232, 240],
  cardBg: [248, 250, 252],
  white:  [255, 255, 255],
};

// Yalnız DOSYA ADI için ASCII (içerik gerçek Türkçe kalır).
export function asciiSafe(text) {
  return (text || '').replace(/ğ/g, 'g').replace(/Ğ/g, 'G').replace(/ü/g, 'u').replace(/Ü/g, 'U')
    .replace(/ş/g, 's').replace(/Ş/g, 'S').replace(/ı/g, 'i').replace(/İ/g, 'I')
    .replace(/ö/g, 'o').replace(/Ö/g, 'O').replace(/ç/g, 'c').replace(/Ç/g, 'C');
}

// Roboto base64'leri LAZY yükle (≈440KB — yalnız PDF üretilirken iner).
export async function loadRobotoFonts() {
  const m = await import('./pdfFonts.js');
  return { regular: m.ROBOTO_REGULAR_B64, bold: m.ROBOTO_BOLD_B64 };
}

// Fontları belgeye uygula (gerçek Türkçe karakterler).
export function applyRoboto(doc, fonts) {
  if (!fonts) return;
  doc.addFileToVFS('Roboto-Regular.ttf', fonts.regular);
  doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
  doc.addFileToVFS('Roboto-Bold.ttf', fonts.bold);
  doc.addFont('Roboto-Bold.ttf', 'Roboto', 'bold');
  doc.setFont('Roboto', 'normal');
}

// ── Üçlü-kod logo işareti (vektör, jsPDF primitive'leriyle) ──
// Uygulama logosuyla aynı geometri (100'lük kutu): somut ●●● (indigo), sözel "üç"
// (mor), sembolik "3" (yeşil), üçgen bağlantı. (cx,cy)=merkez, size=kutu yüksekliği mm.
// onDark: koyu zeminde bağlantı çizgileri daha açık.
export function drawGalaksayMark(doc, cx, cy, size = 24, { onDark = false } = {}) {
  const f = size / 100;
  const X = (v) => cx + (v - 50) * f;
  const Y = (v) => cy + (v - 50) * f;
  const PT_PER_UNIT = 2.8346 * f; // SVG birimi → mm → pt

  // Bağlantı üçgeni
  const lc = onDark ? [165, 180, 200] : [148, 163, 184];
  doc.setDrawColor(lc[0], lc[1], lc[2]);
  doc.setLineWidth(2 * f);
  doc.line(X(28), Y(26), X(72), Y(26));
  doc.line(X(28), Y(26), X(50), Y(74));
  doc.line(X(72), Y(26), X(50), Y(74));

  // Somut — indigo + üç beyaz nokta
  doc.setFillColor(79, 70, 229); // #4F46E5
  doc.circle(X(28), Y(26), 20 * f, 'F');
  doc.setFillColor(255, 255, 255);
  doc.circle(X(21), Y(25), 3 * f, 'F');
  doc.circle(X(28), Y(25), 3 * f, 'F');
  doc.circle(X(35), Y(25), 3 * f, 'F');

  // Sözel — mor + "üç"
  doc.setFillColor(109, 40, 217); // #6D28D9
  doc.circle(X(72), Y(26), 20 * f, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('Roboto', 'bold');
  doc.setFontSize(12 * PT_PER_UNIT);
  doc.text('üç', X(72), Y(31), { align: 'center' });

  // Sembolik — yeşil + "3"
  doc.setFillColor(5, 150, 105); // #059669
  doc.circle(X(50), Y(74), 20 * f, 'F');
  doc.setFontSize(24 * PT_PER_UNIT);
  doc.text('3', X(50), Y(82), { align: 'center' });
  doc.setFont('Roboto', 'normal');
}
