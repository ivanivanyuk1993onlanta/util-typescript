import { Pipe, PipeTransform } from '@angular/core';
import {TreeTableDataSourceInterface} from '../tree-table-data-source-interface';

@Pipe({
  name: 'getColumnCodeListContinuous$Pure'
})
export class GetColumnCodeListContinuous$PurePipe<CellComponentType, DataObjectType, HeaderCellComponentType> implements PipeTransform {
  transform(
    treeTableDataSource: TreeTableDataSourceInterface<CellComponentType, DataObjectType, HeaderCellComponentType>,
  ): any {
    return treeTableDataSource.getColumnCodeListContinuous$();
  }
}
