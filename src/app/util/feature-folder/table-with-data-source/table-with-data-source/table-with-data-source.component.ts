import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-table-with-data-source',
  styleUrls: ['./table-with-data-source.component.scss'],
  templateUrl: './table-with-data-source.component.html',
})
export class TableWithDataSourceComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

}
