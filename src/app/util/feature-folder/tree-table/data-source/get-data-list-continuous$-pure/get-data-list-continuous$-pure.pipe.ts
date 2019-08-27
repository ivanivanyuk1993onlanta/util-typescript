import { Pipe, PipeTransform } from '@angular/core';
import {TreeTableDataSourceInterface} from '../tree-table-data-source-interface';

@Pipe({
  name: 'getDataListContinuous$Pure'
})
export class GetDataListContinuous$PurePipe<CellComponentType, DataObjectType, HeaderCellComponentType> implements PipeTransform {
  transform(
    treeTableDataSource: TreeTableDataSourceInterface<CellComponentType, DataObjectType, HeaderCellComponentType>,
  ) {
    return treeTableDataSource.getDataListContinuous$();
  }
}
