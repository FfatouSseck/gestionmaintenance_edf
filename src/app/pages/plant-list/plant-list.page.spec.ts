import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantListPage } from './plant-list.page';

describe('PlantListPage', () => {
  let component: PlantListPage;
  let fixture: ComponentFixture<PlantListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlantListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
