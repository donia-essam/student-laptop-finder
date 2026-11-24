const FAVORITES_KEY = "studentLaptopFavorites";
const THEME_KEY = "studentLaptopTheme";
const COMPARE_KEY = "studentLaptopCompare";

/*
 * Browser storage can contain values left behind by an earlier session or
 * modified by the user. These functions therefore validate the stored shape
 * before returning it: favourites and comparison selections must be arrays,
 * and every saved ID is converted to a number before it is used by the app.
 */
export function getFavorites() {
  try {
    const value = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
    return Array.isArray(value) ? value.map(Number) : [];
  } catch {
    return [];
  }
}
export function saveFavorites(ids) {
  /*
   * Normalise every supplied ID to a number and remove duplicates before
   * serialising the array. This prevents the same laptop from being counted
   * twice even if it is added through more than one interface action.
   */
  localStorage.setItem(FAVORITES_KEY, JSON.stringify([...new Set(ids.map(Number))]));
}
export function isFavorite(id) { return getFavorites().includes(Number(id)); }
export function toggleFavorite(id) {
  const ids = getFavorites();
  const n = Number(id);
  const updated = ids.includes(n) ? ids.filter(x => x !== n) : [...ids, n];
  saveFavorites(updated);
  /*
   * Dispatching a custom event keeps separate page modules coordinated.
   * The favourites page can recalculate totals, the home page can update
   * its count, and card buttons throughout the app can react to the change
   * without requiring the browser to reload.
   */
  window.dispatchEvent(new CustomEvent("favoritesChanged"));
  return updated;
}
export function clearFavorites() {
  /* Clearing favourites also publishes the shared change event so open views refresh. */
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
