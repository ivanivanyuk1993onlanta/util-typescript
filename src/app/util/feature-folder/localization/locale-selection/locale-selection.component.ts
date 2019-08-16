import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-locale-selection',
  styleUrls: ['./locale-selection.component.scss'],
  templateUrl: './locale-selection.component.html',
})
export class LocaleSelectionComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
