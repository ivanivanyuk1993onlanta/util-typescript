import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthModalComponent } from './auth-modal.component';

describe('AuthModalComponent', () => {
  let component: AuthModalComponent<any, any>;
  let fixture: ComponentFixture<AuthModalComponent<any, any>>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
