// GalakSay — Tema bağlamı (açık / koyu).
// Masaüstü (Jimaro) çizgisindeki yapının karşılığı: bileşenler `useTheme()` ile
// { light, colors } alır. Varsayılan KOYU'dur (oyun-içi ekranlar değişmez); açık tema
// isteyen alt ağaç <ThemeProvider light> ile sarılır (açılış, kaptan ekranları).
import { createContext, useContext } from 'react';
import { colors, colorsLight } from './colors.js';

const DARK = Object.freeze({ light: false, colors });
const LIGHT = Object.freeze({ light: true, colors: colorsLight });
const ThemeContext = createContext(DARK);

export function ThemeProvider({ light = false, children }) {
  return <ThemeContext.Provider value={light ? LIGHT : DARK}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
