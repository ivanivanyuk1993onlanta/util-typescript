import { Pipe, PipeTransform } from '@angular/core';
import {TableWithSelectionDataSourceInterface} from '../data-source/table-with-selection-data-source-interface';
import {Observable} from 'rxjs';

@Pipe({
  name: 'getColumnTextContinuousPure'
})
export class GetColumnTextContinuousPurePipe<ColumnDescriptionType, DataObjectType> implements PipeTransform {
  transform(
    dataSource: TableWithSelectionDataSourceInterface<ColumnDescriptionType, DataObjectType>,
    columnDescription: ColumnDescriptionType,
    dataObject: DataObjectType,
  ): Observable<string> {
    return dataSource.getColumnTextContinuous$(columnDescription, dataObject);
  }
}
