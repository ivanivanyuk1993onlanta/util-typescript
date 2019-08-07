import {ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy} from '@angular/core';
import {RouteListComponent} from '../route-list/route-list.component';
import {BehaviorSubject} from 'rxjs';
import {mergeMap, takeUntil} from 'rxjs/operators';
import {ChangeBroadcaster} from '../../../class-folder/change-broadcaster/change-broadcaster';
import {ComponentDestroyedBroadcaster} from '../../../class-folder/component-destroyed-broadcaster/component-destroyed-broadcaster';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-route-list-item',
  styleUrls: ['./route-list-item.component.scss'],
  templateUrl: './route-list-item.component.html',
})
export class RouteListItemComponent<DataObjectType> implements OnChanges, OnDestroy {
  @Input() dataObject: DataObjectType;
  @Input() routeListComponent: RouteListComponent<DataObjectType>;

  public childListBS$ = new BehaviorSubject<Array<DataObjectType>>([]);
  public displayTextBS$ = new BehaviorSubject<string>(null);
  public isExpandedBS$ = new BehaviorSubject(false);
  public matchesUrlBS$ = new BehaviorSubject<boolean>(null);
  public urlBS$ = new BehaviorSubject<string>(null);

  private _changeBroadcaster = new ChangeBroadcaster();
  private _componentDestroyedBroadcaster = new ComponentDestroyedBroadcaster();

  public handleExpandedChange(isExpanded: boolean) {
    this.isExpandedBS$.next(isExpanded);
  }

  public ngOnChanges(): void {
    this._changeBroadcaster.broadcastChange();

    const routeListComponent = this.routeListComponent;
    const dataSource = routeListComponent.dataSource;

    dataSource.getChildList(this.dataObject).pipe(
      takeUntil(this._changeBroadcaster.changeS$),
      takeUntil(this._componentDestroyedBroadcaster.componentDestroyedS$),
    ).subscribe(childList => {
      this.childListBS$.next(childList);
    });

    dataSource.getDisplayTextBS$(this.dataObject).pipe(
      takeUntil(this._changeBroadcaster.changeS$),
      takeUntil(this._componentDestroyedBroadcaster.componentDestroyedS$),
    ).subscribe(displayText => {
      this.displayTextBS$.next(displayText);
    });

    routeListComponent.currentUrlBS$.pipe(
      mergeMap(url => {
        return dataSource.matchesUrl(this.dataObject, url);
      }),
      takeUntil(this._changeBroadcaster.changeS$),
      takeUntil(this._componentDestroyedBroadcaster.componentDestroyedS$),
    ).subscribe(matchesUrl => {
      this.matchesUrlBS$.next(matchesUrl);
    });

    dataSource.getUrl(this.dataObject).pipe(
      takeUntil(this._changeBroadcaster.changeS$),
      takeUntil(this._componentDestroyedBroadcaster.componentDestroyedS$),
    ).subscribe(url => {
      this.urlBS$.next(url);
    });
  }

  public ngOnDestroy(): void {
    this._changeBroadcaster.complete();
    this._componentDestroyedBroadcaster.broadcastComponentDestroyed();
  }
}
