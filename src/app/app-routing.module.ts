import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/home',
  },

  {
    path: 'about-us',
    loadChildren: './page/about-us/about-us.module#AboutUsModule',
  },
  {
    path: 'contacts',
    loadChildren: './page/contacts/contacts.module#ContactsModule',
  },
  {
    path: 'home',
    loadChildren: './page/home/home.module#HomeModule',
  },

  {
    path: '**',
    loadChildren: './page/page-404/page-404.module#Page404Module',
  },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)],
})
export class AppRoutingModule {
}
