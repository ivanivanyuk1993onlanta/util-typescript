import {AppComponent} from './app.component';
import {CoreModule} from './util/core/core.module';
import {NgModule} from '@angular/core';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    CoreModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
