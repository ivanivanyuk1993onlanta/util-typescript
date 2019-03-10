import {Component, Input, OnChanges, OnDestroy, OnInit, ChangeDetectorRef} from '@angular/core';
import {distinctUntilChanged, startWith, takeUntil} from 'rxjs/operators';
import {BehaviorSubject, Subject, combineLatest} from 'rxjs';
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

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
  ) {    
  }

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

    this._changeDetectorRef.detectChanges();
  }

  public ngOnDestroy(): void {
    this._isComponentDestroyedSubject$.next();
    this._isComponentDestroyedSubject$.complete();
  }

  private _addHasFilteredChildRouteListSubjectToParentRouteData(
    routeData: RouteData,
  ) {
    routeData.matchesSearchRegExpSubject$.pipe(
      startWith(true), // this code is necessary for countOfFilteredChildRouteList to take correct initial value when search string is not empty when changes are emitted
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
    routeData.textTranslatedSubject$ = new BehaviorSubject<string>(routeData.langKey);
    routeData.matchesSearchRegExpSubject$ = new BehaviorSubject<boolean>(true);

    combineLatest(
      this.searchRegExpSubject$,
      routeData.textTranslatedSubject$,
    ).pipe(
      takeUntil(this._isComponentDestroyedSubject$),
    ).subscribe(
      ([
        searchRegExp,
        textTranslated,
      ]) => {
        routeData.matchesSearchRegExpSubject$.next(
          searchRegExp.test(textTranslated),
        );
      },
    );
  }
}
