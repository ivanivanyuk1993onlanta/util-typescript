import {getMergedComparatorFunc} from './get-merged-comparator-func';

interface PropertyHolderInterface {
  id: number;
  sortField1: number;
  sortField2: number;
  sortField3: number;
}

describe('getMergedComparatorFunc', () => {
  const comparator1 = (l, r: PropertyHolderInterface) => l.sortField1 - r.sortField1;
  const comparator2 = (l, r: PropertyHolderInterface) => l.sortField2 - r.sortField2;
  const comparator3 = (l, r: PropertyHolderInterface) => l.sortField3 - r.sortField3;
  let array: PropertyHolderInterface[];
  beforeEach(() => {
    array = [
      {
        id: 1,
        sortField1: 1,
        sortField2: 0,
        sortField3: 3,
      },
      {
        id: 2,
        sortField1: 2,
        sortField2: 1,
        sortField3: 2,
      },
      {
        id: 3,
        sortField1: 3,
        sortField2: 0,
        sortField3: 1,
      },
    ];
  });

  it('getMergedComparatorFunc-1', () => {
    const comparator = getMergedComparatorFunc([
      comparator1,
      comparator3,
    ]);
    expect(array.sort(comparator).map(x => x.id).join(',')).toBe('1,2,3');
  });

  it('getMergedComparatorFunc-2', () => {
    const comparator = getMergedComparatorFunc([
      comparator3,
      comparator1,
    ]);
    expect(array.sort(comparator).map(x => x.id).join(',')).toBe('3,2,1');
  });

  it('getMergedComparatorFunc-3', () => {
    const comparator = getMergedComparatorFunc([
      comparator2,
    ]);
    expect(array.sort(comparator).map(x => x.id).join(',')).toBe('1,3,2');
  });

  it('getMergedComparatorFunc-4', () => {
    const comparator = getMergedComparatorFunc([
      comparator2,
      comparator1,
    ]);
    expect(array.sort(comparator).map(x => x.id).join(',')).toBe('1,3,2');
  });

  it('getMergedComparatorFunc-5', () => {
    const comparator = getMergedComparatorFunc([
      comparator2,
      comparator3,
    ]);
    expect(array.sort(comparator).map(x => x.id).join(',')).toBe('3,1,2');
  });
});
