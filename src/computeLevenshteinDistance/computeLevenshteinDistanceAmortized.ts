import { computeLevenshteinDistance } from "./computeLevenshteinDistance";
import { computeMinimalPossibleLevenshteinDistance } from "./computeMinimalPossibleLevenshteinDistance";

export function computeLevenshteinDistanceAmortized(
  a: string,
  b: string
): number {
  return (
    computeLevenshteinDistance(a, b) -
    computeMinimalPossibleLevenshteinDistance(a, b)
  );
}
