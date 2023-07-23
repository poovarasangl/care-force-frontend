import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeoplecmdlistComponent } from './peoplecmdlist.component';

describe('PeoplecmdlistComponent', () => {
  let component: PeoplecmdlistComponent;
  let fixture: ComponentFixture<PeoplecmdlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeoplecmdlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeoplecmdlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
