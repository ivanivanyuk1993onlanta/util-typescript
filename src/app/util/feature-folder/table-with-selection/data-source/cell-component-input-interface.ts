import {TableWithSelectionDataSourceInterface} from './table-with-selection-data-source-interface';

export interface CellComponentInputInterface<CellDataSourceType, ColumnDescriptionType, DataObjectType, HeaderCellDataSourceType> {
  columnDescription: ColumnDescriptionType;
  dataObject: DataObjectType;
  dataSource: TableWithSelectionDataSourceInterface<CellDataSourceType, ColumnDescriptionType, DataObjectType, HeaderCellDataSourceType>;
}
