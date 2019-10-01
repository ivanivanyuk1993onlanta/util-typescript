import {ChangeDetectionStrategy, Component, Input, OnChanges} from '@angular/core';
import {RouteListComponent} from '../route-list/route-list.component';
import {BehaviorSubject, Observable} from 'rxjs';
import {filter, mergeMap} from 'rxjs/operators';
import {getSharedObservableWithLastValue} from '../../../util-typescript/get-shared-observable-with-last-value/get-shared-observable-with-last-value';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-route-list-item',
  styleUrls: ['./route-list-item.component.scss'],
  templateUrl: './route-list-item.component.html',
})

export class RouteListItemComponent<DataObjectType> implements OnChanges {
  @Input() dataObject: DataObjectType;
  @Input() routeListComponent: RouteListComponent<DataObjectType>;

  public childListContinuousS$: Observable<DataObjectType[]>;
  public iconCodeContinuousS$: Observable<string>;
  public isExpandedBS$ = new BehaviorSubject(false);
  public matchesUrlContinuousS$: Observable<boolean>;
  public urlContinuousS$: Observable<string>;

  public handleExpandedChange(isExpanded: boolean) {
    this.isExpandedBS$.next(isExpanded);
  }

  public ngOnChanges(): void {
    const dataObject = this.dataObject;
    const routeListComponent = this.routeListComponent;
    const dataSource = routeListComponent.dataSource;

    this.childListContinuousS$ = getSharedObservableWithLastValue(
      this.isExpandedBS$.pipe(
        filter(x => !!x),
        mergeMap(() => dataSource.getChildList$(dataObject)),
      ),
    );

    this.iconCodeContinuousS$ = getSharedObservableWithLastValue(dataSource.getIconCode$(dataObject));

    this.matchesUrlContinuousS$ = getSharedObservableWithLastValue(
      routeListComponent.currentUrlBS$.pipe(
        mergeMap(url => dataSource.matchesUrl$(dataObject, url)),
      ),
    );

    this.urlContinuousS$ = getSharedObservableWithLastValue(dataSource.getUrl$(dataObject));
  }
}
