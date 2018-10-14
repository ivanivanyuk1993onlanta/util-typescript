import { TestBed, inject } from '@angular/core/testing';

import { HideMenuService } from './hide-menu.service';

describe('HideMenuService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HideMenuService]
    });
  });

  it('should be created', inject([HideMenuService], (service: HideMenuService) => {
    expect(service).toBeTruthy();
  }));
});
