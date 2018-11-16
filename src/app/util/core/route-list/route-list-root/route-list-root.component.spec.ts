import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteListRootComponent } from './route-list-root.component';

describe('RouteListRootComponent', () => {
  let component: RouteListRootComponent;
  let fixture: ComponentFixture<RouteListRootComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouteListRootComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteListRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
