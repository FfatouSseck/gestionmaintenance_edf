import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeedDialFabPage } from './speed-dial-fab.page';

describe('SpeedDialFabPage', () => {
  let component: SpeedDialFabPage;
  let fixture: ComponentFixture<SpeedDialFabPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpeedDialFabPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeedDialFabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
