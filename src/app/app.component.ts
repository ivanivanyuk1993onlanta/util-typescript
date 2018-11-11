import {Component, OnInit} from '@angular/core';
import {RouteListService} from './util/core/route-list-service/route-list.service';
import {RouteData} from './util/core/route-list-service/route-data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  routeDataList: RouteData[];
  routeLangMap: Object;

  constructor(private routeListService: RouteListService) {
  }

  ngOnInit() {
    this.routeListService.load().subscribe(
      (routeDataList) => {
        this.routeDataList = routeDataList;
        this.routeLangMap = RouteListService.getLangMap(routeDataList);
      },
    );
  }
}
