// CaptainCreate — çocuğun kendi başına kaptan oluşturma sihirbazı.
// Kapsam: (1) üç adım sırayla; ileri düğmesi seçim olmadan kapalı, (2) boş ad → "Kaptan",
// (3) bitişte yerel profil açılır ve onDone doğru kayıtla çağrılır, (4) geri düğmesi
// ilk adımda onCancel, sonraki adımlarda bir önceki adım, (5) Kürtçe sözlük.

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import CaptainCreate from './CaptainCreate.jsx';
import { listChildren } from '../services/localProfiles.js';

beforeEach(() => {
  cleanup();
  localStorage.clear();
});

describe('CaptainCreate', () => {
  it('üç adımı sırayla geçer ve yerel profili açar', () => {
    const onDone = vi.fn();
    render(<CaptainCreate onDone={onDone} onCancel={() => {}} />);

    const next = screen.getByTestId('create-next');
    expect(next).toBeDisabled(); // avatar seçilmeden ilerlenemez
    fireEvent.click(screen.getByTestId('avatar-🦊'));
    expect(next).not.toBeDisabled();
    fireEvent.click(next);

    // Adım 2: ad (isteğe bağlı)
    const input = screen.getByTestId('create-name');
    fireEvent.change(input, { target: { value: '  Ada  ' } });
    fireEvent.click(screen.getByTestId('create-next'));

    // Adım 3: yaş grubu
    expect(screen.getByTestId('create-next')).toBeDisabled();
    fireEvent.click(screen.getByTestId('age-okuloncesi'));
    fireEvent.click(screen.getByTestId('create-next'));

    expect(onDone).toHaveBeenCalledTimes(1);
    const rec = onDone.mock.calls[0][0];
    expect(rec).toMatchObject({ name: 'Ada', avatar: '🦊', ageGroup: 'okuloncesi' });
    expect(rec.ns).toMatch(/^local_\d+$/);
    expect(rec.pin).toBe(''); // çocuk kaydında PIN sorulmaz
    expect(listChildren().map((c) => c.ns)).toEqual([rec.ns]);
  });

  it('boş ad "Kaptan" olur; Enter tuşu ilerletir', () => {
    const onDone = vi.fn();
    render(<CaptainCreate onDone={onDone} onCancel={() => {}} />);
    fireEvent.click(screen.getByTestId('avatar-🚀'));
    fireEvent.click(screen.getByTestId('create-next'));
    fireEvent.keyDown(screen.getByTestId('create-name'), { key: 'Enter' });
    fireEvent.click(screen.getByTestId('age-sinif2'));
    fireEvent.click(screen.getByTestId('create-next'));
    expect(onDone.mock.calls[0][0]).toMatchObject({ name: 'Kaptan', ageGroup: 'sinif2' });
  });

  it('geri: ilk adımda onCancel, sonra bir önceki adım', () => {
    const onCancel = vi.fn();
    render(<CaptainCreate onDone={() => {}} onCancel={onCancel} />);
    fireEvent.click(screen.getByTestId('avatar-⭐'));
    fireEvent.click(screen.getByTestId('create-next'));
    expect(screen.getByTestId('create-name')).toBeTruthy();
    fireEvent.click(screen.getByTestId('create-back'));
    expect(screen.queryByTestId('create-name')).toBeNull();
    expect(onCancel).not.toHaveBeenCalled();
    fireEvent.click(screen.getByTestId('create-back'));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(listChildren()).toHaveLength(0); // vazgeçince kayıt açılmaz
  });

  it('Kürtçe (ds_lang=ku) sözlüğü kullanır', () => {
    localStorage.setItem('ds_lang', 'ku');
    render(<CaptainCreate onDone={() => {}} onCancel={() => {}} />);
    expect(screen.getByText('Kaptanê xwe hilbijêre')).toBeTruthy();
    expect(screen.getByText('← Vegere')).toBeTruthy();
  });
});
