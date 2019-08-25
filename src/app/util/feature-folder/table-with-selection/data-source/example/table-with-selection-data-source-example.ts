import {TableWithSelectionDataSourceInterface} from '../table-with-selection-data-source-interface';
import {ColumnDescriptionExampleInterface} from './column-description-example-interface';
import {DataObjectExampleInterface} from './data-object-example-interface';
import {CollectionViewer} from '@angular/cdk/collections';
import {Observable, of} from 'rxjs';
import {LocalizationService} from '../../../localization/localization/localization.service';

export class TableWithSelectionDataSourceExample implements TableWithSelectionDataSourceInterface<ColumnDescriptionExampleInterface, DataObjectExampleInterface> {
  readonly columnCodeListContinuous$: Observable<Array<string>> = of(['id', 'name']);
  readonly columnDescriptionListContinuous$: Observable<Array<ColumnDescriptionExampleInterface>> = of([
    {
      code: 'id',
      headerLocalizationCode: 'ID',
    },
    {
      code: 'name',
      headerLocalizationCode: 'Name',
    },
  ]);

  constructor(
    private _localizationService: LocalizationService,
  ) {}

  connect(collectionViewer: CollectionViewer): Observable<DataObjectExampleInterface[] | ReadonlyArray<DataObjectExampleInterface>> {
    return of(
      Array.from(Array(100).keys()).map(number => {
        return {
          id: number,
          name: `Name ${number}`,
        };
      }),
    );
  }

  disconnect(collectionViewer: CollectionViewer): void {
  }

  getColumnCode$(columnDescription: ColumnDescriptionExampleInterface): Observable<string> {
    return of(columnDescription.code);
  }

  getColumnHeaderTextContinuous$(columnDescription: ColumnDescriptionExampleInterface): Observable<string> {
    return this._localizationService.localizationDataSource.getLocalizedMessageContinuous$(columnDescription.headerLocalizationCode);
  }

  getColumnTextContinuous$(
    columnDescription: ColumnDescriptionExampleInterface,
    dataObject: DataObjectExampleInterface,
  ): Observable<string> {
    return columnDescription.code === 'id'
      ? of(dataObject.id.toString())
      : this._localizationService.localizationDataSource.getLocalizedMessageContinuous$(dataObject.name);
  }

  trackByFunction(index: number, dataObject: DataObjectExampleInterface): any {
    return dataObject.id;
  }
}
