import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {FormGroup} from '@angular/forms';
import {BehaviorSubject, Observable} from 'rxjs';
import {FieldDataInterface} from '../data-source/field-data-interface';
import {ModalComponent} from '../../modal/modal/modal.component';
import {ComponentDestroyedBroadcaster} from '../../../classes/component-destroyed-broadcaster/component-destroyed-broadcaster';
import {takeUntil, tap} from 'rxjs/operators';
import notify from 'devextreme/ui/notify';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-login-form',
  styleUrls: ['./login-form.component.scss'],
  templateUrl: './login-form.component.html',
})
export class LoginFormComponent<CredentialsType, AuthType> implements OnDestroy, OnInit {
  public loginFormFieldDataListBS$ = new BehaviorSubject<Array<FieldDataInterface>>([]);
  public loginFormGroupBS$ = new BehaviorSubject<FormGroup>(null);

  @ViewChild('modal', {static: true}) modal: ModalComponent;

  private _componentDestroyedBroadcaster = new ComponentDestroyedBroadcaster();

  constructor(
    public authService: AuthService<CredentialsType, AuthType>,
  ) {
  }

  public loginAndClose() {
    this._login().pipe(
      takeUntil(this._componentDestroyedBroadcaster.isComponentDestroyedS$),
    ).subscribe(() => {
      this.modal.close();
    });
  }

  public ngOnDestroy(): void {
    this._componentDestroyedBroadcaster.broadcastComponentDestroyed();
  }

  public ngOnInit() {
    this.authService.authDataSource.getEmptyCredentialsFormGroup$().pipe(
      takeUntil(this._componentDestroyedBroadcaster.isComponentDestroyedS$),
    ).subscribe(formGroup => {
      this.loginFormGroupBS$.next(formGroup);
    });

    this.authService.authDataSource.getLoginFormFieldDataList$().pipe(
      takeUntil(this._componentDestroyedBroadcaster.isComponentDestroyedS$),
    ).subscribe(fieldDataList => {
      this.loginFormFieldDataListBS$.next(fieldDataList);
    });

    this.authService.authDataSource.error401S$.pipe(
      takeUntil(this._componentDestroyedBroadcaster.isComponentDestroyedS$),
    ).subscribe(() => {
      this.openModal();
    });
  }

  public openModal() {
    this.modal.open();
  }

  private _login(): Observable<AuthType> {
    return this.authService.authDataSource.login$(this.loginFormGroupBS$.getValue().getRawValue()).pipe(
      tap(() => {}, (error: HttpErrorResponse) => {
        notify(error.message, 'error');
      }),
    );
  }
}
