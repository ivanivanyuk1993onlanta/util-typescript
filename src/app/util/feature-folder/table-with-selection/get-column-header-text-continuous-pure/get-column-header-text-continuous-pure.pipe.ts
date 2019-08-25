import { Pipe, PipeTransform } from '@angular/core';
import {TableWithSelectionDataSourceInterface} from '../data-source/table-with-selection-data-source-interface';
import {Observable} from 'rxjs';

@Pipe({
  name: 'getColumnHeaderTextContinuousPure'
})
export class GetColumnHeaderTextContinuousPurePipe<ColumnDescriptionType, DataObjectType> implements PipeTransform {
  transform(
    dataSource: TableWithSelectionDataSourceInterface<ColumnDescriptionType, DataObjectType>,
    columnDescription: ColumnDescriptionType,
  ): Observable<string> {
    return dataSource.getColumnHeaderTextContinuous$(columnDescription);
  }
}
