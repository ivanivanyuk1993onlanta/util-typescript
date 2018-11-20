import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {distinctUntilChanged, map} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {RouteData} from '../../../core/route-list/route-data';

@Component({
  selector: 'app-route-list-recursive',
  templateUrl: './route-list-recursive.component.html',
  styleUrls: ['./route-list-recursive.component.scss'],
})
export class RouteListRecursiveComponent implements OnInit {
  @Input() parentRouteData: RouteData;
  @Input() routeDataList: RouteData[];
  @Input() searchRegExp$: Observable<RegExp>;

  constructor(private changerDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    for (const routeData of this.routeDataList) {
      routeData.matchesSearchRegExp$ = this.searchRegExp$.pipe(
        map((searchRegExp: RegExp): boolean => {
          return searchRegExp.test(routeData.textTranslated);
        }),
      );

      if (routeData.childRouteList) {
        routeData.countOfFilteredChildRouteList = new FormControl(0);
        routeData.hasFilteredChildRouteList$ = routeData.countOfFilteredChildRouteList.valueChanges.pipe(
          map((countOfFilteredChildRouteList: number): boolean => {
            return countOfFilteredChildRouteList > 0;
          }),
        );
      }
    }

    if (this.parentRouteData) {
      for (const routeData of this.routeDataList) {
        routeData.matchesSearchRegExp$.pipe(
          distinctUntilChanged(),
        ).subscribe((matchesSearchRegExp: boolean) => {
          const countOfParenReference = this.parentRouteData.countOfFilteredChildRouteList;
          if (matchesSearchRegExp) {
            countOfParenReference.setValue(countOfParenReference.value + 1);
          } else {
            countOfParenReference.setValue(countOfParenReference.value - 1);
          }
        });

        if (routeData.hasFilteredChildRouteList$) {
          routeData.hasFilteredChildRouteList$.pipe(
            distinctUntilChanged(),
          ).subscribe((hasFilteredChildRouteList: boolean) => {
            const countOfParenReference = this.parentRouteData.countOfFilteredChildRouteList;
            if (hasFilteredChildRouteList) {
              countOfParenReference.setValue(countOfParenReference.value + 1);
            } else {
              countOfParenReference.setValue(countOfParenReference.value - 1);
            }
          });
        }
      }
    }

    this.changerDetectorRef.detectChanges();
  }

}
