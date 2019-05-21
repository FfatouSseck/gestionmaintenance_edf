import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentsListPage } from './components-list.page';

describe('ComponentsListPage', () => {
  let component: ComponentsListPage;
  let fixture: ComponentFixture<ComponentsListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComponentsListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
