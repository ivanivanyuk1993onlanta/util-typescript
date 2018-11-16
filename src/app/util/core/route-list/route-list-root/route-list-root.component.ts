import {Component, Input, OnInit} from '@angular/core';
import {RouteData} from '../route-data';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-route-list-root',
  templateUrl: './route-list-root.component.html',
  styleUrls: ['./route-list-root.component.scss'],
})
export class RouteListRootComponent implements OnInit {
  @Input() routeDataList: RouteData[];
  searchRegExp = new FormControl(new RegExp(''));
  searchString = new FormControl('');

  constructor() {
  }

  ngOnInit() {
    this.searchString.valueChanges.subscribe((searchString: string) => {
      this.searchRegExp.setValue(new RegExp(searchString, 'i'));
    });
  }

}
