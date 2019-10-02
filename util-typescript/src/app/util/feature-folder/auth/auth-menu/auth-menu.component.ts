import {ChangeDetectionStrategy, Component, OnDestroy} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {takeUntil} from 'rxjs/operators';
import {ChangeBroadcaster} from '../../../class-folder/change-broadcaster/change-broadcaster';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-auth-menu',
  styleUrls: ['./auth-menu.component.scss'],
  templateUrl: './auth-menu.component.html',
})
export class AuthMenuComponent implements OnDestroy {
  private _componentDestroyedBroadcaster = new ChangeBroadcaster();

  constructor(
    public authService: AuthService,
  ) {
  }

  public logout() {
    this.authService.logout$().pipe(
      takeUntil(this._componentDestroyedBroadcaster.changeS$),
    ).subscribe();
  }

  public openModal() {
    this.authService.openModal$().pipe(
      takeUntil(this._componentDestroyedBroadcaster.changeS$),
    ).subscribe();
  }

  public ngOnDestroy(): void {
    this._componentDestroyedBroadcaster.complete();
  }
}
