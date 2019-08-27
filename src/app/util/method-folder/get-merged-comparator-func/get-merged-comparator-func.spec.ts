import {TestBed} from '@angular/core/testing';
import {computeLevenshteinDistance} from '../compute-levenshtein-distance/compute-levenshtein-distance';

describe('getMergedComparatorFunc', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('getMergedComparatorFunc', () => {
    expect(computeLevenshteinDistance('sitting', 'kitten')).toBe(33);
  });
});
