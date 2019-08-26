import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableWithDataSourceComponent } from './table-with-data-source.component';

describe('TableWithDataSourceComponent', () => {
  let component: TableWithDataSourceComponent;
  let fixture: ComponentFixture<TableWithDataSourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableWithDataSourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableWithDataSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
