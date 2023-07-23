import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostheaderlistComponent } from './postheaderlist.component';

describe('PostheaderlistComponent', () => {
  let component: PostheaderlistComponent;
  let fixture: ComponentFixture<PostheaderlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostheaderlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostheaderlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
