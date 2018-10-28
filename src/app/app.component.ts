import {Component, OnInit} from '@angular/core';
import {RouteListLoaderService} from './util/core/route-list-loader/route-list-loader.service';
import {RouteData} from './util/core/route-list-loader/route-data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  routeDataList: RouteData[];

  constructor(private routeListLoader: RouteListLoaderService) {
  }

  ngOnInit() {
    this.routeListLoader.load().subscribe(
      (routeDataList) => {
        this.routeDataList = routeDataList;
      },
    );
  }
}
