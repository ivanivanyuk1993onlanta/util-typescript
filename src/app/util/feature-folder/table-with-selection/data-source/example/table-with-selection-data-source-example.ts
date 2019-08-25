import {TableWithSelectionDataSourceInterface} from '../table-with-selection-data-source-interface';
import {ColumnDescriptionExampleInterface} from './column-description-example-interface';
import {DataObjectExampleInterface} from './data-object-example-interface';
import {CollectionViewer} from '@angular/cdk/collections';
import {BehaviorSubject, interval, Observable, of} from 'rxjs';
import {LocalizationService} from '../../../localization/localization/localization.service';
import {CellExampleComponent} from './cell-example/cell-example.component';
import {CellDataSourceExample} from './cell-data-source-example';
import {HeaderCellDataSourceExample} from './header-cell-data-source-example';
import {HeaderCellExampleComponent} from './header-cell-example/header-cell-example.component';

export class TableWithSelectionDataSourceExample implements TableWithSelectionDataSourceInterface<CellDataSourceExample, ColumnDescriptionExampleInterface, DataObjectExampleInterface, HeaderCellDataSourceExample> {
  readonly cellComponentType = CellExampleComponent;
  readonly cellDataSource = new CellDataSourceExample();
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
  readonly headerCellComponentType = HeaderCellExampleComponent;
  readonly headerCellDataSource = new HeaderCellDataSourceExample();

  constructor(
    private _localizationService: LocalizationService,
  ) {
  }

  connect(collectionViewer: CollectionViewer): Observable<DataObjectExampleInterface[] | ReadonlyArray<DataObjectExampleInterface>> {
    const BS$ = new BehaviorSubject(Array.from(Array(100).keys()).map(number => {
      return {
        id: number,
        name: `Name ${number}`,
      };
    }));

    interval(1000).subscribe(() => {
      BS$.next(BS$.getValue().slice(1));
    });

    return BS$;
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
