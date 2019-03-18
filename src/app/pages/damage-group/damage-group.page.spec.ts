import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DamageGroupPage } from './damage-group.page';

describe('DamageGroupPage', () => {
  let component: DamageGroupPage;
  let fixture: ComponentFixture<DamageGroupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DamageGroupPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DamageGroupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
