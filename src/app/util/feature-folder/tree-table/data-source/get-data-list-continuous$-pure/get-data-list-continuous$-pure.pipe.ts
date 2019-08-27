import { Pipe, PipeTransform } from '@angular/core';
import {TreeTableDataSourceInterface} from '../tree-table-data-source-interface';

@Pipe({
  name: 'getDataListContinuous$Pure'
})
export class GetDataListContinuous$PurePipe<DataObjectType> implements PipeTransform {
  transform(
    treeTableDataSource: TreeTableDataSourceInterface<DataObjectType>,
  ) {
    return treeTableDataSource.getDataListContinuous$();
  }
}
