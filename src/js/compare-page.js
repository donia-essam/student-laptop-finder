import { getLaptops } from "./api.js";
import { getFavorites, getCompareSelection, saveCompareSelection } from "./storage.js";
import { initializeSharedUI, showError } from "./ui.js";
import { renderComparison } from "./compare.js";
initializeSharedUI();
const choices = document.querySelector("#laptopChoices");
const message = document.querySelector("#selectionMessage");
const output = document.querySelector("#comparisonContainer");
async function init() {
  try {
    const laptops = await getLaptops();
    function updateChoices() {
      const favorites = laptops.filter(l => getFavorites().includes(l.id));
      /*
       * A laptop may remain in the saved comparison list after it is removed
       * from favourites. Filtering the stored selection against the current
       * favourites prevents stale choices from appearing or entering the table.
       * The cleaned selection is written back before the checkbox controls are made.
       */
      let selected = getCompareSelection().filter(id => favorites.some(l => l.id === id));
      saveCompareSelection(selected);
      choices.innerHTML = favorites.length ? favorites.map(l => `<label class="theme-card flex cursor-pointer items-center gap-3 rounded-xl border p-3"><input type="checkbox" class="compare-checkbox" value="${l.id}" ${selected.includes(l.id) ? "checked" : ""}><span class="font-semibold">${l.name}</span></label>`).join("") : `<p class="text-muted">No favorites yet. Add laptops before comparing.</p>`;
      updateComparison();
    }
    function updateComparison() {
      const selected = [...document.querySelectorAll(".compare-checkbox:checked")].map(el => Number(el.value));
      if (selected.length > 4) { message.textContent = "Maximum four laptops."; return; }
      saveCompareSelection(selected);
      message.textContent = selected.length < 2 ? "Select at least two laptops." : `${selected.length} laptops selected.`;
      renderComparison(laptops.filter(l => selected.includes(l.id)), output);
    }
    choices.addEventListener("change", e => {
      /*
       * Every checkbox change is checked against the DOM-selected set rather
       * than a guessed state. If a fifth selection is attempted, that checkbox
       * is immediately undone and the table is not expanded beyond the limit.
       */
      if (e.target.matches(".compare-checkbox")) {
        const checked = document.querySelectorAll(".compare-checkbox:checked");
        if (checked.length > 4) { e.target.checked = false; message.textContent = "You can compare a maximum of four laptops."; }
        updateComparison();
      }
    });
    window.addEventListener("favoritesChanged", updateChoices);
    updateChoices();
  } catch { showError(output, "Unable to load comparison data."); }
}
init();
