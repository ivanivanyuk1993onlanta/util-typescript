import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouteListComponent} from './route-list/route-list.component';
import {RouteListItemComponent} from './route-list-item/route-list-item.component';
import {RouterModule} from '@angular/router';
import {MatAutocompleteModule, MatExpansionModule, MatFormFieldModule, MatInputModule, MatListModule} from '@angular/material';

@NgModule({
  declarations: [RouteListComponent, RouteListItemComponent],
  exports: [RouteListComponent],
  imports: [CommonModule, RouterModule, MatExpansionModule, MatListModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule],
})
export class RouteListModule {
}
