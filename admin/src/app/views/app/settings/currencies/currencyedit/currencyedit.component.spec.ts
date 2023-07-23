import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyeditComponent } from './currencyedit.component';

describe('CurrencyeditComponent', () => {
  let component: CurrencyeditComponent;
  let fixture: ComponentFixture<CurrencyeditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrencyeditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
