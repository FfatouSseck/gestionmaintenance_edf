import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsSettingsPage } from './details-settings.page';

describe('DetailsSettingsPage', () => {
  let component: DetailsSettingsPage;
  let fixture: ComponentFixture<DetailsSettingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsSettingsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsSettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
