import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddtranslatepageComponent } from './addtranslatepage.component';

describe('AddtranslatepageComponent', () => {
  let component: AddtranslatepageComponent;
  let fixture: ComponentFixture<AddtranslatepageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddtranslatepageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddtranslatepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
