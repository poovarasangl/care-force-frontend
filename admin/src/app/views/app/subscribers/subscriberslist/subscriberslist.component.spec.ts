import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriberslistComponent } from './subscriberslist.component';

describe('SubscriberslistComponent', () => {
  let component: SubscriberslistComponent;
  let fixture: ComponentFixture<SubscriberslistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriberslistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriberslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
