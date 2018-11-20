import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProfileMenuComponent} from './profile-menu/profile-menu.component';
import {MaterialUsedModule} from '../../core/material-used/material-used.module';

@NgModule({
  exports: [
    ProfileMenuComponent,
  ],
  imports: [
    CommonModule,
    MaterialUsedModule,
  ],
  declarations: [ProfileMenuComponent],
})
export class ProfileMenuModule {
}
