import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-flex-spacer',
  styleUrls: ['./flex-spacer.component.scss'],
  templateUrl: './flex-spacer.component.html',
})
export class FlexSpacerComponent {
}
