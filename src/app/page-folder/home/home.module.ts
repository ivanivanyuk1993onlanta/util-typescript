import {NgModule} from '@angular/core';

import {HomeRoutingModule} from './home-routing.module';
import {IndexComponent} from './index/index.component';
import {RouteListModule} from '../../util/feature-folder/route-list/route-list.module';

@NgModule({
  declarations: [IndexComponent],
  imports: [
    HomeRoutingModule,
    RouteListModule,
  ],
})
export class HomeModule {
}
