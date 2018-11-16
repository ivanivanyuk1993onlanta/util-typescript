import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-route-translation',
  templateUrl: './route-translation.component.html',
  styleUrls: ['./route-translation.component.scss'],
})
export class RouteTranslationComponent implements OnInit {
  @Input() langKey: string;

  constructor() {
  }

  ngOnInit() {
  }

}
