import {TableWithSelectionDataSourceInterface} from './table-with-selection-data-source-interface';

export interface HeaderCellComponentInputInterface<CellDataSourceType, ColumnDescriptionType, DataObjectType, HeaderCellDataSourceType> {
  columnDescription: ColumnDescriptionType;
  dataSource: TableWithSelectionDataSourceInterface<CellDataSourceType, ColumnDescriptionType, DataObjectType, HeaderCellDataSourceType>;
}
