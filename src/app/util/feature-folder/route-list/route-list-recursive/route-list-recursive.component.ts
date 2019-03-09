import {ChangeDetectorRef, Component, Input, OnChanges, OnDestroy} from '@angular/core';
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

  constructor(
    private _changerDetectorRef: ChangeDetectorRef,
  ) {
  }

  public ngOnChanges() {
    // todo refactor this thing!
    console.log(`ngOnChanges: ${ (new Date()).toLocaleTimeString() }`); // todo remove debug code, make routeDataList correctly show when it is changed when search string is filled
    for (const routeData of this.routeDataList) {
      routeData.matchesSearchRegExpSubject$ = new BehaviorSubject<boolean>(true);
      this.searchRegExpSubject$.pipe(
        takeUntil(this._isComponentDestroyedSubject$),
      ).subscribe((searchRegExp: RegExp) => {
        routeData.matchesSearchRegExpSubject$.next(
          searchRegExp.test(routeData.textTranslated),
        );
      });

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

    if (this.parentRouteData) {
      for (const routeData of this.routeDataList) {
        routeData.matchesSearchRegExpSubject$.pipe(
          // distinctUntilChanged(), // todo
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
            // distinctUntilChanged(), // todo
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
    }

    this._changerDetectorRef.detectChanges();
  }

  public ngOnDestroy(): void {
    this._isComponentDestroyedSubject$.next();
    this._isComponentDestroyedSubject$.complete();
  }

}
