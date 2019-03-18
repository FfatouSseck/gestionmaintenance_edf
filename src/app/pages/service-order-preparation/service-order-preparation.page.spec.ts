import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceOrderPreparationPage } from './service-order-preparation.page';

describe('ServiceOrderPreparationPage', () => {
  let component: ServiceOrderPreparationPage;
  let fixture: ComponentFixture<ServiceOrderPreparationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceOrderPreparationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceOrderPreparationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
