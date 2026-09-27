#!/usr/bin/env python3
"""GalakSay akademik veri paketinden madde ve ölçme analizi.

Girdi: Uygulamanın "Akademik veri paketi" dışa aktarımı (galaksay-akademik-veri-*.zip) ya da
bu paketin açılmış klasörü. Birden çok paket (farklı cihaz/okul) birlikte verilebilir.
Yalnız Python standart kütüphanesi kullanılır; kurulum gerektirmez.

    python3 arastirma/madde_analizi.py paket1.zip paket2.zip --cikti sonuc/

Üretilenler (--cikti klasöründe):
    RAPOR.md              okunur özet ve uyarılar
    hucre_gucluk.csv      görev × seviye: n, doğru oranı (p), %95 Wilson GA, medyan tepki süresi,
                          ipucu oranı, en sık yanılgı, uyarı
    rasch_madde.csv       görev × seviye "madde aileleri" için keşfedici Rasch güçlüğü (logit),
                          standart hata, infit/outfit ortalama kare
    on_son_test.csv       Yıldız Haritası Kontrolü (starcheck) ilk ve son uygulama doğruluğu

Yöntem notları:
  * Veri kaynağı paket içindeki items.jsonl dosyasıdır (her yanıt bir satır). Yalnız puanlanan
    (scored=1) yanıtlar sayılır.
  * Rasch modeli: P(doğru) = 1 / (1 + exp(-(θ_kişi − b_madde))). Aynı görev × seviye hücresinde
    tekrarlı denemeler binom sayım olarak alınır; ortak en çok olabilirlik (JML) ile kestirilir.
    JML küçük örneklemde yanlıdır; sonuç keşfedicidir. Yayın için TAM, eRm ya da mirt (R)
    ile koşullu ya da marjinal kestirim önerilir.
  * Ön-son test: aynı katılımcının ilk ve son starcheck uygulaması (aralarında en az 14 gün)
    karşılaştırılır; eşleştirilmiş t, Cohen d_z ve %95 GA verilir.
"""
import argparse, csv, io, json, math, os, statistics, sys, zipfile
from collections import Counter, defaultdict

# ── Girdi ────────────────────────────────────────────────────────────────────

def read_package(path):
    """Paket içeriğini {dosya_adı: metin} olarak döndürür."""
    files = {}
    if os.path.isdir(path):
        for name in os.listdir(path):
            full = os.path.join(path, name)
            if os.path.isfile(full):
                with open(full, encoding='utf-8-sig') as f:
                    files[name] = f.read()
    else:
        with zipfile.ZipFile(path) as z:
            for name in z.namelist():
                files[os.path.basename(name)] = z.read(name).decode('utf-8-sig')
    return files


def load(paths):
    responses, probes = [], []
    for path in paths:
        files = read_package(path)
        tag = os.path.basename(path)
        for line in files.get('items.jsonl', '').splitlines():
            line = line.strip()
            if not line:
                continue
            try:
                r = json.loads(line)
            except json.JSONDecodeError:
                continue
            if r.get('scored', 1) in (0, '0', False):
                continue
            pid = r.get('participant_code') or r.get('child_pid') or r.get('child_key')
            if not pid or r.get('mode') is None or r.get('level') in (None, ''):
                continue
            responses.append({
                'pid': f'{tag}:{pid}' if not r.get('participant_code') else str(pid),
                'mode': str(r['mode']), 'level': int(r['level']),
                'correct': 1 if r.get('correct') in (1, True, '1') else 0,
                'rt': r.get('rt_ms'), 'hint': r.get('hint_tier') or 0,
                'misc': r.get('misconception_id'), 'ts': r.get('ts'),
            })
        if 'probes.csv' in files:
            for row in csv.DictReader(io.StringIO(files['probes.csv'])):
                row['_pkg'] = tag
                probes.append(row)
    return responses, probes

# ── Yardımcı istatistik ─────────────────────────────────────────────────────

