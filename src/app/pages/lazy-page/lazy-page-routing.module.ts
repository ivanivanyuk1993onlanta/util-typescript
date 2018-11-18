import {IndexComponent} from './index/index.component';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LazyPageGuard} from './lazy-page.guard';

const lazyPageRoutes: Routes = [
  {
    canLoad: [LazyPageGuard],
    component: IndexComponent,
    path: '',
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(lazyPageRoutes),
  ],
  exports: [
    RouterModule,
  ],
})
export class LazyPageRoutingModule {
}
