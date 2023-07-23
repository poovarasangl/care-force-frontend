import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguagemobileaddComponent } from './languagemobileadd.component';

describe('LanguagemobileaddComponent', () => {
  let component: LanguagemobileaddComponent;
  let fixture: ComponentFixture<LanguagemobileaddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LanguagemobileaddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguagemobileaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
