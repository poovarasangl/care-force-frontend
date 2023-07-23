import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainadmineditComponent } from './mainadminedit.component';

describe('MainadmineditComponent', () => {
  let component: MainadmineditComponent;
  let fixture: ComponentFixture<MainadmineditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainadmineditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainadmineditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
