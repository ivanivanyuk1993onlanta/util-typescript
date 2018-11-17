import {Component, Input, OnInit} from '@angular/core';
import {escapeRegExp} from 'tslint/lib/utils';
import {FormControl} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {RouteData} from '../route-data';

@Component({
  selector: 'app-route-list-root',
  templateUrl: './route-list-root.component.html',
  styleUrls: ['./route-list-root.component.scss'],
})
export class RouteListRootComponent implements OnInit {
  @Input() routeDataList: RouteData[];
  searchRegExp$: Observable<RegExp>;
  searchString = new FormControl('');

  constructor() {
  }

  ngOnInit() {
    this.searchRegExp$ = this.searchString.valueChanges.pipe(
      startWith(''),
      map((searchString: string): RegExp => {
        return new RegExp(escapeRegExp(searchString), 'i');
      }),
    );
  }

}
