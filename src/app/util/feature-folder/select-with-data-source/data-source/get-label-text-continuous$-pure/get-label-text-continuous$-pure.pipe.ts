import { Pipe, PipeTransform } from '@angular/core';
import {SelectDataSourceInterface} from '../select-data-source-interface';

@Pipe({
  name: 'getLabelTextContinuous$Pure'
})
export class GetLabelTextContinuous$PurePipe<ValueType> implements PipeTransform {
  transform(
    selectDataSourceInterface: SelectDataSourceInterface<ValueType>,
  ) {
    return selectDataSourceInterface.getLabelTextContinuous$();
  }
}
