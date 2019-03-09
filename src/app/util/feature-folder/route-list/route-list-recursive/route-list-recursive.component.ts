import {Component, Input, OnChanges, OnDestroy} from '@angular/core';
import {distinctUntilChanged, takeUntil} from 'rxjs/operators';
import {BehaviorSubject, Subject} from 'rxjs';
import {RouteData} from '../../../class/route/route-data';

@Component({
  selector: 'app-route-list-recursive',
  templateUrl: './route-list-recursive.component.html',
  styleUrls: ['./route-list-recursive.component.scss'],
})
export class RouteListRecursiveComponent implements OnChanges, OnDestroy {
  @Input() parentRouteData: RouteData;
  @Input() routeDataList: RouteData[];
  @Input() searchRegExpSubject$: BehaviorSubject<RegExp>;

  private _isComponentDestroyedSubject$ = new Subject();

  public ngOnChanges() {
    if (this.parentRouteData) {
      for (const routeData of this.routeDataList) {
        this._addMatchesSearchRegExpSubjectToRouteData(routeData);
        this._addHasFilteredChildRouteListSubjectToRouteData(routeData);
        this._addHasFilteredChildRouteListSubjectToParentRouteData(routeData);
      }
    } else {
      for (const routeData of this.routeDataList) {
        this._addMatchesSearchRegExpSubjectToRouteData(routeData);
        this._addHasFilteredChildRouteListSubjectToRouteData(routeData);
      }
    }
  }

  public ngOnDestroy(): void {
    this._isComponentDestroyedSubject$.next();
    this._isComponentDestroyedSubject$.complete();
  }

  private _addHasFilteredChildRouteListSubjectToParentRouteData(
    routeData: RouteData,
  ) {
    routeData.matchesSearchRegExpSubject$.pipe(
      distinctUntilChanged(),
      takeUntil(this._isComponentDestroyedSubject$),
    ).subscribe((matchesSearchRegExp: boolean) => {
      const countOfParentReference = this.parentRouteData.countOfFilteredChildRouteListSubject$;
      if (matchesSearchRegExp) {
        countOfParentReference.next(countOfParentReference.getValue() + 1);
      } else {
        countOfParentReference.next(countOfParentReference.getValue() - 1);
      }
    });

    if (routeData.hasFilteredChildRouteListSubject$) {
      routeData.hasFilteredChildRouteListSubject$.pipe(
        distinctUntilChanged(),
        takeUntil(this._isComponentDestroyedSubject$),
      ).subscribe((hasFilteredChildRouteList: boolean) => {
        const countOfParentReference = this.parentRouteData.countOfFilteredChildRouteListSubject$;
        if (hasFilteredChildRouteList) {
          countOfParentReference.next(countOfParentReference.getValue() + 1);
        } else {
          countOfParentReference.next(countOfParentReference.getValue() - 1);
        }
      });
    }
  }

  private _addHasFilteredChildRouteListSubjectToRouteData(
    routeData: RouteData,
  ) {
    if (routeData.childRouteList) {
      routeData.countOfFilteredChildRouteListSubject$ = new BehaviorSubject<number>(0);
      routeData.hasFilteredChildRouteListSubject$ = new BehaviorSubject<boolean>(false);
      routeData.countOfFilteredChildRouteListSubject$.pipe(
        takeUntil(this._isComponentDestroyedSubject$),
      ).subscribe((countOfFilteredChildRouteList: number) => {
        routeData.hasFilteredChildRouteListSubject$.next(countOfFilteredChildRouteList > 0);
      });
    }
  }

  private _addMatchesSearchRegExpSubjectToRouteData(
    routeData: RouteData,
  ) {
    // todo make routeData.textTranslated some observable/subject (it is undefined on component creation, hence when searchRegExp is not empty, it does not match it)
    // todo check if the problem of empty filtered list when route data is changed when search string is not empty is solved
    // todo have in mind this: (new RegExp('', 'i')).test(undefined) true
    // todo have in mind this: (new RegExp('a', 'i')).test(undefined) false
    routeData.matchesSearchRegExpSubject$ = new BehaviorSubject<boolean>(true);
    this.searchRegExpSubject$.pipe(
      takeUntil(this._isComponentDestroyedSubject$),
    ).subscribe((searchRegExp: RegExp) => {
      routeData.matchesSearchRegExpSubject$.next(
        searchRegExp.test(routeData.textTranslated),
      );
    });
  }
}
