import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentpriceeditComponent } from './paymentpriceedit.component';

describe('PaymentpriceeditComponent', () => {
  let component: PaymentpriceeditComponent;
  let fixture: ComponentFixture<PaymentpriceeditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentpriceeditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentpriceeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
