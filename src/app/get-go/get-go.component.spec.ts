import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetGoComponent } from './get-go.component';

describe('GetGoComponent', () => {
  let component: GetGoComponent;
  let fixture: ComponentFixture<GetGoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetGoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetGoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
