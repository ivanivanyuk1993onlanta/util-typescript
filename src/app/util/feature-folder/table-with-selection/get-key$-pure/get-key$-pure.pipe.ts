import { Pipe, PipeTransform } from '@angular/core';
import {TableWithSelectionDataSourceInterface} from '../data-source/table-with-selection-data-source-interface';

@Pipe({
  name: 'getKey$Pure'
})
export class GetKey$PurePipe<CellDataSourceType, ColumnDescriptionType, DataObjectType, HeaderCellDataSourceType, KeyType> implements PipeTransform {
  transform(
    // tslint:disable-next-line:max-line-length
    dataSource: TableWithSelectionDataSourceInterface<CellDataSourceType, ColumnDescriptionType, DataObjectType, HeaderCellDataSourceType, KeyType>,
    dataObject: DataObjectType,
  ): any {
    return dataSource.getKey$(dataObject);
  }
}
