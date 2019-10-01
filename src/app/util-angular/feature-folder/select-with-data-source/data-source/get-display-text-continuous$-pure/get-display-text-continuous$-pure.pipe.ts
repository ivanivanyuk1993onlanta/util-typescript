import { Pipe, PipeTransform } from '@angular/core';
import {SelectDataSourceInterface} from '../select-data-source-interface';

@Pipe({
  name: 'getDisplayTextContinuous$Pure'
})
export class GetDisplayTextContinuous$PurePipe<OptionType> implements PipeTransform {
  transform(
    selectDataSourceInterface: SelectDataSourceInterface<OptionType>,
    option: OptionType,
  ) {
    return selectDataSourceInterface.getDisplayTextContinuous$(option);
  }
}
