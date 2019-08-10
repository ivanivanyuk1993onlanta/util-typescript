import { TestBed } from '@angular/core/testing';

import { MediaQueryObserverService } from './media-query-observer.service';

describe('MediaQueryObserverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MediaQueryObserverService = TestBed.get(MediaQueryObserverService);
    expect(service).toBeTruthy();
  });
});
