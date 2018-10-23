import {IndexComponent} from './index/index.component';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const lazyPageRoutes: Routes = [
  {
    path: '',
    component: IndexComponent,
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
