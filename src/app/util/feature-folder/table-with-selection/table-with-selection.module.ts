import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TableWithSelectionComponent} from './table-with-selection/table-with-selection.component';
import {MatTableModule} from '@angular/material';
import {GetColumnCodePurePipe} from './get-column-code-pure/get-column-code-pure.pipe';
import {GetColumnHeaderTextContinuousPurePipe} from './get-column-header-text-continuous-pure/get-column-header-text-continuous-pure.pipe';
import {GetColumnTextContinuousPurePipe} from './get-column-text-continuous-pure/get-column-text-continuous-pure.pipe';
import {DynamicContainerModule} from '../dynamic-container/dynamic-container.module';
import { CellExampleComponent } from './data-source/example/cell-example/cell-example.component';
import { HeaderCellExampleComponent } from './data-source/example/header-cell-example/header-cell-example.component';
import {MapGetPureModule} from '../map-get-pure/map-get-pure.module';
import { GetKey$PurePipe } from './get-key$-pure/get-key$-pure.pipe';
// todo remove
@NgModule({
  bootstrap: [CellExampleComponent, HeaderCellExampleComponent],
  declarations: [
    CellExampleComponent,
    GetColumnCodePurePipe,
    GetColumnHeaderTextContinuousPurePipe,
    GetColumnTextContinuousPurePipe,
    TableWithSelectionComponent,
    HeaderCellExampleComponent,
    GetKey$PurePipe,
  ],
  exports: [
    TableWithSelectionComponent
  ],
  imports: [
    CommonModule,
    DynamicContainerModule,
    MatTableModule,
    MapGetPureModule,
  ]
})
export class TableWithSelectionModule {
}
