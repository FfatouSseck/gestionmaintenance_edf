import { TestBed } from '@angular/core/testing';

import { ObjectpartcodeService } from './objectpartcode.service';

describe('ObjectpartcodeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ObjectpartcodeService = TestBed.get(ObjectpartcodeService);
    expect(service).toBeTruthy();
  });
});
