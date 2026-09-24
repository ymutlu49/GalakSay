// GalakSay — Cihaz-yerel çocuk profilleri (Numap'siz mod).
//
// Öğretmen/uzman cihazda çocuk profilleri oluşturur; çocuk kendi profilini
// seçip 4-haneli PIN ile girer ve oyununa KALDIĞI YERDEN devam eder.
//
// Önemli mimari nokta: oyun ilerlemesi zaten ns-namespace'lidir
// (`ds_*_<ns>`, `dokunsay-user-<ns>`). Bu servis YALNIZ roster'ı tutar
// (ad/avatar/yaş-grubu/PIN); ns sabit olduğu için oyun kendiliğinden resume eder.
// Yani profil silinmeden ns korunur → çocuk her girişte kaldığı yerden devam eder.

import { hashPin, verifyPin as verifyHash } from '../utils/crypto.js';

const KEY = 'galaksay_local_children';

// Çocukların seçebileceği avatarlar (uzay teması — oyunun materyalleriyle uyumlu).
export const LOCAL_AVATARS = ['🚀', '🪐', '⭐', '🌟', '🛸', '☄️', '🌙', '🌍', '👽', '🤖', '🦊', '🐱'];

// Yaş-grubu seçenekleri (GalakSay ageGroup anahtarlarıyla birebir).
export const AGE_GROUPS = [
  { key: 'okuloncesi', label: 'Okul Öncesi', hint: '5-6 yaş', icon: '🪐' },
  { key: 'sinif1', label: '1. Sınıf', hint: '6-7 yaş', icon: '⭐' },
  { key: 'sinif2', label: '2. Sınıf', hint: '7-8 yaş', icon: '🚀' },
];

function readAll() {
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function writeAll(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
    return true;
  } catch {
    return false;
  }
}

// Kararlı, çakışmasız ns: `local_<artan>`. Silinen kayıtla çakışmaması için
// mevcut en büyük numaranın bir fazlası alınır (sayaç geri sarmaz).
function genNs(existing) {
  const maxNum = existing.reduce((m, c) => {
    const mt = /^local_(\d+)$/.exec(c.ns || '');
    return mt ? Math.max(m, +mt[1]) : m;
  }, 0);
  return `local_${maxNum + 1}`;
}

// Yerel çocuklar. ownerId verilirse YALNIZ o kullanıcının (öğretmenin) öğrencileri
// döner (izolasyon); verilmezse (StudentPicker self-login) tüm cihaz roster'ı döner.
// ownerId === null → sahipsiz/yönetici-öğrencileri (eski kayıtlar ve admin'in eklediği).
// FAZ A (2026-08-05): Numap-kaynaklı roster kayıtları (source==='numap') yerel
// yüzeylerde GÖRÜNMEZ — StudentPicker/yerel hub davranışı değişmez; Numap listesi
// için listNumapChildren kullanılır. (Birleşik liste UI'ı Faz B'nin işi.)
export function listChildren(ownerId) {
  let arr = readAll().filter((c) => c.source !== 'numap');
  if (ownerId !== undefined) arr = arr.filter((c) => (c.ownerId || null) === (ownerId || null));
  return arr.sort(
    (a, b) =>
      (b.lastSeenAt || '').localeCompare(a.lastSeenAt || '') ||
      (a.name || '').localeCompare(b.name || '', 'tr'),
  );
}

export function getChild(ns) {
  return readAll().find((c) => c.ns === ns) || null;
}

export function childCount() {
  return readAll().filter((c) => c.source !== 'numap').length;
}

// Yeni yerel çocuk oluştur. pin '' ise PIN'siz (serbest) giriş.
// ownerId: çocuğu ekleyen yerel kullanıcı (öğretmen) id'si; admin için null.
export function addChild({ name, avatar, ageGroup, grade, pin, ownerId = null } = {}) {
  const list = readAll();
  const ns = genNs(list);
  const child = {
    ns,
    ownerId: ownerId || null,
    name: (name || '').trim() || 'Öğrenci',
    avatar: avatar || LOCAL_AVATARS[list.length % LOCAL_AVATARS.length],
    ageGroup: ageGroup || 'sinif1', // okuloncesi | sinif1 | sinif2
    grade: grade || '',
    pin: String(pin || '').trim(), // '' = PIN yok
    createdAt: new Date().toISOString(),
    lastSeenAt: '',
  };
  list.push(child);
  writeAll(list);
  return child;
}

