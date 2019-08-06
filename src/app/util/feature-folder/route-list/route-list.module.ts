import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouteListComponent} from './route-list/route-list.component';
import {RouteListItemComponent} from './route-list-item/route-list-item.component';
import {GetChildrenPurePipe} from './get-children-pure/get-children-pure.pipe';
import {GetDisplayTextBsPurePipe} from './get-display-text-bs-pure/get-display-text-bs-pure.pipe';

@NgModule({
  declarations: [RouteListComponent, RouteListItemComponent, GetChildrenPurePipe, GetDisplayTextBsPurePipe],
  exports: [RouteListComponent],
  imports: [CommonModule],
})
export class RouteListModule {
}
