import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {TableWithSelectionDataSourceInterface} from '../data-source/table-with-selection-data-source-interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-table-with-selection',
  styleUrls: ['./table-with-selection.component.scss'],
  templateUrl: './table-with-selection.component.html',
})
export class TableWithSelectionComponent<CellDataSourceType, ColumnDescriptionType, DataObjectType, HeaderCellDataSourceType> {
  // tslint:disable-next-line:max-line-length
  @Input() dataSource: TableWithSelectionDataSourceInterface<CellDataSourceType, ColumnDescriptionType, DataObjectType, HeaderCellDataSourceType>;
}
