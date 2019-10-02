import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouteListComponent} from './route-list/route-list.component';
import {RouteListItemComponent} from './route-list-item/route-list-item.component';
import {RouterModule} from '@angular/router';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
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
