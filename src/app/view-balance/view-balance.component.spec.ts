import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBalanceComponent } from './view-balance.component';

describe('ViewBalanceComponent', () => {
  let component: ViewBalanceComponent;
  let fixture: ComponentFixture<ViewBalanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewBalanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
