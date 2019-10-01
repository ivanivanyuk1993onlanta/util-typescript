import {BehaviorSubject} from 'rxjs';
import {NotificationMessageData} from '../notification-message-data/notification-message-data';

export interface NotificationWindowDataInterface {
  notificationMessageDataListBS$: BehaviorSubject<Array<NotificationMessageData>>;
}
