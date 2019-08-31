import { Pipe, PipeTransform } from '@angular/core';
import {SelectDataSourceInterface} from '../select-data-source-interface';

@Pipe({
  name: 'getValueListContinuous$Pure'
})
export class GetValueListContinuous$PurePipe<ValueType> implements PipeTransform {
  transform(
    selectDataSourceInterface: SelectDataSourceInterface<ValueType>,
  ) {
    return selectDataSourceInterface.getValueListContinuous$();
  }
}
