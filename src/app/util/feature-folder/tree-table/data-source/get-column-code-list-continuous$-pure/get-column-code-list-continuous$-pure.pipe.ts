import { Pipe, PipeTransform } from '@angular/core';
import {TreeTableDataSourceInterface} from '../tree-table-data-source-interface';

@Pipe({
  name: 'getColumnCodeListContinuous$Pure'
})
export class GetColumnCodeListContinuous$PurePipe<DataObjectType> implements PipeTransform {
  transform(
    treeTableDataSource: TreeTableDataSourceInterface<DataObjectType>,
  ): any {
    return treeTableDataSource.getColumnCodeListContinuous$();
  }
}
