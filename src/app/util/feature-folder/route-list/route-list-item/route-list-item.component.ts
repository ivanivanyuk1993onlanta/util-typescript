import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-route-list-item',
  styleUrls: ['./route-list-item.component.scss'],
  templateUrl: './route-list-item.component.html',
})
export class RouteListItemComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
