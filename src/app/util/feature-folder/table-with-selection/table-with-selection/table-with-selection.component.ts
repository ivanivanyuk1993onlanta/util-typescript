import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges} from '@angular/core';
import {TableWithSelectionDataSourceInterface} from '../data-source/table-with-selection-data-source-interface';
import {Broadcaster} from '../../../class-folder/broadcaster/broadcaster';
import {BehaviorSubject} from 'rxjs';
import {mergeMap, takeUntil} from 'rxjs/operators';
import {SelectionModel} from '@angular/cdk/collections';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-table-with-selection',
  styleUrls: ['./table-with-selection.component.scss'],
  templateUrl: './table-with-selection.component.html',
})
export class TableWithSelectionComponent<CellDataSourceType, ColumnDescriptionType, DataObjectType, HeaderCellDataSourceType, KeyType> implements OnChanges, OnDestroy {
  // tslint:disable-next-line:max-line-length
  @Input() dataSource: TableWithSelectionDataSourceInterface<CellDataSourceType, ColumnDescriptionType, DataObjectType, HeaderCellDataSourceType, KeyType>;
  @Output() rowDoubleClick = new EventEmitter<DataObjectType>();

  public dataListBS$ = new BehaviorSubject<Array<DataObjectType>>([]);
  public keySelectionModel = new SelectionModel<KeyType>(true, []);
  public keyToIsSelectedBS$MapBS$ = new BehaviorSubject(new Map<KeyType, BehaviorSubject<boolean>>());

  private _changeBroadcaster = new Broadcaster();
  private _keyToRowIndexMapBS$ = new BehaviorSubject(new Map<KeyType, number>());
  private _lastClickedWithoutShiftKeyBS$ = new BehaviorSubject<KeyType>(null);

  public handleRowClick(
    row: DataObjectType,
    event: MouseEvent,
  ) {
    this.dataSource.getKey$(row).pipe(
      takeUntil(this._changeBroadcaster.broadcastS$),
    ).subscribe(clickedKey => {
      const selectionModel = this.keySelectionModel;

      const lastClickedWithoutShiftKeyBS$ = this._lastClickedWithoutShiftKeyBS$;
      if (event.shiftKey) {
        if (!event.ctrlKey) {
          // Если не нажат Ctrl, мы можем очистить выделение
          selectionModel.clear();
        }

        const lastClickedWithoutShiftKey = lastClickedWithoutShiftKeyBS$.getValue();
        // Если мы ещё не кликали без Shift, ничего делать не нужно
        if (lastClickedWithoutShiftKey) {
          this._selectRange(clickedKey, lastClickedWithoutShiftKey);
        }
      } else {
        // Мы кликнули без Shift, записываем
        lastClickedWithoutShiftKeyBS$.next(clickedKey);

        if (!event.ctrlKey) {
          // При клике по выделенной строке в режиме единичного выделения нужно снять с неё выделение, если она одна,
          // потому что если она не одна, нужно будет её выделить. Для этого пишем флаг
          const shouldDeselectClickedKey = selectionModel.isSelected(clickedKey) && selectionModel.selected.length === 1;
          // Если не нажат Ctrl, то у нас режим единичного выделения, нужно очистить старое
          selectionModel.clear();
          if (shouldDeselectClickedKey) {
            selectionModel.toggle(clickedKey);
          }
        }
        selectionModel.toggle(clickedKey);
      }
    });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this._changeBroadcaster.broadcast();

    this.dataSource.disconnect(null);
    this.dataSource.connect(null).pipe(
      takeUntil(this._changeBroadcaster.broadcastS$),
    ).subscribe(dataList => {
      this.dataListBS$.next(dataList as DataObjectType[]);
    });

    this._subscribeToDataListBS$();
    this._subscribeToSelectionChanged();
  }

  public ngOnDestroy(): void {
    this._changeBroadcaster.broadcastAndComplete();
  }

  private _selectRange(
    clickedKey: KeyType,
    lastClickedWithoutShiftKey: KeyType,
  ) {
    const dataList = this.dataListBS$.getValue();

    // Получаем индексы последеней кликнутой без Shift строки и кликнутой сейчас строки
    const clickedKeyIndex = this._keyToRowIndexMapBS$.getValue().get(clickedKey);
    const lastClickedWithoutShiftKeyIndex = this._keyToRowIndexMapBS$.getValue().get(lastClickedWithoutShiftKey);

    // Вычисляем младший и старший индексы
    let leftIndex: number;
    let rightIndex: number;
    if (clickedKeyIndex < lastClickedWithoutShiftKeyIndex) {
      leftIndex = clickedKeyIndex;
      rightIndex = lastClickedWithoutShiftKeyIndex;
    } else {
      leftIndex = lastClickedWithoutShiftKeyIndex;
      rightIndex = clickedKeyIndex;
    }

    // Выделяем ключи от младшего до старшего индекса
    this.dataSource.getKeyList$(dataList.slice(leftIndex, rightIndex + 1)).pipe(
      takeUntil(this._changeBroadcaster.broadcastS$),
    ).subscribe(keyList => {
      this.keySelectionModel.select(...keyList);
    });
  }


  private _subscribeToDataListBS$() {
    this.dataListBS$.pipe(
      mergeMap(dataList => this.dataSource.getKeyList$(dataList)),
      takeUntil(this._changeBroadcaster.broadcastS$),
    ).subscribe((keyList) => {
      // Строим здесь map за O(n), чтобы не тратить O(n) при каждом вызове _getRowIndexByKey
      this._keyToRowIndexMapBS$.next(
        new Map<KeyType, number>(keyList.map((key, index) => {
          return [
            key,
            index,
          ];
        })),
      );
      // Обновляем keyToIsSelectedBS$MapBS$ с учётом новых/удалённых значений из dataList
      const previousUuidToIsSelectedBS$Map = this.keyToIsSelectedBS$MapBS$.getValue();
      this.keyToIsSelectedBS$MapBS$.next(new Map(keyList.map(key => {
        const isSelectedBS$ = previousUuidToIsSelectedBS$Map.get(key);
        return [
          key,
          isSelectedBS$ || new BehaviorSubject(false),
        ];
      })));

      // Обнуляем lastClickedWithoutShiftKey, если такого ключа больше нет
      if (!this._keyToRowIndexMapBS$.getValue().has(this._lastClickedWithoutShiftKeyBS$.getValue())) {
        this._lastClickedWithoutShiftKeyBS$.next(null);
      }
    });
  }

  private _subscribeToSelectionChanged() {
    this.keySelectionModel.changed.pipe(
      takeUntil(this._changeBroadcaster.broadcastS$),
    ).subscribe((selectionChange) => {
      if (selectionChange) {
        const uuidToIsSelectedBS$Map = this.keyToIsSelectedBS$MapBS$.getValue();
        // Кидаем новое значение/добавляем в мапу добавленные uuid-ы
        for (const addedUuid of selectionChange.added) {
          uuidToIsSelectedBS$Map.get(addedUuid).next(true);
        }
        // Кидаем новое значение/добавляем в мапу удалённые uuid-ы
        for (const removedUuid of selectionChange.removed) {
          // При удалении строк выделение снимается, но в мапе выделения значения уже нет, потому что там только
          // существующие ключи
          const isSelectedBS$ = uuidToIsSelectedBS$Map.get(removedUuid);
          if (isSelectedBS$) {
            isSelectedBS$.next(false);
          }
        }
      }
    });
  }
}