export function updateChild(ns, patch) {
  const list = readAll();
  const i = list.findIndex((c) => c.ns === ns);
  if (i < 0) return null;
  list[i] = { ...list[i], ...patch };
  // pin normalize
  if (patch && Object.prototype.hasOwnProperty.call(patch, 'pin')) {
    list[i].pin = String(patch.pin || '').trim();
  }
  writeAll(list);
  return list[i];
}

/** Profili roster'dan kaldır. wipeProgress=true ise oyun ilerleme verisini de sil.
 *  FAZ C: kayıt bir Numap taramasına BAĞLIYSA bağ artıkları (gerçek-adlı oturum
 *  payload'ı + türetilmiş müdahale planı) wipeProgress'ten BAĞIMSIZ temizlenir —
 *  kayıt gidince bu anahtarları silebilecek başka yol kalmıyordu (orphan PII).
 *  Oyun ilerlemesi (ds_*, dokunsay-user-*) yalnız wipeProgress=true ile gider. */
export function removeChild(ns, wipeProgress = false) {
  const rec = getChild(ns);
  writeAll(readAll().filter((c) => c.ns !== ns));
  if (rec && rec.source !== 'numap' && rec.numapStudentKey) {
    try { localStorage.removeItem(NUMAP_SESSION_KEY(ns)); } catch { /* yok say */ }
    try { localStorage.removeItem(`numap_intervention_${ns}`); } catch { /* yok say */ }
  }
  if (wipeProgress) wipeChildData(ns);
}

/** Çocuğun tüm ns-namespace'li oyun verisini sil (geri alınamaz). */
export function wipeChildData(ns) {
  try {
    // Sonek çakışma koruması (Faz A): başka bir çocuğun ns'i hedef ns ile BİTİYORSA
    // (ör. numap_<key>_local_3 ↔ local_3) onun anahtarları yanlışlıkla silinmesin.
    const others = readAll()
      .map((c) => c.ns)
      .filter((x) => x && x !== ns && x.endsWith(ns));
    const conflict = (k) => others.some((x) => k.endsWith(`_${x}`) || k.endsWith(`-${x}`));
    const toRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;
      // ds_*_<ns>, dokunsay-user-<ns>, dokunsay-lb-<ns>, numap_intervention_<ns>
      if ((k.endsWith(`_${ns}`) || k.endsWith(`-${ns}`) || k === `numap_intervention_${ns}`) && !conflict(k)) {
        toRemove.push(k);
      }
    }
    toRemove.forEach((k) => localStorage.removeItem(k));
  } catch {
    /* depolama engelli */
  }
  // KVKK: IndexedDB'deki oturum/olay/profil kayıtları da (ad + doğum tarihi taşıyabilir)
  try { import('../analytics/database.js').then((m) => m.deleteChildRecords(ns)).catch(() => {}); } catch { /* yok say */ }
}

/** Son giriş zamanını güncelle (StudentPicker sıralaması için). */
export function touchChild(ns) {
  return updateChild(ns, { lastSeenAt: new Date().toISOString() });
}

export function hasPin(ns) {
  const c = getChild(ns);
  if (c && c.source === 'numap') return false; // numap kaydında pin kavramı yok
  return !!(c && c.pin);
}

/** PIN doğrula (hash'li). Çocuğun PIN'i yoksa her zaman geçerli (serbest giriş).
 *  Numap-kaynaklı kayıt: DAİMA reddet — pin alanı olmadığından "serbest giriş"
 *  sayılmasın (bugün bu yola çağrı yok; Faz B öncesi korkuluk). */
export async function verifyPin(ns, pin) {
  const c = getChild(ns);
  if (!c) return false;
  if (c.source === 'numap') return false;
  if (!c.pin) return true;
  if (getPinLockRemainingMs(`child_${ns}`) > 0) return false;
  let ok;
  // Geriye uyumluluk: eski düz-metin PIN (önek yok) → düz karşılaştır; yeni PIN'ler hash'li.
  if (!/^(pbkdf2|sha256|plain):/.test(c.pin)) {
    ok = String(pin) === String(c.pin);
    if (ok) {
      // Başarılı girişte sessiz yükseltme: düz-metin PIN cihazda bir daha durmasın
      try { updateChild(ns, { pin: await hashPin(String(pin)) }); } catch { /* yükseltme başarısızsa eski davranış sürer */ }
    }
  } else {
    ok = await verifyHash(String(pin), c.pin);
  }
  if (ok) _clearPinFails(`child_${ns}`); else _recordPinFail(`child_${ns}`);
  return ok;
}

