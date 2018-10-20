import {AppComponent} from './app.component';
import {CoreModule} from './util/core/core.module';
import {NgModule} from '@angular/core';
import {SharedModule} from './util/shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    CoreModule,
    SharedModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
