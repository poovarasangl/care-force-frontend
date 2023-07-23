import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumenteditComponent } from './documentedit.component';

describe('DocumenteditComponent', () => {
  let component: DocumenteditComponent;
  let fixture: ComponentFixture<DocumenteditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumenteditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumenteditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
