import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TableWithSelectionDataSourceExample} from '../../../util/feature-folder/table-with-selection/data-source/example/table-with-selection-data-source-example';
import {LocalizationService} from '../../../util/feature-folder/localization/localization/localization.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-index',
  styleUrls: ['./index.component.scss'],
  templateUrl: './index.component.html',
})
export class IndexComponent {
  public tableDataSource: TableWithSelectionDataSourceExample;

  constructor(
    private _localizationService: LocalizationService,
  ) {
    this.tableDataSource = new TableWithSelectionDataSourceExample(_localizationService);
  }
}