// ── Numap-kaynaklı roster kayıtları (FAZ A — birleşik roster temeli) ─────────
// Numap öğretmeninin tanıladığı çocuklar da AYNI roster'da yaşar: kayıt
// source:'numap' + numapOwnerId (öğretmen id) ile etiketlenir, ns=numap_<studentKey>
// AYNEN korunur (ilerleme verisi ns'e kilitli — asla değişmez). Ağır oturum
// payload'ı (madde yanıtları) roster listesini şişirmesin diye çocuk-başına ayrı
// anahtarda tutulur: galaksay_numap_session_<ns>. Bu yapı eski
// numap_children_cache_<userId> önbelleğinin yerini alır (çevrimdışı liste
// roster'dan gelir). KVKK: öğretmen çıkışında kayıtlar removeNumapChildren ile
// silinir; oyun ilerlemesi (ds_*_<ns>, IndexedDB) YERİNDE kalır — sonraki
// girişte upsert aynı ns'i kurunca kaldığı yerden devam eder.

const NUMAP_SESSION_KEY = (ns) => `galaksay_numap_session_${ns}`;

function readSessionPayload(ns) {
  try {
    const raw = localStorage.getItem(NUMAP_SESSION_KEY(ns));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Numap listesini roster'a UPSERT eder (o öğretmenin kayıtları için otoriter:
 * listede olmayan eski kayıtları budar — eski cache'in wholesale-değiştirme
 * semantiğiyle birebir). Yerel (source!=='numap') kayıtlara ve DİĞER öğretmenin
 * kayıtlarına DOKUNMAZ: kayıtlar (ns, numapOwnerId) çifti başına tutulur — aynı
 * çocuğu (deterministik studentKey → aynı ns) iki öğretmen de görüyorsa iki ayrı
 * kayıt yaşar; ns-paylaşımlı payload anahtarı ancak HİÇBİR kayıt kalmayınca silinir.
 * Yazım sırası: ÖNCE roster (writeAll), payload'lar ancak roster kalıcıysa —
 * kota düşmesinde ortada sahipsiz (roster'sız) PII payload'ı kalmaz.
 * @param {string} userId  Numap öğretmen id'si (zorunlu; yoksa no-op)
 * @param {Array}  items   distinctChildren çıktısı: {ns, studentKey, name, ageMonths,
 *                         grade, savedAt, sessionId, status, school, city, district,
 *                         gender, assessmentDate, birthDate, session}
 * @returns {boolean} roster kalıcı olarak yazıldıysa true — çağıran, eski cache'i
 *                    ancak true dönünce silmelidir.
 */
export function upsertNumapChildren(userId, items) {
  if (!userId || !Array.isArray(items)) return false;
  const list = readAll();
  const keep = new Set(items.map((i) => i.ns).filter(Boolean));
  const now = new Date().toISOString();

  // Bu öğretmenin listeden düşen eski numap kayıtlarını buda (payload'a henüz dokunma).
  const droppedNs = [];
  const pruned = list.filter((c) => {
    const mine = c.source === 'numap' && (c.numapOwnerId || null) === userId;
    if (mine && !keep.has(c.ns)) { droppedNs.push(c.ns); return false; }
    return true;
  });

  for (const it of items) {
    if (!it?.ns) continue;
    const rec = {
      ns: it.ns,
      source: 'numap',
      numapOwnerId: userId,
      numapStudentKey: it.studentKey || null,
      numapSessionId: it.sessionId || null,
      name: it.name || 'İsimsiz',
      ageMonths: it.ageMonths || 0,
      grade: it.grade || '',
      school: it.school || '',
      city: it.city || '',
      district: it.district || '',
      gender: it.gender || '',
      assessmentDate: it.assessmentDate || '',
      birthDate: it.birthDate || '',
      savedAt: it.savedAt || '',
      status: it.status || 'completed',
      updatedAt: now,
    };
    const i = pruned.findIndex(
      (c) => c.ns === it.ns && c.source === 'numap' && (c.numapOwnerId || null) === userId,
    );
    if (i >= 0) pruned[i] = { ...pruned[i], ...rec };
    else pruned.push({ ...rec, createdAt: now });
  }

  if (!writeAll(pruned)) return false; // roster yazılamadı → payload/temizlik YOK

  // Roster kalıcı — budanan çocukların payload'ı yalnız başka sahip kalmadıysa gider.
  const stillRef = (ns) => pruned.some((c) => c.source === 'numap' && c.ns === ns);
  for (const ns of droppedNs) {
    if (!stillRef(ns)) {
      try { localStorage.removeItem(NUMAP_SESSION_KEY(ns)); } catch { /* yok say */ }
    }
  }
  for (const it of items) {
    if (it?.ns && it.session) {
      try { localStorage.setItem(NUMAP_SESSION_KEY(it.ns), JSON.stringify(it.session)); } catch { /* depolama dolu → payload'sız devam (liste yine çalışır; seçim session=null'a toleranslı) */ }
    }
  }
  return true;
}

/**
 * Öğretmenin numap-kaynaklı çocukları — ChildSelect liste biçiminde (session
 * payload'ı iliştirilmiş; depolama payload'ı düşürmüşse session=null döner,
 * seçimde numapProfile nötr varsayılanlarla kurulur). savedAt'e göre yeni→eski.
 */
export function listNumapChildren(userId) {
  if (!userId) return [];
  return readAll()
    .filter((c) => c.source === 'numap' && (c.numapOwnerId || null) === userId)
    // studentKey/sessionId takma adları: çevrimdışı liste, çevrimiçi distinctChildren
    // çıktısıyla AYNI şekli taşır (Faz C eşleme + mükerrer-gizleme her iki yolda çalışır).
    .map((c) => ({
      ...c,
      studentKey: c.numapStudentKey || null,
      sessionId: c.numapSessionId || null,
      session: readSessionPayload(c.ns),
    }))
    .sort((a, b) => (b.savedAt || '').localeCompare(a.savedAt || ''));
}

/**
 * Numap-kaynaklı kayıtları sil (KVKK — öğretmen çıkışı). userId verilirse yalnız
 * o öğretmeninkiler; null/undefined → TÜM numap kayıtları (kimlik bilinmiyorsa
 * temiz bırakmak yeniden-çekmekten iyidir). Oyun ilerlemesi SİLİNMEZ.
 * Payload temizliği KALICI duruma göre yapılır: silme sonrası roster'da referansı
 * kalmayan TÜM galaksay_numap_session_* anahtarları süpürülür — kota yarışlarından
 * artakalan sahipsiz payload'lar da (orphan) böylece garantili gider.
 */
export function removeNumapChildren(userId) {
  const list = readAll();
  const rest = list.filter(
    (c) => !(c.source === 'numap' && (userId == null || (c.numapOwnerId || null) === userId)),
  );
  if (rest.length !== list.length) writeAll(rest);
  try {
    // Gerçek kalıcı durumdan oku (writeAll düştüyse yanlışlıkla referanslı payload silinmesin).
    const ref = new Set(readAll().filter((c) => c.source === 'numap').map((c) => c.ns));
    const toRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('galaksay_numap_session_') && !ref.has(k.slice('galaksay_numap_session_'.length))) {
        toRemove.push(k);
      }
    }
    toRemove.forEach((k) => localStorage.removeItem(k));
  } catch { /* depolama engelli */ }
}

