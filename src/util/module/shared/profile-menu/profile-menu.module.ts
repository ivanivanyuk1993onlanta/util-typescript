import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProfileMenuComponent} from './profile-menu/profile-menu.component';
import {MaterialUsedModule} from '../material-used/material-used.module';
import {MatDialogModule} from '@angular/material';
import {RegisterFormComponent} from '../register-form/register-form.component';

@NgModule({
  entryComponents: [RegisterFormComponent],
  exports: [
    ProfileMenuComponent,
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MaterialUsedModule,
  ],
  declarations: [
    ProfileMenuComponent,
  ],
})
export class ProfileMenuModule {
}
