import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {TableWithSelectionDataSourceInterface} from '../data-source/table-with-selection-data-source-interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-table-with-selection',
  styleUrls: ['./table-with-selection.component.scss'],
  templateUrl: './table-with-selection.component.html',
})
export class TableWithSelectionComponent<ColumnDescriptionType, DataObjectType> {
  @Input() dataSource: TableWithSelectionDataSourceInterface<ColumnDescriptionType, DataObjectType>;
}
