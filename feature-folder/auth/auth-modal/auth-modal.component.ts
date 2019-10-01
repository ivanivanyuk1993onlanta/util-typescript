import {ChangeDetectionStrategy, Component, EventEmitter, Inject, Output} from '@angular/core';
import {CredentialsDataSourceInterface} from '../data-source/credentials-data-source-interface';
import {AuthDataSourceInterface} from '../data-source/auth-data-source-interface';
import {AUTH_DATA_SOURCE} from '../../../src/app/config/auth/auth-data-source-injection-token';
import {CREDENTIALS_DATA_SOURCE} from '../../../src/app/config/auth/credentials-data-source-injection-token';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-login-form',
  styleUrls: ['./auth-modal.component.scss'],
  templateUrl: './auth-modal.component.html',
})
export class AuthModalComponent<AuthType, CredentialsType> {
  @Output() loginButtonClickEvent = new EventEmitter();
  @Output() logoutButtonClickEvent = new EventEmitter();

  constructor(
    @Inject(AUTH_DATA_SOURCE) public authDataSource: AuthDataSourceInterface<AuthType, CredentialsType>,
    @Inject(CREDENTIALS_DATA_SOURCE) public credentialsDataSource: CredentialsDataSourceInterface,
  ) {
  }
}
