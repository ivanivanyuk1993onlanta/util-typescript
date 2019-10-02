import {Subject} from 'rxjs';

// This class is used to effectively dispose of unused subscriptions in ngOnChanges hook
// In the beginning of ngOnChanges method there should be this._changeBroadcaster.broadcastChange() call,
// Before each subscribe(...) in ngOnChanges there should be a pipe with last item - takeUntil(this._changeBroadcaster.changeS$)
// ngOnDestroy should call this._changeBroadcaster.complete() to complete subject
export class ChangeBroadcaster {
  public readonly changeS$ = new Subject<void>();

  public broadcastChange() {
    this.changeS$.next();
  }

  public complete() {
    this.broadcastChange();
    this.changeS$.complete();
  }
}
