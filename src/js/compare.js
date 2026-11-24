export function getBestValues(laptops) {
  /*
   * Comparison highlighting depends on the lowest or highest value for each
   * specification. The extremes are calculated from the complete selected
   * group rather than from a single laptop, ensuring that only genuinely
   * favourable values receive the best-value label and green styling.
   */
  return {
    price: Math.min(...laptops.map(l => l.price)),
    ramGB: Math.max(...laptops.map(l => l.ramGB)),
    storageGB: Math.max(...laptops.map(l => l.storageGB)),
    batteryHours: Math.max(...laptops.map(l => l.batteryHours)),
    weightKg: Math.min(...laptops.map(l => l.weightKg))
  };
}
export function renderComparison(laptops, container) {
  /*
   * The comparison requires at least two records because the header and
   * specification rows need something meaningful to compare. For a valid
   * selection, specifications are mapped to formatters that keep the table
   * presentation consistent without changing the underlying data values.
   */
  if (laptops.length < 2) {
    container.innerHTML = `<p class="theme-card rounded-xl border p-8 text-center">Select at least two laptops to compare.</p>`;
    return;
  }
  const best = getBestValues(laptops);
  const specs = [
    ["Price","price",v=>`${Number(v).toLocaleString()} EGP`],
    ["Processor","cpu",v=>v],
    ["RAM","ramGB",v=>`${v} GB`],
    ["Storage","storageGB",v=>`${v} GB`],
    ["Battery life","batteryHours",v=>`${v} hours`],
    ["Weight","weightKg",v=>`${v} kg`],
    ["Screen","screenInches",v=>`${v} inches`],
    ["Category","category",v=>v]
  ];
  const headers = laptops.map(l => `<th class="min-w-44 p-4 text-center"><img src="${l.image}" alt="${l.name}" class="mx-auto mb-3 h-24 w-36 rounded-lg object-cover">${l.name}</th>`).join("");
  const rows = specs.map(([label,key,format]) => `<tr class="border-t"><th class="theme-card p-4 text-left">${label}</th>${laptops.map(l => {
    const winner = Object.hasOwn(best,key) && l[key] === best[key];
    return `<td class="p-4 text-center ${winner ? "best-value" : ""}">${format(l[key])}${winner ? " ★" : ""}</td>`;
  }).join("")}</tr>`).join("");
  container.innerHTML = `<div class="overflow-x-auto rounded-xl border"><table class="w-full border-collapse text-sm"><thead><tr><th class="p-4 text-left">Specification</th>${headers}</tr></thead><tbody>${rows}</tbody></table></div><p class="text-muted mt-4 text-sm">★ Best value in this specification.</p>`;
}
