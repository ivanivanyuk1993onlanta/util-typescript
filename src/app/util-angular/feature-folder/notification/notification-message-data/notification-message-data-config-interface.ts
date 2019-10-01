import {MessageTypeEnum} from './message-type-enum';

export interface NotificationMessageDataConfigInterface {
  canBeRemovedManually?: boolean;
  duration?: number;
  message: string;
  type?: MessageTypeEnum;
}
