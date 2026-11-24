export async function getLaptops() {
  try {
    /*
     * Centralise the catalogue request here so every page uses the same
     * loading process. Keeping it in this module prevents the data URL,
     * validation rules, and error handling from being duplicated across
     * home, catalogue, details, favourites, and comparison pages.
     */
    const response = await fetch("./data/laptops.json");
    if (!response.ok) throw new Error(`Request failed: ${response.status}`);
    const laptops = await response.json();
    if (!Array.isArray(laptops)) throw new Error("Laptop data must be an array.");
    return laptops;
  } catch (error) {
    console.error("Laptop data loading failed:", error);
    throw error;
  }
}
