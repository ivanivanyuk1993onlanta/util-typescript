import {TableWithSelectionDataSourceInterface} from './table-with-selection-data-source-interface';

export interface HeaderCellComponentInputInterface<CellDataSourceType, ColumnDescriptionType, DataObjectType, HeaderCellDataSourceType, KeyType> {
  columnDescription: ColumnDescriptionType;
  // tslint:disable-next-line:max-line-length
  dataSource: TableWithSelectionDataSourceInterface<CellDataSourceType, ColumnDescriptionType, DataObjectType, HeaderCellDataSourceType, KeyType>;
}
