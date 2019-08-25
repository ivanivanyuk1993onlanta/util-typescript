import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TableWithSelectionComponent} from './table-with-selection/table-with-selection.component';
import {MatTableModule} from '@angular/material';
import {GetColumnCodePurePipe} from './get-column-code-pure/get-column-code-pure.pipe';
import {GetColumnHeaderTextContinuousPurePipe} from './get-column-header-text-continuous-pure/get-column-header-text-continuous-pure.pipe';
import {GetColumnTextContinuousPurePipe} from './get-column-text-continuous-pure/get-column-text-continuous-pure.pipe';

@NgModule({
  declarations: [
    GetColumnCodePurePipe,
    GetColumnHeaderTextContinuousPurePipe,
    GetColumnTextContinuousPurePipe,
    TableWithSelectionComponent,
  ],
  exports: [
    TableWithSelectionComponent
  ],
  imports: [
    CommonModule,
    MatTableModule
  ]
})
export class TableWithSelectionModule {
}
