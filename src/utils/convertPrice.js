export default function convertPrice(amountBase, exchangeRate) {
  const base = Number(amountBase) || 0;
  const ex = Number(exchangeRate) || 1;
  if (ex <= 0) return Math.max(0, Math.ceil(base));
  // Heuristic: many exchange APIs return either (targetPerBase) or (basePerTarget).
  // If the rate is large (>10) it's likely "how many base units in 1 target" (e.g., 350 PKR per 1 EUR)
  // In that case we should divide base by rate. Otherwise multiply.
  const converted = ex > 10 ? base / ex : base * ex;
  return Math.max(0, Math.ceil(converted));
}
