import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderCellExampleComponent } from './header-cell-example.component';

describe('HeaderCellExampleComponent', () => {
  let component: HeaderCellExampleComponent;
  let fixture: ComponentFixture<HeaderCellExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderCellExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderCellExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
