# Canlı sürüm kopyası (galaksay.com)

Bu klasör, galaksay.com'da yayında olan **masaüstü (Jimaro) v5.10.0** derlemesinin birebir
kopyasıdır. Kaynak kodu bu depoda olmadığı için canlı hatalar bu kopya üzerinde düzeltilir ve
buradan yayımlanır. Masaüstü kaynağı depoya geldiğinde bu klasör kaldırılır.

- Kaynak: Cloudflare Pages dağıtımı `104bd678` (25 Eyl 2026 15:04), `crawl.py` ile eksiksiz indirildi.
- `_headers`: canlı yanıtlardaki güvenlik başlıklarından birebir yeniden kuruldu.
- Yayın: GitHub → Actions → "Canlı kopyayı yayınla" → hedef `onizleme` (önizleme) ya da `main` (galaksay.com).

## Kopya üzerindeki düzeltmeler

| Tarih | Dosya | Değişiklik |
|---|---|---|
| 27 Eyl 2026 | `site/oyna/index.html` | `.space-btn-hover` için `position: relative`, `::after` için `pointer-events: none`. Basma efekti katmanı tüm ekranı kaplayıp "Öğrenci Girişi" ve öğrenci kartı tıklamalarını yutuyordu; "Devam et" çalışmıyordu. |
| 27 Eyl 2026 | `site/sw.js` | Sürüm etiketi `galaksay-v5.10.1-20260927-tiklama`: tarayıcılar yeni sürümü hemen alır. |
