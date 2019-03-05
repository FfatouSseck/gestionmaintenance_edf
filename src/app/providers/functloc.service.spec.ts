import { TestBed } from '@angular/core/testing';

import { FunctlocService } from './functloc.service';

describe('FunctlocService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FunctlocService = TestBed.get(FunctlocService);
    expect(service).toBeTruthy();
  });
});
