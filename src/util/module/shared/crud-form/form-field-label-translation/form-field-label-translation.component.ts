import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-form-field-label-translation',
  templateUrl: './form-field-label-translation.component.html',
  styleUrls: ['./form-field-label-translation.component.scss'],
})
export class FormFieldLabelTranslationComponent implements OnInit {
  @Input() langKey: string;

  constructor() {
  }

  ngOnInit() {
  }

}
