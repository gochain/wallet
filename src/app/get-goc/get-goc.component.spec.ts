import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetGocComponent } from './get-goc.component';

describe('GetGocComponent', () => {
  let component: GetGocComponent;
  let fixture: ComponentFixture<GetGocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetGocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetGocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
