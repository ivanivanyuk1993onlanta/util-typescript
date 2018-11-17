import {Observable} from 'rxjs';

export class RouteData {
  childRouteList?: RouteData[];
  countOfFilteredChildRouteList?: number;
  iconKey?: string;
  langKey: string;
  matchesSearchRegExp$?: Observable<boolean>;
  route: string;
  textTranslated?: string;
}
