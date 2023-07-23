import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsgatewayComponent } from './smsgateway.component';

describe('SmsgatewayComponent', () => {
  let component: SmsgatewayComponent;
  let fixture: ComponentFixture<SmsgatewayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsgatewayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsgatewayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
