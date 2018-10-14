import {Component} from '@angular/core';
import {MenuData} from '../util/menu/menuData';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  menuData: MenuData = {};
  title = 'app';

  ngOnInit() {
    this.addMenu(this.menuData, 'Menu', 3, 6);
  }

  addMenu(
    menu: MenuData,
    textPrefix: string,
    depthLevel: number,
    quantity: number
  ) {
    if (depthLevel > 0) {
      menu.items = [];
      for (let i = 0; i < quantity; i++) {
        menu.items.push({
          text: `${textPrefix}-${i}`,
        });
      }
      for (let i = 0; i < quantity; i++) {
        this.addMenu(
          menu.items[i],
          menu.items[i].text,
          depthLevel - 1,
          quantity
        );
      }
    }
  }
}
