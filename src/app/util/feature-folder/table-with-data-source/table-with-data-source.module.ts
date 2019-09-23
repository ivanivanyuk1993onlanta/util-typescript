import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TableWithDataSourceComponent} from './table-with-data-source/table-with-data-source.component';
import {MatTableModule} from '@angular/material';
import {GetDataListContinuous$PurePipe} from './data-source/get-data-list-continuous$-pure/get-data-list-continuous$-pure.pipe';
import {GetColumnCodeListContinuous$PurePipe} from './data-source/get-column-code-list-continuous$-pure/get-column-code-list-continuous$-pure.pipe';
import {DynamicContainerModule} from '../dynamic-container/dynamic-container.module';
import {SelectionDataSourceModule} from '../selection-data-source/selection-data-source.module';
import {GetRowNgClassContinuous$PurePipe} from './data-source/get-row-ng-class-continuous$-pure/get-row-ng-class-continuous$-pure.pipe';
import {GetKeyContinuous$PureModule} from './data-source/get-key-continuous$-pure/get-key-continuous$-pure.module';
import {DragDropModule} from '@angular/cdk/drag-drop';


@NgModule({
  declarations: [
    GetColumnCodeListContinuous$PurePipe,
    GetDataListContinuous$PurePipe,
    GetRowNgClassContinuous$PurePipe,
    TableWithDataSourceComponent,
  ],
  exports: [
    TableWithDataSourceComponent
  ],
  imports: [
    CommonModule,
// Todo use template outlet instead of dynamic container
    DynamicContainerModule,
    GetKeyContinuous$PureModule,
    MatTableModule,
    SelectionDataSourceModule,
    DragDropModule,
  ]
})
export class TableWithDataSourceModule {
}
