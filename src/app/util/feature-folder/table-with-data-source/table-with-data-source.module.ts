import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TableWithDataSourceComponent} from './table-with-data-source/table-with-data-source.component';
import {MatTableModule} from '@angular/material';
import {GetDataListContinuous$PurePipe} from './data-source/get-data-list-continuous$-pure/get-data-list-continuous$-pure.pipe';
import {GetColumnCodeListContinuous$PurePipe} from './data-source/get-column-code-list-continuous$-pure/get-column-code-list-continuous$-pure.pipe';
import {DynamicContainerModule} from '../dynamic-container/dynamic-container.module';
import {SelectionDataSourceModule} from '../selection-data-source/selection-data-source.module';
import {GetKeyContinuous$PurePipe} from './data-source/get-key-continuous$-pure/get-key-continuous$-pure.pipe';


@NgModule({
  declarations: [
    GetColumnCodeListContinuous$PurePipe,
    GetDataListContinuous$PurePipe,
    GetKeyContinuous$PurePipe,
    TableWithDataSourceComponent,
  ],
  exports: [
    TableWithDataSourceComponent
  ],
  imports: [
    CommonModule,
    DynamicContainerModule,
    MatTableModule,
    SelectionDataSourceModule,
  ]
})
export class TableWithDataSourceModule {
}
