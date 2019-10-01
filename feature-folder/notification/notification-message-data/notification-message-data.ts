import {MessageTypeEnum} from './message-type-enum';
import {NotificationMessageDataConfigInterface} from './notification-message-data-config-interface';

export class NotificationMessageData {
  canBeRemovedManually = true;
  duration = 2000;
  message: string;
  type = MessageTypeEnum.Info;

  constructor(config: NotificationMessageDataConfigInterface) {
    for (const entry of Object.entries(config)) {
      this[entry[0]] = entry[1];
    }
  }
}
