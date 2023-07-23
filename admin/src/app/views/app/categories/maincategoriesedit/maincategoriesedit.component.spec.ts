import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaincategorieseditComponent } from './maincategoriesedit.component';

describe('MaincategorieseditComponent', () => {
  let component: MaincategorieseditComponent;
  let fixture: ComponentFixture<MaincategorieseditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaincategorieseditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaincategorieseditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
