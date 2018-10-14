import {Component, ElementRef, Input} from '@angular/core';
import {MenuData} from './menuData';
import {HideMenuService} from './hide-menu.service';
import {TouchMoveWatcherService} from '../touch-move-watcher/touch-move-watcher.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  @Input() data: MenuData;

  constructor(
    private elementRef: ElementRef,
    private hideMenuService: HideMenuService,
    private touchMoveWatcherService: TouchMoveWatcherService
  ) {
  }

  onTouch(event) {
    if (
      !TouchMoveWatcherService.getIsMoving()
      &&
      event.currentTarget.querySelector('.menu')
      &&
      !event.currentTarget.classList.contains('menu_item--touched')
    ) {
      event.currentTarget.classList.add('menu_item--touched');
      event.preventDefault();
    }
  }
}
