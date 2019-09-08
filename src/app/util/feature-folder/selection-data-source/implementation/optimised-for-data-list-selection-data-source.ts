import {SelectionDataSourceInterface} from '../selection-data-source-interface';
import {SelectionModel} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {map, mergeMap, takeUntil, tap, withLatestFrom} from 'rxjs/operators';
import {getSharedObservableWithLastValue} from '../../../method-folder/get-shared-observable-with-last-value/get-shared-observable-with-last-value';

// This class uses optimisation - we know data list, hence we can build map of single observables for O(n) on data list
// change and use it in isSelectedContinuous$, which will allow to call isSelected(dataObject) only in affected
// Observable, instead of subscribing to whole map change in every subscriber, which would cast to all subscribers on every change

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
          // notice that this solution requires
          // - n map.set()
          // - n map.get()
          // - n_old map.has()

          const lastDataObjectToIsSelectedBS$Map = this._lastDataObjectToIsSelectedBS$Map;
          // n map.get(), n map.set()
          const newDataObjectToIsSelectedBS$Map = new Map(dataList.map(dataObject => {
            return [
              dataObject,
              lastDataObjectToIsSelectedBS$Map.get(dataObject) || new BehaviorSubject(false),
            ];
          }));

          // n_old map.has()
          const deselectList: DataObjectType[] = [];
          for (const dataObject of lastDataObjectToIsSelectedBS$Map.keys()) {
            if (!newDataObjectToIsSelectedBS$Map.has(dataObject)) {
              deselectList.push(dataObject);
            }
          }

          this.selectionModel.deselect(...deselectList);
          return newDataObjectToIsSelectedBS$Map;
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
