import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {TreeTableDataSourceInterface} from '../data-source/tree-table-data-source-interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-tree-table',
  styleUrls: ['./tree-table.component.scss'],
  templateUrl: './tree-table.component.html',
})
export class TreeTableComponent<CellComponentType, DataObjectType> {
  @Input() dataSource: TreeTableDataSourceInterface<CellComponentType, DataObjectType>;
}
