import { TestBed, inject } from '@angular/core/testing';

import { TouchMoveWatcherService } from './touch-move-watcher.service';

describe('TouchMoveWatcherService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TouchMoveWatcherService]
    });
  });

  it('should be created', inject([TouchMoveWatcherService], (service: TouchMoveWatcherService) => {
    expect(service).toBeTruthy();
  }));
});
