import {Pipe, PipeTransform} from '@angular/core';
import {SelectionDataSourceInterface} from '../selection-data-source-interface';

@Pipe({
  name: 'isSelectedContinuous$Pure'
})
export class IsSelectedContinuous$PurePipe<DataObjectType> implements PipeTransform {
  transform(
    selectionDataSource: SelectionDataSourceInterface<DataObjectType>,
    dataObject: DataObjectType,
  ) {
    return selectionDataSource.isSelectedContinuous$(dataObject);
  }
}
