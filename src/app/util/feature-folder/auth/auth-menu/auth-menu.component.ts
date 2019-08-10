import {ChangeDetectionStrategy, Component, OnDestroy} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {ComponentDestroyedBroadcaster} from '../../../classes/component-destroyed-broadcaster/component-destroyed-broadcaster';
import {takeUntil} from 'rxjs/operators';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-auth-menu',
  styleUrls: ['./auth-menu.component.scss'],
  templateUrl: './auth-menu.component.html',
})
export class AuthMenuComponent<CredentialsType, AuthType> implements OnDestroy {
  private _componentDestroyedBroadcaster = new ComponentDestroyedBroadcaster();

  constructor(
    public authService: AuthService<CredentialsType, AuthType>,
  ) {
  }

  public logout() {
    this.authService.authDataSource.logout$().pipe(
      takeUntil(this._componentDestroyedBroadcaster.isComponentDestroyedS$),
    ).subscribe();
  }

  public ngOnDestroy(): void {
    this._componentDestroyedBroadcaster.broadcastComponentDestroyed();
  }
}
