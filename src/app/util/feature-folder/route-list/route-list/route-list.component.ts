import {ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {RouteListDataSourceInterface} from '../data-source/route-list-data-source-interface';
import {ChangeBroadcaster} from '../../../class-folder/change-broadcaster/change-broadcaster';
import {filter, takeUntil} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';
import {NavigationEnd, Router} from '@angular/router';
import {FormControl} from '@angular/forms';
import {getControlObservableWithInitialValue$} from '../../../method-folder/form-helper/get-control-observable-with-initial-value';
import { MatOptionSelectionChange } from '@angular/material/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-route-list',
  styleUrls: ['./route-list.component.scss'],
  templateUrl: './route-list.component.html',
})
export class RouteListComponent<DataObjectType> implements OnChanges, OnDestroy, OnInit {
  @Input() dataSource: RouteListDataSourceInterface<DataObjectType>;

  public currentUrlBS$ = new BehaviorSubject<string>(null);
  public searchResultListBS$ = new BehaviorSubject<Array<DataObjectType>>([]);
  public searchTextFC = new FormControl();

  private _changeBroadcaster = new ChangeBroadcaster();
  private _componentDestroyedBroadcaster = new ChangeBroadcaster();

  constructor(
    private _router: Router,
  ) {
  }

  public handleFocus() {
    this.searchTextFC.updateValueAndValidity();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this._changeBroadcaster.broadcastChange();

    this._subscribeToSearchText();
  }

  public ngOnDestroy(): void {
    this._changeBroadcaster.complete();
    this._componentDestroyedBroadcaster.complete();
  }

  public ngOnInit(): void {
    this._subscribeToRouterEvents();
  }

  public selectOption(
    event: MatOptionSelectionChange,
    dataObject: DataObjectType,
  ): void {
    if (event.source.selected) {
      this.dataSource.getUrl$(dataObject).pipe(
        takeUntil(this._componentDestroyedBroadcaster.changeS$),
      ).subscribe(url => {
        this._router.navigateByUrl(url).then(() => {
          this.searchTextFC.setValue('');
        });
      });
    }
  }

  private _subscribeToRouterEvents() {
    this.currentUrlBS$ = new BehaviorSubject<string>(this._router.url);
    this._router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      takeUntil(this._componentDestroyedBroadcaster.changeS$),
    ).subscribe(() => {
      this.currentUrlBS$.next(this._router.url);
    });
  }

  private _subscribeToSearchText() {
    getControlObservableWithInitialValue$<string>(this.searchTextFC).pipe(
      takeUntil(this._changeBroadcaster.changeS$),
      takeUntil(this._componentDestroyedBroadcaster.changeS$),
    ).subscribe(searchText => {
      this.dataSource.getSearchResultList$(searchText).pipe(
        takeUntil(this._changeBroadcaster.changeS$),
        takeUntil(this._componentDestroyedBroadcaster.changeS$),
      ).subscribe(searchResultList => {
        this.searchResultListBS$.next(searchResultList);
      });
    });
  }
}
