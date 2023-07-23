import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeoplecmdeditComponent } from './peoplecmdedit.component';

describe('PeoplecmdeditComponent', () => {
  let component: PeoplecmdeditComponent;
  let fixture: ComponentFixture<PeoplecmdeditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeoplecmdeditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeoplecmdeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
