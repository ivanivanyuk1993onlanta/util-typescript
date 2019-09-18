import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ButtonDataSourceInterface} from '../data-source/button-data-source-interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-button-with-data-source',
  styleUrls: ['./button-with-data-source.component.scss'],
  templateUrl: './button-with-data-source.component.html',
})
export class ButtonWithDataSourceComponent {
  @Input() dataSource: ButtonDataSourceInterface;
}