// ── FAZ C: yerel çocuğa Numap taraması BAĞLAMA ──────────────────────────────
// Bağlama BİRLEŞTİRME değildir: yerel kaydın ns'i (local_N) AYNEN kalır; Numap
// ilişkisi kayda alan olarak iliştirilir (numapStudentKey/numapSessionId/
// numapSavedAt/numapLinkedAt). Oturum payload'ı aynı ns-anahtarlı depoda
// (galaksay_numap_session_<ns>) yaşar — öğretmen çıkışında KVKK süpürmesiyle
// gider (removeNumapChildren orphan taraması onu da kapsar; BİLİNÇLİ) ama bağ
// alanları ve türetilmiş müdahale planı kalır; sonraki başarılı Numap
// yenilemesinde refreshNumapLinks payload'ı geri yazar (kendini onarır).

/** Bağlı yerel çocuğun oturum payload'ını oku (yoksa null — seçim toleranslı). */
export function readNumapSessionPayload(ns) {
  return readSessionPayload(ns);
}

/**
 * Yerel çocuğa Numap taraması bağla. Bir studentKey aynı anda YALNIZ BİR yerel
 * çocuğa bağlanabilir (mükerrer kimlik önlenir). Numap-kaynaklı kayda bağlama
 * yapılamaz (onlar zaten taramanın kendisidir).
 * @param {string} ns    yerel çocuk ns'i (local_N)
 * @param {object} info  {studentKey, sessionId, savedAt, session}
 * @returns {{ok: boolean, error: string}}
 */
