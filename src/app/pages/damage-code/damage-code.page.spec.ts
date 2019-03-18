import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DamageCodePage } from './damage-code.page';

describe('DamageCodePage', () => {
  let component: DamageCodePage;
  let fixture: ComponentFixture<DamageCodePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DamageCodePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DamageCodePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
