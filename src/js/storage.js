const FAVORITES_KEY = "studentLaptopFavorites";
const THEME_KEY = "studentLaptopTheme";
const COMPARE_KEY = "studentLaptopCompare";

export function getFavorites() {
  try {
    const value = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
    return Array.isArray(value) ? value.map(Number) : [];
  } catch {
    return [];
  }
}
export function saveFavorites(ids) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify([...new Set(ids.map(Number))]));
}
export function isFavorite(id) { return getFavorites().includes(Number(id)); }
export function toggleFavorite(id) {
  const ids = getFavorites();
  const n = Number(id);
  const updated = ids.includes(n) ? ids.filter(x => x !== n) : [...ids, n];
  saveFavorites(updated);
  window.dispatchEvent(new CustomEvent("favoritesChanged"));
  return updated;
}
export function clearFavorites() {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify([]));
  window.dispatchEvent(new CustomEvent("favoritesChanged"));
}
export function getTheme() { return localStorage.getItem(THEME_KEY) || "saver"; }
export function saveTheme(theme) { localStorage.setItem(THEME_KEY, theme); }
export function applyTheme() { document.documentElement.dataset.theme = getTheme(); }
export function getCompareSelection() {
  try { return JSON.parse(localStorage.getItem(COMPARE_KEY) || "[]").map(Number); }
  catch { return []; }
}
export function saveCompareSelection(ids) {
  localStorage.setItem(COMPARE_KEY, JSON.stringify([...new Set(ids.map(Number))].slice(0,4)));
}
