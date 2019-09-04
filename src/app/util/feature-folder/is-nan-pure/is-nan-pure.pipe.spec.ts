import { IsNanPurePipe } from './is-nan-pure.pipe';

describe('IsNanPurePipe', () => {
  it('create an instance', () => {
    const pipe = new IsNanPurePipe();
    expect(pipe).toBeTruthy();
  });
});
