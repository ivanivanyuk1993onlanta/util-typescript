import {DataSource} from '@angular/cdk/table';
import {Observable} from 'rxjs';
import {Type} from '@angular/core';
import {DynamicComponentInterface} from '../../dynamic-container/dynamic-container/dynamic-component-interface';
import {CellComponentInputInterface} from './cell-component-input-interface';
import {HeaderCellComponentInputInterface} from './header-cell-component-input-interface';

export interface TableWithSelectionDataSourceInterface<CellDataSourceType, ColumnDescriptionType, DataObjectType, HeaderCellDataSourceType> extends DataSource<DataObjectType> {
  // tslint:disable-next-line:max-line-length
  readonly cellComponentType: Type<DynamicComponentInterface<CellComponentInputInterface<CellDataSourceType, ColumnDescriptionType, DataObjectType, HeaderCellDataSourceType>>>;
  readonly cellDataSource: CellDataSourceType;
  readonly columnCodeListContinuous$: Observable<Array<string>>;
  readonly columnDescriptionListContinuous$: Observable<Array<ColumnDescriptionType>>;
  // tslint:disable-next-line:max-line-length
  readonly headerCellComponentType: Type<DynamicComponentInterface<HeaderCellComponentInputInterface<CellDataSourceType, ColumnDescriptionType, DataObjectType, HeaderCellDataSourceType>>>;
  readonly headerCellDataSource: HeaderCellDataSourceType;

  getColumnCode$(columnDescription: ColumnDescriptionType): Observable<string>;

  getColumnHeaderTextContinuous$(columnDescription: ColumnDescriptionType): Observable<string>;

  getColumnTextContinuous$(columnDescription: ColumnDescriptionType, dataObject: DataObjectType): Observable<string>;

  trackByFunction(index: number, dataObject: DataObjectType): any;
}
