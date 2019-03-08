import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProfileMenuComponent} from './profile-menu/profile-menu.component';
import {MatButtonModule, MatDialogModule, MatIconModule, MatMenuModule} from '@angular/material';
import {RegisterFormComponent} from '../register-form/register-form.component';

@NgModule({
  entryComponents: [RegisterFormComponent],
  exports: [
    ProfileMenuComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatMenuModule,
  ],
  declarations: [
    ProfileMenuComponent,
  ],
})
export class ProfileMenuModule {
}
