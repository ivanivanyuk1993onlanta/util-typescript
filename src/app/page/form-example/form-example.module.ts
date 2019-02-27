import {NgModule} from '@angular/core';
import {FormExampleComponent} from './form-example/form-example.component';
import {FormExampleRoutingModule} from './form-example-routing.module';

@NgModule({
  declarations: [FormExampleComponent],
  imports: [
    FormExampleRoutingModule,
  ],
})
export class FormExampleModule {
}
