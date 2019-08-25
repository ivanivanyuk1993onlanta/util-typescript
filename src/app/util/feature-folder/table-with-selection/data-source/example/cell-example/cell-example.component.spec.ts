import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CellExampleComponent } from './cell-example.component';

describe('CellExampleComponent', () => {
  let component: CellExampleComponent<unknown, unknown>;
  let fixture: ComponentFixture<CellExampleComponent<unknown, unknown>>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CellExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CellExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
