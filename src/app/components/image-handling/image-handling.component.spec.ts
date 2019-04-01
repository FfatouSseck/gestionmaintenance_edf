import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageHandlingPage } from './image-handling.page';

describe('ImageHandlingPage', () => {
  let component: ImageHandlingPage;
  let fixture: ComponentFixture<ImageHandlingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageHandlingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageHandlingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
