import {Subject} from 'rxjs';

// Class is used to prevent memory leaks in subscriptions. Before each subscribe() call there should be a pipe with last item -
// takeUntil(this._componentDestroyedBroadcaster.componentDestroyedS$)
// ngOnDestroy should contain this._componentDestroyedBroadcaster.broadcastComponentDestroyed()
// That will effectively dispose of subscriptions in ngOnDestroy hook
export class ComponentDestroyedBroadcaster {
  public readonly componentDestroyedS$ = new Subject<void>();

  public broadcastComponentDestroyed() {
    this.componentDestroyedS$.next();
    this.componentDestroyedS$.complete();
  }
}
