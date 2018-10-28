import { TestBed } from '@angular/core/testing';

import { RouteListLoaderService } from './route-list-loader.service';

describe('RouteListLoaderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RouteListLoaderService = TestBed.get(RouteListLoaderService);
    expect(service).toBeTruthy();
  });
});
