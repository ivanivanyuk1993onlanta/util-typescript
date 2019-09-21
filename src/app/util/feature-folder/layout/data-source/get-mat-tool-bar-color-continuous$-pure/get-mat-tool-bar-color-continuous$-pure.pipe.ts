import { Pipe, PipeTransform } from '@angular/core';
import {LayoutDataSourceInterface} from '../layout-data-source-interface';

@Pipe({
  name: 'getMatToolBarColorContinuous$Pure'
})
export class GetMatToolBarColorContinuous$PurePipe implements PipeTransform {
  transform(
    layoutDataSource: LayoutDataSourceInterface,
  ) {
    return layoutDataSource.getMatToolBarColorContinuous$();
  }
}
