import { getLaptops } from "./api.js";
import { isFavorite, toggleFavorite, getCompareSelection, saveCompareSelection } from "./storage.js";
import { initializeSharedUI, formatPrice, showError } from "./ui.js";
initializeSharedUI();
const root = document.querySelector("#detailsContainer");
async function init() {
  try {
    const laptops = await getLaptops();
    /*
     * Details pages share one HTML template and receive the selected laptop
     * through the id query parameter. Reading that parameter allows links from
     * catalogue cards to open a focused page without creating a separate HTML
     * file for every laptop in the data set.
     */
    const id = Number(new URLSearchParams(location.search).get("id"));
    const laptop = laptops.find(l => l.id === id);
    if (!laptop) {
      root.innerHTML = `<div class="theme-card rounded-2xl border p-10 text-center"><h1 class="text-2xl font-bold">Laptop not found</h1><p class="mt-3">Please return to the catalogue and choose a laptop.</p><a class="btn-action mt-6" href="./laptops.html">Browse laptops</a></div>`;
      return;
    }
    root.innerHTML = `<div class="grid items-start gap-8 lg:grid-cols-2">
      <div class="theme-card rounded-2xl border p-4"><img src="${laptop.image}" alt="${laptop.name}" class="h-72 w-full rounded-xl object-cover sm:h-96"></div>
      <div><p class="font-bold uppercase tracking-wider text-orange-500">${laptop.brand}</p><h1 class="mt-2 text-3xl font-extrabold sm:text-4xl">${laptop.name}</h1><p class="mt-5 text-2xl font-extrabold text-orange-500">${formatPrice(laptop.price)}</p><p class="text-muted mt-5 leading-relaxed">${laptop.description}</p><div class="mt-7 flex flex-wrap gap-3"><button id="favoriteDetail" class="btn-action">${isFavorite(id) ? "♥ Remove favorite" : "♡ Add favorite"}</button><button id="compareDetail" class="btn-secondary">Add to comparison</button></div></div></div>
      <section class="mt-14"><h2 class="section-title">Full specifications</h2><div class="theme-card overflow-hidden rounded-2xl border"><table class="w-full text-left"><tbody>${[
        ["Laptop ID",laptop.id],["Name",laptop.name],["Brand",laptop.brand],["Price",formatPrice(laptop.price)],["Category",laptop.category],["Processor",laptop.cpu],["RAM",`${laptop.ramGB} GB`],["Storage",`${laptop.storageGB} GB`],["Battery life",`${laptop.batteryHours} hours`],["Weight",`${laptop.weightKg} kg`],["Screen size",`${laptop.screenInches} inches`]
      ].map(([k,v])=>`<tr class="border-b last:border-0"><th class="w-2/5 p-4 font-semibold">${k}</th><td class="p-4">${v}</td></tr>`).join("")}</tbody></table></div></section>`;
    document.querySelector("#favoriteDetail").addEventListener("click", e => {
      /*
       * The detail-page control updates storage and immediately changes its own
       * label. This gives direct feedback while the shared favourites event
       * allows totals and grids on other modules to refresh as needed.
       */
      toggleFavorite(id); e.currentTarget.textContent = isFavorite(id) ? "♥ Remove favorite" : "♡ Add favorite";
    });
    document.querySelector("#compareDetail").addEventListener("click", () => {
      /*
       * Adding a laptop to comparison is intentionally limited to four records.
       * Existing selections are preserved, duplicates are avoided, and the user
       * is redirected only after the updated list has been saved successfully.
       */
      let selected = getCompareSelection();
      if (!selected.includes(id)) {
        if (selected.length >= 4) { alert("You can select a maximum of four laptops."); return; }
        selected.push(id); saveCompareSelection(selected);
      }
      location.href = "./compare.html";
    });
  } catch { showError(root, "Unable to load laptop details."); }
}
init();
