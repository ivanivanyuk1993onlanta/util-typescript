import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFieldLabelTranslationComponent } from './form-field-label-translation.component';

describe('FormFieldLabelTranslationComponent', () => {
  let component: FormFieldLabelTranslationComponent;
  let fixture: ComponentFixture<FormFieldLabelTranslationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormFieldLabelTranslationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormFieldLabelTranslationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
