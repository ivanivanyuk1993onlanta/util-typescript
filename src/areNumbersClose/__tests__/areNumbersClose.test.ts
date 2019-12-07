import { areNumbersClose } from '../areNumbersClose';

describe('AsyncReadWriteLock', () => {
  it('shouldWorkWithPositiveNumbers', () => {
    expect(areNumbersClose(10, 8, 1)).toBeFalsy();
    expect(areNumbersClose(10, 9, 1)).toBeTruthy();
    expect(areNumbersClose(8, 10, 1)).toBeFalsy();
    expect(areNumbersClose(9, 10, 1)).toBeTruthy();
  });
});
