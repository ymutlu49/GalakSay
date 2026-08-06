// GalakSay — Akademik veri export (CSV/Excel uyumlu, kütüphanesiz).
//
// Oyun verisini (IndexedDB) araştırma analizine (SPSS/R/Python/Excel) hazır
// LONG-FORMAT CSV tablolarına döker ve store-only ZIP olarak indirir:
//   events.csv        — madde-düzey (her question_answered bir satır: doğruluk,
//                       yanıt süresi, ipucu, temsil, hata türü, operandlar)
//   sessions.csv      — oturum özetleri
//   daily_summary.csv — günlük kategori performansı (boylamsal)
//   child_meta.csv    — demografik + Numap baseline (Faz 0)
//
// Tek çocuk veya tüm roster (childKey kolonuyla ayrışır). Pseudonim seçeneği
// (sha256 childKey → 8 hex; doğrudan kimlik alanları çıkarılır) akademik anonim
// veri için. KVKK md.11 (taşınabilirlik) çerçevesinde — `dataExport.js` ile aynı
// indirme mekanizması, farklı (tablosal) biçim. Kütüphane eklenmez.

import { getAllFromStore } from '../analytics/database.js';

// ── CSV (RFC-4180) ──────────────────────────────────────────────────────────
function csvCell(v) {
  if (v == null) return '';
  if (typeof v === 'object') v = JSON.stringify(v);
  let s = String(v);
  // CSV formül enjeksiyonu önleme: =,+,-,@,TAB,CR ile başlayan hücreyi tek tırnakla nötrle
  // (Excel/Sheets bunları formül sanıp çalıştırabilir → veri sızıntısı/komut).
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\n\r;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
/** headers: string[]; rows: Record<string,any>[] → BOM'lu CRLF CSV (Excel TR uyumlu). */
function toCsv(headers, rows) {
  const head = headers.map(csvCell).join(',');
  const body = rows.map((r) => headers.map((h) => csvCell(r[h])).join(',')).join('\r\n');
  return `﻿${head}\r\n${body}${rows.length ? '\r\n' : ''}`;
}

// ── Pseudonimleştirme ───────────────────────────────────────────────────────
async function pseudoId(childKey) {
  try {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(childKey || ''));
    return [...new Uint8Array(buf)].slice(0, 4).map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch {
    // crypto.subtle yoksa (çok eski tarayıcı) kararlı basit hash'e düş.
    let h = 0;
    for (let i = 0; i < (childKey || '').length; i++) h = (h * 31 + childKey.charCodeAt(i)) >>> 0;
    return h.toString(16).padStart(8, '0');
  }
}

// ── Store-only (sıkıştırmasız) ZIP — kütüphanesiz ──────────────────────────
function crc32(bytes) {
  let crc = ~0;
  for (let i = 0; i < bytes.length; i++) {
    crc ^= bytes[i];
    for (let j = 0; j < 8; j++) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return ~crc >>> 0;
}
/** files: [{name, data:Uint8Array}] → application/zip Blob (method 0 = store). */
function zipStore(files) {
  const enc = new TextEncoder();
  const chunks = [];
  const central = [];
  let offset = 0;
  for (const f of files) {
    const name = enc.encode(f.name);
    const crc = crc32(f.data);
    const size = f.data.length;
    const lfh = new DataView(new ArrayBuffer(30));
    lfh.setUint32(0, 0x04034b50, true);
    lfh.setUint16(4, 20, true);
    lfh.setUint16(8, 0, true); // store
    lfh.setUint32(14, crc, true);
    lfh.setUint32(18, size, true);
    lfh.setUint32(22, size, true);
    lfh.setUint16(26, name.length, true);
    const lfhB = new Uint8Array(lfh.buffer);
    chunks.push(lfhB, name, f.data);
    const cdr = new DataView(new ArrayBuffer(46));
    cdr.setUint32(0, 0x02014b50, true);
    cdr.setUint16(4, 20, true);
    cdr.setUint16(6, 20, true);
    cdr.setUint16(10, 0, true); // store
    cdr.setUint32(16, crc, true);
    cdr.setUint32(20, size, true);
    cdr.setUint32(24, size, true);
    cdr.setUint16(28, name.length, true);
    cdr.setUint32(42, offset, true);
    central.push({ rec: new Uint8Array(cdr.buffer), name });
    offset += lfhB.length + name.length + size;
  }
  const centralStart = offset;
  let centralSize = 0;
  for (const c of central) {
    chunks.push(c.rec, c.name);
    centralSize += c.rec.length + c.name.length;
  }
  const eocd = new DataView(new ArrayBuffer(22));
  eocd.setUint32(0, 0x06054b50, true);
  eocd.setUint16(8, central.length, true);
  eocd.setUint16(10, central.length, true);
  eocd.setUint32(12, centralSize, true);
  eocd.setUint32(16, centralStart, true);
  chunks.push(new Uint8Array(eocd.buffer));
  return new Blob(chunks, { type: 'application/zip' });
}

function download(filename, blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function isoTs(t) {
  if (!t) return '';
  try {
    return new Date(t).toISOString();
  } catch {
    return '';
  }
}

/**
 * Akademik CSV paketini (ZIP) üretir ve indirir.
 * @param {{childId?:string|null, anonymous?:boolean}} opts
 *   childId verilirse yalnız o çocuk; yoksa cihazdaki tüm çocuklar (toplu).
 *   anonymous=true → ham childKey + ad + doğum tarihi çıkarılır, pseudoId kalır.
 * @returns {Promise<{events:number, sessions:number, daily:number, children:number}>}
 */
export async function exportAcademicCSV({ childId = null, childIds = null, anonymous = false } = {}) {
  const [events, sessions, daily, profiles] = await Promise.all([
    getAllFromStore('game_events'),
    getAllFromStore('game_sessions'),
    getAllFromStore('daily_performance_summary'),
    getAllFromStore('child_profiles'),
  ]);

  // childIds (roster kapsamı) verilirse YALNIZ o çocuklar paketlenir — cihazdaki tüm
  // child_profiles'ı dökmek paylaşılan cihazda başka kullanıcının öğrencilerini
  // sızdırıyordu (2026-08-05). childId (tek çocuk) eski davranışıyla korunur.
  const idSet = Array.isArray(childIds) ? new Set(childIds) : null;
  const keep = (cid) => (childId ? cid === childId : idSet ? idSet.has(cid) : true);
  const fEvents = events.filter((e) => keep(e.childId) && e.eventType === 'question_answered');
  const fSessions = sessions.filter((s) => keep(s.childId));
  const fDaily = daily.filter((d) => keep(d.childId));
  const fProfiles = profiles.filter((p) => keep(p.childId));

  // pseudoId haritası (tüm geçen childId'ler için).
  const ids = [...new Set([
    ...fProfiles.map((p) => p.childId),
    ...fEvents.map((e) => e.childId),
    ...fSessions.map((s) => s.childId),
  ].filter(Boolean))];
  const pseudo = {};
  for (const id of ids) pseudo[id] = await pseudoId(id);
  const key = (cid) => (anonymous ? '' : cid || '');

  // events.csv — madde-düzey
  const evHeaders = ['childKey', 'pseudoId', 'sessionId', 'timestamp', 'category', 'eventType',
    'isCorrect', 'responseTime_ms', 'hintLevel', 'representation', 'errorType', 'errorSeverity',
    'ltLevel', 'difficulty', 'num1', 'num2', 'targetAnswer', 'givenAnswer'];
  const evRows = fEvents.map((e) => {
    const d = e.data || {};
    const q = d.questionContent || {};
    return {
      childKey: key(e.childId), pseudoId: pseudo[e.childId] || '',
      sessionId: e.sessionId, timestamp: isoTs(e.timestamp), category: e.category, eventType: e.eventType,
      isCorrect: d.isCorrect ? 1 : 0, responseTime_ms: d.responseTime_ms, hintLevel: d.hintLevelUsed,
      representation: d.representationUsed, errorType: d.errorType, errorSeverity: d.errorSeverity,
      ltLevel: e.ltLevel, difficulty: e.difficulty, num1: q.num1, num2: q.num2,
      targetAnswer: d.targetAnswer, givenAnswer: d.givenAnswer,
    };
  });

  // sessions.csv
  const sHeaders = ['childKey', 'pseudoId', 'sessionId', 'startTime', 'endTime', 'durationMs',
    'questionsAttempted', 'questionsCorrect', 'accuracy', 'categoriesVisited', 'deviceType', 'appVersion'];
  const sRows = fSessions.map((s) => ({
    childKey: key(s.childId), pseudoId: pseudo[s.childId] || '',
    sessionId: s.sessionId, startTime: isoTs(s.startTime), endTime: isoTs(s.endTime),
    durationMs: s.durationMs, questionsAttempted: s.questionsAttempted, questionsCorrect: s.questionsCorrect,
    accuracy: s.questionsAttempted > 0 ? +(s.questionsCorrect / s.questionsAttempted).toFixed(4) : '',
    categoriesVisited: s.categoriesVisited, deviceType: s.deviceType, appVersion: s.appVersion,
  }));

  // daily_summary.csv
  const dHeaders = ['childKey', 'pseudoId', 'date', 'category', 'questionsAttempted', 'questionsCorrect',
    'accuracy', 'avgResponseTimeMs', 'avgHintLevel', 'hintDependencyRate', 'concreteSupportRate',
    'ltLevel', 'sessionCount'];
  const dRows = fDaily.map((x) => ({
    childKey: key(x.childId), pseudoId: pseudo[x.childId] || '',
    date: x.date, category: x.category, questionsAttempted: x.questionsAttempted, questionsCorrect: x.questionsCorrect,
    accuracy: x.accuracy, avgResponseTimeMs: x.avgResponseTimeMs, avgHintLevel: x.avgHintLevel,
    hintDependencyRate: x.hintDependencyRate, concreteSupportRate: x.concreteSupportRate,
    ltLevel: x.ltLevel, sessionCount: x.sessionCount,
  }));

  // child_meta.csv — demografik + baseline (anonimde ad/doğum tarihi çıkar; demografik değişkenler kalır)
  // FAZ B: 'source' kolonu — karışık rosterda Numap-tanılı (baseline'lı) çocuklar ile
  // elle eklenen yerel profiller araştırmacı için ayrışsın (ns önekinden türetilir).
  const cHeaders = ['childKey', 'pseudoId', 'source', 'name', 'birthDate', 'gradeLevel', 'gender', 'school',
    'city', 'district', 'ageMonths', 'nuMapRiskLevel', 'nuMapAssessmentDate'];
  const cRows = fProfiles.map((p) => ({
    childKey: key(p.childId), pseudoId: pseudo[p.childId] || '',
    source: (p.childId || '').startsWith('numap_') ? 'numap' : 'local',
    name: anonymous ? '' : p.name, birthDate: anonymous ? '' : p.birthDate,
    gradeLevel: p.gradeLevel, gender: p.gender, school: p.school, city: p.city, district: p.district,
    ageMonths: p.ageMonths, nuMapRiskLevel: p.nuMapRiskLevel, nuMapAssessmentDate: p.nuMapAssessmentDate,
  }));

  const enc = new TextEncoder();
  const files = [
    { name: 'events.csv', data: enc.encode(toCsv(evHeaders, evRows)) },
    { name: 'sessions.csv', data: enc.encode(toCsv(sHeaders, sRows)) },
    { name: 'daily_summary.csv', data: enc.encode(toCsv(dHeaders, dRows)) },
    { name: 'child_meta.csv', data: enc.encode(toCsv(cHeaders, cRows)) },
    { name: 'README.txt', data: enc.encode(readme(anonymous, childId)) },
  ];
  const stamp = new Date().toISOString().slice(0, 10);
  const scope = childId ? 'cocuk' : 'sinif';
  download(`galaksay-akademik-veri-${scope}-${stamp}.zip`, zipStore(files));

  return { events: evRows.length, sessions: sRows.length, daily: dRows.length, children: cRows.length };
}

function readme(anonymous, childId) {
  return [
    'GalakSay — Akademik Veri Paketi',
    `Üretim: ${new Date().toISOString()}`,
    `Kapsam: ${childId ? 'tek çocuk' : 'tüm çocuklar (sınıf)'}`,
    `Anonimleştirme: ${anonymous ? 'AÇIK (ad/doğum tarihi/ham anahtar çıkarıldı; pseudoId ile eşleştirin)' : 'kapalı'}`,
    '',
    'Dosyalar (long-format, UTF-8 BOM, virgül ayraçlı — Excel/SPSS/R/pandas uyumlu):',
    '  events.csv        Her satır bir cevaplanan madde (madde-düzey analiz birimi).',
    '  sessions.csv      Her satır bir oyun oturumu.',
    '  daily_summary.csv Her satır bir çocuk×gün×kategori (boylamsal).',
    '  child_meta.csv    Her satır bir çocuk (demografik + Numap baseline risk).',
    "                    'source' kolonu: numap = tarama baseline'lı; local = elle eklenen",
    '                    profil (baseline alanları boş gelir — analizde ayırınız).',
    '',
    'Anahtar: pseudoId tüm dosyalarda çocuğu eşleştirir (anonim modda ham kimlik yok).',
    'Bu veri yalnız bu cihazda oynanan oturumları içerir (merkezi havuz değil).',
  ].join('\n');
}

export default { exportAcademicCSV };
