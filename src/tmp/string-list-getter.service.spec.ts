import { TestBed, inject } from '@angular/core/testing';

import { StringListGetterService } from './string-list-getter.service';

describe('StringListGetterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StringListGetterService]
    });
  });

  it('should be created', inject([StringListGetterService], (service: StringListGetterService) => {
    expect(service).toBeTruthy();
  }));
});
