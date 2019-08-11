import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NotificationWindowComponent} from './notification-window/notification-window.component';
import {MatListModule, MatSnackBarModule} from '@angular/material';
import {MapGetPureModule} from '../map-get-pure/map-get-pure.module';

@NgModule({
  bootstrap: [NotificationWindowComponent],
  declarations: [NotificationWindowComponent],
  imports: [
    CommonModule,
    MapGetPureModule,
    MatSnackBarModule,
    MatListModule,
  ]
})
export class NotificationModule {
}
