# -*- coding: utf-8 -*-
"""
Galaksay PWA ikon üreticisi.

Marka amblemini (üçlü kod modeli — 3 bağlı daire: mavi/3-nokta=somut,
mor/"üç"=sözel, yeşil/"3"=sembolik) uzay gradyanı zemin üzerine çizer ve
PWA için gereken tüm ikon boyutlarını site/icons/ altına üretir.

Kaynak amblem geometrisi src/components/branding/GalaksayLogo.jsx'ten alınmıştır
(viewBox 0..100 normalize edilerek).

Çalıştır:  python scripts/gen-icons.py
Gerekli  :  Pillow  (kurulu: PIL 12.x)
"""
import os
import sys
from PIL import Image, ImageDraw, ImageFilter, ImageFont

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "..", "site", "icons")
os.makedirs(OUT, exist_ok=True)

SS = 4  # supersampling — keskin kenarlar için 4x render edip küçült

# ── Marka renkleri (colors.js / GalaksayLogo.jsx) ───────────────────────────
BG_TOP = (11, 14, 45)      # #0B0E2D
BG_BOT = (30, 36, 112)     # #1E2470
NEBULA = (124, 58, 237)    # #7c3aed mor parıltı

CIRC = {
    "dot":  {"base": (84, 87, 232),  "hi": (129, 140, 248)},  # indigo  #5457e8 / #818cf8
    "word": {"base": (109, 40, 217), "hi": (167, 139, 250)},  # mor     #6d28d9 / #a78bfa
    "num":  {"base": (14, 163, 114), "hi": (52, 211, 153)},   # yeşil   #0ea372 / #34d399
}

# Normalize amblem koordinatları (SVG /100)
C1 = (0.28, 0.26)   # somut (noktalar)
C2 = (0.72, 0.26)   # sözel ("üç")
C3 = (0.50, 0.74)   # sembolik ("3")
R = 0.20
DOTS = [(0.21, 0.25), (0.28, 0.25), (0.35, 0.25)]
DOT_R = 0.032


def lerp(a, b, t):
    return tuple(int(round(a[i] + (b[i] - a[i]) * t)) for i in range(3))


def gradient_bg(size):
    grad = Image.new("RGB", (1, size))
    for y in range(size):
        grad.putpixel((0, y), lerp(BG_TOP, BG_BOT, y / (size - 1)))
    return grad.resize((size, size))


def load_font(px):
    """Kalın bir TTF bul (Nunito → Segoe UI Bold → Arial Bold → default)."""
    candidates = [
        os.path.join(HERE, "..", "node_modules", "@fontsource", "nunito", "files", "nunito-latin-800-normal.woff2"),
        r"C:\Windows\Fonts\segoeuib.ttf",
        r"C:\Windows\Fonts\arialbd.ttf",
        r"C:\Windows\Fonts\Arial.ttf",
    ]
    for p in candidates:
        try:
            return ImageFont.truetype(p, px)
        except Exception:
            continue
    return ImageFont.load_default()


def draw_text_centered(draw, cx, cy, text, font, fill):
    bbox = draw.textbbox((0, 0), text, font=font)
    w = bbox[2] - bbox[0]
    h = bbox[3] - bbox[1]
    draw.text((cx - w / 2 - bbox[0], cy - h / 2 - bbox[1]), text, font=font, fill=fill)


def draw_circle(layer, cx, cy, r, base, hi):
    d = ImageDraw.Draw(layer)
    # yumuşak gölge
    sh = Image.new("RGBA", layer.size, (0, 0, 0, 0))
    ds = ImageDraw.Draw(sh)
    ds.ellipse([cx - r, cy - r + r * 0.10, cx + r, cy + r + r * 0.10], fill=(0, 0, 0, 90))
    sh = sh.filter(ImageFilter.GaussianBlur(r * 0.12))
    layer.alpha_composite(sh)
    # taban daire
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=base + (255,))
    # üst parıltı (highlight) — sol-üst
    hl = Image.new("RGBA", layer.size, (0, 0, 0, 0))
    dh = ImageDraw.Draw(hl)
    hr = r * 0.92
    dh.ellipse([cx - hr, cy - hr * 1.15, cx + hr, cy + hr * 0.55], fill=hi + (150,))
    hl = hl.filter(ImageFilter.GaussianBlur(r * 0.18))
    # parıltıyı daire içine kırp
    mask = Image.new("L", layer.size, 0)
    dm = ImageDraw.Draw(mask)
    dm.ellipse([cx - r, cy - r, cx + r, cy + r], fill=255)
    layer.paste(hl, (0, 0), Image.composite(hl.split()[3], Image.new("L", layer.size, 0), mask))
    # alt koyu ton (hacim)
    sd = Image.new("RGBA", layer.size, (0, 0, 0, 0))
    dd = ImageDraw.Draw(sd)
    dd.ellipse([cx - r, cy + r * 0.05, cx + r, cy + r], fill=(0, 0, 0, 70))
    sd = sd.filter(ImageFilter.GaussianBlur(r * 0.15))
    layer.paste(sd, (0, 0), Image.composite(sd.split()[3], Image.new("L", layer.size, 0), mask))