def wilson(k, n, z=1.96):
    if n == 0:
        return (float('nan'), float('nan'))
    p = k / n
    d = 1 + z * z / n
    c = (p + z * z / (2 * n)) / d
    h = z * math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)) / d
    return (c - h, c + h)


def _betacf(a, b, x):
    qab, qap, qam = a + b, a + 1, a - 1
    c, d = 1.0, 1 - qab * x / qap
    d = 1 / (d if abs(d) > 1e-30 else 1e-30)
    h = d
    for m in range(1, 200):
        m2 = 2 * m
        aa = m * (b - m) * x / ((qam + m2) * (a + m2))
        d = 1 + aa * d; d = 1 / (d if abs(d) > 1e-30 else 1e-30)
        c = 1 + aa / c if abs(c) > 1e-30 else 1e30
        h *= d * c
        aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2))
        d = 1 + aa * d; d = 1 / (d if abs(d) > 1e-30 else 1e-30)
        c = 1 + aa / c if abs(c) > 1e-30 else 1e30
        de = d * c
        h *= de
        if abs(de - 1) < 3e-12:
            break
    return h


def betainc(a, b, x):
    if x <= 0:
        return 0.0
    if x >= 1:
        return 1.0
    lbeta = math.lgamma(a + b) - math.lgamma(a) - math.lgamma(b) + a * math.log(x) + b * math.log(1 - x)
    if x < (a + 1) / (a + b + 2):
        return math.exp(lbeta) * _betacf(a, b, x) / a
    return 1 - math.exp(lbeta) * _betacf(b, a, 1 - x) / b


def t_two_sided_p(t, df):
    return betainc(df / 2, 0.5, df / (df + t * t))


def t_crit(df, alpha=0.05):
    lo, hi = 0.0, 50.0
    for _ in range(100):
        mid = (lo + hi) / 2
        if t_two_sided_p(mid, df) > alpha:
            lo = mid
        else:
            hi = mid
    return (lo + hi) / 2


def spearman(xs, ys):
    def ranks(v):
        order = sorted(range(len(v)), key=lambda i: v[i])
        r = [0.0] * len(v)
        i = 0
        while i < len(v):
            j = i
            while j + 1 < len(v) and v[order[j + 1]] == v[order[i]]:
                j += 1
            for k in range(i, j + 1):
                r[order[k]] = (i + j) / 2 + 1
            i = j + 1
        return r
    if len(xs) < 3:
        return float('nan')
    rx, ry = ranks(xs), ranks(ys)
    mx, my = statistics.mean(rx), statistics.mean(ry)
    num = sum((a - mx) * (b - my) for a, b in zip(rx, ry))
    den = math.sqrt(sum((a - mx) ** 2 for a in rx) * sum((b - my) ** 2 for b in ry))
    return num / den if den else float('nan')

# ── 1. Hücre güçlüğü ────────────────────────────────────────────────────────

def cell_difficulty(responses, min_n=30):
    cells = defaultdict(list)
    for r in responses:
        cells[(r['mode'], r['level'])].append(r)
    rows = []
    for (mode, level), rs in sorted(cells.items()):
        n = len(rs)
        k = sum(r['correct'] for r in rs)
        lo, hi = wilson(k, n)
        rts = [r['rt'] for r in rs if isinstance(r['rt'], (int, float)) and 0 < r['rt'] < 120000]
        miscs = Counter(r['misc'] for r in rs if r['misc'])
        rows.append({
            'gorev': mode, 'seviye': level, 'n': n, 'kisi': len({r['pid'] for r in rs}),
            'p': round(k / n, 3), 'ga_alt': round(lo, 3), 'ga_ust': round(hi, 3),
            'medyan_tepki_sn': round(statistics.median(rts) / 1000, 2) if rts else '',
            'ipucu_orani': round(sum(1 for r in rs if r['hint']) / n, 3),
            'en_sik_yanilgi': miscs.most_common(1)[0][0] if miscs else '',
            'uyari': '',
        })
    by_mode = defaultdict(list)
    for row in rows:
        by_mode[row['gorev']].append(row)
    for mode, rs in by_mode.items():
        rs.sort(key=lambda x: x['seviye'])
        for row in rs:
            flags = []
            if row['n'] >= min_n and row['ga_alt'] > 0.95:
                flags.append('çok kolay (tavan)')
            if row['n'] >= min_n and row['ga_ust'] < 0.40:
                flags.append('çok zor')
            row['uyari'] = '; '.join(flags)
        for a, b in zip(rs, rs[1:]):
            if a['n'] >= min_n and b['n'] >= min_n and b['ga_alt'] > a['ga_ust']:
                b['uyari'] = '; '.join(filter(None, [b['uyari'], f"bir önceki seviyeden (Sv.{a['seviye']}) anlamlı biçimde kolay"]))
    return rows

