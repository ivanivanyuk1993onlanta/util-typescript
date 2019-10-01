import {Inject, Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {first, mergeMap, tap} from 'rxjs/operators';
import {MatDialog, MatDialogRef} from '@angular/material';
import {AuthModalComponent} from '../auth-modal/auth-modal.component';
import {AuthDataSourceInterface} from '../data-source/auth-data-source-interface';
import {CredentialsDataSourceInterface} from '../data-source/credentials-data-source-interface';
import {CREDENTIALS_DATA_SOURCE} from '../../../src/app/config/auth/credentials-data-source-injection-token';
import {AUTH_DATA_SOURCE} from '../../../src/app/config/auth/auth-data-source-injection-token';

@Injectable({
  providedIn: 'root'
})
export class AuthService<AuthType, CredentialsType> {
  private _isDialogOpenedBS$ = new BehaviorSubject(false);
  private _matDialogRef: MatDialogRef<AuthModalComponent<AuthType, CredentialsType>>;

  constructor(
    @Inject(AUTH_DATA_SOURCE) public authDataSource: AuthDataSourceInterface<AuthType, CredentialsType>,
    @Inject(CREDENTIALS_DATA_SOURCE) private _credentialsDataSource: CredentialsDataSourceInterface,
    private _matDialog: MatDialog,
  ) {
    authDataSource.authRequiredErrorS$.pipe(
      tap(() => {
        this.openModal();
      })
    ).subscribe();

    authDataSource.loginErrorS$.pipe(
      tap(err => {
        this._credentialsDataSource.formGroup.setErrors(err);
      }),
    ).subscribe();
  }

  public closeModal$(): Observable<void> {
    this._matDialogRef.close();
    return of(null);
  }

  public loginAndCloseModal() {
    this.authDataSource.login$(this._credentialsDataSource.formGroup.getRawValue()).pipe(
      mergeMap(() => this.closeModal$()),
    ).subscribe();
  }

  public logout() {
    this.authDataSource.logout$().subscribe();
  }

  public openModal() {
    this.openModal$().subscribe();
  }

  public openModal$(): Observable<void> {
    if (!this._isDialogOpenedBS$.getValue()) {
      this._isDialogOpenedBS$.next(true);
      this._matDialogRef = this._matDialog.open<AuthModalComponent<AuthType, CredentialsType>>(AuthModalComponent);
      this._matDialogRef.componentInstance.loginButtonClickEvent.subscribe(() => {
        this.loginAndCloseModal();
      });
      this._matDialogRef.componentInstance.logoutButtonClickEvent.subscribe(() => {
        this.logout();
      });
      this._matDialogRef.beforeClosed().pipe(
        first(),
      ).subscribe(() => {
        this._isDialogOpenedBS$.next(false);
      });
    }
    return of(null);
  }
}
