import { Pipe, PipeTransform } from '@angular/core';
import {DynamicCellComponentInterface} from '../dynamic-cell-component-interface';
import {DynamicHeaderCellComponentInterface} from '../dynamic-header-cell-component-interface';
import {TableDataSourceInterface} from '../table-data-source-interface';

@Pipe({
  name: 'getKeyContinuous$Pure'
})
export class GetKeyContinuous$PurePipe<CellComponentType extends DynamicCellComponentInterface<CellComponentType,
  HeaderCellComponentType,
  TableDataSourceType,
  DataObjectType,
  KeyType>,
  HeaderCellComponentType extends DynamicHeaderCellComponentInterface<CellComponentType,
    HeaderCellComponentType,
    TableDataSourceType,
    DataObjectType,
    KeyType>,
  TableDataSourceType extends TableDataSourceInterface<CellComponentType,
    HeaderCellComponentType,
    TableDataSourceType,
    DataObjectType,
    KeyType>,
  DataObjectType = any,
  KeyType = any> implements PipeTransform {
  transform(
    tableDataSource: TableDataSourceType,
    dataObject: DataObjectType,
  ) {
    return tableDataSource.getKeyContinuous$(dataObject);
  }
}
