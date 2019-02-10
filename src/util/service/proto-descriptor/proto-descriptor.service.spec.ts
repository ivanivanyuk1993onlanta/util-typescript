import { TestBed } from '@angular/core/testing';

import { ProtoDescriptorService } from './proto-descriptor.service';

describe('ProtoDescriptorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProtoDescriptorService = TestBed.get(ProtoDescriptorService);
    expect(service).toBeTruthy();
  });
});
