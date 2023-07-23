import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguagemanageaddComponent } from './languagemanageadd.component';

describe('LanguagemanageaddComponent', () => {
  let component: LanguagemanageaddComponent;
  let fixture: ComponentFixture<LanguagemanageaddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LanguagemanageaddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguagemanageaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
