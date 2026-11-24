import { getLaptops } from "./api.js";
import { getFavorites } from "./storage.js";
import { initializeSharedUI, renderCards, showLoading, showError, formatPrice } from "./ui.js";
initializeSharedUI();
const featured = document.querySelector("#featuredLaptops");
async function initializeHome() {
  showLoading(featured, 3);
  try {
    const laptops = await getLaptops();
    /*
     * Collection statistics are calculated from every laptop in the catalogue.
     * The sorted featured section is deliberately separate and limited to three
     * items, because it is intended as a promotional preview rather than a
     * second copy of the complete laptop catalogue.
     */
    const lowest = laptops.reduce((min, laptop) => Math.min(min, laptop.price), Infinity);
    const average = laptops.reduce((sum, laptop) => sum + laptop.price, 0) / laptops.length;
    document.querySelector("#laptopCount").textContent = laptops.length;
    document.querySelector("#lowestPrice").textContent = formatPrice(lowest);
    document.querySelector("#averagePrice").textContent = formatPrice(average);
    const updateFavorites = () => document.querySelector("#favoriteCount").textContent = getFavorites().length;
    updateFavorites();
    window.addEventListener("favoritesChanged", updateFavorites);
    renderCards([...laptops].sort((a,b) => a.price-b.price).slice(0,3), featured);
  } catch { showError(featured, "Unable to load the laptop database."); }
}
initializeHome();
