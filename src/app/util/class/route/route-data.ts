import {BehaviorSubject} from 'rxjs';

export class RouteData {
  childRouteList?: RouteData[];
  countOfFilteredChildRouteListSubject$?: BehaviorSubject<number>;
  hasFilteredChildRouteListSubject$?: BehaviorSubject<boolean>;
  iconKey?: string;
  langKey: string;
  matchesSearchRegExpSubject$?: BehaviorSubject<boolean>;
  route: string;
  textTranslatedSubject$?: BehaviorSubject<string>;
}
