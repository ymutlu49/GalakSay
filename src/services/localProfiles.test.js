// FAZ A (birleşik roster) — numap-kaynaklı roster kayıtları sözleşme testleri.
// Kritik değişmezler: (1) ns ASLA değişmez, (2) yerel yüzeyler (listChildren /
// childCount / StudentPicker) numap kayıtlarını GÖRMEZ, (3) upsert öğretmen-başına
// otoriterdir (budar) ama yerel kayıtlara ve DİĞER öğretmenin kayıtlarına dokunmaz,
// (4) çıkış temizliği payload anahtarlarını da siler, oyun verisine dokunmaz.
import { describe, expect, it, beforeEach, vi } from 'vitest';
import {
  addChild,
  removeChild,
  listChildren,
  childCount,
  upsertNumapChildren,
  listNumapChildren,
  removeNumapChildren,
  wipeChildData,
  hasPin,
  verifyPin,
  linkNumapToChild,
  unlinkNumapFromChild,
  refreshNumapLinks,
  readNumapSessionPayload,
} from './localProfiles.js';

const item = (key, over = {}) => ({
  ns: `numap_${key}`,
  studentKey: key,
  name: `Çocuk ${key}`,
  ageMonths: 84,
  grade: '2',
  savedAt: '2026-08-01T10:00:00Z',
  sessionId: `s_${key}`,
  status: 'completed',
  school: 'Okul',
  city: 'Muş',
  district: '',
  gender: 'female',
  assessmentDate: '2026-08-01',
  birthDate: '',
  session: { id: `s_${key}`, studentKey: key, payload: { student: { name: `Çocuk ${key}` } } },
  ...over,
});

