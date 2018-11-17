import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {distinctUntilChanged, map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {RouteData} from '../route-data';

@Component({
  selector: 'app-route-list-recursive',
  templateUrl: './route-list-recursive.component.html',
  styleUrls: ['./route-list-recursive.component.scss'],
})
export class RouteListRecursiveComponent implements OnInit {
  @Input() parentRouteData: RouteData;
  @Input() routeDataList: RouteData[];
  @Input() searchRegExp$: Observable<RegExp>;

  constructor() {
  }

  ngOnInit() {
    for (const routeData of this.routeDataList) {
      if (routeData.childRouteList) {
        routeData.countOfFilteredChildRouteList = 0;
      }

      routeData.matchesSearchRegExp$ = this.searchRegExp$.pipe(
        map((searchRegExp: RegExp): boolean => {
          return searchRegExp.test(routeData.textTranslated);
        }),
      );
    }

    if (this.parentRouteData) {
      for (const routeData of this.routeDataList) {
        routeData.matchesSearchRegExp$.pipe(
          distinctUntilChanged(),
        ).subscribe((matchesSearchRegExp: boolean) => {
          if (matchesSearchRegExp || routeData.countOfFilteredChildRouteList > 0) {
            this.parentRouteData.countOfFilteredChildRouteList++;
          } else {
            this.parentRouteData.countOfFilteredChildRouteList--;
          }
        });
      }
    }
  }

}
