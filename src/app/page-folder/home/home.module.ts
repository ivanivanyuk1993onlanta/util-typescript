import {NgModule} from '@angular/core';

import {HomeRoutingModule} from './home-routing.module';
import {IndexComponent} from './index/index.component';

@NgModule({
  declarations: [IndexComponent],
  imports: [
    HomeRoutingModule,
  ],
})
export class HomeModule {
}
