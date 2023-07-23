import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancellationeditComponent } from './cancellationedit.component';

describe('CancellationeditComponent', () => {
  let component: CancellationeditComponent;
  let fixture: ComponentFixture<CancellationeditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancellationeditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancellationeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
