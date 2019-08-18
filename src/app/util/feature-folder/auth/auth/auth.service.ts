import {Inject, Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {first, mergeMap, tap} from 'rxjs/operators';
import {MatDialog, MatDialogRef} from '@angular/material';
import {AuthModalComponent} from '../auth-modal/auth-modal.component';
import {AUTH_DATA_SOURCE} from '../data-source/example/auth/auth-data-source-injection-token';
import {AuthDataSourceInterface} from '../data-source/auth-data-source-interface';
import {CREDENTIALS_DATA_SOURCE} from '../data-source/example/auth/credentials-data-source-injection-token';
import {CredentialsDataSourceInterface} from '../data-source/credentials-data-source-interface';
import {NotificationService} from '../../notification/notification/notification.service';
import {MessageTypeEnum} from '../../notification/notification-message-data/message-type-enum';

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
    private _notificationService: NotificationService,
  ) {
    authDataSource.authErrorS$.subscribe((error) => {
      this.openModal();
      this._notificationService.pushMessage({
        message: error.message,
        type: MessageTypeEnum.Error,
      });
    });
  }

  public closeModal$(): Observable<void> {
    this._matDialogRef.close();
    return of();
  }

  public loginAndCloseModal() {
    this.authDataSource.login$(this._credentialsDataSource.formGroup.getRawValue()).pipe(
      tap(
        () => {},
        (error: Error) => {
          this._notificationService.pushMessage({
            message: error.message,
            type: MessageTypeEnum.Error,
          });
        }
      ),
      mergeMap(() => this.closeModal$()),
    ).subscribe();
  }

  public logout() {
    this.authDataSource.logout$().pipe(
      tap(
        () => {},
        (error: Error) => {
          this._notificationService.pushMessage({
            message: error.message,
            type: MessageTypeEnum.Error,
          });
        }
      ),
    ).subscribe();
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
      this._matDialogRef.beforeClose().pipe(
        first(),
      ).subscribe(() => {
        this._isDialogOpenedBS$.next(false);
      });
    }
    return of();
  }
}