describe('localProfiles — numap roster (Faz A)', () => {
  beforeEach(() => { localStorage.clear(); });

  it('upsert kayıt ekler; ns korunur ve payload çocuk-başına ayrı anahtara yazılır', () => {
    upsertNumapChildren('u1', [item('a'), item('b')]);
    const list = listNumapChildren('u1');
    expect(list.map((c) => c.ns).sort()).toEqual(['numap_a', 'numap_b']);
    expect(list[0].source).toBe('numap');
    expect(localStorage.getItem('galaksay_numap_session_numap_a')).toContain('"studentKey":"a"');
    // Liste kaydının kendisi payload taşımaz (roster şişmez)
    const raw = JSON.parse(localStorage.getItem('galaksay_local_children'));
    expect(JSON.stringify(raw)).not.toContain('payload');
  });

  it('upsert mevcut kaydı günceller — createdAt korunur, ad tazelenir', () => {
    upsertNumapChildren('u1', [item('a')]);
    const created = listNumapChildren('u1')[0].createdAt;
    upsertNumapChildren('u1', [item('a', { name: 'Yeni Ad', savedAt: '2026-08-05T09:00:00Z' })]);
    const rec = listNumapChildren('u1')[0];
    expect(rec.name).toBe('Yeni Ad');
    expect(rec.createdAt).toBe(created);
    expect(listNumapChildren('u1')).toHaveLength(1);
  });

  it('upsert öğretmen-başına otoriter: listeden düşen kayıt + payload budanır', () => {
    upsertNumapChildren('u1', [item('a'), item('b')]);
    upsertNumapChildren('u1', [item('a')]);
    expect(listNumapChildren('u1').map((c) => c.ns)).toEqual(['numap_a']);
    expect(localStorage.getItem('galaksay_numap_session_numap_b')).toBeNull();
  });

  it('budama DİĞER öğretmenin ve YEREL kayıtların yanından geçmez', () => {
    addChild({ name: 'Yerel Deniz' });
    upsertNumapChildren('u1', [item('a')]);
    upsertNumapChildren('u2', [item('z')]);
    upsertNumapChildren('u1', []); // u1 listesi boşaldı
    expect(listNumapChildren('u1')).toHaveLength(0);
    expect(listNumapChildren('u2').map((c) => c.ns)).toEqual(['numap_z']);
    expect(listChildren().map((c) => c.name)).toEqual(['Yerel Deniz']);
  });

  it('listNumapChildren yalnız o öğretmenin kayıtlarını payload iliştirerek döner', () => {
    upsertNumapChildren('u1', [item('a', { savedAt: '2026-08-02T00:00:00Z' }), item('b', { savedAt: '2026-08-04T00:00:00Z' })]);
    upsertNumapChildren('u2', [item('z')]);
    const list = listNumapChildren('u1');
    expect(list.map((c) => c.ns)).toEqual(['numap_b', 'numap_a']); // savedAt yeni→eski
    expect(list[0].session.id).toBe('s_b');
    expect(listNumapChildren(undefined)).toEqual([]);
  });

  it('payload depolamadan düşmüşse session=null döner (liste yine çalışır)', () => {
    upsertNumapChildren('u1', [item('a')]);
    localStorage.removeItem('galaksay_numap_session_numap_a');
    expect(listNumapChildren('u1')[0].session).toBeNull();
  });

  it('YEREL yüzeyler numap kayıtlarını görmez: listChildren + childCount', () => {
    const local = addChild({ name: 'Yerel Deniz', ownerId: null });
    upsertNumapChildren('u1', [item('a'), item('b')]);
    expect(listChildren().map((c) => c.ns)).toEqual([local.ns]);      // StudentPicker (tümü)
    expect(listChildren(null).map((c) => c.ns)).toEqual([local.ns]);  // yerel yönetici görünümü
    expect(childCount()).toBe(1);
  });

  it('removeNumapChildren(userId) yalnız o öğretmeni siler; payload anahtarları da gider', () => {
    upsertNumapChildren('u1', [item('a')]);
    upsertNumapChildren('u2', [item('z')]);
    removeNumapChildren('u1');
    expect(listNumapChildren('u1')).toHaveLength(0);
    expect(localStorage.getItem('galaksay_numap_session_numap_a')).toBeNull();
    expect(listNumapChildren('u2')).toHaveLength(1);
  });

  it('removeNumapChildren(null) TÜM numap kayıtlarını siler, yerel + oyun verisi kalır', () => {
    addChild({ name: 'Yerel Deniz' });
    localStorage.setItem('dokunsay-user-numap_a', '{"stats":{"totalGames":3}}'); // oyun ilerlemesi
    upsertNumapChildren('u1', [item('a')]);
    upsertNumapChildren('u2', [item('z')]);
    removeNumapChildren(null);
    expect(listNumapChildren('u1')).toHaveLength(0);
    expect(listNumapChildren('u2')).toHaveLength(0);
    expect(listChildren()).toHaveLength(1);
    expect(localStorage.getItem('dokunsay-user-numap_a')).not.toBeNull();
  });

  it('numap kayıtları yerel ns sayacını (genNs) şaşırtmaz', () => {
    upsertNumapChildren('u1', [item('a')]);
    const c1 = addChild({ name: 'Bir' });
    const c2 = addChild({ name: 'İki' });
    expect(c1.ns).toBe('local_1');
    expect(c2.ns).toBe('local_2');
  });

  // ── Doğrulama-turu bulguları (2026-08-05) ────────────────────────────────

  it('AYNI ns iki öğretmende iki ayrı kayıt olarak yaşar — sahiplik çalınmaz', () => {
    upsertNumapChildren('u1', [item('ortak')]);
    upsertNumapChildren('u2', [item('ortak', { name: 'U2 Görünümü' })]);
    expect(listNumapChildren('u1')).toHaveLength(1); // u1 listesi kaybolmadı
    expect(listNumapChildren('u2')).toHaveLength(1);
    expect(listNumapChildren('u1')[0].name).toBe('Çocuk ortak');
    expect(listNumapChildren('u2')[0].name).toBe('U2 Görünümü');
  });

  it('paylaşılan ns: bir sahibin budaması/silmesi payload anahtarını diğeri dururken SİLMEZ', () => {
    upsertNumapChildren('u1', [item('ortak')]);
    upsertNumapChildren('u2', [item('ortak')]);
    upsertNumapChildren('u2', []); // u2 çocuğu listeden çıkardı (prune)
    expect(localStorage.getItem('galaksay_numap_session_numap_ortak')).not.toBeNull();
    removeNumapChildren('u1'); // son sahip de gitti → payload gider
    expect(localStorage.getItem('galaksay_numap_session_numap_ortak')).toBeNull();
  });

  it('removeNumapChildren sahipsiz (orphan) payload anahtarlarını da süpürür', () => {
    localStorage.setItem('galaksay_numap_session_numap_orphan', '{"id":"eski"}');
    upsertNumapChildren('u1', [item('a')]);
    removeNumapChildren(null);
    expect(localStorage.getItem('galaksay_numap_session_numap_orphan')).toBeNull();
    expect(localStorage.getItem('galaksay_numap_session_numap_a')).toBeNull();
  });

  it('roster yazılamazsa upsert false döner ve HİÇBİR payload yazılmaz (orphan PII yok)', () => {
    // jsdom Storage'ında örnek üzerine tanımlanan özellik metodu geçersiz kılmaz
    // (WebIDL adlı-özellik ayarlayıcısı onu bir anahtar olarak saklar); prototipte casusla.
    // Ortama göre setItem ya Storage prototipinde (gerçek jsdom) ya da bellek şimi
    // üzerinde kendi özelliğidir (src/test/setup.js) → sahibi olan nesnede casusla.
    const proto = Object.prototype.hasOwnProperty.call(localStorage, 'setItem')
      ? localStorage
      : Object.getPrototypeOf(localStorage);
    const orig = proto.setItem;
    const spy = vi.spyOn(proto, 'setItem').mockImplementation(function (k, v) {
      if (k === 'galaksay_local_children') throw new Error('QuotaExceeded');
      return orig.call(this, k, v);
    });
    try {
      const ok = upsertNumapChildren('u1', [item('a')]);
      expect(ok).toBe(false);
      expect(localStorage.getItem('galaksay_numap_session_numap_a')).toBeNull();
    } finally {
      spy.mockRestore();
    }
  });

  it('wipeChildData sonek çakışmasında başka çocuğun anahtarına dokunmaz', () => {
    addChild({ name: 'Yerel' }); // local_1
    upsertNumapChildren('u1', [item('ab_local_1')]); // ns=numap_ab_local_1 → "local_1" ile bitiyor
    localStorage.setItem('ds_stats_local_1', 'yerel-veri');
    localStorage.setItem('ds_stats_numap_ab_local_1', 'numap-veri');
    wipeChildData('local_1');
    expect(localStorage.getItem('ds_stats_local_1')).toBeNull();          // hedef silindi
    expect(localStorage.getItem('ds_stats_numap_ab_local_1')).toBe('numap-veri'); // komşu korundu
  });

  it('numap kaydında PIN korkulukları: hasPin=false, verifyPin daima reddeder', async () => {
    upsertNumapChildren('u1', [item('a')]);
    expect(hasPin('numap_a')).toBe(false);
    await expect(verifyPin('numap_a', '')).resolves.toBe(false);
    await expect(verifyPin('numap_a', '1234')).resolves.toBe(false);
  });

  // ── Faz B: Numap öğretmeninin eklediği yerel profiller ("numap:<id>" sahipliği) ──

  // ── Faz C: yerel çocuğa Numap taraması bağlama ────────────────────────────

  const linkInfo = (key, over = {}) => ({
    studentKey: key,
    sessionId: `s_${key}`,
    savedAt: '2026-08-06T09:00:00Z',
    session: { id: `s_${key}`, studentKey: key, payload: { student: { name: 'Gerçek Ad' } } },
    ...over,
  });

  it('link: alanlar iliştirilir, ns DEĞİŞMEZ, payload ns-anahtarına yazılır', () => {
    const c = addChild({ name: 'Rumuz Deniz', ownerId: 'numap:u1' });
    const r = linkNumapToChild(c.ns, linkInfo('k1'));
    expect(r.ok).toBe(true);
    const rec = listChildren('numap:u1')[0];
    expect(rec.ns).toBe(c.ns); // local_1 aynen
    expect(rec.numapStudentKey).toBe('k1');
    expect(rec.numapSessionId).toBe('s_k1');
    expect(readNumapSessionPayload(c.ns)?.studentKey).toBe('k1');
  });

  it('link tekilliği: aynı tarama ikinci yerel çocuğa bağlanamaz; numap kaydına bağlama reddedilir', () => {
    const a = addChild({ name: 'Bir', ownerId: 'numap:u1' });
    const b = addChild({ name: 'İki', ownerId: 'numap:u1' });
    expect(linkNumapToChild(a.ns, linkInfo('k1')).ok).toBe(true);
    const dup = linkNumapToChild(b.ns, linkInfo('k1'));
    expect(dup.ok).toBe(false);
    expect(dup.error).toContain('Bir');
    upsertNumapChildren('u1', [item('x')]);
    expect(linkNumapToChild('numap_x', linkInfo('k9')).ok).toBe(false);
  });

  it('unlink: bağ alanları + payload + müdahale planı gider; oyun verisi kalır', () => {
    const c = addChild({ name: 'Rumuz', ownerId: 'numap:u1' });
    linkNumapToChild(c.ns, linkInfo('k1'));
    localStorage.setItem(`numap_intervention_${c.ns}`, '{"source":"numap"}');
    localStorage.setItem(`dokunsay-user-${c.ns}`, '{"stats":{"totalGames":2}}');
    expect(unlinkNumapFromChild(c.ns)).toBe(true);
    const rec = listChildren('numap:u1')[0];
    expect(rec.numapStudentKey).toBeUndefined();
    expect(readNumapSessionPayload(c.ns)).toBeNull();
    expect(localStorage.getItem(`numap_intervention_${c.ns}`)).toBeNull();
    expect(localStorage.getItem(`dokunsay-user-${c.ns}`)).not.toBeNull();
  });

  it('çıkış süpürmesi bağlı payload\'ı alır (BİLİNÇLİ) ama bağ kalır; refreshNumapLinks onarır', () => {
    const c = addChild({ name: 'Rumuz', ownerId: 'numap:u1' });
    linkNumapToChild(c.ns, linkInfo('k1'));
    removeNumapChildren(null); // çıkış: orphan taraması ns=local_* payload'ını da süpürür
    expect(readNumapSessionPayload(c.ns)).toBeNull();
    expect(listChildren('numap:u1')[0].numapStudentKey).toBe('k1'); // bağ durur
    // Sonraki başarılı yenileme: aynı studentKey listede → payload geri yazılır + sürüm tazelenir
    refreshNumapLinks([{ studentKey: 'k1', sessionId: 's_k1_yeni', savedAt: '2026-08-07T10:00:00Z', session: { id: 's_k1_yeni', studentKey: 'k1' } }]);
    expect(readNumapSessionPayload(c.ns)?.id).toBe('s_k1_yeni');
    const rec = listChildren('numap:u1')[0];
    expect(rec.numapSessionId).toBe('s_k1_yeni');
    expect(rec.numapSavedAt).toBe('2026-08-07T10:00:00Z');
  });

  it('bağlı profil silinince bağ artıkları da gider (payload+plan); oyun verisi kalır', () => {
    const c = addChild({ name: 'Rumuz', ownerId: 'numap:u1' });
    linkNumapToChild(c.ns, linkInfo('k1'));
    localStorage.setItem(`numap_intervention_${c.ns}`, '{"source":"numap"}');
    localStorage.setItem(`dokunsay-user-${c.ns}`, '{"stats":{"totalGames":2}}');
    removeChild(c.ns, false); // ChildForm'un çağırdığı biçim (wipeProgress=false)
    expect(readNumapSessionPayload(c.ns)).toBeNull();
    expect(localStorage.getItem(`numap_intervention_${c.ns}`)).toBeNull();
    expect(localStorage.getItem(`dokunsay-user-${c.ns}`)).not.toBeNull(); // ilerleme durur
    expect(listChildren('numap:u1')).toHaveLength(0);
  });

  it('çapraz-sahip bağlama çakışmasında rumuz sızdırılmaz (jenerik mesaj)', () => {
    const a = addChild({ name: 'Gizli Rumuz', ownerId: 'numap:u1' });
    const b = addChild({ name: 'B Çocuğu', ownerId: 'numap:u2' });
    expect(linkNumapToChild(a.ns, linkInfo('k1')).ok).toBe(true);
    const r = linkNumapToChild(b.ns, linkInfo('k1'));
    expect(r.ok).toBe(false);
    expect(r.error).not.toContain('Gizli Rumuz');
    expect(r.error).toContain('başka bir profile bağlı');
  });

  it('refreshNumapLinks: listede olmayan bağ anahtarına dokunmaz', () => {
    const c = addChild({ name: 'Rumuz', ownerId: 'numap:u1' });
    linkNumapToChild(c.ns, linkInfo('k1'));
    refreshNumapLinks([{ studentKey: 'BASKA', sessionId: 's_b', savedAt: '2026-08-07T00:00:00Z', session: { id: 's_b' } }]);
    const rec = listChildren('numap:u1')[0];
    expect(rec.numapSessionId).toBe('s_k1'); // değişmedi
    expect(readNumapSessionPayload(c.ns)?.id).toBe('s_k1');
  });

  it('numap:<id> sahipli yerel profil: sahibine görünür, yönetici listesine sızmaz, StudentPicker\'da yaşar', () => {
    const mine = addChild({ name: 'Elle Eklenen', ownerId: 'numap:u1' });
    addChild({ name: 'Yönetici Çocuğu', ownerId: null });
    expect(listChildren('numap:u1').map((c) => c.ns)).toEqual([mine.ns]); // öğretmenin tek listesi
    expect(listChildren(null).map((c) => c.name)).toEqual(['Yönetici Çocuğu']); // yerel yönetici görünümü
    expect(listChildren().map((c) => c.name).sort()).toEqual(['Elle Eklenen', 'Yönetici Çocuğu']); // çocuk self-login (tümü)
    // Numap roster temizliği (çıkış) elle eklenen YEREL profile dokunmaz
    upsertNumapChildren('u1', [item('a')]);
    removeNumapChildren(null);
    expect(listChildren('numap:u1')).toHaveLength(1);
  });
});

