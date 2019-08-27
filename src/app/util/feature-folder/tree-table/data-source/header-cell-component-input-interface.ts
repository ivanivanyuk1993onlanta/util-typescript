import {TreeTableDataSourceInterface} from './tree-table-data-source-interface';

export interface HeaderCellComponentInputInterface<CellComponentType, DataObjectType> {
  columnCode: string;
  dataSource: TreeTableDataSourceInterface<CellComponentType, DataObjectType>;
}
