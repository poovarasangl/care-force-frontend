import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostheadereditComponent } from './postheaderedit.component';

describe('PostheadereditComponent', () => {
  let component: PostheadereditComponent;
  let fixture: ComponentFixture<PostheadereditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostheadereditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostheadereditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
