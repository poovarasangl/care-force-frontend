import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguagemobileComponent } from './languagemobile.component';

describe('LanguagemobileComponent', () => {
  let component: LanguagemobileComponent;
  let fixture: ComponentFixture<LanguagemobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LanguagemobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguagemobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
