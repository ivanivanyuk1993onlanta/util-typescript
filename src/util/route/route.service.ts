import {Injectable} from '@angular/core';
import {Routes} from '@angular/router';
import {HomeComponent} from '../../app/pages/home/home.component';
import {NotHomeComponent} from '../../app/pages/not-home/not-home.component';

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  constructor() {
  }

  static getRouteMap(): Routes {
    return [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/home',
      },
      {
        component: HomeComponent,
        path: 'home',
      },
      {
        component: NotHomeComponent,
        path: 'not-home',
      },
    ];
  }
}
