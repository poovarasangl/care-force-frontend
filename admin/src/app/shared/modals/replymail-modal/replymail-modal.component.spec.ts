import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplymailModalComponent } from './replymail-modal.component';

describe('ReplymailModalComponent', () => {
  let component: ReplymailModalComponent;
  let fixture: ComponentFixture<ReplymailModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReplymailModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplymailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
