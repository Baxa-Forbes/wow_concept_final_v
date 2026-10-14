/**
 * Formats a number as a price in Uzbek Sum (UZS)
 * e.g. 3000000 → "3 000 000 сум"
 */
export const formatPrice = (price: number): string => {
  return `${new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(price)} сум`;
};

/**
 * Parses a price string back to a number
 */
export const parsePrice = (priceStr: string): number => {
  return parseInt(priceStr.replace(/\D/g, ''), 10) || 0;
};
