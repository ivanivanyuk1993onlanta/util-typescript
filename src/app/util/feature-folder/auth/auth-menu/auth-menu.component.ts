import {ChangeDetectionStrategy, Component} from '@angular/core';
import {AuthService} from '../auth/auth.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-auth-menu',
  styleUrls: ['./auth-menu.component.scss'],
  templateUrl: './auth-menu.component.html',
})
export class AuthMenuComponent<AuthType, CredentialsType> {
  constructor(
    public authService: AuthService<AuthType, CredentialsType>,
  ) {
  }
}
