import {NgModule} from '@angular/core';
import {FormExampleComponent} from './form-example/form-example.component';
import {FormExampleRoutingModule} from './form-example-routing.module';
import {SharedModule} from '../../../util/module/shared/shared.module';

@NgModule({
  declarations: [FormExampleComponent],
  imports: [
    FormExampleRoutingModule,
    SharedModule,
  ],
})
export class FormExampleModule {
}
