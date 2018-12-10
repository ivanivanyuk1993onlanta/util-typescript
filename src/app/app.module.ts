import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {CoreModule} from './util/core/core.module';
import {environment} from '../environments/environment';
import {NgModule} from '@angular/core';
import {ServiceWorkerModule} from '@angular/service-worker';
import {SharedModule} from './util/shared/shared.module';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
  ],
  imports: [
    AppRoutingModule,
    CoreModule,
    SharedModule,
    ServiceWorkerModule.register(
      'ngsw-worker.js',
      {enabled: environment.production},
    ),
  ],
  providers: [],
})
export class AppModule {
}
