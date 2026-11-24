import { getLaptops } from "./api.js";
import { getFavorites, clearFavorites } from "./storage.js";
import { initializeSharedUI, renderCards, formatPrice, showLoading, showError } from "./ui.js";
initializeSharedUI();
const grid = document.querySelector("#favoritesGrid");
async function init() {
  showLoading(grid, 3);
  try {
    const laptops = await getLaptops();
    function update() {
      /*
       * All favourite-page information is derived from the same saved-ID list.
       * Filtering the catalogue first ensures that totals and visible cards agree,
       * while recalculating after a change also removes deleted or stale entries
       * from the interface automatically.
       */
      const saved = laptops.filter(l => getFavorites().includes(l.id));
      const total = saved.reduce((sum,l) => sum + l.price, 0);
      document.querySelector("#totalFavorites").textContent = saved.length;
      document.querySelector("#totalPrice").textContent = formatPrice(total);
      document.querySelector("#averagePrice").textContent = formatPrice(saved.length ? total/saved.length : 0);
      renderCards(saved, grid);
    }
    document.querySelector("#clearFavorites").addEventListener("click", () => {
      /*
       * A confirmation dialog prevents a bulk delete from happening through an
       * accidental click. Clearing storage also broadcasts favouritesChanged,
       * which drives update() and removes the current cards from the page.
       */
      if (confirm("Clear all saved favorites?")) clearFavorites();
    });
    window.addEventListener("favoritesChanged", update);
    update();
  } catch { showError(grid, "Unable to load your saved laptops."); }
}
init();
