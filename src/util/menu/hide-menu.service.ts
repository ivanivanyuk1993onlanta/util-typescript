import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HideMenuService {
  constructor() {
    document.addEventListener('click', HideMenuService.hideUnFocusedMenus.bind(this));
  }

  static async hideUnFocusedMenus(event) {
    const collection = document.getElementsByClassName('menu_item--touched');
    let element;

    for (let i = 0, l = collection.length; i < l; i++) {
      element = collection[i];

      if (element && !element.contains(event.target)) {
        element.classList.remove('menu_item--touched');
      }
    }
  }
}
