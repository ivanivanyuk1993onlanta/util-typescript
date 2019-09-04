import {TrackByFunction, Type} from '@angular/core';
import {Observable} from 'rxjs';
import {DynamicCellComponentInterface} from './dynamic-cell-component-interface';
import {DynamicHeaderCellComponentInterface} from './dynamic-header-cell-component-interface';
import {NgClass} from '@angular/common';

// used to get typeof ngClass in generic
const ngClassInstance = new NgClass(null);

export interface TableDataSourceInterface<CellComponentType extends DynamicCellComponentInterface<CellComponentType,
  HeaderCellComponentType,
  TableDataSourceType,
  DataObjectType,
  KeyType>,
  HeaderCellComponentType extends DynamicHeaderCellComponentInterface<CellComponentType,
    HeaderCellComponentType,
    TableDataSourceType,
    DataObjectType,
    KeyType>,
  TableDataSourceType extends TableDataSourceInterface<CellComponentType,
    HeaderCellComponentType,
    TableDataSourceType,
    DataObjectType,
    KeyType>,
  DataObjectType,
  KeyType> {
  readonly cellComponentType: Type<CellComponentType>;
  readonly headerCellComponentType: Type<HeaderCellComponentType>;
  readonly trackByFunc: TrackByFunction<DataObjectType>;

  getColumnCodeListContinuous$(): Observable<string[]>;

  getDataListContinuous$(): Observable<DataObjectType[]>;

  getKeyContinuous$(dataObject: DataObjectType): Observable<KeyType>;

  getKeyListContinuous$(dataObjectList: DataObjectType[]): Observable<KeyType[]>;

  getRowNgClassContinuous$?(dataObject: DataObjectType): Observable<typeof ngClassInstance.ngClass>;
}
