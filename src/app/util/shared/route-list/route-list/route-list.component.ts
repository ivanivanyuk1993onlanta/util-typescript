import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {escapeRegExp} from 'tslint/lib/utils';
import {FormControl} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {MatOptionSelectionChange} from '@angular/material';
import {MediaQueryObserverService} from '../../../core/media-query-observer/media-query-observer.service';
import {Observable} from 'rxjs';
import {RouteData} from '../../../core/route/route-data';
import {Router} from '@angular/router';

@Component({
  selector: 'app-route-list',
  templateUrl: './route-list.component.html',
  styleUrls: ['./route-list.component.scss'],
})

export class RouteListComponent implements OnChanges, OnInit {
  @Input() routeDataList: RouteData[];
  routeDataListFlat: RouteData[];
  searchRegExp$: Observable<RegExp>;
  searchString = new FormControl('');

  constructor(
    private router: Router,
    public mediaQueryObserverService: MediaQueryObserverService,
  ) {
  }

  private static appendRouteDataToRouteDataListFlat(
    routeData: RouteData,
    routeDataListFlat: RouteData[],
  ): void {
    routeDataListFlat.push(routeData);

    if (routeData.childRouteList) {
      for (const routeDataChild of routeData.childRouteList) {
        RouteListComponent.appendRouteDataToRouteDataListFlat(
          routeDataChild,
          routeDataListFlat,
        );
      }
    }
  }

  private static assembleRouteDataListFlat(
    routeDataList: RouteData[],
  ): RouteData[] {
    const routeDataListFlat: RouteData[] = [];

    for (const routeData of routeDataList) {
      RouteListComponent.appendRouteDataToRouteDataListFlat(
        routeData,
        routeDataListFlat,
      );
    }

    return routeDataListFlat;
  }

  ngOnChanges() {
    this.routeDataListFlat = RouteListComponent.assembleRouteDataListFlat(
      this.routeDataList,
    );
  }

  ngOnInit() {
    this.searchRegExp$ = this.searchString.valueChanges.pipe(
      startWith(this.searchString.value),
      map((searchString: string): RegExp => {
        return new RegExp(escapeRegExp(searchString), 'i');
      }),
    );
  }

  selectOption(
    event: MatOptionSelectionChange,
    routeData: RouteData,
  ): void {
    if (event.source.selected) {
      this.router.navigateByUrl(routeData.route).then(
        () => {
          this.searchString.setValue('');
        },
      );
    }
  }

}
