import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouteListComponent} from './route-list/route-list.component';
import {RouteListItemComponent} from './route-list-item/route-list-item.component';
import {RouterModule} from '@angular/router';
import {
  MatAutocompleteModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule
} from '@angular/material';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [RouteListComponent, RouteListItemComponent],
  exports: [RouteListComponent],
  imports: [CommonModule, RouterModule, MatExpansionModule, MatListModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatIconModule],
})
export class RouteListModule {
}
