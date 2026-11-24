import { isFavorite, toggleFavorite, getTheme, saveTheme, applyTheme } from "./storage.js";

export const formatPrice = price => `${Number(price).toLocaleString("en-US")} EGP`;

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
  container.innerHTML = laptops.length
    ? laptops.map(renderLaptopCard).join("")
    : `<p class="col-span-full rounded-xl border p-10 text-center text-muted">No laptops match your selection.</p>`;
}

export function showLoading(container, count = 6) {
  container.innerHTML = Array.from({length: count}, () =>
    `<div class="theme-card rounded-2xl border p-4"><div class="skeleton h-44 w-full"></div><div class="skeleton mt-4 h-5 w-3/4"></div><div class="skeleton mt-3 h-4 w-1/2"></div><div class="skeleton mt-6 h-10 w-full"></div></div>`
  ).join("");
}

export function showError(container, message) {
  container.innerHTML = `<div class="col-span-full rounded-xl border border-red-300 bg-red-50 p-6 text-center text-red-700"><h3 class="font-bold">Something went wrong</h3><p class="mt-2">${message}</p><button id="retryButton" class="btn-action mt-4">Try again</button></div>`;
  container.querySelector("#retryButton")?.addEventListener("click", () => location.reload());
}

export function setupTheme() {
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
  const button = document.querySelector("#menuToggle");
  const menu = document.querySelector("#mainMenu");
  if (!button || !menu) return;
  button.addEventListener("click", () => {
    menu.classList.toggle("hidden");
    button.setAttribute("aria-expanded", String(!menu.classList.contains("hidden")));
  });
}

export function setupFavoriteButtons() {
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
