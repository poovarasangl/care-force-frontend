import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentpricelistComponent } from './paymentpricelist.component';

describe('PaymentpricelistComponent', () => {
  let component: PaymentpricelistComponent;
  let fixture: ComponentFixture<PaymentpricelistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentpricelistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentpricelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
