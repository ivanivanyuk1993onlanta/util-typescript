import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {FormExampleComponent} from './form-example/form-example.component';

const routes: Routes = [
  {
    component: FormExampleComponent,
    path: '',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormExampleRoutingModule {
}
