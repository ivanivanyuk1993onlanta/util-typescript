import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginFormComponent} from './login-form/login-form.component';
import {MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule} from '@angular/material';
import {ReactiveFormsModule} from '@angular/forms';
import {ModalModule} from '../modal/modal.module';
import { AuthMenuComponent } from './auth-menu/auth-menu.component';

@NgModule({
  declarations: [LoginFormComponent, AuthMenuComponent],
  exports: [
    AuthMenuComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    ModalModule,
    ReactiveFormsModule,
  ]
})
export class AuthModule {
}
