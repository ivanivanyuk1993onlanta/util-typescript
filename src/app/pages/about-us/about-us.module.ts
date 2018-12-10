import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AboutUsRoutingModule} from './about-us-routing.module';
import {IndexComponent} from './index/index.component';

@NgModule({
  declarations: [IndexComponent],
  imports: [
    CommonModule,
    AboutUsRoutingModule,
  ],
})
export class AboutUsModule {
}
