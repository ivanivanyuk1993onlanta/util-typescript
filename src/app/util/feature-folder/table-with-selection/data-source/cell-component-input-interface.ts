import {TableWithSelectionDataSourceInterface} from './table-with-selection-data-source-interface';

export interface CellComponentInputInterface<CellDataSourceType, ColumnDescriptionType, DataObjectType, HeaderCellDataSourceType, KeyType> {
  columnDescription: ColumnDescriptionType;
  dataObject: DataObjectType;
  // tslint:disable-next-line:max-line-length
  dataSource: TableWithSelectionDataSourceInterface<CellDataSourceType, ColumnDescriptionType, DataObjectType, HeaderCellDataSourceType, KeyType>;
}
