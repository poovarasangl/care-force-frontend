import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcategorieseditComponent } from './subcategoriesedit.component';

describe('SubcategorieseditComponent', () => {
  let component: SubcategorieseditComponent;
  let fixture: ComponentFixture<SubcategorieseditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubcategorieseditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubcategorieseditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