export function linkNumapToChild(ns, info) {
  if (!ns || !info?.studentKey) return { ok: false, error: 'Eksik bağlama bilgisi.' };
  const list = readAll();
  const i = list.findIndex((c) => c.ns === ns);
  if (i < 0) return { ok: false, error: 'Çocuk kaydı bulunamadı.' };
  if (list[i].source === 'numap') return { ok: false, error: 'Numap kaydına bağlama yapılmaz.' };
  const taken = list.find((c) => c.ns !== ns && c.source !== 'numap' && c.numapStudentKey === info.studentKey);
  if (taken) {
    // Çapraz-sahip durumda başka öğretmenin çocuk rumuzu SIZDIRILMAZ (KVKK).
    const sameOwner = (taken.ownerId || null) === (list[i].ownerId || null);
    return {
      ok: false,
      error: sameOwner
        ? `Bu tarama zaten "${taken.name}" profiline bağlı.`
        : 'Bu tarama bu cihazda başka bir profile bağlı.',
    };
  }
  list[i] = {
    ...list[i],
    numapStudentKey: info.studentKey,
    numapSessionId: info.sessionId || null,
    numapSavedAt: info.savedAt || '',
    numapLinkedAt: new Date().toISOString(),
  };
  if (!writeAll(list)) return { ok: false, error: 'Depolamaya yazılamadı.' };
  if (info.session) {
    try { localStorage.setItem(NUMAP_SESSION_KEY(ns), JSON.stringify(info.session)); } catch { /* payload'sız da çalışır */ }
  }
  return { ok: true, error: '' };
}

/** Bağı kaldır: bağ alanları + payload + türetilmiş müdahale planı silinir.
 *  Çocuğun OYUN ilerlemesi (ds_*_<ns>, IndexedDB) silinmez. */
export function unlinkNumapFromChild(ns) {
  const list = readAll();
  const i = list.findIndex((c) => c.ns === ns);
  if (i < 0) return false;
  const { numapStudentKey, numapSessionId, numapSavedAt, numapLinkedAt, ...rest } = list[i];
  list[i] = rest;
  if (!writeAll(list)) return false;
  try { localStorage.removeItem(NUMAP_SESSION_KEY(ns)); } catch { /* yok say */ }
  try { localStorage.removeItem(`numap_intervention_${ns}`); } catch { /* yok say */ }
  return true;
}

/**
 * Başarılı Numap yenilemesinde bağlı yerel çocukların payload'ını tazele/onar
 * (çıkış süpürmesi sonrası kendini iyileştirme). items = distinctChildren çıktısı.
 */
export function refreshNumapLinks(items) {
  if (!Array.isArray(items) || !items.length) return;
  const byKey = new Map(items.filter((x) => x?.studentKey).map((x) => [x.studentKey, x]));
  const list = readAll();
  let dirty = false;
  for (let i = 0; i < list.length; i++) {
    const c = list[i];
    if (c.source === 'numap' || !c.numapStudentKey) continue;
    const it = byKey.get(c.numapStudentKey);
    if (!it) continue; // tarama artık listede yok → bağ durur, payload tazelenmez
    if (c.numapSessionId !== (it.sessionId || null) || c.numapSavedAt !== (it.savedAt || '')) {
      list[i] = { ...c, numapSessionId: it.sessionId || null, numapSavedAt: it.savedAt || '' };
      dirty = true;
    }
    if (it.session) {
      try { localStorage.setItem(NUMAP_SESSION_KEY(c.ns), JSON.stringify(it.session)); } catch { /* yok say */ }
    }
  }
  if (dirty) writeAll(list);
}

// ── Yönetici (admin) PIN'i ──────────────────────────────────────────────────
// Yerel yönetim panelini (öğrenci ekle/çıkar, ayarlar) çocuklardan korur.
// İlk kullanımda yönetici belirler; sonra her girişte doğrulanır. PIN cihazda
// PBKDF2 ile HASH'lenir (utils/crypto) — düz metin saklanmaz.
const ADMIN_PIN_KEY = 'galaksay_admin_pin';

