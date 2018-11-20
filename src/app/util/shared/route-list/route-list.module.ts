import {CommonModule} from '@angular/common';
import {MaterialUsedModule} from '../material-used/material-used.module';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouteListComponent} from './route-list/route-list.component';
import {RouteListRecursiveComponent} from './route-list-recursive/route-list-recursive.component';
import {RouterModule} from '@angular/router';
import {RouteTranslationComponent} from './route-translation/route-translation.component';

@NgModule({
  exports: [
    RouteListComponent,
  ],
  imports: [
    CommonModule,
    MaterialUsedModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  declarations: [
    RouteListComponent,
    RouteListRecursiveComponent,
    RouteTranslationComponent,
  ],
})
export class RouteListModule {
}
