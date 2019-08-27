import { Pipe, PipeTransform } from '@angular/core';
import {TableWithSelectionDataSourceInterface} from '../data-source/table-with-selection-data-source-interface';
import {Observable} from 'rxjs';

@Pipe({
  name: 'getColumnHeaderTextContinuousPure'
})
export class GetColumnHeaderTextContinuousPurePipe<CellDataSourceType, ColumnDescriptionType, DataObjectType, HeaderCellDataSourceType, KeyType> implements PipeTransform {
  transform(
    // tslint:disable-next-line:max-line-length
    dataSource: TableWithSelectionDataSourceInterface<CellDataSourceType, ColumnDescriptionType, DataObjectType, HeaderCellDataSourceType, KeyType>,
    columnDescription: ColumnDescriptionType,
  ): Observable<string> {
    return dataSource.getColumnHeaderTextContinuous$(columnDescription);
  }
}
