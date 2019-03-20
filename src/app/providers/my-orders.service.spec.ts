import { TestBed } from '@angular/core/testing';

import { MyOrdersService } from './my-orders.service';

describe('MyOrdersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MyOrdersService = TestBed.get(MyOrdersService);
    expect(service).toBeTruthy();
  });
});
