import {
  Component,
  Input,
} from '@angular/core';
import {RouteData} from '../route-data';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-route-list-recursive',
  templateUrl: './route-list-recursive.component.html',
  styleUrls: ['./route-list-recursive.component.scss'],
})
export class RouteListRecursiveComponent {
  @Input() routeDataList: RouteData[];
  @Input() searchRegExp: FormControl;

  constructor() {
  }

}
