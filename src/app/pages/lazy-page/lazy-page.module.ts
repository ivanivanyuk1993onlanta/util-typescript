import {NgModule} from '@angular/core';
import {LazyPageRoutingModule} from './lazy-page-routing.module';
import { IndexComponent } from './index/index.component';

@NgModule({
  imports: [
    LazyPageRoutingModule,
  ],
  declarations: [IndexComponent],
})
export class LazyPageModule {
}
