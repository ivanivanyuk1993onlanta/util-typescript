import {ChangeDetectionStrategy, Component, EventEmitter, Inject, Output} from '@angular/core';
import {MAT_SNACK_BAR_DATA} from '@angular/material';
import {NotificationWindowDataInterface} from './notification-window-data-interface';
import {MessageTypeEnum} from '../notification-message-data/message-type-enum';
import {NotificationMessageData} from '../notification-message-data/notification-message-data';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-notification-window',
  styleUrls: ['./notification-window.component.scss'],
  templateUrl: './notification-window.component.html',
})
export class NotificationWindowComponent {
  @Output() clickEvent = new EventEmitter<NotificationMessageData>();
  public messageTypeToClassMap = new Map<MessageTypeEnum, string>([
    [MessageTypeEnum.Error, 'bg-warn'],
  ]);
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: NotificationWindowDataInterface,
  ) {
  }
}
