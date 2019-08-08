import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteListItemComponent } from './route-list-item.component';

describe('RouteListItemComponent', () => {
  let component: RouteListItemComponent<any>;
  let fixture: ComponentFixture<RouteListItemComponent<any>>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouteListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
