import { Pipe, PipeTransform } from '@angular/core';
import {TableDataSourceInterface} from '../table-data-source-interface';
import {DynamicCellComponentInterface} from '../dynamic-cell-component-interface';
import {DynamicHeaderCellComponentInterface} from '../dynamic-header-cell-component-interface';

@Pipe({
  name: 'getDataListContinuous$Pure'
})
export class GetDataListContinuous$PurePipe<CellComponentType extends DynamicCellComponentInterface<DataObjectType,
  TableDataSourceType>,
  HeaderCellComponentType extends DynamicHeaderCellComponentInterface<TableDataSourceType>,
  TableDataSourceType extends TableDataSourceInterface<CellComponentType,
    HeaderCellComponentType,
    TableDataSourceType,
    DataObjectType,
    KeyType>,
  DataObjectType = any,
  KeyType = any> implements PipeTransform {
  transform(
    tableDataSource: TableDataSourceType,
  ) {
    return tableDataSource.getDataListContinuous$();
  }
}
