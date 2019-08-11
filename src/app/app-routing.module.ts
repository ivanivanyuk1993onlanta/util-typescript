import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/home',
  },

  {
    path: 'home',
    loadChildren: () => import('./page-folder/home/home.module').then(m => m.HomeModule),
  },

  {
    path: '**',
    loadChildren: () => import('./page-folder/page-404/page-404.module').then(m => m.Page404Module),
  },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)],
})
export class AppRoutingModule {
}
