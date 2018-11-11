import {Component, Input, OnInit} from '@angular/core';
import {RouteData} from '../route-list-service/route-data';

@Component({
  selector: 'app-route-list',
  templateUrl: './route-list.component.html',
  styleUrls: ['./route-list.component.scss']
})
export class RouteListComponent implements OnInit {
  @Input() routeDataList: RouteData[];
  @Input() routeLangMap: Object;

  constructor() { }

  ngOnInit() {
  }

}
