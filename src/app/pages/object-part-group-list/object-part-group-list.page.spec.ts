import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectPartGroupListPage } from './object-part-group-list.page';

describe('ObjectPartGroupListPage', () => {
  let component: ObjectPartGroupListPage;
  let fixture: ComponentFixture<ObjectPartGroupListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObjectPartGroupListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectPartGroupListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
