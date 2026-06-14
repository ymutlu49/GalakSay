import { describe, expect, it, beforeEach } from 'vitest';
import { encryptString, decryptString, encryptJSON, decryptJSON, hashPin, verifyPin, _resetKeyCache } from './crypto.js';

describe('crypto', () => {
  beforeEach(() => {
    localStorage.clear();
    _resetKeyCache();
  });

  it('encryptString → decryptString round-trip', async () => {
    const enc = await encryptString('hassas-veri');
    expect(enc.startsWith('enc2:')).toBe(true);
    const dec = await decryptString(enc);
    expect(dec).toBe('hassas-veri');
  });

  it('encryptJSON → decryptJSON round-trip preserves shape', async () => {
    const profile = { name: 'Ali', age: 7, traits: ['focused'] };
    const blob = await encryptJSON(profile);
    const back = await decryptJSON(blob);
    expect(back).toEqual(profile);
  });

  it('düz metin değer geri uyumlu çözülür', async () => {
    const dec = await decryptString('düz-metin');
    expect(dec).toBe('düz-metin');
  });

  it('PIN hash + verify çalışır', async () => {
    const h = await hashPin('1234');
    expect(await verifyPin('1234', h)).toBe(true);
    expect(await verifyPin('0000', h)).toBe(false);
  });

  it('eski plain: PIN ile geri uyumluluk', async () => {
    expect(await verifyPin('1234', 'plain:1234')).toBe(true);
    expect(await verifyPin('9999', 'plain:1234')).toBe(false);
  });
});
