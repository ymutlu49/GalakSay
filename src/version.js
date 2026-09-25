// Tek sürüm kaynağı: package.json → vite define(__APP_VERSION__). Testte/derleme dışında güvenli geri dönüş.
export const APP_VERSION = (typeof __APP_VERSION__ !== 'undefined' && __APP_VERSION__) || '0.0.0-dev';
