import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TreeTableComponent} from './tree-table/tree-table.component';
import {MatTableModule} from '@angular/material';
import {GetDataListContinuous$PurePipe} from './data-source/get-data-list-continuous$-pure/get-data-list-continuous$-pure.pipe';
import {GetColumnCodeListContinuous$PurePipe} from './data-source/get-column-code-list-continuous$-pure/get-column-code-list-continuous$-pure.pipe';
import { GetColumnHeaderTextContinuous$PurePipe } from './data-source/get-column-header-text-continuous$-pure/get-column-header-text-continuous$-pure.pipe';
import {DynamicContainerModule} from '../dynamic-container/dynamic-container.module';

@NgModule({
  exports: [TreeTableComponent],
  declarations: [TreeTableComponent, GetDataListContinuous$PurePipe, GetColumnCodeListContinuous$PurePipe, GetColumnHeaderTextContinuous$PurePipe, GetColumnHeaderTextContinuous$PurePipe],
  imports: [
    CommonModule,
    MatTableModule,
    DynamicContainerModule,
  ]
})
export class TreeTableModule {
}
