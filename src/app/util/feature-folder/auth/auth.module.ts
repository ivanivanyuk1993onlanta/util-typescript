import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthModalComponent} from './auth-modal/auth-modal.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import {ReactiveFormsModule} from '@angular/forms';
import { AuthMenuComponent } from './auth-menu/auth-menu.component';
import {LocalizationModule} from '../localization/localization.module';

@NgModule({
  bootstrap: [AuthModalComponent],
  declarations: [AuthModalComponent, AuthMenuComponent],
  exports: [
    AuthMenuComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    ReactiveFormsModule,
    LocalizationModule,
  ]
})
export class AuthModule {
}
