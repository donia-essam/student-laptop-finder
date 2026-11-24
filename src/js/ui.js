import { isFavorite, toggleFavorite, getTheme, saveTheme, applyTheme } from "./storage.js";

export const formatPrice = price => `${Number(price).toLocaleString("en-US")} EGP`;

/*
 * Laptop cards have the same structure in several parts of the application.
 * This renderer creates that structure once and allows each page to pass only
 * the laptop data. It also checks whether the item is saved so the heart
 * button displays the correct state before a user interaction occurs.
 */
export function renderLaptopCard(laptop) {
  const saved = isFavorite(laptop.id);
  return `
  <article class="laptop-card theme-card">
    <a href="./details.html?id=${laptop.id}" aria-label="View ${laptop.name}">
      <img src="${laptop.image}" alt="${laptop.name}" loading="lazy"
        class="h-44 w-full rounded-xl object-cover" onerror="this.src='https://placehold.co/800x520?text=Laptop'">
    </a>
    <div class="flex flex-1 flex-col pt-4">
      <p class="text-sm font-semibold text-orange-500">${laptop.brand} · ${laptop.category}</p>
      <h3 class="mt-1 text-lg font-bold">${laptop.name}</h3>
      <p class="text-muted mt-2 text-sm">${laptop.cpu}</p>
      <div class="mt-3 grid grid-cols-2 gap-2 text-sm">
        <span>RAM: ${laptop.ramGB} GB</span><span>Storage: ${laptop.storageGB} GB</span>
        <span>Battery: ${laptop.batteryHours}h</span><span>Weight: ${laptop.weightKg} kg</span>
      </div>
      <p class="mt-4 text-xl font-extrabold text-orange-500">${formatPrice(laptop.price)}</p>
      <div class="mt-auto flex gap-2 pt-4">
        <a href="./details.html?id=${laptop.id}" class="btn-action flex-1 text-sm">Details</a>
        <button class="btn-secondary favorite-btn" data-id="${laptop.id}"
          aria-label="Toggle ${laptop.name} favorite" aria-pressed="${saved}">${saved ? "♥" : "♡"}</button>
      </div>
    </div>
  </article>`;
}

export function renderCards(laptops, container) {
  /*
   * Rendering is delegated to renderLaptopCard for each item. When no records
   * pass the caller's filter, a full-width empty state replaces the card grid
   * rather than leaving the page with an unexplained blank area.
   */
  container.innerHTML = laptops.length
    ? laptops.map(renderLaptopCard).join("")
    : `<p class="col-span-full rounded-xl border p-10 text-center text-muted">No laptops match your selection.</p>`;
}

export function showLoading(container, count = 6) {
  /*
   * Skeleton cards are temporary visual placeholders. They occupy the same
   * general amount of space as completed cards, which reduces layout movement
   * while catalogue data is downloaded and while a page is preparing content.
   */
  container.innerHTML = Array.from({length: count}, () =>
    `<div class="theme-card rounded-2xl border p-4"><div class="skeleton h-44 w-full"></div><div class="skeleton mt-4 h-5 w-3/4"></div><div class="skeleton mt-3 h-4 w-1/2"></div><div class="skeleton mt-6 h-10 w-full"></div></div>`
  ).join("");
}

export function showError(container, message) {
  /*
   * Errors are rendered into the requested content area with a retry control.
   * Reloading allows the browser to repeat the fetch and recreate all initial
   * state instead of attempting a partial recovery that could miss dependencies.
   */
  container.innerHTML = `<div class="col-span-full rounded-xl border border-red-300 bg-red-50 p-6 text-center text-red-700"><h3 class="font-bold">Something went wrong</h3><p class="mt-2">${message}</p><button id="retryButton" class="btn-action mt-4">Try again</button></div>`;
  container.querySelector("#retryButton")?.addEventListener("click", () => location.reload());
}

export function setupTheme() {
  /*
   * Apply the persisted theme immediately, then update the header control text
   * so the button describes the mode the user can switch to. The click handler
   * alternates between Battery Saver and Performance, saves that choice, and
   * reapplies the data-theme attribute used by the CSS selectors.
   */
  applyTheme();
  const button = document.querySelector("#themeToggle");
  if (!button) return;
  const update = () => button.textContent = getTheme() === "saver" ? "☀ Battery Saver" : "⚡ Performance";
  update();
  button.addEventListener("click", () => {
    saveTheme(getTheme() === "saver" ? "performance" : "saver");
    applyTheme(); update();
  });
}

export function setupNavigation() {
  /*
   * The same navigation markup is used on every page. On small screens, this
   * handler toggles the menu visibility and synchronises aria-expanded so a
   * screen reader is told whether the expanded menu is currently available.
   */
  const button = document.querySelector("#menuToggle");
  const menu = document.querySelector("#mainMenu");
  if (!button || !menu) return;
  button.addEventListener("click", () => {
    menu.classList.toggle("hidden");
    button.setAttribute("aria-expanded", String(!menu.classList.contains("hidden")));
  });
}

export function setupFavoriteButtons() {
  /*
   * Event delegation places one listener on the document instead of attaching
   * a listener to every card. It works for cards rendered initially or later
   * after filtering and detects only buttons marked with the favourite class.
   */
  document.addEventListener("click", event => {
    const button = event.target.closest(".favorite-btn");
    if (!button) return;
    const ids = toggleFavorite(button.dataset.id);
    const saved = ids.includes(Number(button.dataset.id));
    button.textContent = saved ? "♥" : "♡";
    button.setAttribute("aria-pressed", String(saved));
  });
}
export function initializeSharedUI() { setupTheme(); setupNavigation(); setupFavoriteButtons(); }
