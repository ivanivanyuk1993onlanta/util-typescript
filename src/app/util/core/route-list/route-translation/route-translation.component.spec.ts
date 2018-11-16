import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteTranslationComponent } from './route-translation.component';

describe('RouteTranslationComponent', () => {
  let component: RouteTranslationComponent;
  let fixture: ComponentFixture<RouteTranslationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouteTranslationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteTranslationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