export function hasAdminPin() {
  try {
    return !!localStorage.getItem(ADMIN_PIN_KEY);
  } catch {
    return false;
  }
}

export async function setAdminPin(pin) {
  try {
    localStorage.setItem(ADMIN_PIN_KEY, await hashPin(String(pin || '').trim()));
    return true;
  } catch {
    return false;
  }
}

// ── PIN deneme kilidi (kaba kuvvet freni): 5 başarısız denemeden sonra artan bekleme ──
// 4 haneli PIN = 10.000 olasılık; konsoldan döngüyle dakikalar içinde kırılabiliyordu.
const LOCK_KEY = (id) => `galaksay_pin_attempts_${id}`;
const LOCK_MAX_FREE = 5;          // ücretsiz deneme
const LOCK_BASE_MS = 30 * 1000;   // 6. denemede 30 sn, sonra 2×, 4×… (tavan 8×)
function _readLock(id) {
  try { return JSON.parse(localStorage.getItem(LOCK_KEY(id)) || '{"n":0,"until":0}'); } catch { return { n: 0, until: 0 }; }
}
/** Kilit kalan süresi (ms); 0 = deneme serbest. */
export function getPinLockRemainingMs(id) {
  const s = _readLock(id);
  return s.until > Date.now() ? s.until - Date.now() : 0;
}
function _recordPinFail(id) {
  const s = _readLock(id); s.n += 1;
  if (s.n >= LOCK_MAX_FREE) s.until = Date.now() + LOCK_BASE_MS * Math.min(8, 2 ** (s.n - LOCK_MAX_FREE));
  try { localStorage.setItem(LOCK_KEY(id), JSON.stringify(s)); } catch { /* depolama yok */ }
}
function _clearPinFails(id) {
  try { localStorage.removeItem(LOCK_KEY(id)); } catch { /* yok say */ }
}

export async function verifyAdminPin(pin) {
  if (getPinLockRemainingMs('admin') > 0) return false;
  let ok = false;
  try {
    const s = localStorage.getItem(ADMIN_PIN_KEY);
    if (!s) return false;
    // Geriye uyumluluk: eski düz-metin PIN (önek yok) → düz karşılaştır.
    ok = !/^(pbkdf2|sha256|plain):/.test(s) ? String(pin) === s : await verifyHash(String(pin), s);
  } catch {
    ok = false;
  }
  if (ok) _clearPinFails('admin'); else _recordPinFail('admin');
  return ok;
}

export function clearAdminPin() {
  try {
    localStorage.removeItem(ADMIN_PIN_KEY);
  } catch {
    /* depolama engelli */
  }
}

// "Kaldığı yer" özeti — oyunun yazdığı `dokunsay-user-<ns>` kaydından okunur
// (window.storage = senkron localStorage sarmalayıcı). StudentPicker kartında
// "devam" ipucu göstermek için; oyun resume'u bundan bağımsız çalışır.
export function getResumeInfo(ns) {
  try {
    const raw = localStorage.getItem(`dokunsay-user-${ns}`);
    if (!raw) return null;
    const d = JSON.parse(raw);
    const s = d?.stats || {};
    return {
      lastPlayed: d?.lastPlayed || null, // { mode, level }
      totalGames: s.totalGames || 0,
      stars: s.starFragments || s.totalScore || 0,
      hasProgress: (s.totalGames || 0) > 0,
    };
  } catch {
    return null;
  }
}

// ── Yerel kullanıcılar (Numap'siz öğretmen/uzman hesapları) ──────────────────
// Yönetici (admin), Numap hesabı OLMAYAN öğretmen/uzmanları kullanıcı olarak
// tanımlar. Her kullanıcı kullanıcı-adı + şifre ile giriş yapar ve YALNIZ kendi
// eklediği öğrencileri görür (child.ownerId === user.id izolasyonu). Şifre,
// cihazda tek-yönlü hash'lenir (utils/crypto hashPin) → düz metin saklanmaz.
const USERS_KEY = 'galaksay_local_users';

function readUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function writeUsers(list) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(list));
    return true;
  } catch {
    return false;
  }
}

