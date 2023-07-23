import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddexperienceComponent } from './addexperience.component';

describe('AddexperienceComponent', () => {
  let component: AddexperienceComponent;
  let fixture: ComponentFixture<AddexperienceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddexperienceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddexperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
