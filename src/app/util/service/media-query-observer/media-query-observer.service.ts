import {Injectable} from '@angular/core';
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MediaQueryObserverService {
  matchesMediumQuery$: Observable<boolean>; // todo replace with subject

  constructor(
    breakpointObserver: BreakpointObserver,
  ) {
    this.matchesMediumQuery$ = breakpointObserver.observe([
      Breakpoints.Large,
      Breakpoints.Medium,
      Breakpoints.XLarge,
    ]).pipe(
      map(
        (breakpointState: BreakpointState): boolean => {
          return breakpointState.matches;
        },
      ),
    );
  }
}