// Kararlı, çakışmasız id: `user_<artan>` (silinen kayıtla çakışmasın diye max+1).
function genUserId(existing) {
  const maxNum = existing.reduce((m, u) => {
    const mt = /^user_(\d+)$/.exec(u.id || '');
    return mt ? Math.max(m, +mt[1]) : m;
  }, 0);
  return `user_${maxNum + 1}`;
}

// Kullanıcı-adı normalleştirme: kenar boşluğu + küçük harf (tr) → eşsizlik/eşleşme.
function normUsername(u) {
  return String(u || '').trim().toLocaleLowerCase('tr');
}

/** Tüm yerel kullanıcılar — en son giren + ada göre sıralı. */
export function listUsers() {
  return readUsers().sort(
    (a, b) =>
      (b.lastSeenAt || '').localeCompare(a.lastSeenAt || '') ||
      (a.name || '').localeCompare(b.name || '', 'tr'),
  );
}

export function getUser(id) {
  return readUsers().find((u) => u.id === id) || null;
}

export function getUserByUsername(username) {
  const n = normUsername(username);
  return n ? readUsers().find((u) => u.username === n) || null : null;
}

export function userCount() {
  return readUsers().length;
}

/**
 * Yeni yerel kullanıcı oluştur (şifre hash'lenir).
 * @returns {Promise<{ user: object|null, error: string }>}
 */
export async function addUser({ username, name, password } = {}) {
  const n = normUsername(username);
  if (!n) return { user: null, error: 'Kullanıcı adı gerekli.' };
  if (String(password || '').length < 4) return { user: null, error: 'Şifre en az 4 karakter olmalı.' };
  const list = readUsers();
  if (list.some((u) => u.username === n)) return { user: null, error: 'Bu kullanıcı adı zaten kullanılıyor.' };
  const user = {
    id: genUserId(list),
    username: n,
    name: (name || '').trim() || n,
    passwordHash: await hashPin(String(password)),
    createdAt: new Date().toISOString(),
    lastSeenAt: '',
  };
  list.push(user);
  writeUsers(list);
  return { user: { id: user.id, username: user.username, name: user.name }, error: '' };
}

/**
 * Kullanıcıyı güncelle. password boş/verilmezse mevcut şifre korunur.
 * @returns {Promise<{ user: object|null, error: string }>}
 */
export async function updateUser(id, { username, name, password } = {}) {
  const list = readUsers();
  const i = list.findIndex((u) => u.id === id);
  if (i < 0) return { user: null, error: 'Kullanıcı bulunamadı.' };
  const patch = { ...list[i] };
  if (username !== undefined) {
    const n = normUsername(username);
    if (!n) return { user: null, error: 'Kullanıcı adı gerekli.' };
    if (list.some((u) => u.username === n && u.id !== id)) return { user: null, error: 'Bu kullanıcı adı zaten kullanılıyor.' };
    patch.username = n;
  }
  if (name !== undefined) patch.name = (name || '').trim() || patch.name;
  if (password) {
    if (String(password).length < 4) return { user: null, error: 'Şifre en az 4 karakter olmalı.' };
    patch.passwordHash = await hashPin(String(password));
  }
  list[i] = patch;
  writeUsers(list);
  return { user: { id: patch.id, username: patch.username, name: patch.name }, error: '' };
}

/** Kullanıcıyı sil. Öğrencileri cihazda KALIR (yalnız yönetici görebilir). */
export function removeUser(id) {
  writeUsers(readUsers().filter((u) => u.id !== id));
}

/** Son giriş zamanını güncelle (kullanıcı sıralaması için). */
export function touchUser(id) {
  const list = readUsers();
  const i = list.findIndex((u) => u.id === id);
  if (i < 0) return null;
  list[i] = { ...list[i], lastSeenAt: new Date().toISOString() };
  writeUsers(list);
  return list[i];
}

/**
 * Kullanıcı-adı + şifre doğrula. Eşleşirse sade kullanıcı ({id,username,name})
 * döner (passwordHash sızdırılmaz) + lastSeenAt güncellenir; aksi halde null.
 * @returns {Promise<{id:string,username:string,name:string}|null>}
 */
export async function verifyUser(username, password) {
  const user = getUserByUsername(username);
  if (!user) return null;
  const ok = await verifyHash(String(password || ''), user.passwordHash);
  if (!ok) return null;
  touchUser(user.id);
  return { id: user.id, username: user.username, name: user.name };
}
