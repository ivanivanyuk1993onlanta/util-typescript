import {CommonModule} from '@angular/common';
import {MaterialUsedModule} from '../material-used/material-used.module';
import {NgModule} from '@angular/core';
import {RouteListRecursiveComponent} from './route-list-recursive/route-list-recursive.component';
import {RouteListRootComponent} from './route-list-root/route-list-root.component';
import {RouterModule} from '@angular/router';
import {RouteTranslationComponent} from './route-translation/route-translation.component';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  exports: [
    RouteListRootComponent,
  ],
  imports: [
    CommonModule,
    MaterialUsedModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  declarations: [
    RouteListRecursiveComponent,
    RouteListRootComponent,
    RouteTranslationComponent,
  ],
})
export class RouteListModule {
}
