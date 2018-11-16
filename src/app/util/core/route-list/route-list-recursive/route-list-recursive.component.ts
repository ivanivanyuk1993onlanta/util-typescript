import {
  Component,
  Input,
} from '@angular/core';
import {RouteData} from '../route-data';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-route-list-recursive',
  templateUrl: './route-list-recursive.component.html',
  styleUrls: ['./route-list-recursive.component.scss'],
})
export class RouteListRecursiveComponent {
  @Input() routeDataList: RouteData[];
  @Input() searchRegExp$: Observable<string>;

  constructor() {
  }

}
