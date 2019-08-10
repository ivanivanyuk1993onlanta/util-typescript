import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthModalComponent} from './auth-modal/auth-modal.component';
import {MatButtonModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule} from '@angular/material';
import {ReactiveFormsModule} from '@angular/forms';
import { AuthMenuComponent } from './auth-menu/auth-menu.component';

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
  ]
})
export class AuthModule {
}
