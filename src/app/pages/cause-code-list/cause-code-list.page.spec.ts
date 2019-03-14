import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CauseCodeListPage } from './cause-code-list.page';

describe('CauseCodeListPage', () => {
  let component: CauseCodeListPage;
  let fixture: ComponentFixture<CauseCodeListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CauseCodeListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CauseCodeListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
