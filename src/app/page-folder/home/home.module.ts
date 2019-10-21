import {NgModule} from '@angular/core';

import {HomeRoutingModule} from './home-routing.module';
import {IndexComponent} from './index/index.component';
import {TableWithDataSourceModule} from '../../util-angular/feature-folder/table-with-data-source/table-with-data-source.module';

@NgModule({
  declarations: [IndexComponent],
  imports: [
    HomeRoutingModule,
    TableWithDataSourceModule,
  ],
})
export class HomeModule {
}
