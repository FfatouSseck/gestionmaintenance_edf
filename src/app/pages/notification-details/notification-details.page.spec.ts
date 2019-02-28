import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationDetailsPage } from './notification-details.page';

describe('NotificationDetailsPage', () => {
  let component: NotificationDetailsPage;
  let fixture: ComponentFixture<NotificationDetailsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationDetailsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
