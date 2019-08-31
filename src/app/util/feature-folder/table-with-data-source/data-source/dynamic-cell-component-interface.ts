import {DynamicComponentInterface} from '../../dynamic-container/dynamic-container/dynamic-component-interface';
import {CellComponentInputInterface} from './cell-component-input-interface';
import {DynamicHeaderCellComponentInterface} from './dynamic-header-cell-component-interface';
import {TableDataSourceInterface} from './table-data-source-interface';

export interface DynamicCellComponentInterface<CellComponentType extends DynamicCellComponentInterface<CellComponentType,
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
  DataObjectType = any,
  KeyType = any> extends DynamicComponentInterface<CellComponentInputInterface<CellComponentType,
  HeaderCellComponentType,
  TableDataSourceType,
  DataObjectType,
  KeyType>> {
}
