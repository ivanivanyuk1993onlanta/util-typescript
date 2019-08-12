import {Injectable} from '@angular/core';
import {MatSnackBar, MatSnackBarRef} from '@angular/material';
import {NotificationWindowComponent} from '../notification-window/notification-window.component';
import {BehaviorSubject, timer} from 'rxjs';
import {NotificationMessageData} from '../notification-message-data/notification-message-data';
import {NotificationMessageDataConfigInterface} from '../notification-message-data/notification-message-data-config-interface';
import {withLatestFrom} from 'rxjs/operators';
import {NotificationWindowDataInterface} from '../notification-window/notification-window-data-interface';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private _isOpenedBS$ = new BehaviorSubject(false);
  private _matSnackBarRef: MatSnackBarRef<NotificationWindowComponent>;
  private _notificationMessageDataListBS$ = new BehaviorSubject<Array<NotificationMessageData>>([]);

  constructor(
    private _snackBar: MatSnackBar,
  ) {
    this._notificationMessageDataListBS$.pipe(
      withLatestFrom(this._isOpenedBS$),
    ).subscribe(([messageList, isShown]) => {
      if (isShown) {
        if (messageList.length < 1) {
          this._closeNotificationWindow();
        }
      } else {
        if (messageList.length > 0) {
          this._openNotificationWindow();
        }
      }
    });
  }

  public pushMessage(config: NotificationMessageDataConfigInterface) {
    const notificationMessageDataList = this._notificationMessageDataListBS$.getValue();

    this._pushMessage(config, notificationMessageDataList);

    this._notificationMessageDataListBS$.next(notificationMessageDataList);
  }

  public pushMessageList(configList: Array<NotificationMessageDataConfigInterface>) {
    const notificationMessageDataList = this._notificationMessageDataListBS$.getValue();

    for (const config of configList) {
      this._pushMessage(config, notificationMessageDataList);
    }

    this._notificationMessageDataListBS$.next(notificationMessageDataList);
  }

  private _closeNotificationWindow() {
    this._matSnackBarRef.dismiss();
  }

  private _openNotificationWindow() {
    this._isOpenedBS$.next(true);
    this._matSnackBarRef = this._snackBar.openFromComponent(NotificationWindowComponent, {
      data: {
        notificationMessageDataListBS$: this._notificationMessageDataListBS$,
      } as NotificationWindowDataInterface,
    });
    this._matSnackBarRef.afterDismissed().subscribe(() => {
      this._isOpenedBS$.next(false);
    });
    this._matSnackBarRef.instance.clickEvent.subscribe(message => {
      this._removeMessage(message);
    });
  }

  private _pushMessage(
    config: NotificationMessageDataConfigInterface,
    messageList: Array<NotificationMessageData>,
  ) {
    const message = new NotificationMessageData(config);

    messageList.push(message);

    if (message.duration) {
      timer(message.duration).subscribe(() => {
        this._removeMessage(message);
      });
    }
  }

  private _removeMessage(message: NotificationMessageData) {
    let notificationMessageDataList = this._notificationMessageDataListBS$.getValue();

    notificationMessageDataList = notificationMessageDataList.filter(message2 => message !== message2);

    this._notificationMessageDataListBS$.next(notificationMessageDataList);
  }

  private _removeMessageList(messageList: Array<NotificationMessageData>) {
    let notificationMessageDataList = this._notificationMessageDataListBS$.getValue();

    const messageSet = new Set(messageList);

    notificationMessageDataList = notificationMessageDataList.filter(message2 => !messageSet.has(message2));

    this._notificationMessageDataListBS$.next(notificationMessageDataList);
  }
}
