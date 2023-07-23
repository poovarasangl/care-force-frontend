import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageeditComponent } from './languageedit.component';

describe('LanguageeditComponent', () => {
  let component: LanguageeditComponent;
  let fixture: ComponentFixture<LanguageeditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LanguageeditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