# ── 2. Rasch (binom JML) ────────────────────────────────────────────────────

def rasch(responses, min_item_n=20, min_person_n=15, iters=200):
    cnt = defaultdict(lambda: [0, 0])  # (kişi, madde) -> [doğru, deneme]
    for r in responses:
        c = cnt[(r['pid'], (r['mode'], r['level']))]
        c[0] += r['correct']; c[1] += 1
    item_n = Counter(); person_n = Counter()
    for (p, i), (k, n) in cnt.items():
        item_n[i] += n; person_n[p] += n
    items = sorted(i for i, n in item_n.items() if n >= min_item_n)
    persons = sorted(p for p, n in person_n.items() if n >= min_person_n)
    iset, pset = set(items), set(persons)
    data = [(p, i, k, n) for (p, i), (k, n) in cnt.items() if p in pset and i in iset]
    if len(items) < 2 or len(persons) < 5:
        return None
    # Uç puanlılar (hep doğru / hep yanlış) sonsuz kestirime gider: 0,3 düzeltmesi
    theta = {p: 0.0 for p in persons}
    b = {i: 0.0 for i in items}
    by_p = defaultdict(list); by_i = defaultdict(list)
    for p, i, k, n in data:
        by_p[p].append((i, k, n)); by_i[i].append((p, k, n))

    def adj(k, n, tot_k, tot_n):
        if tot_k == 0:
            return k + 0.3 * n / tot_n
        if tot_k == tot_n:
            return k - 0.3 * n / tot_n
        return k

    p_tot = {p: (sum(k for _, k, _ in v), sum(n for _, _, n in v)) for p, v in by_p.items()}
    i_tot = {i: (sum(k for _, k, _ in v), sum(n for _, _, n in v)) for i, v in by_i.items()}
    for _ in range(iters):
        delta = 0.0
        for p in persons:
            tk, tn = p_tot[p]
            g = h = 0.0
            for i, k, n in by_p[p]:
                e = 1 / (1 + math.exp(-(theta[p] - b[i])))
                g += adj(k, n, tk, tn) - n * e
                h += n * e * (1 - e)
            step = max(-1.0, min(1.0, g / h)) if h else 0.0
            theta[p] += step; delta = max(delta, abs(step))
        for i in items:
            tk, tn = i_tot[i]
            g = h = 0.0
            for p, k, n in by_i[i]:
                e = 1 / (1 + math.exp(-(theta[p] - b[i])))
                g += adj(k, n, tk, tn) - n * e
                h += n * e * (1 - e)
            step = max(-1.0, min(1.0, -g / h)) if h else 0.0
            b[i] += step; delta = max(delta, abs(step))
        m = statistics.mean(b.values())
        for i in items:
            b[i] -= m
        for p in persons:
            theta[p] -= m
        if delta < 1e-4:
            break
    out = []
    for i in items:
        info = sq = wsq = 0.0
        nres = 0
        for p, k, n in by_i[i]:
            e = 1 / (1 + math.exp(-(theta[p] - b[i])))
            v = n * e * (1 - e)
            info += v
            if v > 0:
                z2 = (k - n * e) ** 2 / v
                sq += z2; wsq += (k - n * e) ** 2; nres += 1
        out.append({'gorev': i[0], 'seviye': i[1], 'n': i_tot[i][1], 'b_logit': round(b[i], 3),
                    'se': round(1 / math.sqrt(info), 3) if info else '',
                    'outfit_mnsq': round(sq / nres, 2) if nres else '',
                    'infit_mnsq': round(wsq / info, 2) if info else ''})
    se_p = []
    for p in persons:
        info = sum(n * (1 / (1 + math.exp(-(theta[p] - b[i])))) * (1 - 1 / (1 + math.exp(-(theta[p] - b[i])))) for i, k, n in by_p[p])
        se_p.append(1 / info if info else 0)
    var_t = statistics.pvariance(theta.values()) if len(theta) > 1 else 0
    rel = (var_t - statistics.mean(se_p)) / var_t if var_t > 0 else float('nan')
    return {'items': out, 'n_person': len(persons), 'reliability': rel}

