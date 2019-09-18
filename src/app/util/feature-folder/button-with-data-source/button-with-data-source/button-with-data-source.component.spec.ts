import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonWithDataSourceComponent } from './button-with-data-source.component';

describe('ButtonWithDataSourceComponent', () => {
  let component: ButtonWithDataSourceComponent;
  let fixture: ComponentFixture<ButtonWithDataSourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonWithDataSourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonWithDataSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
