export default function formatCurrency(value, options = {}) {
  const { locale = "en-US", maximumFractionDigits = 0 } = options;
  const n = Number(value ?? 0) || 0;
  // Round up to nearest integer for display consistency with existing code
  const rounded = Math.ceil(n);
  try {
    return new Intl.NumberFormat(locale, { maximumFractionDigits }).format(
      rounded
    );
  } catch (e) {
    return String(rounded);
  }
}
