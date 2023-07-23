import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayouteditComponent } from './payoutedit.component';

describe('PayouteditComponent', () => {
  let component: PayouteditComponent;
  let fixture: ComponentFixture<PayouteditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayouteditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayouteditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
