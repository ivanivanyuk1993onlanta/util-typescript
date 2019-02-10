import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CrudFormComponent} from './crud-form/crud-form.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MaterialUsedModule} from '../material-used/material-used.module';

@NgModule({
  declarations: [CrudFormComponent],
  exports: [
    CrudFormComponent,
  ],
  imports: [
    CommonModule,
    MaterialUsedModule,
    ReactiveFormsModule,
  ],
})
export class CrudFormModule {
}
