import {SelectionChange, SelectionModel} from '@angular/cdk/collections';
import {Observable} from 'rxjs';
import {getSharedObservableWithLastValue} from '../../../util-typescript/get-shared-observable-with-last-value/get-shared-observable-with-last-value';
import {map} from 'rxjs/operators';
import {SelectionDataSourceInterface} from '../selection-data-source-interface';

// This class is called simple, because every subscription runs isSelected(dataObject) on every selection change, O(n)

export class SimpleSelectionDataSource<DataObjectType> implements SelectionDataSourceInterface<DataObjectType> {
  public readonly selectionModel = new SelectionModel<DataObjectType>(true);

  private _selectionChangeContinuous$: Observable<SelectionChange<DataObjectType>>;

  constructor() {
    this._selectionChangeContinuous$ = getSharedObservableWithLastValue(this.selectionModel.changed);
  }

  public isSelectedContinuous$(dataObject: DataObjectType): Observable<boolean> {
    return this._selectionChangeContinuous$.pipe(
      map(() => this.selectionModel.isSelected(dataObject)),
    );
  }
}
