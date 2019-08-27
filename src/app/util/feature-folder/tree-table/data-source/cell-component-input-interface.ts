import {TreeTableDataSourceInterface} from './tree-table-data-source-interface';

export interface CellComponentInputInterface<CellComponentType, DataObjectType, HeaderCellComponentType> {
  columnCode: string;
  dataObject: DataObjectType;
  dataSource: TreeTableDataSourceInterface<CellComponentType, DataObjectType, HeaderCellComponentType>;
}
