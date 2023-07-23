import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EarningslistComponent } from './earningslist.component';

describe('EarningslistComponent', () => {
  let component: EarningslistComponent;
  let fixture: ComponentFixture<EarningslistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EarningslistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EarningslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
