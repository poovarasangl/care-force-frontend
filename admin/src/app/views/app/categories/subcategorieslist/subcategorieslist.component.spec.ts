import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcategorieslistComponent } from './subcategorieslist.component';

describe('SubcategorieslistComponent', () => {
  let component: SubcategorieslistComponent;
  let fixture: ComponentFixture<SubcategorieslistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubcategorieslistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubcategorieslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
