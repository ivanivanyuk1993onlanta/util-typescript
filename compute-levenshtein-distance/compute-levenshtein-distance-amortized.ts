import {computeLevenshteinDistance} from './compute-levenshtein-distance';
import {computeMinimalPossibleLevenshteinDistance} from './compute-minimal-possible-levenshtein-distance';

export function computeLevenshteinDistanceAmortized(
  a: string,
  b: string,
): number {
  return computeLevenshteinDistance(a, b) - computeMinimalPossibleLevenshteinDistance(a, b);
}
