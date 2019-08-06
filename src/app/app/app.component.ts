import {Component} from '@angular/core';
import {RouteListDataSourceExample} from '../util/feature-folder/route-list/data-source/example/route-list-data-source-example';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public dataSource = new RouteListDataSourceExample();
}
