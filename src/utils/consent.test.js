import { describe, expect, it, beforeEach } from 'vitest';
import { CONSENT_KEY, loadConsent, saveConsent } from './consent.js';

describe('consent helper', () => {
  beforeEach(() => { localStorage.clear(); });

  it('hiç kayıt yokken null döner', () => {
    expect(loadConsent()).toBeNull();
  });

  it('saveConsent → loadConsent round-trip', () => {
    saveConsent({ dataProcessing: true, analytics: false, decision: 'accept' });
    const c = loadConsent();
    expect(c.decision).toBe('accept');
    expect(c.dataProcessing).toBe(true);
    expect(c.analytics).toBe(false);
    expect(c.grantedAt).toMatch(/\d{4}-\d{2}-\d{2}T/);
    expect(c.version).toBe(1);
  });

  it('bozuk JSON → null (graceful)', () => {
    localStorage.setItem(CONSENT_KEY, '{not json');
    expect(loadConsent()).toBeNull();
  });

  it('reddetme kararı saklanır', () => {
    saveConsent({ dataProcessing: false, analytics: false, decision: 'decline' });
    expect(loadConsent().decision).toBe('decline');
  });

  it('CONSENT_KEY namespace iyi tanımlı', () => {
    expect(CONSENT_KEY).toMatch(/^galaksay_/);
  });
});
