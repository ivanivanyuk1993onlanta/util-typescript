import { TestBed } from '@angular/core/testing';

import { GlobalClickEventService } from './global-click-event.service';

describe('GlobalClickEventService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GlobalClickEventService = TestBed.get(GlobalClickEventService);
    expect(service).toBeTruthy();
  });
});
