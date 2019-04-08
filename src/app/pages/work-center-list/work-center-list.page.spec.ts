import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkCenterListPage } from './work-center-list.page';

describe('WorkCenterListPage', () => {
  let component: WorkCenterListPage;
  let fixture: ComponentFixture<WorkCenterListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkCenterListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkCenterListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
