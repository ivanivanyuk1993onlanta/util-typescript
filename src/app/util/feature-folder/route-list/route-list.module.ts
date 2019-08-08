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
import {GetUrl$PurePipe} from './get-url$-pure/get-url$-pure.pipe';
import {GetDisplayTextBS$PurePipe} from './get-display-text-bs$-pure/get-display-text-bs$-pure.pipe';

@NgModule({
  declarations: [RouteListComponent, RouteListItemComponent, GetUrl$PurePipe, GetDisplayTextBS$PurePipe],
  exports: [RouteListComponent],
  imports: [CommonModule, RouterModule, MatExpansionModule, MatListModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatIconModule],
})
export class RouteListModule {
}
