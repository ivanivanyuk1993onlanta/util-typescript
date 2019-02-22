import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CrudFormComponent} from './crud-form/crud-form.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MaterialUsedModule} from '../material-used/material-used.module';
import {FormFieldLabelTranslationComponent} from './form-field-label-translation/form-field-label-translation.component';

@NgModule({
  declarations: [CrudFormComponent, FormFieldLabelTranslationComponent],
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
