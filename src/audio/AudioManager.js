// GalakSay Pro — 2026-03-18 — Merkezi ses yöneticisi
// Ses kanallarını bağımsız yönet, toggle ve volume kontrolleri

const CHANNELS = {
  music:   { volume: 0.3, muted: false },
  effects: { volume: 0.8, muted: false },
  voice:   { volume: 1.0, muted: false },
  counting: { volume: 0.7, muted: false },
};

const STORAGE_KEY = 'galaksay_audio_prefs';

class AudioManagerClass {
  constructor() {
    this.channels = { ...CHANNELS };
    this.globalMuted = false;
    this._load();
  }

  _load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        Object.keys(parsed).forEach(k => {
          if (this.channels[k]) Object.assign(this.channels[k], parsed[k]);
        });
        if (parsed._globalMuted !== undefined) this.globalMuted = parsed._globalMuted;
      }
    } catch {}
  }

  _save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        ...this.channels,
        _globalMuted: this.globalMuted,
      }));
    } catch {}
  }

  // Kanal sesi seviyesini ayarla (0-1)
  setVolume(channel, volume) {
    if (this.channels[channel]) {
      this.channels[channel].volume = Math.max(0, Math.min(1, volume));
      this._save();
    }
  }

  // Kanal sesini aç/kapat
  toggleChannel(channel) {
    if (this.channels[channel]) {
      this.channels[channel].muted = !this.channels[channel].muted;
      this._save();
      return !this.channels[channel].muted;
    }
    return false;
  }

  // Tüm sesi aç/kapat
  toggleGlobal() {
    this.globalMuted = !this.globalMuted;
    this._save();
    return !this.globalMuted;
  }

  // Kanal çalabilir mi?
  canPlay(channel = 'effects') {
    return !this.globalMuted && this.channels[channel] && !this.channels[channel].muted;
  }

  // Kanal ses seviyesi
  getVolume(channel = 'effects') {
    if (this.globalMuted) return 0;
    const ch = this.channels[channel];
    return ch ? (ch.muted ? 0 : ch.volume) : 0;
  }

  // Durum raporu
  getState() {
    return {
      globalMuted: this.globalMuted,
      channels: { ...this.channels },
    };
  }
}

export const AudioManager = new AudioManagerClass();
