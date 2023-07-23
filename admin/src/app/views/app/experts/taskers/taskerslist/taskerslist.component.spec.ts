import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskerslistComponent } from './taskerslist.component';

describe('TaskerslistComponent', () => {
  let component: TaskerslistComponent;
  let fixture: ComponentFixture<TaskerslistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskerslistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskerslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
