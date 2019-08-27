import {NgModule} from '@angular/core';
import {ViewContainerRefDirective} from './view-container-ref.directive';

@NgModule({
  exports: [
    ViewContainerRefDirective,
  ],
  declarations: [ViewContainerRefDirective],
})
export class ViewContainerRefModule {
}
