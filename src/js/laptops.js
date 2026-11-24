import { getLaptops } from "./api.js";
import { initializeSharedUI, renderCards, showLoading, showError } from "./ui.js";
initializeSharedUI();
const grid = document.querySelector("#laptopGrid");
const count = document.querySelector("#resultCount");
const controls = ["searchInput","categoryFilter","maxPrice","minRam","minBattery","sortSelect"].map(id => document.getElementById(id));
let all = [];
function filterLaptops() {
  const [searchEl, categoryEl, priceEl, ramEl, batteryEl, sortEl] = controls;
  /*
   * Text and category filters are combined with the numeric limits below.
   * An empty numeric field is converted to a neutral value: Infinity permits
   * every price, while zero permits every RAM and battery requirement.
   * All conditions must match for a laptop to remain in the result set.
   */
  const q = searchEl.value.trim().toLowerCase();
  const category = categoryEl.value;
  const max = priceEl.value === "" ? Infinity : Number(priceEl.value);
  const ram = ramEl.value === "" ? 0 : Number(ramEl.value);
  const battery = batteryEl.value === "" ? 0 : Number(batteryEl.value);
  let results = all.filter(l => (l.name.toLowerCase().includes(q) || l.brand.toLowerCase().includes(q)) &&
    (!category || l.category === category) && l.price <= max && l.ramGB >= ram && l.batteryHours >= battery);
  const sorters = {
    "price-asc":(a,b)=>a.price-b.price, "price-desc":(a,b)=>b.price-a.price,
    "battery-asc":(a,b)=>a.batteryHours-b.batteryHours, "battery-desc":(a,b)=>b.batteryHours-a.batteryHours,
    "weight-asc":(a,b)=>a.weightKg-b.weightKg, "weight-desc":(a,b)=>b.weightKg-a.weightKg
  };
  if (sorters[sortEl.value]) results = [...results].sort(sorters[sortEl.value]);
  renderCards(results, grid);
  count.textContent = `${results.length} of ${all.length} laptops`;
}
async function init() {
  showLoading(grid);
  /*
   * The catalogue is downloaded once and stored in memory. Every later filter,
   * sort, or reset operation processes that local array instead of making a
   * repeated network request, keeping interactions immediate and predictable.
   */
  try { all = await getLaptops(); filterLaptops(); }
  catch { count.textContent = "Unavailable"; showError(grid, "Laptop data could not be loaded."); }
}
controls.forEach(el => { el.addEventListener("input", filterLaptops); el.addEventListener("change", filterLaptops); });
document.querySelector("#resetFilters").addEventListener("click", () => {
  controls.forEach(el => el.value = "");
  controls[5].value = "default";
  filterLaptops();
});
init();
