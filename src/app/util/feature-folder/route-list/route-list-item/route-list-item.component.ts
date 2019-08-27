import {ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy} from '@angular/core';
import {RouteListComponent} from '../route-list/route-list.component';
import {BehaviorSubject} from 'rxjs';
import {mergeMap, takeUntil} from 'rxjs/operators';
import {Broadcaster} from '../../../class-folder/broadcaster/broadcaster';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-route-list-item',
  styleUrls: ['./route-list-item.component.scss'],
  templateUrl: './route-list-item.component.html',
})

// todo make childListBS$ lazy loaded

export class RouteListItemComponent<DataObjectType> implements OnChanges, OnDestroy {
  @Input() dataObject: DataObjectType;
  @Input() routeListComponent: RouteListComponent<DataObjectType>;

  public childListBS$ = new BehaviorSubject<Array<DataObjectType>>([]);
  public displayTextBS$ = new BehaviorSubject<string>(null);
  public iconCodeBS$ = new BehaviorSubject<string>(null);
  public isExpandedBS$ = new BehaviorSubject(false);
  public matchesUrlBS$ = new BehaviorSubject<boolean>(false);
  public urlBS$ = new BehaviorSubject<string>(null);

  private _changeBroadcaster = new Broadcaster();
  private _componentDestroyedBroadcaster = new Broadcaster();

  public handleExpandedChange(isExpanded: boolean) {
    this.isExpandedBS$.next(isExpanded);
  }

  public ngOnChanges(): void {
    this._changeBroadcaster.broadcast();

    const routeListComponent = this.routeListComponent;
    const dataSource = routeListComponent.dataSource;

    dataSource.getChildList$(this.dataObject).pipe(
      takeUntil(this._changeBroadcaster.broadcastS$),
      takeUntil(this._componentDestroyedBroadcaster.broadcastS$),
    ).subscribe(childList => {
      this.childListBS$.next(childList);
    });

    dataSource.getDisplayTextContinuous$(this.dataObject).pipe(
      takeUntil(this._changeBroadcaster.broadcastS$),
      takeUntil(this._componentDestroyedBroadcaster.broadcastS$),
    ).subscribe(displayText => {
      this.displayTextBS$.next(displayText);
    });

    dataSource.getIconCode$(this.dataObject).pipe(
      takeUntil(this._changeBroadcaster.broadcastS$),
      takeUntil(this._componentDestroyedBroadcaster.broadcastS$),
    ).subscribe(iconCode => {
      this.iconCodeBS$.next(iconCode);
    });

    routeListComponent.currentUrlBS$.pipe(
      mergeMap(url => {
        return dataSource.matchesUrl$(this.dataObject, url);
      }),
      takeUntil(this._changeBroadcaster.broadcastS$),
      takeUntil(this._componentDestroyedBroadcaster.broadcastS$),
    ).subscribe(matchesUrl => {
      this.matchesUrlBS$.next(matchesUrl);
    });

    dataSource.getUrl$(this.dataObject).pipe(
      takeUntil(this._changeBroadcaster.broadcastS$),
      takeUntil(this._componentDestroyedBroadcaster.broadcastS$),
    ).subscribe(url => {
      this.urlBS$.next(url);
    });
  }

  public ngOnDestroy(): void {
    this._changeBroadcaster.broadcastAndComplete();
    this._componentDestroyedBroadcaster.broadcastAndComplete();
  }
}
