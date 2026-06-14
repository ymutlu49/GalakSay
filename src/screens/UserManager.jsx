// GalakSay — Yerel kullanıcı yönetimi (yalnız yönetici görür).
//
// Yönetici, Numap hesabı OLMAYAN öğretmen/uzmanları kullanıcı olarak tanımlar.
// Her kullanıcı kendi kullanıcı-adı + şifresiyle "Yerel Hesap" sekmesinden girer
// ve YALNIZ kendi eklediği öğrencileri görür (ownerId izolasyonu). Bu ekran
// kullanıcıları listeler + ekle/düzenle/sil sağlar (UserForm'a delege).

import React, { useState, useCallback } from 'react';
import { SpaceBackground } from '../design-system/components/SpaceBackground.jsx';
import { Button } from '../design-system/components/Button.jsx';
import { Card } from '../design-system/components/Card.jsx';
import { EmptyState } from '../design-system/components/EmptyState.jsx';
import { colors } from '../design-system/colors.js';
import { typography } from '../design-system/typography.js';
import { layout } from '../design-system/spacing.js';
import { listUsers, removeUser, listChildren } from '../services/localProfiles.js';
import UserForm from './UserForm.jsx';

const F = typography.fontFamily.display;

function dateLabel(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return '';
  }
}

export default function UserManager({ onBack }) {
  const [users, setUsers] = useState(() => listUsers());
  // form: undefined = liste; null = yeni kullanıcı; obj = düzenlenen kullanıcı
  const [form, setForm] = useState(undefined);

  const refresh = useCallback(() => setUsers(listUsers()), []);
  const onFormSave = useCallback(() => { refresh(); setForm(undefined); }, [refresh]);

  const handleDelete = useCallback((u) => {
    const n = listChildren(u.id).length;
    const msg = n > 0
      ? `${u.name} kullanıcısını silmek istediğine emin misin?\n\nBu kullanıcının ${n} öğrencisi cihazda kalır (yalnız yönetici görebilir).`
      : `${u.name} kullanıcısını silmek istediğine emin misin?`;
    if (!window.confirm(msg)) return;
    removeUser(u.id);
    refresh();
  }, [refresh]);

  if (form !== undefined) {
    return <UserForm user={form} onSave={onFormSave} onCancel={() => setForm(undefined)} />;
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: colors.gradient.background, padding: '24px 16px', boxSizing: 'border-box', overflowY: 'auto' }}>
      <SpaceBackground starCount={36} />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 600, margin: '0 auto' }}>
        {/* Üst bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Button variant="ghost" size="sm" onClick={onBack}>← Ana Sayfa</Button>
          <Button variant="primary" size="sm" onClick={() => setForm(null)}>➕ Yeni Kullanıcı</Button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 22 }}>
          <div style={{ fontSize: 46, marginBottom: 6, lineHeight: 1 }}>👥</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: colors.text.primary, fontFamily: F, margin: '0 0 4px' }}>
            Kullanıcılar
          </h1>
          <p style={{ fontSize: 14, color: colors.text.secondary, fontFamily: F, margin: 0 }}>
            Numap'siz öğretmen/uzman hesapları — her biri yalnız kendi öğrencilerini yönetir
          </p>
        </div>

        {users.length === 0 ? (
          <EmptyState
            icon="🧑‍🏫"
            title="Henüz kullanıcı yok"
            description="Numap hesabı olmayan bir öğretmen/uzman için kullanıcı oluştur — sonra kendi kullanıcı adı ve şifresiyle girip kendi öğrencilerini yönetebilir."
            actionLabel="➕ Yeni Kullanıcı"
            onAction={() => setForm(null)}
          />
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {users.map((u) => {
              const childN = listChildren(u.id).length;
              const meta = [`@${u.username}`, `${childN} öğrenci`, u.lastSeenAt ? `son: ${dateLabel(u.lastSeenAt)}` : 'hiç girmedi']
                .filter(Boolean)
                .join(' · ');
              return (
                <Card key={u.id} padding={16}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div
                      style={{
                        fontSize: 26,
                        width: 50,
                        height: 50,
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        background: 'rgba(108,99,255,.15)',
                      }}
                    >
                      🧑‍🏫
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 17, fontWeight: 800, color: colors.text.primary, fontFamily: F, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {u.name}
                      </div>
                      <div style={{ fontSize: 12.5, color: colors.text.tertiary, fontFamily: F, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {meta}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setForm(u)}
                      aria-label={`${u.name} düzenle`}
                      style={{
                        flexShrink: 0,
                        width: 38,
                        height: 38,
                        borderRadius: '50%',
                        border: `1px solid ${colors.surface.divider}`,
                        background: 'rgba(255,255,255,.05)',
                        color: colors.text.secondary,
                        fontSize: 16,
                        cursor: 'pointer',
                      }}
                    >
                      ✏️
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(u)}
                      aria-label={`${u.name} sil`}
                      style={{
                        flexShrink: 0,
                        width: 38,
                        height: 38,
                        borderRadius: '50%',
                        border: `1px solid ${colors.feedback.error}`,
                        background: 'transparent',
                        color: colors.feedback.error,
                        fontSize: 15,
                        cursor: 'pointer',
                      }}
                    >
                      🗑
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
