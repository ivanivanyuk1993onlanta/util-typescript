import { TestBed, async, inject } from '@angular/core/testing';

import { LazyPageGuard } from './lazy-page.guard';

describe('LazyPageGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LazyPageGuard]
    });
  });

  it('should ...', inject([LazyPageGuard], (guard: LazyPageGuard) => {
    expect(guard).toBeTruthy();
  }));
});
