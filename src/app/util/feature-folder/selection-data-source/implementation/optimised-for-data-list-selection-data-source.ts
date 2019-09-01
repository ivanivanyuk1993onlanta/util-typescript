import {SelectionDataSourceInterface} from '../selection-data-source-interface';
import {SelectionModel} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {getSharedObservableWithLastValue} from '../../../method-folder/get-shared-observable-with-last-value/get-shared-observable-with-last-value';
import {map, mergeMap, takeUntil, tap, withLatestFrom} from 'rxjs/operators';

// This class uses optimisation - we know data list, hence we can build map of single observables for O(n) on data list
// change and use it in isSelectedContinuous$, which will allow to call isSelected(dataObject) only in affected
// Observable

// todo think about adding counter subject that should count data source users and emit when it reaches 0 to destroy
//  subscriptions

export class OptimisedForDataListSelectionDataSource<DataObjectType> implements SelectionDataSourceInterface<DataObjectType> {
  public readonly selectionModel: SelectionModel<DataObjectType> = new SelectionModel<DataObjectType>(true);

  private _dataObjectToIsSelectedBS$MapContinuous$: Observable<Map<DataObjectType, BehaviorSubject<boolean>>>;
  private _lastDataObjectToIsSelectedBS$Map = new Map<DataObjectType, BehaviorSubject<boolean>>();

  constructor(
    dataListContinuous$: Observable<Array<DataObjectType>>,
    destroyedS$: Subject<void>,
  ) {
    this._dataObjectToIsSelectedBS$MapContinuous$ = getSharedObservableWithLastValue(
      dataListContinuous$.pipe(
        map(dataList => {
          const newDataSet = new Set(dataList);
          const lastDataObjectToIsSelectedBS$Map = this._lastDataObjectToIsSelectedBS$Map;

          const deselectList: DataObjectType[] = [];

          // Removing from map entries which do not exist in data set, or removing from data set entries that already
          // exist in map to not process them while adding
          for (const dataObject of lastDataObjectToIsSelectedBS$Map.keys()) {
            // if dataObject exists in new data set, it should not be added later, hence we remove it
            if (newDataSet.has(dataObject)) {
              newDataSet.delete(dataObject);
              // else we should remove it from both lastDataObjectToIsSelectedBS$Map and mark it to be removed from
              // selectionModel to produce only one stream event instead of stream event per iteration
            } else {
              deselectList.push(dataObject);
            }
          }

          // not forgetting to deselect marked list
          // notice that if we lastDataObjectToIsSelectedBS$Map.delete(dataObject) before deselect(...deselectList),
          // deselect will throw error, because selectionModel changed subscription does not check existence
          this.selectionModel.deselect(...deselectList);
          for (const dataObject of deselectList) {
            lastDataObjectToIsSelectedBS$Map.delete(dataObject);
          }

          // Adding rest dataObject list to lastDataObjectToIsSelectedBS$Map
          // Notice that it contains here only new keys, that do not exist in map
          for (const dataObject of newDataSet) {
            lastDataObjectToIsSelectedBS$Map.set(dataObject, new BehaviorSubject(false));
          }

          return lastDataObjectToIsSelectedBS$Map;
        }),
        tap(dataObjectToIsSelectedBS$Map => {
          this._lastDataObjectToIsSelectedBS$Map = dataObjectToIsSelectedBS$Map;
        }),
      ),
    );

    this.selectionModel.changed.pipe(
      withLatestFrom(this._dataObjectToIsSelectedBS$MapContinuous$),
      takeUntil(destroyedS$),
    ).subscribe(([selectionChange, dataObjectToIsSelectedBS$Map]) => {
      if (selectionChange) {
        // Кидаем новое значение/добавляем в мапу added
        for (const added of selectionChange.added) {
          dataObjectToIsSelectedBS$Map.get(added).next(true);
        }
        // Кидаем новое значение/добавляем в мапу removed
        for (const removed of selectionChange.removed) {
          dataObjectToIsSelectedBS$Map.get(removed).next(false);
        }
      }
    });
  }

  public isSelectedContinuous$(dataObject: DataObjectType): Observable<boolean> {
    return this._dataObjectToIsSelectedBS$MapContinuous$.pipe(
      // Notice that we return of(false) when value does not exist in map(it can happen legitimately when map or key
      // stream fired before key or map stream, we do not want creating synchronization outside, hence we return
      // of(false), as it is logical that value, which is not in data list, not selected)
      // We could also filter values that don't exist in map, but it wouldn't be logical, because stream wouldn't fire,
      // even if we know that data object can not be selected, hence it is not
      mergeMap(dataObjectToIsSelectedBS$Map => dataObjectToIsSelectedBS$Map.get(dataObject) || of(false)),
    );
  }
}
