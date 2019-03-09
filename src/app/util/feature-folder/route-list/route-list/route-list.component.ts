import {BehaviorSubject, Subject} from 'rxjs';
import {Component, Input, OnChanges, OnDestroy} from '@angular/core';
import {escapeRegExp} from 'tslint/lib/utils';
import {FormControl} from '@angular/forms';
import {MatOptionSelectionChange} from '@angular/material';
import {MediaQueryObserverService} from '../../../service/media-query-observer/media-query-observer.service';
import {RouteData} from '../../../class/route/route-data';
import {Router} from '@angular/router';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-route-list',
  templateUrl: './route-list.component.html',
  styleUrls: ['./route-list.component.scss'],
})

export class RouteListComponent implements OnChanges, OnDestroy {
  @Input() routeDataList: RouteData[];

  public routeDataListFlat: RouteData[];
  public searchRegExpSubject$: BehaviorSubject<RegExp>;
  public searchStringFormControl = new FormControl('');

  private _isComponentDestroyedSubject$ = new Subject();

  constructor(
    private router: Router,
    public mediaQueryObserverService: MediaQueryObserverService,
  ) {
    this.searchRegExpSubject$ = new BehaviorSubject<RegExp>(
      RouteListComponent._getEscapedSearchRegExp(this.searchStringFormControl.value),
    );

    this.searchStringFormControl.valueChanges.pipe(
      takeUntil(this._isComponentDestroyedSubject$),
    ).subscribe((searchString: string) => {
      this.searchRegExpSubject$.next(
        RouteListComponent._getEscapedSearchRegExp(searchString),
      );
    });
  }

  private static _appendRouteDataToRouteDataListFlat(
    routeData: RouteData,
    routeDataListFlat: RouteData[],
  ): void {
    routeDataListFlat.push(routeData);

    if (routeData.childRouteList) {
      for (const routeDataChild of routeData.childRouteList) {
        RouteListComponent._appendRouteDataToRouteDataListFlat(
          routeDataChild,
          routeDataListFlat,
        );
      }
    }
  }

  private static _assembleRouteDataListFlat(
    routeDataList: RouteData[],
  ): RouteData[] {
    const routeDataListFlat: RouteData[] = [];

    for (const routeData of routeDataList) {
      RouteListComponent._appendRouteDataToRouteDataListFlat(
        routeData,
        routeDataListFlat,
      );
    }

    return routeDataListFlat;
  }

  private static _getEscapedSearchRegExp(
    searchString: string,
  ): RegExp {
    return new RegExp(escapeRegExp(searchString), 'i');
  }

  public ngOnChanges() {
    this.routeDataListFlat = RouteListComponent._assembleRouteDataListFlat(
      this.routeDataList,
    );
  }

  public ngOnDestroy(): void {
    this._isComponentDestroyedSubject$.next();
    this._isComponentDestroyedSubject$.complete();
  }

  public selectOption(
    event: MatOptionSelectionChange,
    routeData: RouteData,
  ): void {
    if (event.source.selected) {
      this.router.navigateByUrl(routeData.route).then(
        () => {
          this.searchStringFormControl.setValue('');
        },
      );
    }
  }
}
