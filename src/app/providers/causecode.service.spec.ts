import { TestBed } from '@angular/core/testing';

import { CausecodeService } from './causecode.service';

describe('CausecodeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CausecodeService = TestBed.get(CausecodeService);
    expect(service).toBeTruthy();
  });
});
