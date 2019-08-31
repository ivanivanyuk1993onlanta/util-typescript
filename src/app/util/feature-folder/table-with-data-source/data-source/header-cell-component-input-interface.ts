import {TableDataSourceInterface} from './table-data-source-interface';
import {DynamicCellComponentInterface} from './dynamic-cell-component-interface';
import {DynamicHeaderCellComponentInterface} from './dynamic-header-cell-component-interface';

export interface HeaderCellComponentInputInterface<CellComponentType extends DynamicCellComponentInterface<CellComponentType,
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
  KeyType = any> {
  columnCode: string;
  dataSource: TableDataSourceType;
}
