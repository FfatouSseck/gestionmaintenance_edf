import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentListPage } from './equipment-list.page';

describe('EquipmentListPage', () => {
  let component: EquipmentListPage;
  let fixture: ComponentFixture<EquipmentListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipmentListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
