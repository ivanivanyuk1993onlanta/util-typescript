import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputAutocompletedComponent } from './input-autocompleted.component';

describe('InputAutocompletedComponent', () => {
  let component: InputAutocompletedComponent;
  let fixture: ComponentFixture<InputAutocompletedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputAutocompletedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputAutocompletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
