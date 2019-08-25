import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DynamicContainerComponent} from './dynamic-container/dynamic-container.component';
import {ViewContainerRefModule} from '../view-container-ref/view-container-ref.module';

@NgModule({
  exports: [
    DynamicContainerComponent,
  ],
  declarations: [DynamicContainerComponent],
  imports: [
    CommonModule,
    ViewContainerRefModule,
  ]
})
export class DynamicContainerModule {
}
