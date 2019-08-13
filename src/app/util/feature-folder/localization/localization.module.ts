import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {GetLocalizedMessageContinuous$PurePipe} from './get-localized-message-continuous$-pure/get-localized-message-continuous$-pure.pipe';
import { LocaleSelectionComponent } from './locale-selection/locale-selection.component';

@NgModule({
  declarations: [GetLocalizedMessageContinuous$PurePipe, LocaleSelectionComponent],
  exports: [
    GetLocalizedMessageContinuous$PurePipe
  ],
  imports: [
    CommonModule
  ]
})
export class LocalizationModule { }
