import { describe, expect, it, beforeEach, vi } from 'vitest';

// Indexed DB & analytics database modülü mockla — gerçek DB testi gerekmiyor
vi.mock('../analytics/database.js', () => ({
  STORES: { PROFILES: 'profiles', SESSIONS: 'sessions' },
  openDB: vi.fn().mockResolvedValue({}),
  getAllFromStore: vi.fn().mockResolvedValue([]),
}));

import { buildExportPayload, eraseAllData } from './dataExport.js';

describe('dataExport', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('payload schema doğru', async () => {
    localStorage.setItem('galaksay_test', JSON.stringify({ a: 1 }));
    const p = await buildExportPayload();
    expect(p.schema).toBe('galaksay-export-v1');
    expect(p.exportedAt).toMatch(/\d{4}-\d{2}-\d{2}/);
    expect(p.localStorage.galaksay_test).toEqual({ a: 1 });
    expect(typeof p.indexedDB).toBe('object');
  });

  it('galaksay_ ön ekli olmayan key dahil edilmez', async () => {
    localStorage.setItem('other_app', 'should-not-leak');
    localStorage.setItem('galaksay_kept', 'kept');
    const p = await buildExportPayload();
    expect(p.localStorage.other_app).toBeUndefined();
    expect(p.localStorage.galaksay_kept).toBe('kept');
  });

  it('eraseAllData galaksay_ anahtarlarını siler', async () => {
    localStorage.setItem('galaksay_a', 'x');
    localStorage.setItem('galaksay_b', 'y');
    localStorage.setItem('other_keep', 'z');
    const r = await eraseAllData();
    expect(r.removedKeys).toContain('galaksay_a');
    expect(r.removedKeys).toContain('galaksay_b');
    expect(localStorage.getItem('galaksay_a')).toBeNull();
    expect(localStorage.getItem('other_keep')).toBe('z');
  });
});
