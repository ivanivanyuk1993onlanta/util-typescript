import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotHomeComponent } from './not-home.component';

describe('NotHomeComponent', () => {
  let component: NotHomeComponent;
  let fixture: ComponentFixture<NotHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
