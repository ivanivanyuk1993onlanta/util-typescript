import {TrackByFunction, Type} from '@angular/core';
import {Observable} from 'rxjs';
import {DynamicComponentInterface} from '../../dynamic-container/dynamic-container/dynamic-component-interface';
import {CellComponentInputInterface} from './cell-component-input-interface';
import {HeaderCellComponentInputInterface} from './header-cell-component-input-interface';

export interface TreeTableDataSourceInterface<CellComponentType, DataObjectType, HeaderCellComponentType> {
  // tslint:disable-next-line:max-line-length
  readonly cellComponentType: Type<DynamicComponentInterface<HeaderCellComponentInputInterface<CellComponentType, DataObjectType, HeaderCellComponentType>>>;

  // tslint:disable-next-line:max-line-length
  readonly headerCellComponentType: Type<DynamicComponentInterface<CellComponentInputInterface<CellComponentType, DataObjectType, HeaderCellComponentType>>>;

  readonly trackByFunc: TrackByFunction<DataObjectType>;

  getColumnCodeListContinuous$(): Observable<Array<string>>;

  getDataListContinuous$(): Observable<Array<DataObjectType>>;
}
