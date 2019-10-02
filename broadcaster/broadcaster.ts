import {Subject} from 'rxjs';

// This class is used to effectively dispose of unused subscriptions in ngOnChanges hook
// In the beginning of ngOnChanges method there should be this._broadcaster.broadcast() call,
// Before each subscribe(...) in ngOnChanges there should be a pipe with last item - takeUntil(this._broadcaster.broadcastS$)
// ngOnDestroy should call this._broadcaster.broadcastAndComplete()
export class Broadcaster {
  public readonly broadcastS$ = new Subject<void>();

  public broadcast() {
    this.broadcastS$.next();
  }

  public broadcastAndComplete() {
    this.broadcast();
    this.broadcastS$.complete();
  }
}
