import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencylistComponent } from './currencylist.component';

describe('CurrencylistComponent', () => {
  let component: CurrencylistComponent;
  let fixture: ComponentFixture<CurrencylistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrencylistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
