export async function getLaptops() {
  try {
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
