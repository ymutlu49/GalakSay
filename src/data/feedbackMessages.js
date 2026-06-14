// @ts-check
// GalakSay Pro — Galaksi narratif geri bildirim mesaj havuzları.
// Doğru/yanlış/streak başarımı sırasında rastgele seçilir.

export const GALAXY_CORRECT_MSGS = [
  "Harika, Kaşif! 🌟", "Yıldız gibi parlıyorsun! ⭐", "Galaksi aydınlanıyor! 💫",
  "Uzay yolcusu oluyorsun! 🚀", "Yıldız taşı parıldıyor! 💎", "Mükemmel keşif! 🔭",
  "Yörüngede ilerliyorsun! 🌍", "Süper çözdün, Kaşif! ✨",
];

export const GALAXY_WRONG_MSGS = [
  "Yörünge biraz kaydı... Tekrar dene! 🔭", "Yaklaştın! Bir daha bak 👀",
  "Bu sefer olmadı, ama yakınsın! 🌟", "Kaşifler tekrar dener! Hadi 🚀",
];

export const GALAXY_STREAK_MSGS = [
  "", "", "",
  "Üçlü Yıldız Dizilimi! 🌟🌟🌟", "Dört yıldızlı yörünge! 🚀🌟",
  "Galaktik Seri Aktif! ⚡💫", "Kozmik Güç Alanı! 🌌✨",
  "YILDIZ PATLAMASI! 🎇🎆", "SÜPERNOVA MODUNDA! 💥🌟💥",
];

// ═══ KÜRTÇE (KURMANCÎ) ═══════════════════════════════════════════════════
export const GALAXY_CORRECT_MSGS_KU = [
  "Aferîn, Keşifger! 🌟", "Mîna stêrkê dibiriqî! ⭐", "Galaksî ronî dibe! 💫",
  "Tu dibî gerokê fezayê! 🚀", "Kevirê stêrkê dibiriqe! 💎", "Keşfeke bêkêmasî! 🔭",
  "Tu di gerîngehê de pêş dikevî! 🌍", "Te super çareser kir, Keşifger! ✨",
];

export const GALAXY_WRONG_MSGS_KU = [
  "Gerîngeh hinekî şemitî... Dîsa biceribîne! 🔭", "Nêzîk bûyî! Careke din binêre 👀",
  "Vê carê nebû, lê tu nêzîk î! 🌟", "Keşifger dîsa diceribînin! De were 🚀",
];

export const GALAXY_STREAK_MSGS_KU = [
  "", "", "",
  "Rêza Sê Stêrkan! 🌟🌟🌟", "Gerîngeha çar-stêrkî! 🚀🌟",
  "Rêza Galaktîk Çalak e! ⚡💫", "Qada Hêza Kozmîk! 🌌✨",
  "TEQÎNA STÊRKAN! 🎇🎆", "DI MODA SUPERNOVA DE! 💥🌟💥",
];

// Aktif dil — render başında setFeedbackLang(lang) ile ayarlanır.
let _fbLang = "tr";
export const setFeedbackLang = (lang) => { _fbLang = lang; };
export const galaxyCorrect = () => (_fbLang === "ku" ? GALAXY_CORRECT_MSGS_KU : GALAXY_CORRECT_MSGS);
export const galaxyWrong   = () => (_fbLang === "ku" ? GALAXY_WRONG_MSGS_KU   : GALAXY_WRONG_MSGS);
export const galaxyStreak  = () => (_fbLang === "ku" ? GALAXY_STREAK_MSGS_KU  : GALAXY_STREAK_MSGS);
