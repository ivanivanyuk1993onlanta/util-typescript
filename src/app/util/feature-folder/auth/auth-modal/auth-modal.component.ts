import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {FormGroup} from '@angular/forms';
import {BehaviorSubject, Observable} from 'rxjs';
import {FieldDataInterface} from '../data-source/field-data-interface';
import {takeUntil} from 'rxjs/operators';
import {ChangeBroadcaster} from '../../../class-folder/change-broadcaster/change-broadcaster';
import {CredentialsInterface} from '../auth/credentials-interface';
import {AuthInterface} from '../auth/auth-interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-login-form',
  styleUrls: ['./auth-modal.component.scss'],
  templateUrl: './auth-modal.component.html',
})
export class AuthModalComponent<CredentialsType extends CredentialsInterface, AuthType extends AuthInterface> implements OnDestroy, OnInit {
  public loginFormFieldDataListBS$ = new BehaviorSubject<Array<FieldDataInterface>>([]);
  public loginFormGroupBS$ = new BehaviorSubject<FormGroup>(null);

  private _componentDestroyedBroadcaster = new ChangeBroadcaster();

  constructor(
    public authService: AuthService,
  ) {
  }

  public loginAndClose() {
    this._login().pipe(
      takeUntil(this._componentDestroyedBroadcaster.changeS$),
    ).subscribe(() => {
      this.modal.close();
    });
  }

  public ngOnDestroy(): void {
    this._componentDestroyedBroadcaster.complete();
  }

  public ngOnInit() {
    this.authService.getEmptyCredentialsFormGroup$().pipe(
      takeUntil(this._componentDestroyedBroadcaster.changeS$),
    ).subscribe(formGroup => {
      this.loginFormGroupBS$.next(formGroup);
    });

    this.authService.getLoginFormFieldDataList$().pipe(
      takeUntil(this._componentDestroyedBroadcaster.changeS$),
    ).subscribe(fieldDataList => {
      this.loginFormFieldDataListBS$.next(fieldDataList);
    });
  }

  private _login(): Observable<AuthInterface> {
    return this.authService.login$(this.loginFormGroupBS$.getValue().getRawValue());
  }
}
