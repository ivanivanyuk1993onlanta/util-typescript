import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ContactsRoutingModule} from './contacts-routing.module';
import {IndexComponent} from './index/index.component';

@NgModule({
  declarations: [IndexComponent],
  imports: [
    CommonModule,
    ContactsRoutingModule,
  ],
})
export class ContactsModule {
}
