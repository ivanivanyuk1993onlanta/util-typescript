import { Pipe, PipeTransform } from '@angular/core';
import {SelectDataSourceInterface} from '../select-data-source-interface';

@Pipe({
  name: 'getOptionListContinuous$Pure'
})
export class GetOptionListContinuous$PurePipe<OptionType> implements PipeTransform {
  transform(
    selectDataSourceInterface: SelectDataSourceInterface<OptionType>,
  ) {
    return selectDataSourceInterface.getOptionListContinuous$();
  }
}
