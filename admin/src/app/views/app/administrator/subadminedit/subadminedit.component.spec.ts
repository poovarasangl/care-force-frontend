import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubadmineditComponent } from './subadminedit.component';

describe('SubadmineditComponent', () => {
  let component: SubadmineditComponent;
  let fixture: ComponentFixture<SubadmineditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubadmineditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubadmineditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