# ── 3. Ön-son test ──────────────────────────────────────────────────────────

def pre_post(probes, min_gap_days=14):
    adm = defaultdict(lambda: {'k': 0, 'n': 0, 'date': None})
    for r in probes:
        if r.get('kind') != 'starcheck' or str(r.get('skipped', '0')) in ('1', 'true'):
            continue
        pid = r.get('participantCode') or f"{r['_pkg']}:{r.get('pseudoId')}"
        key = (pid, r.get('probeId'))
        a = adm[key]
        a['n'] += 1; a['k'] += 1 if str(r.get('correct')) in ('1', 'true', 'True') else 0
        a['date'] = r.get('date') or a['date']; a['form'] = r.get('form')
    per = defaultdict(list)
    for (pid, _), a in adm.items():
        if a['n'] and a['date']:
            per[pid].append((a['date'][:10], a['k'] / a['n'], a.get('form')))
    rows, diffs = [], []
    for pid, lst in sorted(per.items()):
        lst.sort()
        first, last = lst[0], lst[-1]
        try:
            from datetime import date
            gap = (date.fromisoformat(last[0]) - date.fromisoformat(first[0])).days
        except ValueError:
            gap = 0
        use = len(lst) >= 2 and gap >= min_gap_days
        rows.append({'katilimci': pid, 'ilk_tarih': first[0], 'ilk_form': first[2], 'ilk_dogruluk': round(first[1], 3),
                     'son_tarih': last[0], 'son_form': last[2], 'son_dogruluk': round(last[1], 3), 'gun_farki': gap,
                     'analize_girdi': 1 if use else 0})
        if use:
            diffs.append(last[1] - first[1])
    res = {'rows': rows, 'n': len(diffs)}
    if len(diffs) >= 3:
        m, sd = statistics.mean(diffs), statistics.stdev(diffs)
        df = len(diffs) - 1
        t = m / (sd / math.sqrt(len(diffs))) if sd else float('inf')
        tc = t_crit(df)
        res.update({'mean_diff': m, 'sd': sd, 't': t, 'df': df, 'p': t_two_sided_p(abs(t), df) if sd else 0.0,
                    'dz': m / sd if sd else float('inf'),
                    'ci': (m - tc * sd / math.sqrt(len(diffs)), m + tc * sd / math.sqrt(len(diffs)))})
    return res

# ── Çıktı ───────────────────────────────────────────────────────────────────

