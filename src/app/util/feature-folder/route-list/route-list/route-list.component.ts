import {ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {RouteListDataSourceInterface} from '../data-source/route-list-data-source-interface';
import {ComponentDestroyedBroadcaster} from '../../../class-folder/component-destroyed-broadcaster/component-destroyed-broadcaster';
import {ChangeBroadcaster} from '../../../class-folder/change-broadcaster/change-broadcaster';
import {filter, takeUntil} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';
import {NavigationEnd, Router} from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-route-list',
  styleUrls: ['./route-list.component.scss'],
  templateUrl: './route-list.component.html',
})
export class RouteListComponent<DataObjectType> implements OnChanges, OnDestroy, OnInit {
  @Input() dataSource: RouteListDataSourceInterface<DataObjectType>;

  public currentUrlBS$ = new BehaviorSubject<string>(null);

  private _changeBroadcaster = new ChangeBroadcaster();
  private _componentDestroyedBroadcaster = new ComponentDestroyedBroadcaster();

  constructor(
    private _router: Router,
  ) {
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this._changeBroadcaster.broadcastChange();

    this.dataSource.connect(null).pipe(
      takeUntil(this._changeBroadcaster.changeS$),
      takeUntil(this._componentDestroyedBroadcaster.componentDestroyedS$),
    ).subscribe();
  }

  public ngOnDestroy(): void {
    this._changeBroadcaster.complete();
    this._componentDestroyedBroadcaster.broadcastComponentDestroyed();
  }

  public ngOnInit(): void {
    this._subscribeToRouterEvents();
  }

  private _subscribeToRouterEvents() {
    this.currentUrlBS$ = new BehaviorSubject<string>(this._router.url);
    this._router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      takeUntil(this._componentDestroyedBroadcaster.componentDestroyedS$),
    ).subscribe(() => {
      this.currentUrlBS$.next(this._router.url);
    });
  }
}
