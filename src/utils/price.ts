/** Converts a Daraz price label such as "৳ 28,499" into a number (28499). */
export function parsePrice(label: string): number {
  const digits = label.replace(/[^\d.]/g, '');
  const value = Number(digits);
  if (!digits || Number.isNaN(value)) throw new Error(`Cannot parse price from "${label}"`);
  return value;
}

export function isSortedAscending(values: number[]): boolean {
  return values.every((v, i) => i === 0 || values[i - 1] <= v);
}

export function isSortedDescending(values: number[]): boolean {
  return values.every((v, i) => i === 0 || values[i - 1] >= v);
}
