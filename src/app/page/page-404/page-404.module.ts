import {NgModule} from '@angular/core';

import {Page404RoutingModule} from './page-404-routing.module';
import {IndexComponent} from './index/index.component';

@NgModule({
  declarations: [IndexComponent],
  imports: [
    Page404RoutingModule,
  ],
})
export class Page404Module {
}
