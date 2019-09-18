import {Observable} from 'rxjs';

export interface ButtonDataSourceInterface {
  actionFunc();

  getDisplayTextContinuous$(): Observable<string>;

  getIconContinuous$(): Observable<string>;
}
