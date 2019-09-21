import {Pipe, PipeTransform} from '@angular/core';
import {LayoutDataSourceInterface} from '../layout-data-source-interface';

@Pipe({
  name: 'getSideNavContainerNgClassContinuous$Pure'
})
export class GetSideNavContainerNgClassContinuous$PurePipe implements PipeTransform {
  transform(
    layoutDataSource: LayoutDataSourceInterface,
  ) {
    return layoutDataSource.getSideNavContainerNgClassContinuous$();
  }
}
