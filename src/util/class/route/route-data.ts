import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';

export class RouteData {
  childRouteList?: RouteData[];
  countOfFilteredChildRouteList?: FormControl;
  hasFilteredChildRouteList$?: Observable<boolean>;
  iconKey?: string;
  langKey: string;
  matchesSearchRegExp$?: Observable<boolean>;
  route: string;
  textTranslated?: string;
}
