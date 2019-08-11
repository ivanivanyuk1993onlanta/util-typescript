import {Inject, Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {first, mergeMap} from 'rxjs/operators';
import {MatDialog, MatDialogRef} from '@angular/material';
import {AuthModalComponent} from '../auth-modal/auth-modal.component';
import {AUTH_DATA_SOURCE} from '../../../../config/auth/auth-data-source-injection-token';
import {AuthDataSourceInterface} from '../data-source/auth-data-source-interface';
import {CREDENTIALS_DATA_SOURCE} from '../../../../config/auth/credentials-data-source-injection-token';
import {CredentialsDataSourceInterface} from '../data-source/credentials-data-source-interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService<CredentialsType, AuthType> {
  private _isDialogOpenedBS$ = new BehaviorSubject(false);
  private _matDialogRef: MatDialogRef<AuthModalComponent<CredentialsType, AuthType>>;

  constructor(
    @Inject(AUTH_DATA_SOURCE) public authDataSource: AuthDataSourceInterface<CredentialsType, AuthType>,
    @Inject(CREDENTIALS_DATA_SOURCE) private _credentialsDataSource: CredentialsDataSourceInterface,
    private _matDialog: MatDialog,
  ) {
    authDataSource.authErrorS$.subscribe(() => {
      this.openModal();
    });
  }

  public closeModal$(): Observable<void> {
    this._matDialogRef.close();
    return of();
  }

  public loginAndCloseModal() {
    this.authDataSource.login$(this._credentialsDataSource.formGroup.getRawValue()).pipe(
      // todo notify error
      mergeMap(() => this.closeModal$()),
    ).subscribe();
  }

  public logout() {
    this.authDataSource.logout$().pipe(
      // todo notify error
    ).subscribe();
  }

  public openModal() {
    this.openModal$().subscribe();
  }

  public openModal$(): Observable<void> {
    if (!this._isDialogOpenedBS$.getValue()) {
      this._isDialogOpenedBS$.next(true);
      this._matDialogRef = this._matDialog.open<AuthModalComponent<CredentialsType, AuthType>>(AuthModalComponent);
      this._matDialogRef.componentInstance.loginButtonClickEvent.subscribe(() => {
        this.loginAndCloseModal();
      });
      this._matDialogRef.beforeClose().pipe(
        first(),
      ).subscribe(() => {
        this._isDialogOpenedBS$.next(false);
      });
    }
    return of();
  }
}
