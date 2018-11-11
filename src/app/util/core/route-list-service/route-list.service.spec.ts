import { TestBed } from '@angular/core/testing';

import { RouteListService } from './route-list.service';

describe('RouteListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RouteListService = TestBed.get(RouteListService);
    expect(service).toBeTruthy();
  });
});
