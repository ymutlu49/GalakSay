import { describe, expect, it, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useAutoSave, getResumeInfo } from './useAutoSave.js';

describe('useAutoSave', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('saveProgress → şifreli kaydeder; loadProgress geri döner', async () => {
    const { result } = renderHook(() => useAutoSave());
    await act(async () => {
      result.current.saveProgress({ category: 'sayma', mode: 'counting', currentQuestion: 3, totalQuestions: 10 });
      // 100ms debounce + crypto async — bekleyelim
      await new Promise(r => setTimeout(r, 250));
    });

    const raw = localStorage.getItem('galaksay_session_progress');
    expect(raw).toBeTruthy();
    expect(raw.startsWith('enc2:')).toBe(true); // v2 cihaz-sırlı şifreleme

    const loaded = await result.current.loadProgress();
    expect(loaded.category).toBe('sayma');
    expect(loaded.currentQuestion).toBe(3);
    expect(loaded.timestamp).toBeGreaterThan(0);
  });

  it('clearProgress siler', async () => {
    const { result } = renderHook(() => useAutoSave());
    await act(async () => {
      result.current.saveProgress({ category: 'a' });
      await new Promise(r => setTimeout(r, 250));
    });
    expect(localStorage.getItem('galaksay_session_progress')).toBeTruthy();
    act(() => result.current.clearProgress());
    expect(localStorage.getItem('galaksay_session_progress')).toBeNull();
  });

  it('hasResumableSession async true/false', async () => {
    const { result } = renderHook(() => useAutoSave());
    expect(await result.current.hasResumableSession()).toBe(false);
    await act(async () => {
      result.current.saveProgress({ category: 'a' });
      await new Promise(r => setTimeout(r, 250));
    });
    expect(await result.current.hasResumableSession()).toBe(true);
  });

  it('getResumeInfo özet bilgi döner', async () => {
    const { result } = renderHook(() => useAutoSave());
    await act(async () => {
      result.current.saveProgress({ category: 'subitizing', mode: 'fivesFrame', currentQuestion: 5, totalQuestions: 10 });
      await new Promise(r => setTimeout(r, 250));
    });
    const info = await getResumeInfo();
    expect(info.category).toBe('subitizing');
    expect(info.mode).toBe('fivesFrame');
    expect(info.currentQuestion).toBe(5);
  });
});
