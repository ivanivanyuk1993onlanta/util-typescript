import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BlockComponent} from '../util/block/block.component';
import {MenuComponent} from '../util/menu/menu.component';
import {RouterModule} from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {RouteService} from '../util/route/route.service';
import { NotHomeComponent } from './pages/not-home/not-home.component';

@NgModule({
  declarations: [
    AppComponent,
    BlockComponent,
    MenuComponent,
    HomeComponent,
    NotHomeComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      RouteService.getRouteMap()
    ),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
