import {DataSource} from '@angular/cdk/table';
import {Observable} from 'rxjs';

export interface TableWithSelectionDataSourceInterface<ColumnDescriptionType, DataObjectType> extends DataSource<DataObjectType> {
  readonly columnCodeListContinuous$: Observable<Array<string>>;
  readonly columnDescriptionListContinuous$: Observable<Array<ColumnDescriptionType>>;

  getColumnCode$(columnDescription: ColumnDescriptionType): Observable<string>;

  getColumnHeaderTextContinuous$(columnDescription: ColumnDescriptionType): Observable<string>;

  getColumnTextContinuous$(columnDescription: ColumnDescriptionType, dataObject: DataObjectType): Observable<string>;

  trackByFunction(index: number, dataObject: DataObjectType): any;
}
