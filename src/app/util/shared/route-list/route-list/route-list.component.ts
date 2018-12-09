import {Component, Input, OnChanges} from '@angular/core';
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

export class RouteListComponent implements OnChanges {
  @Input() routeDataList: RouteData[];
  routeDataListFlat: RouteData[];
  searchRegExp$: Observable<RegExp>;
  searchString = new FormControl('');

  constructor(
    private router: Router,
    public mediaQueryObserverService: MediaQueryObserverService,
  ) {
  }

  static appendRouteDataToRouteDataListFlat(
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

  assembleRouteDataListFlat(): RouteData[] {
    const routeDataListFlat: RouteData[] = [];

    for (const routeData of this.routeDataList) {
      RouteListComponent.appendRouteDataToRouteDataListFlat(
        routeData,
        routeDataListFlat,
      );
    }

    return routeDataListFlat;
  }

  ngOnChanges() {
    this.searchRegExp$ = this.searchString.valueChanges.pipe(
      startWith(''),
      map((searchString: string): RegExp => {
        return new RegExp(escapeRegExp(searchString), 'i');
      }),
    );

    this.routeDataListFlat = this.assembleRouteDataListFlat();
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