def draw_emblem(img, frac):
    size = img.size[0]
    box = frac * size
    ox = (size - box) / 2
    oy = (size - box) / 2

    def P(n):
        return (ox + n[0] * box, oy + n[1] * box)

    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)

    # bağlantı çizgileri (üçgen) — dairelerin arkasında
    line_w = max(2, int(box * 0.012))
    for a, b in [(C1, C2), (C1, C3), (C2, C3)]:
        d.line([P(a), P(b)], fill=(165, 180, 200, 120), width=line_w)

    r = R * box
    c1, c2, c3 = P(C1), P(C2), P(C3)
    draw_circle(layer, c1[0], c1[1], r, **CIRC["dot"])
    draw_circle(layer, c2[0], c2[1], r, **CIRC["word"])
    draw_circle(layer, c3[0], c3[1], r, **CIRC["num"])

    dd = ImageDraw.Draw(layer)
    # somut daire — 3 beyaz nokta
    for dn in DOTS:
        p = P(dn)
        dr = DOT_R * box
        dd.ellipse([p[0] - dr, p[1] - dr, p[0] + dr, p[1] + dr], fill=(255, 255, 255, 235))
    # sözel daire — "üç"
    f_word = load_font(int(r * 0.78))
    draw_text_centered(dd, c2[0], c2[1], "üç", f_word, (255, 255, 255, 255))
    # sembolik daire — "3"
    f_num = load_font(int(r * 1.25))
    draw_text_centered(dd, c3[0], c3[1], "3", f_num, (255, 255, 255, 255))

    img.alpha_composite(layer)


def add_nebula_and_stars(img):
    size = img.size[0]
    # nebula parıltısı (sağ-üst mor, sol-alt pembe)
    neb = Image.new("RGBA", img.size, (0, 0, 0, 0))
    dn = ImageDraw.Draw(neb)
    dn.ellipse([size * 0.55, -size * 0.15, size * 1.15, size * 0.45], fill=NEBULA + (60,))
    dn.ellipse([-size * 0.15, size * 0.6, size * 0.4, size * 1.1], fill=(236, 72, 153, 45))
    neb = neb.filter(ImageFilter.GaussianBlur(size * 0.12))
    img.alpha_composite(neb)
    # yıldızlar (deterministik)
    st = ImageDraw.Draw(img)
    for i in range(60):
        x = ((i * 37 + 13) % 100) / 100 * size
        y = ((i * 61 + 7) % 100) / 100 * size
        rr = (((i * 17) % 3) + 1) * size / 380
        a = int((0.25 + ((i * 29) % 50) / 100) * 255)
        col = (167, 139, 250, a) if i % 7 == 0 else (255, 255, 255, a)
        st.ellipse([x - rr, y - rr, x + rr, y + rr], fill=col)


def make_icon(final, emblem_frac, fname, rounded=False):
    size = final * SS
    base = gradient_bg(size).convert("RGBA")
    add_nebula_and_stars(base)
    draw_emblem(base, emblem_frac)
    out = base.resize((final, final), Image.LANCZOS)
    if rounded:
        # köşeleri yuvarla (apple-touch hariç "any" ikonlar için opsiyonel)
        radius = int(final * 0.22)
        mask = Image.new("L", (final, final), 0)
        ImageDraw.Draw(mask).rounded_rectangle([0, 0, final, final], radius=radius, fill=255)
        out.putalpha(mask)
    path = os.path.join(OUT, fname)
    out.save(path)
    print(f"  [OK] {fname}  ({final}x{final})")
    return out


def main():
    print("Galaksay ikonları üretiliyor → site/icons/")
    # PWA "any" ikonlar — köşeler kare (platform kendi maskeler)
    make_icon(192, 0.80, "icon-192.png")
    make_icon(512, 0.80, "icon-512.png")
    # maskable — içerik %80 güvenli bölge içinde, tam taşma zemin
    make_icon(512, 0.60, "icon-maskable-512.png")
    # apple-touch — iOS yuvarlar, tam taşma zemin + biraz iç boşluk
    make_icon(180, 0.74, "apple-touch-icon.png")
    # favicon
    make_icon(32, 0.92, "favicon-32.png")
    fav = make_icon(64, 0.92, "favicon-64.png")
    try:
        fav.save(os.path.join(OUT, "favicon.ico"), sizes=[(16, 16), (32, 32), (48, 48)])
        print("  [OK] favicon.ico")
    except Exception as e:
        print(f"  [warn] favicon.ico atlandı: {e}")
    print("Bitti.")


if __name__ == "__main__":
    main()
