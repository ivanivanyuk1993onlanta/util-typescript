import {Pipe, PipeTransform} from '@angular/core';
import {ButtonDataSourceInterface} from '../button-data-source-interface';

@Pipe({
  name: 'getDisplayTextContinuous$Pure'
})
export class GetDisplayTextContinuous$PurePipe implements PipeTransform {
  transform(
    buttonDataSource: ButtonDataSourceInterface,
  ) {
    return buttonDataSource.getDisplayTextContinuous$();
  }
}
