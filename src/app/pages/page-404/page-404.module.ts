import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {Page404RoutingModule} from './page-404-routing.module';
import {IndexComponent} from './index/index.component';

@NgModule({
  declarations: [IndexComponent],
  imports: [
    CommonModule,
    Page404RoutingModule,
  ],
})
export class Page404Module {
}
