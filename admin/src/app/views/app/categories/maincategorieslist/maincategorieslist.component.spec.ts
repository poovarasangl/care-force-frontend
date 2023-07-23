import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaincategorieslistComponent } from './maincategorieslist.component';

describe('MaincategorieslistComponent', () => {
  let component: MaincategorieslistComponent;
  let fixture: ComponentFixture<MaincategorieslistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaincategorieslistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaincategorieslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
