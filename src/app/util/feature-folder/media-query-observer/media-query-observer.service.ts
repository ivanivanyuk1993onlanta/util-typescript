import {Observable} from 'rxjs';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Injectable} from '@angular/core';
import {getSharedObservableWithLastValue} from '../../method-folder/get-shared-observable-with-last-value/get-shared-observable-with-last-value';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MediaQueryObserverService {
  readonly isHandset$: Observable<boolean>;

  constructor(
    private _breakpointObserver: BreakpointObserver,
  ) {
    this.isHandset$ = getSharedObservableWithLastValue(
      _breakpointObserver.observe(Breakpoints.Handset).pipe(
        map(breakpointState => breakpointState.matches)
      ),
    );
  }
}
