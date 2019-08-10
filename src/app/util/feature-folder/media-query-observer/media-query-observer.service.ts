import {BehaviorSubject} from 'rxjs';
import {BreakpointObserver, Breakpoints, BreakpointState} from '@angular/cdk/layout';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MediaQueryObserverService {
  matchesMediumQuerySubject$ = new BehaviorSubject<boolean>(false);

  constructor(
    private _breakpointObserver: BreakpointObserver,
  ) {
    _breakpointObserver.observe([
      Breakpoints.Large,
      Breakpoints.Medium,
      Breakpoints.XLarge,
    ]).subscribe((breakpointState: BreakpointState) => {
      this.matchesMediumQuerySubject$.next(breakpointState.matches);
    });
  }
}
