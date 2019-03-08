import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CrudFormComponent} from './crud-form/crud-form.component';
import {ReactiveFormsModule} from '@angular/forms';
import {FormFieldLabelTranslationComponent} from './form-field-label-translation/form-field-label-translation.component';

@NgModule({
  declarations: [CrudFormComponent, FormFieldLabelTranslationComponent],
  exports: [
    CrudFormComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
})
export class CrudFormModule {
}
