import {DataSource} from '@angular/cdk/table';
import {Observable} from 'rxjs';
import {Type} from '@angular/core';
import {DynamicComponentInterface} from '../../dynamic-container/dynamic-container/dynamic-component-interface';
import {CellComponentInputInterface} from './cell-component-input-interface';
import {HeaderCellComponentInputInterface} from './header-cell-component-input-interface';

export interface TableWithSelectionDataSourceInterface<CellDataSourceType, ColumnDescriptionType, DataObjectType, HeaderCellDataSourceType, KeyType> extends DataSource<DataObjectType> {
  // tslint:disable-next-line:max-line-length
  readonly cellComponentType: Type<DynamicComponentInterface<CellComponentInputInterface<CellDataSourceType, ColumnDescriptionType, DataObjectType, HeaderCellDataSourceType, KeyType>>>;
  readonly cellDataSource: CellDataSourceType;
  readonly columnCodeListContinuous$: Observable<Array<string>>;
  readonly columnDescriptionListContinuous$: Observable<Array<ColumnDescriptionType>>;
  // tslint:disable-next-line:max-line-length
  readonly headerCellComponentType: Type<DynamicComponentInterface<HeaderCellComponentInputInterface<CellDataSourceType, ColumnDescriptionType, DataObjectType, HeaderCellDataSourceType, KeyType>>>;
  readonly headerCellDataSource: HeaderCellDataSourceType;

  getColumnCode$(columnDescription: ColumnDescriptionType): Observable<string>;

  getColumnHeaderTextContinuous$(columnDescription: ColumnDescriptionType): Observable<string>;

  getColumnTextContinuous$(columnDescription: ColumnDescriptionType, dataObject: DataObjectType): Observable<string>;

  getKey$(dataObject: DataObjectType): Observable<KeyType>;

  getKeyList$(dataList: Array<DataObjectType>): Observable<Array<KeyType>>;

  trackByFunction(index: number, dataObject: DataObjectType): any;
}
