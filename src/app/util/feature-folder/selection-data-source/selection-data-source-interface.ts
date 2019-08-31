import {SelectionModel} from '@angular/cdk/collections';
import {Observable} from 'rxjs';

export interface SelectionDataSourceInterface<DataObjectType> {
  readonly selectionModel: SelectionModel<DataObjectType>;

  isSelectedContinuous$(dataObject: DataObjectType): Observable<boolean>;
}
