// KVKK silme yetkisi testi: yükle → varlığını doğrula → sil → silindiğini doğrula
import { eraseAllData, eraseNumapData } from './src/utils/dataExport.js';

// localStorage simülasyonu (Node ortamı için)
const _store = new Map();
globalThis.localStorage = {
  get length() { return _store.size; },
  key(i) { return [..._store.keys()][i]; },
  getItem(k) { return _store.has(k) ? _store.get(k) : null; },
  setItem(k, v) { _store.set(k, String(v)); },
  removeItem(k) { _store.delete(k); },
  clear() { _store.clear(); },
};
globalThis.sessionStorage = { ..._store, length: 0, key: () => null, getItem: () => null, setItem: () => {}, removeItem: () => {}, clear: () => {} };
// indexedDB stub: success callback'i hemen tetiklesin
globalThis.indexedDB = {
  deleteDatabase: () => {
    const req = { onsuccess: null, onerror: null, onblocked: null };
    setTimeout(() => req.onsuccess && req.onsuccess({}), 0);
    return req;
  },
  open: () => {
    const req = { onsuccess: null, onerror: null, onupgradeneeded: null, result: { objectStoreNames: { contains: () => false }, transaction: () => ({ objectStore: () => ({ getAll: () => ({ onsuccess: null, onerror: null }) }) }) } };
    setTimeout(() => req.onsuccess && req.onsuccess({ target: req }), 0);
    return req;
  },
};

const dump = () => [...new Map([..._store.entries()].sort())].map(([k]) => '  • ' + k);

console.log('═══════════════════════════════════════════════════════════════');
console.log('   KVKK Silme Yetkisi Testi');
console.log('═══════════════════════════════════════════════════════════════\n');

// 1) Veri yükle: NuMap + GalakSay verileri karışık
console.log('📥 [1/4] Karışık veri yükleniyor...');
localStorage.setItem('numap_intervention_AHMET', JSON.stringify({ child: { code: 'AHMET' }, source: 'numap' }));
localStorage.setItem('numap_progress_AHMET', JSON.stringify({ sessions: [{ acc: 60 }] }));
localStorage.setItem('numap_intervention_ZEYNEP', JSON.stringify({ child: { code: 'ZEYNEP' }, source: 'numap' }));
localStorage.setItem('galaksay_user_profile', JSON.stringify({ name: 'test' }));
localStorage.setItem('galaksay_settings', JSON.stringify({ theme: 'dark' }));
localStorage.setItem('unrelated_app_key', 'should-not-touch');

console.log('   localStorage içeriği:');
dump().forEach(l => console.log(l));

// 2) Test A — Tek çocuğun NuMap verisini sil
console.log('\n🗑 [2/4] eraseNumapData("AHMET") çağrılıyor...');
const removedA = eraseNumapData('AHMET');
console.log('   Silinen:', removedA);
console.log('   Kalan localStorage:');
dump().forEach(l => console.log(l));

const ahmetGone = !localStorage.getItem('numap_intervention_AHMET') && !localStorage.getItem('numap_progress_AHMET');
const zeynepStays = !!localStorage.getItem('numap_intervention_ZEYNEP');
const galaksayStays = !!localStorage.getItem('galaksay_user_profile');
console.log('   ✓ AHMET silindi mi?', ahmetGone, '(beklenen true)');
console.log('   ✓ ZEYNEP duruyor mu?', zeynepStays, '(beklenen true — başka çocuk dokunulmadı)');
console.log('   ✓ GalakSay verisi duruyor mu?', galaksayStays, '(beklenen true — sadece numap_*)');

// 3) Test B — Tüm NuMap verisini sil
console.log('\n🗑 [3/4] eraseNumapData() (kod yok → hepsi) çağrılıyor...');
const removedB = eraseNumapData();
console.log('   Silinen:', removedB);
const allNumapGone = ![...new Array(localStorage.length)].some((_, i) => localStorage.key(i)?.startsWith('numap_'));
console.log('   ✓ Hiç numap_* kaldı mı?', !allNumapGone, '(beklenen false)');

// 4) Test C — eraseAllData() artık numap_* kapsamında mı?
console.log('\n💣 [4/4] Karışık veri yeniden yüklenip eraseAllData() çağrılıyor...');
localStorage.setItem('numap_intervention_AHMET', '{}');
localStorage.setItem('numap_progress_ZEYNEP', '{}');
localStorage.setItem('galaksay_settings', '{}');
localStorage.setItem('unrelated_app_key', 'should-not-touch');

const result = await eraseAllData();
console.log('   Silinen anahtarlar:', result.removedKeys);
const numapStillThere = [...new Array(localStorage.length)].some((_, i) => localStorage.key(i)?.startsWith('numap_'));
const galaksayStillThere = [...new Array(localStorage.length)].some((_, i) => localStorage.key(i)?.startsWith('galaksay_'));
const unrelatedStays = !!localStorage.getItem('unrelated_app_key');

console.log('   ✓ numap_* tamamen silindi mi?', !numapStillThere, '(beklenen true — KVKK düzeltmesi)');
console.log('   ✓ galaksay_* silindi mi?', !galaksayStillThere, '(beklenen true)');
console.log('   ✓ İlgisiz anahtar korundu mu?', unrelatedStays, '(beklenen true — sadece bizim prefix\'ler silinir)');

const allPassed = ahmetGone && zeynepStays && galaksayStays && !numapStillThere && !galaksayStillThere && unrelatedStays;
console.log('\n' + (allPassed
  ? '🎉 TÜM SİLME YETKİSİ TESTLERİ GEÇTİ — KVKK md.7 (silme hakkı) artık tam destekli.'
  : '⚠️  Bazı testler başarısız — düzeltme gerekli.'));
