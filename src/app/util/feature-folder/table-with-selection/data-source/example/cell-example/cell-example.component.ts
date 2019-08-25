import {ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {DynamicComponentInterface} from '../../../../dynamic-container/dynamic-container/dynamic-component-interface';
import {CellComponentInputInterface} from '../../cell-component-input-interface';
import {CellDataSourceExample} from '../cell-data-source-example';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-cell-component-example',
  styleUrls: ['./cell-example.component.scss'],
  templateUrl: './cell-example.component.html',
})
export class CellExampleComponent<ColumnDescriptionType, DataObjectType, HeaderCellDataSourceType> implements DynamicComponentInterface<CellComponentInputInterface<CellDataSourceExample, ColumnDescriptionType, DataObjectType, HeaderCellDataSourceType>>, OnChanges {
  @Input() input: CellComponentInputInterface<CellDataSourceExample, ColumnDescriptionType, DataObjectType, HeaderCellDataSourceType>;

  public ngOnChanges(changes: SimpleChanges): void {
  }
}
