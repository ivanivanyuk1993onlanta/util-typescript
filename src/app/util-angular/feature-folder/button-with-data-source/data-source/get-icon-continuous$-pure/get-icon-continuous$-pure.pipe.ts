import { Pipe, PipeTransform } from '@angular/core';
import {ButtonDataSourceInterface} from '../button-data-source-interface';

@Pipe({
  name: 'getIconContinuous$Pure'
})
export class GetIconContinuous$PurePipe implements PipeTransform {
  transform(
    buttonDataSource: ButtonDataSourceInterface,
  ) {
    return buttonDataSource.getIconContinuous$();
  }
}
