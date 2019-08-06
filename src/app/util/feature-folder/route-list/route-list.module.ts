import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouteListComponent} from './route-list/route-list.component';
import {RouteListItemComponent} from './route-list-item/route-list-item.component';

@NgModule({
  declarations: [RouteListComponent, RouteListItemComponent],
  exports: [RouteListComponent],
  imports: [CommonModule],
})
export class RouteListModule {
}
