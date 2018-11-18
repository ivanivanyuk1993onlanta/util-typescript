import {Injectable} from '@angular/core';
import {
  CanLoad, Route,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LazyPageGuard implements CanLoad {
  canLoad(
    route: Route,
  ): boolean {
    return false;
  }
}
