// Currency code to symbol and name mappings
export const CURRENCY_MAPPINGS = {
  '001': { symbol: '$', name: 'US Dollar' },
  '002': { symbol: '€', name: 'Euro' },
  '003': { symbol: '₨', name: 'Pakistani Rupee' },
  '004': { symbol: '£', name: 'British Pound' },
  '005': { symbol: '¥', name: 'Japanese Yen' },
  '006': { symbol: 'A$', name: 'Australian Dollar' },
  '007': { symbol: 'C$', name: 'Canadian Dollar' },
  '008': { symbol: '₣', name: 'Swiss Franc' },
  '009': { symbol: '¥', name: 'Chinese Yuan' },
  '010': { symbol: '₹', name: 'Indian Rupee' }
};

// Function to get currency info by code
export function getCurrencyInfo(code) {
  return CURRENCY_MAPPINGS[code] || { symbol: code, name: code };
}

// Function to get all currencies as an array
export function getAllCurrencies() {
  return Object.entries(CURRENCY_MAPPINGS).map(([code, { symbol, name }]) => ({
    tpCUR_CODE: code,
    tpCUR_SYMBOL: symbol,
    tpCUR_DESCRIPTION: name
  }));
}
