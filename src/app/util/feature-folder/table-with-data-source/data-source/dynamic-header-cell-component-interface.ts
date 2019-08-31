import {DynamicComponentInterface} from '../../dynamic-container/dynamic-container/dynamic-component-interface';
import {HeaderCellComponentInputInterface} from './header-cell-component-input-interface';
import {DynamicCellComponentInterface} from './dynamic-cell-component-interface';
import {TableDataSourceInterface} from './table-data-source-interface';

export interface DynamicHeaderCellComponentInterface<CellComponentType extends DynamicCellComponentInterface<CellComponentType,
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
  KeyType = any> extends DynamicComponentInterface<HeaderCellComponentInputInterface<CellComponentType,
  HeaderCellComponentType,
  TableDataSourceType,
  DataObjectType,
  KeyType>> {
}
