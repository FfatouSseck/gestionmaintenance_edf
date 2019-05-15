import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderTimeAndMaterialPage } from './order-time-and-material.page';

describe('OrderTimeAndMaterialPage', () => {
  let component: OrderTimeAndMaterialPage;
  let fixture: ComponentFixture<OrderTimeAndMaterialPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderTimeAndMaterialPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderTimeAndMaterialPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
