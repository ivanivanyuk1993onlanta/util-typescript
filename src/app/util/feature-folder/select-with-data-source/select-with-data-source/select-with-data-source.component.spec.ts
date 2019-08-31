import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectWithDataSourceComponent } from './select-with-data-source.component';

describe('SelectWithDataSourceComponent', () => {
  let component: SelectWithDataSourceComponent;
  let fixture: ComponentFixture<SelectWithDataSourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectWithDataSourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectWithDataSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
