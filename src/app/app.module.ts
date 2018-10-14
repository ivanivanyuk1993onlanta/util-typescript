import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BlockComponent } from '../util/block/block.component';
import { MenuComponent } from '../util/menu/menu.component';

@NgModule({
  declarations: [
    AppComponent,
    BlockComponent,
    MenuComponent,
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
