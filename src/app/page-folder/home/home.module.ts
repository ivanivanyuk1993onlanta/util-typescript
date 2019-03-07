import {NgModule} from '@angular/core';

import {HomeRoutingModule} from './home-routing.module';
import {IndexComponent} from './index/index.component';
import {SharedModule} from '../../util/module/shared/shared.module';

@NgModule({
  declarations: [IndexComponent],
  imports: [
    HomeRoutingModule,
    SharedModule,
  ],
})
export class HomeModule {
}
