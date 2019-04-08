import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActTypeListPage } from './act-type-list.page';

describe('ActTypeListPage', () => {
  let component: ActTypeListPage;
  let fixture: ComponentFixture<ActTypeListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActTypeListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActTypeListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