describe('localProfiles — PIN deneme kilidi (kaba kuvvet freni)', () => {
  beforeEach(() => { localStorage.clear(); });

  it('5 yanlış denemeden sonra doğru PIN bile kilit süresince reddedilir', async () => {
    const { setAdminPin, verifyAdminPin, getPinLockRemainingMs } = await import('./localProfiles.js');
    await setAdminPin('1234');
    expect(await verifyAdminPin('1234')).toBe(true);
    expect(getPinLockRemainingMs('admin')).toBe(0);
    for (let i = 0; i < 5; i++) expect(await verifyAdminPin('0000')).toBe(false);
    expect(getPinLockRemainingMs('admin')).toBeGreaterThan(0);
    expect(await verifyAdminPin('1234')).toBe(false); // kilitli
  });

  it('başarılı giriş sayaç ve kilidi sıfırlar', async () => {
    const { setAdminPin, verifyAdminPin, getPinLockRemainingMs } = await import('./localProfiles.js');
    await setAdminPin('4321');
    for (let i = 0; i < 3; i++) await verifyAdminPin('9999');
    expect(await verifyAdminPin('4321')).toBe(true);
    expect(getPinLockRemainingMs('admin')).toBe(0);
    expect(localStorage.getItem('galaksay_pin_attempts_admin')).toBeNull();
  });

  it('çocuk PIN kilidi çocuğa özgüdür', async () => {
    const { addChild, updateChild, verifyPin, getPinLockRemainingMs } = await import('./localProfiles.js');
    const { hashPin } = await import('../utils/crypto.js');
    const a = addChild({ name: 'A' }); const b = addChild({ name: 'B' });
    updateChild(a.ns, { pin: await hashPin('1111') }); updateChild(b.ns, { pin: await hashPin('2222') });
    for (let i = 0; i < 5; i++) await verifyPin(a.ns, '0000');
    expect(getPinLockRemainingMs(`child_${a.ns}`)).toBeGreaterThan(0);
    expect(await verifyPin(a.ns, '1111')).toBe(false);
    expect(await verifyPin(b.ns, '2222')).toBe(true);
  });
});
