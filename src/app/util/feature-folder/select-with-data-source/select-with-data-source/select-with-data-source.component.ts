import {ChangeDetectionStrategy, Component, Input, OnDestroy} from '@angular/core';
import {SelectDataSourceInterface} from '../data-source/select-data-source-interface';
import {MatSelectChange} from '@angular/material';
import {takeUntil} from 'rxjs/operators';
import {Broadcaster} from '../../../class-folder/broadcaster/broadcaster';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-select-with-data-source',
  styleUrls: ['./select-with-data-source.component.scss'],
  templateUrl: './select-with-data-source.component.html',
})
export class SelectWithDataSourceComponent<OptionType> implements OnDestroy {
  @Input() dataSource: SelectDataSourceInterface<OptionType>;

  private _changeBroadcaster = new Broadcaster();

  ngOnDestroy(): void {
    this._changeBroadcaster.broadcastAndComplete();
  }

  public select(matSelectChange: MatSelectChange) {
    this.dataSource.setOption$(matSelectChange.value).pipe(
      takeUntil(this._changeBroadcaster.broadcastS$),
    ).subscribe();
  }
}
