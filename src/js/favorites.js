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
      const saved = laptops.filter(l => getFavorites().includes(l.id));
      const total = saved.reduce((sum,l) => sum + l.price, 0);
      document.querySelector("#totalFavorites").textContent = saved.length;
      document.querySelector("#totalPrice").textContent = formatPrice(total);
      document.querySelector("#averagePrice").textContent = formatPrice(saved.length ? total/saved.length : 0);
      renderCards(saved, grid);
    }
    document.querySelector("#clearFavorites").addEventListener("click", () => {
      if (confirm("Clear all saved favorites?")) clearFavorites();
    });
    window.addEventListener("favoritesChanged", update);
    update();
  } catch { showError(grid, "Unable to load your saved laptops."); }
}
init();
