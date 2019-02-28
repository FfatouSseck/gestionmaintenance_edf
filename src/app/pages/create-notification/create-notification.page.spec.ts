import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNotificationPage } from './create-notification.page';

describe('CreateNotificationPage', () => {
  let component: CreateNotificationPage;
  let fixture: ComponentFixture<CreateNotificationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateNotificationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNotificationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
