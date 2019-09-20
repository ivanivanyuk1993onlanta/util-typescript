import { Pipe, PipeTransform } from '@angular/core';
import {SelectDataSourceInterface} from '../select-data-source-interface';

@Pipe({
  name: 'getLabelTextContinuous$Pure'
})
export class GetLabelTextContinuous$PurePipe<OptionType> implements PipeTransform {
  transform(
    selectDataSourceInterface: SelectDataSourceInterface<OptionType>,
  ) {
    return selectDataSourceInterface.getLabelTextContinuous$();
  }
}
