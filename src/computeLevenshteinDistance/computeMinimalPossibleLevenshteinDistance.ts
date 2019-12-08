export function computeMinimalPossibleLevenshteinDistance(
  a: string,
  b: string
): number {
  return a.length > b.length ? a.length - b.length : b.length - a.length;
}
