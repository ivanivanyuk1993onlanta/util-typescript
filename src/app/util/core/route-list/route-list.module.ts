import {CommonModule} from '@angular/common';
import {MaterialUsedModule} from '../material-used/material-used.module';
import {NgModule} from '@angular/core';
import {RouteListComponent} from './route-list/route-list.component';
import {RouterModule} from '@angular/router';
import {RouteTranslationComponent} from './route-translation/route-translation.component';

@NgModule({
  exports: [
    RouteListComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialUsedModule,
  ],
  declarations: [RouteListComponent, RouteTranslationComponent],
})
export class RouteListModule {
}
