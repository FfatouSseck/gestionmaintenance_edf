import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardTextListPage } from './standard-text-list.page';

describe('StandardTextListPage', () => {
  let component: StandardTextListPage;
  let fixture: ComponentFixture<StandardTextListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StandardTextListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StandardTextListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
