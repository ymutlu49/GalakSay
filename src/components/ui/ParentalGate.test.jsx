import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { ParentalGate } from './ParentalGate.jsx';

describe('ParentalGate', () => {
  beforeEach(() => {
    cleanup();
    localStorage.clear();
  });

  it('açıkken matematik sorusu gösterir', () => {
    render(<ParentalGate open onSuccess={() => {}} onClose={() => {}} />);
    // Soru "X op Y = ?" formatında render edilir
    expect(screen.getByText(/=\s*\?/)).toBeInTheDocument();
    expect(screen.getByLabelText('Cevap')).toBeInTheDocument();
  });

  it('yanlış cevap → 3 deneme sonrası kilitlenir', () => {
    const onSuccess = vi.fn();
    render(<ParentalGate open onSuccess={onSuccess} onClose={() => {}} />);
    const input = screen.getByLabelText('Cevap');
    const submit = screen.getByText('Doğrula');

    for (let i = 0; i < 3; i++) {
      fireEvent.change(input, { target: { value: '999999' } });
      fireEvent.click(submit);
    }

    expect(onSuccess).not.toHaveBeenCalled();
    expect(screen.getByText(/3 deneme aşıldı/)).toBeInTheDocument();
  });

  it('kapalıyken render olmaz', () => {
    render(<ParentalGate open={false} onSuccess={() => {}} onClose={() => {}} />);
    expect(screen.queryByLabelText('Cevap')).toBeNull();
  });
});
