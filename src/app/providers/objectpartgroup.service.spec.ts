import { TestBed } from '@angular/core/testing';

import { ObjectpartgroupService } from './objectpartgroup.service';

describe('ObjectpartgroupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ObjectpartgroupService = TestBed.get(ObjectpartgroupService);
    expect(service).toBeTruthy();
  });
});
