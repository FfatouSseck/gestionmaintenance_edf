import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CauseGroupListPage } from './cause-group-list.page';

describe('CauseGroupListPage', () => {
  let component: CauseGroupListPage;
  let fixture: ComponentFixture<CauseGroupListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CauseGroupListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CauseGroupListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
