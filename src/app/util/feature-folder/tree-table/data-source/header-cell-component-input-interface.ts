import {TreeTableDataSourceInterface} from './tree-table-data-source-interface';

export interface HeaderCellComponentInputInterface<CellComponentType, HeaderCellComponentType, DataObjectType> {
  columnCode: string;
  dataSource: TreeTableDataSourceInterface<CellComponentType, HeaderCellComponentType, DataObjectType>;
}
