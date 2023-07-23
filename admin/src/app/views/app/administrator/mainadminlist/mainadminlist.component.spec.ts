import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainadminlistComponent } from './mainadminlist.component';

describe('MainadminlistComponent', () => {
  let component: MainadminlistComponent;
  let fixture: ComponentFixture<MainadminlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainadminlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainadminlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
