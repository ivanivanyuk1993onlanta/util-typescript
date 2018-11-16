import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteListRecursiveComponent } from './route-list-recursive.component';

describe('RouteListRecursiveComponent', () => {
  let component: RouteListRecursiveComponent;
  let fixture: ComponentFixture<RouteListRecursiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouteListRecursiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteListRecursiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
