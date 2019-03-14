import { TestBed } from '@angular/core/testing';

import { CausegroupService } from './causegroup.service';

describe('CausegroupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CausegroupService = TestBed.get(CausegroupService);
    expect(service).toBeTruthy();
  });
});
