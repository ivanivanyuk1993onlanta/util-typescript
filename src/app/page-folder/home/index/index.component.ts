import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-index',
  styleUrls: ['./index.component.scss'],
  templateUrl: './index.component.html',
})
export class IndexComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