def write_csv(path, rows):
    if not rows:
        return
    with open(path, 'w', newline='', encoding='utf-8-sig') as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        w.writeheader(); w.writerows(rows)


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('paketler', nargs='+', help='galaksay-akademik-veri-*.zip ya da açılmış klasör')
    ap.add_argument('--cikti', default='galaksay-analiz', help='çıktı klasörü')
    ap.add_argument('--min-n', type=int, default=30, help='uyarı için en az yanıt (hücre)')
    a = ap.parse_args(argv)
    responses, probes = load(a.paketler)
    if not responses:
        sys.exit('Pakette puanlanmış yanıt (items.jsonl) bulunamadı.')
    os.makedirs(a.cikti, exist_ok=True)
    cells = cell_difficulty(responses, a.min_n)
    write_csv(os.path.join(a.cikti, 'hucre_gucluk.csv'), cells)
    ra = rasch(responses)
    if ra:
        write_csv(os.path.join(a.cikti, 'rasch_madde.csv'), ra['items'])
    pp = pre_post(probes)
    write_csv(os.path.join(a.cikti, 'on_son_test.csv'), pp['rows'])

    L = ['# GalakSay madde ve ölçme analizi', '',
         f"Paket: {len(a.paketler)} · katılımcı: {len({r['pid'] for r in responses})} · puanlanan yanıt: {len(responses)} · "
         f"görev × seviye hücresi: {len(cells)}", '']
    L += ['## 1. Hücre güçlüğü', '', f'Uyarı ölçütü: en az {a.min_n} yanıt. Ayrıntı: hucre_gucluk.csv', '']
    flagged = [c for c in cells if c['uyari']]
    if flagged:
        L += ['| Görev | Seviye | n | p | %95 GA | Uyarı |', '|---|---:|---:|---:|---|---|']
        L += [f"| {c['gorev']} | {c['seviye']} | {c['n']} | {c['p']} | {c['ga_alt']}–{c['ga_ust']} | {c['uyari']} |" for c in flagged]
    else:
        L.append('Uyarı üreten hücre yok.')
    L += ['', '## 2. Keşfedici Rasch kalibrasyonu', '']
    if ra:
        L.append(f"Kişi sayısı: {ra['n_person']} · kişi ayırma güvenirliği: {ra['reliability']:.2f}")
        L.append('')
        mis = [i for i in ra['items'] if isinstance(i['outfit_mnsq'], float) and (i['outfit_mnsq'] > 1.5 or i['outfit_mnsq'] < 0.5)]
        L.append(f"Uyum dışı madde ailesi (outfit < 0,5 ya da > 1,5): {len(mis)}")
        by = defaultdict(list)
        for i in ra['items']:
            by[i['gorev']].append(i)
        bad = []
        for g, lst in by.items():
            if len(lst) >= 3:
                rho = spearman([x['seviye'] for x in lst], [x['b_logit'] for x in lst])
                if not math.isnan(rho) and rho < 0.6:
                    bad.append(f'{g} (ρ = {rho:.2f})')
        L.append('Seviye sırası ile güçlük sırası zayıf uyuşan görevler: ' + (', '.join(bad) if bad else 'yok'))
        L.append('')
        L.append('Not: JML kestirimi keşfedicidir. Yayın için TAM, eRm ya da mirt ile yeniden kestirin.')
    else:
        L.append('Rasch için yeterli veri yok (en az 5 kişi, madde ailesi başına 20 yanıt).')
    L += ['', '## 3. Ön-son test (Yıldız Haritası Kontrolü)', '']
    if pp.get('n', 0) >= 3:
        ptxt = 'p < 0,001' if pp['p'] < 0.001 else 'p = %.3f' % pp['p']
        L.append(f"Eşleştirilmiş katılımcı: {pp['n']} · ortalama doğruluk farkı: {pp['mean_diff']:+.3f} "
                 f"(%95 GA {pp['ci'][0]:+.3f} – {pp['ci'][1]:+.3f}) · t({pp['df']}) = {pp['t']:.2f}, {ptxt} · d_z = {pp['dz']:.2f}")
        L.append('')
        L.append('Kontrol grubu olmadan bu fark yalnız müdahaleye atfedilemez (olgunlaşma, sınıf öğretimi).')
    else:
        L.append(f"Aralarında en az 14 gün olan iki uygulaması bulunan katılımcı sayısı yetersiz ({pp.get('n', 0)}).")
    with open(os.path.join(a.cikti, 'RAPOR.md'), 'w', encoding='utf-8') as f:
        f.write('\n'.join(L) + '\n')
    print('\n'.join(L))


if __name__ == '__main__':
    main()
