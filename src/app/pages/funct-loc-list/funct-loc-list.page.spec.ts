import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FunctLocListPage } from './funct-loc-list.page';

describe('FunctLocListPage', () => {
  let component: FunctLocListPage;
  let fixture: ComponentFixture<FunctLocListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FunctLocListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FunctLocListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
