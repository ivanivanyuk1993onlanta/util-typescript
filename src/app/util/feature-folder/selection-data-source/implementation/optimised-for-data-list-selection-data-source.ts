import {SelectionDataSourceInterface} from '../selection-data-source-interface';
import {SelectionModel} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {mergeMap, takeUntil, tap, withLatestFrom} from 'rxjs/operators';

// This class uses optimisation - we know data list, hence we can build map of single observables for O(n) on data list
// change and use it in isSelectedContinuous$, which will allow to call isSelected(dataObject) only in affected
// Observable, instead of subscribing to whole map change in every subscriber, which would cast to all subscribers on every change

// todo think about adding counter subject that should count data source users and emit when it reaches 0 to destroy
//  subscriptions

export class OptimisedForDataListSelectionDataSource<DataObjectType> implements SelectionDataSourceInterface<DataObjectType> {
  public readonly selectionModel: SelectionModel<DataObjectType> = new SelectionModel<DataObjectType>(true);

  private _dataObjectToIsSelectedBS$MapBS$ = new BehaviorSubject(new Map<DataObjectType, BehaviorSubject<boolean>>());

  constructor(
    dataListContinuous$: Observable<Array<DataObjectType>>,
    destroyedS$: Subject<void>,
  ) {
    dataListContinuous$.pipe(
      withLatestFrom(this._dataObjectToIsSelectedBS$MapBS$),
      tap(([dataList, dataObjectToIsSelectedBS$Map]) => {
        // creating list to write deselect values to
        const deselectList: DataObjectType[] = [];
        // creating new map from scratch, as we can not optimise to use old map, because we need set of new values anyway
        const newDataObjectToIsSelectedBS$Map = new Map(dataList.map(dataObject => {
          // trying to get isSelectedBS$ from last map
          const isSelectedBS$ = dataObjectToIsSelectedBS$Map.get(dataObject);
          // if we got isSelectedBS$, returning key-value pair
          if (isSelectedBS$) {
            return [
              dataObject,
              isSelectedBS$,
            ];
            // if we didn't, returning key-value pair with new BehaviorSubject, not forgetting to push key to deselectList to bulk deselect
            // later
          } else {
            deselectList.push(dataObject);
            return [
              dataObject,
              new BehaviorSubject(false),
            ];
          }
        }));

        // deselecting before pushing new map, while removed in new map keys still exist, because if we do it after, we will have to check
        // for key existence in selectionModel.changed subscription
        this.selectionModel.deselect(...deselectList);

        this._dataObjectToIsSelectedBS$MapBS$.next(newDataObjectToIsSelectedBS$Map);
      }),
      takeUntil(destroyedS$),
    ).subscribe();

    this.selectionModel.changed.pipe(
      withLatestFrom(this._dataObjectToIsSelectedBS$MapBS$),
      takeUntil(destroyedS$),
    ).subscribe(([selectionChange, dataObjectToIsSelectedBS$Map]) => {
      if (selectionChange) {
        // Кидаем новое значение
        for (const added of selectionChange.added) {
          dataObjectToIsSelectedBS$Map.get(added).next(true);
        }
        // Кидаем новое значение
        for (const removed of selectionChange.removed) {
          dataObjectToIsSelectedBS$Map.get(removed).next(false);
        }
      }
    });
  }

  public isSelectedContinuous$(dataObject: DataObjectType): Observable<boolean> {
    return this._dataObjectToIsSelectedBS$MapBS$.pipe(
      // Notice that we return of(false) when value does not exist in map(it can happen legitimately when map or key
      // stream fired before key or map stream, we do not want creating synchronization outside, hence we return
      // of(false), as it is logical that value, which is not in data list, not selected)
      // We could also filter values that don't exist in map, but it wouldn't be logical, because stream wouldn't fire,
      // even if we know that data object can not be selected, hence it is not
      mergeMap(dataObjectToIsSelectedBS$Map => dataObjectToIsSelectedBS$Map.get(dataObject) || of(false)),
    );
  }
}
