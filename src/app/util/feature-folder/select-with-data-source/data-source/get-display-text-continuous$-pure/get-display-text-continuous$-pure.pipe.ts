import { Pipe, PipeTransform } from '@angular/core';
import {SelectDataSourceInterface} from '../select-data-source-interface';

@Pipe({
  name: 'getDisplayTextContinuous$Pure'
})
export class GetDisplayTextContinuous$PurePipe<ValueType> implements PipeTransform {
  transform(
    selectDataSourceInterface: SelectDataSourceInterface<ValueType>,
    value: ValueType,
  ) {
    return selectDataSourceInterface.getDisplayTextContinuous$(value);
  }
}
