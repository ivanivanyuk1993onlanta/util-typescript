import { TestBed } from '@angular/core/testing';

import { TableUrlService } from './table-url.service';

describe('TableUrlService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TableUrlService = TestBed.get(TableUrlService);
    expect(service).toBeTruthy();
  });
});
