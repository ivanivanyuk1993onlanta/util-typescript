import {NgModule} from '@angular/core';

import {HomeRoutingModule} from './home-routing.module';
import {IndexComponent} from './index/index.component';
import {TableWithSelectionModule} from '../../util/feature-folder/table-with-selection/table-with-selection.module';

@NgModule({
  declarations: [IndexComponent],
  imports: [
    HomeRoutingModule,
    TableWithSelectionModule,
  ],
})
export class HomeModule {
}
