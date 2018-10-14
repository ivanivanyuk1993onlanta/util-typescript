import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TouchMoveWatcherService {
  private static isMoving = false;

  constructor() {
    document.addEventListener(
      'touchmove', () => {
        TouchMoveWatcherService.isMoving = true;
      }
    );

    document.addEventListener(
      'touchend', () => {
        TouchMoveWatcherService.isMoving = false;
      }
    );
  }

  static getIsMoving() {
    return TouchMoveWatcherService.isMoving;
  }

}
