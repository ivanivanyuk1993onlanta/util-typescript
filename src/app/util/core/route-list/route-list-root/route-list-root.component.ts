import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {escapeRegExp} from 'tslint/lib/utils';
import {FormControl} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {RouteData} from '../route-data';
import {Router} from '@angular/router';
import {MatOptionSelectionChange} from '@angular/material';

@Component({
  selector: 'app-route-list-root',
  templateUrl: './route-list-root.component.html',
  styleUrls: ['./route-list-root.component.scss'],
})

export class RouteListRootComponent implements OnInit {
  @Input() routeDataList: RouteData[];
  routeDataListFlat: RouteData[];
  searchRegExp$: Observable<RegExp>;
  searchString = new FormControl('');

  constructor(
    private router: Router,
  ) {
  }

  static appendRouteDataToRouteDataListFlat(
    routeData: RouteData,
    routeDataListFlat: RouteData[],
  ): void {
    routeDataListFlat.push(routeData);

    if (routeData.childRouteList) {
      for (const routeDataChild of routeData.childRouteList) {
        RouteListRootComponent.appendRouteDataToRouteDataListFlat(
          routeDataChild,
          routeDataListFlat,
        );
      }
    }
  }

  assembleRouteDataListFlat(): RouteData[] {
    const routeDataListFlat: RouteData[] = [];

    for (const routeData of this.routeDataList) {
      RouteListRootComponent.appendRouteDataToRouteDataListFlat(routeData,
        routeDataListFlat);
    }

    return routeDataListFlat;
  }

  ngOnInit() {
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
